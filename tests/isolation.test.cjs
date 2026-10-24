'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {snapshot}=require('../scripts/public-snapshot.cjs'),{build,PUBLIC_FILES,SOURCE}=require('../scripts/build.cjs'),M=require('../public/store-model.js');
function data(){const x=M.defaults();return {...x,published:true,revision:20,publishedAt:'2026-10-24',products:[{key:'a:1',name:'Garland',code:'SKU1',barcode:'001',price:50,cost:20,privateNote:'SECRET',image:'https://i.ibb.co/example/a.jpg',categoryIds:[],variants:[{key:'a:2',name:'Red',label:'Red',code:'SKU2',barcode:'002',price:60,cost:30,stock:20,image:''}]}],serviceAccount:'SECRET',updatedBy:'SECRET'};}
test('export independently allowlists fields at every level without copying costs stock user or unknown fields',()=>{const x=data();x.header.secret='SECRET';x.sections[0].secret='SECRET';const r=snapshot(x),s=JSON.stringify(r);for(const key of ['SECRET','privateNote','serviceAccount','updatedBy','cost','stock'])assert.ok(!s.includes(key),key);assert.equal(r.products[0].variants[0].barcode,'002');assert.equal(r.products[0].price,60);assert.equal(r.products[0].priceMax,60);});
test('reject invalid snapshots and preserve safe text/URLs',()=>{assert.throws(()=>snapshot({...data(),published:false}));assert.throws(()=>snapshot({...data(),revision:NaN}));const x=data();x.products[0].price=-1;assert.throws(()=>snapshot(x));const y=data();y.header.logo='javascript:alert(1)';y.header.name='<script>bad</script>';const r=snapshot(y);assert.equal(r.header.logo,'');assert.equal(r.header.name,y.header.name);});
test('build emits only fixed public assets, fetches fixed public source, and checks hook revision',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'store-split-'));try{await fs.mkdir(path.join(root,'public'));for(const name of PUBLIC_FILES)await fs.writeFile(path.join(root,'public',name),'asset');await fs.writeFile(path.join(root,'public','pos.html'),'DO NOT PUBLISH');let called;
 const r=await build({root,hookBody:'{"revision":20}',fetchImpl:async(url,opt)=>{called=url;assert.equal(opt.redirect,'error');assert.equal(opt.headers,undefined);return new Response(JSON.stringify(data()));}});
 assert.equal(r.products,1);assert.equal(called,SOURCE+'?revision=20');assert.deepEqual((await fs.readdir(path.join(root,'dist'))).sort(),[...PUBLIC_FILES,'store-data.json'].sort());
 const out=JSON.parse(await fs.readFile(path.join(root,'dist/store-data.json'),'utf8'));assert.equal(out.revision,20);assert.ok(!JSON.stringify(out).includes('SECRET'));
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
test('upstream failure stale revision or oversized body never overwrites an existing build',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'store-split-'));try{await fs.mkdir(path.join(root,'dist'));await fs.writeFile(path.join(root,'dist/keep'),'previous');for(const fetchImpl of [async()=>new Response('failed',{status:503}),async()=>new Response(JSON.stringify({...data(),revision:19})),async()=>new Response('x'.repeat(2000001))])await assert.rejects(build({root,hookBody:'{"revision":20}',fetchImpl}));assert.equal(await fs.readFile(path.join(root,'dist/keep'),'utf8'),'previous');}finally{await fs.rm(root,{recursive:true,force:true});}
});
test('public client has no POS API or authentication and ignores demo/preview URL overrides',async()=>{
 const root=path.resolve(__dirname,'../public'),js=await fs.readFile(path.join(root,'store.js'),'utf8');
 for(const token of ['.netlify/functions','firebase','getAuth','localStorage','STORE_DEMO','store-preview','store-editor','window.open'])assert.ok(!js.includes(token),token);
 assert.ok(js.includes("fetch('store-data.json'"));assert.deepEqual((await fs.readdir(root)).sort(),[...PUBLIC_FILES].sort());
});
