(function(root,factory){const x=factory();if(typeof module==='object'&&module.exports)module.exports=x;else root.StoreModel=x;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const text=(v,n=500)=>String(v??'').trim().slice(0,n);
const OWNED_BRAND_IMAGES=Object.freeze({"https://i.ibb.co/pvYhJpvK/1660909698077.jpg": "https://courageous-smakager-7b886a.netlify.app/.netlify/functions/product-image?id=0f732bb8baa2a68a52b5048894c85b31d649ab97589c48b919134f1ee3818bc3.jpg", "https://i.ibb.co/k2WwYzT5/1777820693593.png": "https://courageous-smakager-7b886a.netlify.app/.netlify/functions/product-image?id=79c776f66b8a4e7cd4ba1ed7d6ebf4f7f1525af2dbd60a429b949261fb40d04d.jpg", "https://i.ibb.co/b56JWb1j/kplusshop-qr-20230425145855.jpg": "https://courageous-smakager-7b886a.netlify.app/.netlify/functions/product-image?id=72006e841d304f38873eba653d30a5fe80d360c99e0becc336226d368e990440.jpg", "https://i.ibb.co/60XSNkLx/05816f18412b.webp": "https://courageous-smakager-7b886a.netlify.app/.netlify/functions/product-image?id=9853c21788e8b588cd92979b2bba7fcd8731f26d106ff59e15b8f20053fef205.jpg"});
function image(v){v=text(v,210000);v=OWNED_BRAND_IMAGES[v]||v;if(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v))return v;try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
function link(v){try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
function mapLink(v){const safe=link(v);if(!safe)return '';const u=new URL(safe);return ['maps.app.goo.gl','maps.google.com','www.google.com','google.com','goo.gl'].includes(u.hostname)?safe:'';}
function mapEmbed(v){const safe=link(v);if(!safe)return '';const u=new URL(safe);return ['www.google.com','maps.google.com','google.com'].includes(u.hostname)&&u.pathname.startsWith('/maps/embed')?safe:'';}
function appearance(a={}){const num=(v,d,min,max)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Math.round(Number(v)))):d;return {nameSize:num(a.nameSize,16,12,28),priceSize:num(a.priceSize,20,14,36),detailNameSize:num(a.detailNameSize,27,18,40),detailPriceSize:num(a.detailPriceSize,25,18,48),imageSize:num(a.imageSize,300,180,600)};}
function defaults(){return {version:'1.5',header:{name:'นาถดาวเรือง',tagline:'ดอกไม้ พวงมาลัย และของบูชา',announcement:'เลือกชมสินค้า แล้วสอบถามร้านผ่าน LINE',logo:'',color:'#8c3f65',line:'https://line.me/R/ti/p/@natt114',phone:'',appearance:appearance(),hideNoImage:false,address:'',storePhoto:'',openingHours:'',deliveryHours:'',mapUrl:'',mapEmbed:'',menus:[{label:'หน้าหลัก',target:'home'},{label:'สินค้าทั้งหมด',target:'catalog'},{label:'ติดต่อร้าน',target:'contact'}]},sections:[{id:'hero',type:'banner',title:'ดอกไม้สวย สำหรับวันสำคัญของคุณ',subtitle:'พวงมาลัย ดอกไม้สด และของบูชา เลือกชมสินค้าจากร้านนาถดาวเรือง',image:'',visible:true},{id:'cats',type:'categories',title:'เลือกชมตามหมวดหมู่',visible:true},{id:'featured',type:'products',title:'สินค้าจากร้าน',category:'',visible:true},{id:'about',type:'text',title:'สอบถามก่อนสั่ง เพื่อเตรียมดอกไม้ให้ตรงใจ',body:'ส่งชื่อหรือรหัสสินค้า พร้อมวันที่ต้องการใช้งานให้ร้านทาง LINE ได้เลยค่ะ',image:'',visible:true}],categories:[],groups:[],products:[]};}
function config(x){if(!x||!x.header||!Array.isArray(x.sections)||!Array.isArray(x.products))throw Error('ข้อมูลเว็บไซต์ไม่ครบ');if(x.sections.length>20||x.products.length>3000)throw Error('รองรับ 20 ส่วน และสินค้าเผยแพร่ 3000 รายการ');const h=x.header;
const cats=categories(x.categories||[]);const out={categories:cats,version:'1.5',header:{name:text(h.name,80),tagline:text(h.tagline,150),announcement:text(h.announcement,200),logo:image(h.logo),color:/^#[0-9a-f]{6}$/i.test(h.color)?h.color:'#8c3f65',line:link(h.line),phone:text(h.phone,40),appearance:appearance(h.appearance),hideNoImage:h.hideNoImage===true,address:text(h.address,500),storePhoto:image(h.storePhoto),openingHours:text(h.openingHours,1000),deliveryHours:text(h.deliveryHours,1000),mapUrl:mapLink(h.mapUrl),mapEmbed:mapEmbed(h.mapEmbed),menus:(h.menus||[]).slice(0,6).map(m=>({label:text(m.label,40),target:(['home','catalog','contact'].includes(m.target)||cats.some(c=>'category/'+c.id===m.target))?m.target:'catalog'}))},sections:x.sections.map((s,i)=>({id:'section-'+i,type:['banner','categories','products','text'].includes(s.type)?s.type:'text',title:text(s.title,150),subtitle:text(s.subtitle,500),body:text(s.body,2000),image:image(s.image),category:cats.some(c=>c.id===s.category)?s.category:'',visible:s.visible!==false})),products:x.products.map(p=>({key:text(p.key,250),visible:p.visible!==false,description:text(p.description,1500),image:image(p.image),priceMode:p.priceMode==='ask'?'ask':'show',categoryIds:Array.isArray(p.categoryIds)?[...new Set(p.categoryIds.map(v=>text(v,80)))]:[],gallery:(p.gallery||[]).slice(0,6).map(image).filter(Boolean),options:(p.options||[]).slice(0,12).map(v=>({label:text(v.label,60),image:image(v.image)})).filter(v=>v.label)}))};out.groups=groups(x.groups||[],cats);if(new Set([...out.products.map(p=>p.key),...out.groups.flatMap(g=>g.variants.map(v=>v.key))]).size>3000)throw Error('รองรับ SKU บนเว็บไซต์รวม 3000 รายการ');for(const p of out.products)if(p.categoryIds.some(id=>!cats.some(c=>c.id===id)))throw Error('หมวดหมู่ของสินค้าไม่ถูกต้อง');if(!out.header.name)throw Error('กรุณาระบุชื่อร้าน');if(new Set(out.products.map(p=>p.key)).size!==out.products.length)throw Error('เลือกสินค้าซ้ำ');if(JSON.stringify(out).length>780000)throw Error('รูปและข้อมูลรวมใหญ่เกินไป กรุณาลดขนาดรูป');return out;}
function catalog(rows){const out=[];for(const [cid,cat]of rows){for(const p of cat.products||[]){if(p.id==null)continue;const display=rows.find(([id])=>id===p.displayCatId)?.[1]||cat;out.push({key:cid+':'+String(p.id),name:text(p.name,200),category:text(display.name||cid,160),code:text(p.sku||p.barcode||p.id,80),barcode:text(p.barcode,80),price:Number.isFinite(Number(p.price))&&Number(p.price)>=0?Number(p.price):0,image:image(p.img)});}}return out;}
function categories(rows){
if(!Array.isArray(rows)||rows.length>100)throw Error('รองรับหมวดหมู่เว็บไซต์ 100 หมวด');
const clean=rows.map(c=>({id:text(c.id,80),parentId:text(c.parentId,80),name:text(c.name,100),description:text(c.description,500),image:image(c.image),visible:c.visible!==false}));
const map=new Map(clean.map(c=>[c.id,c]));if(map.size!==clean.length)throw Error('รหัสหมวดหมู่ซ้ำ');
for(const c of clean){if(!/^[a-zA-Z0-9_-]{1,80}$/.test(c.id)||!c.name)throw Error('กรุณาระบุชื่อและรหัสหมวดหมู่');if(c.parentId&&!map.has(c.parentId))throw Error('ไม่พบหมวดหมู่แม่');const seen=new Set([c.id]);let node=c;while(node.parentId){if(seen.has(node.parentId))throw Error('หมวดหมู่วนกลับหาตัวเอง');seen.add(node.parentId);node=map.get(node.parentId);if(seen.size>6)throw Error('หมวดหมู่ลึกเกิน 6 ระดับ');}}
return clean;
}
function visibleCategories(rows){const map=new Map(rows.map(c=>[c.id,c]));return rows.filter(c=>{let n=c;const seen=new Set();while(n){if(n.visible===false||seen.has(n.id))return false;seen.add(n.id);n=map.get(n.parentId);}return true;});}
function descendants(rows,id){const found=new Set([id]);let changed=true;while(changed){changed=false;for(const c of rows)if(found.has(c.parentId)&&!found.has(c.id)){found.add(c.id);changed=true;}}return found;}
function trail(rows,id){const map=new Map(rows.map(c=>[c.id,c])),out=[],seen=new Set();let n=map.get(id);while(n&&!seen.has(n.id)){seen.add(n.id);out.unshift(n);n=map.get(n.parentId);}return out;}
function groups(rows,cats){
 if(!Array.isArray(rows)||rows.length>500)throw Error('รองรับชุดสี / แบบ 500 ชุด');
 const ids=new Set(),keys=new Set();return rows.map(g=>{
  const id=text(g.id,80),name=text(g.name,200);if(!/^[a-zA-Z0-9_-]{1,80}$/.test(id)||ids.has(id)||!name)throw Error('ชื่อหรือรหัสชุดสีไม่ถูกต้อง / ซ้ำ');ids.add(id);
  if(!Array.isArray(g.variants)||g.variants.length>50)throw Error('รองรับ 50 สี / แบบต่อชุด');
  const labels=new Set(),variants=g.variants.map(v=>{const key=text(v.key,250),label=text(v.label,60);if(!key||!label||keys.has(key)||labels.has(label))throw Error('สินค้า SKU หรือชื่อสีซ้ำในชุด กรุณาตรวจสอบ');keys.add(key);labels.add(label);return {key,label};});
  const categoryIds=[...new Set((g.categoryIds||[]).map(v=>text(v,80)))];if(categoryIds.some(id=>!cats.some(c=>c.id===id)))throw Error('หมวดหมู่ของชุดสีไม่ถูกต้อง');
  return {id,name,visible:g.visible!==false,image:image(g.image),description:text(g.description,1500),priceMode:g.priceMode==='ask'?'ask':'show',categoryIds,variants};
 });
}
function publish(draft,items){
 const clean=config(draft),map=new Map(items.map(p=>[p.key,p])),settings=new Map(clean.products.map(p=>[p.key,p])),visible=visibleCategories(clean.categories),allowed=new Set(visible.map(c=>c.id)),shown=p=>p.visible&&(!p.categoryIds.length||p.categoryIds.some(id=>allowed.has(id))),category=p=>p.categoryIds.filter(id=>allowed.has(id)),categoryName=p=>category(p).map(id=>clean.categories.find(c=>c.id===id).name).join(' · ');
 const grouped=new Set(),combined=[];
 for(const g of clean.groups.filter(shown)){
  if(!g.variants.length)throw Error('ชุด '+g.name+' ยังไม่มีสินค้า กรุณาเพิ่มสีหรือซ่อนชุด');
  let variants=g.variants.filter(v=>{const p=settings.get(v.key);return !p||shown(p);}).map(v=>{
   const item=map.get(v.key),p=settings.get(v.key);if(!item)throw Error('สินค้าในชุดสีถูกย้ายหรือลบ กรุณาเลือก SKU ใหม่');
   grouped.add(v.key);return {key:item.key,label:v.label,name:item.name,code:item.code,barcode:item.barcode||'',price:item.price,image:p?.image||item.image,priceMode:g.priceMode==='ask'||p?.priceMode==='ask'?'ask':'show'};
  });
  if(clean.header.hideNoImage)variants=variants.filter(v=>image(v.image));
  if(!variants.length)continue;
  combined.push({key:'@group/'+g.id,name:g.name,category:categoryName(g),categoryIds:category(g),code:'',price:Math.min(...variants.map(v=>v.price)),priceMax:Math.max(...variants.map(v=>v.price)),image:g.image||variants[0].image,gallery:[],options:[],variants,description:g.description,priceMode:variants.some(v=>v.priceMode==='ask')?'ask':'show'});
 }
 const products=clean.products.filter(p=>shown(p)&&!grouped.has(p.key)).map(p=>{const item=map.get(p.key);if(!item)throw Error('มีสินค้าถูกย้ายหรือลบ กรุณาเลือกสินค้าใหม่');return {key:item.key,name:item.name,category:categoryName(p),categoryIds:category(p),code:item.code,barcode:item.barcode,price:item.price,image:p.image||item.image,gallery:p.gallery,options:p.options,description:p.description,priceMode:p.priceMode};});
 const {groups:privateGroups,...base}=clean;return {...base,categories:visible,products:[...combined,...products].filter(p=>!clean.header.hideNoImage||image(p.image))};
}
function variantLabel(v){const label=String(v.label||'').trim();return label&&label!==v.code&&label!==v.barcode?label:(v.name||label||v.code||'เลือกแบบ');}
function selectedName(p,v){return v?.name||p.name;}
function inquiryLink(base,p,v){
 const safe=link(base);if(!safe||!p)return safe;const u=new URL(safe),id=u.hostname==='line.me'?u.pathname.match(/^\/R\/(?:ti\/p|oaMessage)\/(@[^/]+)/)?.[1]:null;
 if(!id)return safe;const selected=v?{...p,...v}:p,message='สอบถามสินค้า '+selectedName(p,v)+(v?' · '+variantLabel(v):'')+'\nรหัสสินค้า '+(selected.code||'—')+(selected.barcode?'\nBarcode '+selected.barcode:'');
 return 'https://line.me/R/oaMessage/'+id+'/?'+encodeURIComponent(message);
}
function matchesProduct(p,q){return q.trim().toLowerCase().split(/\s+/).every(t=>[p.name,p.code,p.category,...(p.variants||[]).flatMap(v=>[v.name,v.label,v.code,v.barcode])].join(' ').toLowerCase().includes(t));}
function photoCode(p){const code=String(p?.code??'').trim(),barcode=String(p?.barcode??'').trim();return code?{text:code,position:'sku'}:barcode?{text:barcode,position:'barcode'}:null;}
function navigation(data){return visibleCategories(data.categories||[]);}
function inCategory(product,rows,id){if(!id)return true;if(!rows.some(c=>c.id===id))return false;const ids=descendants(rows,id);return (product.categoryIds||[]).some(c=>ids.has(c));}
return {photoCode,defaults,config,catalog,publish,image,link,categories,visibleCategories,descendants,trail,navigation,inCategory,groups,appearance,mapLink,mapEmbed,variantLabel,selectedName,inquiryLink,matchesProduct};});

