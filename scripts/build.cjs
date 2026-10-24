'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),{snapshot}=require('./public-snapshot.cjs');
const SOURCE='https://courageous-smakager-7b886a.netlify.app/.netlify/functions/storefront';
const PUBLIC_FILES=['index.html','store.html','store.js','store-model.js','store.css','_headers'];
async function build({root=path.resolve(__dirname,'..'),fetchImpl=fetch,hookBody=process.env.INCOMING_HOOK_BODY}={}){
 let expected;
 if(hookBody){let h;try{h=JSON.parse(hookBody);}catch{throw Error('Invalid build hook metadata');}if(!Number.isSafeInteger(h.revision)||h.revision<0)throw Error('Invalid expected revision');expected=h.revision;}
 const url=new URL(SOURCE);if(expected!==undefined)url.searchParams.set('revision',String(expected));
 const response=await fetchImpl(url.href,{redirect:'error',signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error('Public catalog unavailable: HTTP '+response.status);
 if(Number(response.headers.get('content-length'))>2000000)throw Error('Public catalog exceeds limit');
 let bytes=0;const chunks=[];
 for await(const chunk of response.body){bytes+=chunk.length;if(bytes>2000000)throw Error('Public catalog exceeds limit');chunks.push(chunk);}
 const data=snapshot(JSON.parse(Buffer.concat(chunks).toString('utf8')));
 if(expected!==undefined&&data.revision<expected)throw Error('Published revision not ready; previous website stays live');
 const dist=path.join(root,'dist');
 // Do not emit a deployable result until the upstream snapshot is valid.
 await fs.rm(dist,{recursive:true,force:true});await fs.mkdir(dist,{recursive:true});
 for(const name of PUBLIC_FILES)await fs.copyFile(path.join(root,'public',name),path.join(dist,name));
 await fs.writeFile(path.join(dist,'store-data.json'),JSON.stringify(data));
 return {revision:data.revision,products:data.products.length};
}
module.exports={build,SOURCE,PUBLIC_FILES};
if(require.main===module)build().then(x=>console.log('Public website built: revision '+x.revision+', '+x.products+' products')).catch(()=>{console.error('Build stopped: public catalog unavailable or invalid; do not replace the live website.');process.exitCode=1;});
