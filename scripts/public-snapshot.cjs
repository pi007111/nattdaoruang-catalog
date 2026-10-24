'use strict';
const M=require('../public/store-model.js');
const text=(v,n=500)=>String(v??'').trim().slice(0,n);
function list(v,max){if(!Array.isArray(v)||v.length>max)throw Error('Invalid public catalog array');return v;}
function price(v){if(typeof v!=='number'||!Number.isFinite(v)||v<0)throw Error('Invalid public price');return v;}
function mode(v){return v==='ask'?'ask':'show';}
function snapshot(x){
 if(!x||x.published!==true||!Number.isSafeInteger(x.revision)||x.revision<0)throw Error('No valid published catalog');
 const base=M.config({header:x.header,sections:x.sections,categories:x.categories,products:[],groups:[]});
 const ids=new Set(base.categories.map(c=>c.id));
 const member=v=>list(v||[],100).map(id=>text(id,80)).filter(id=>ids.has(id));
 const products=list(x.products,3500).map(p=>{
  const row={key:text(p.key,250),name:text(p.name,200),category:text(p.category,500),categoryIds:member(p.categoryIds),code:text(p.code,80),barcode:text(p.barcode,80),price:price(p.price),priceMode:mode(p.priceMode),image:M.image(p.image),description:text(p.description,1500),gallery:list(p.gallery||[],6).map(M.image).filter(Boolean),options:list(p.options||[],12).map(v=>({label:text(v.label,60),image:M.image(v.image)}))};
  if(!row.key||!row.name)throw Error('Public product identity missing');
  if(p.variants){
   row.variants=list(p.variants,50).map(v=>({key:text(v.key,250),label:text(v.label,60),name:text(v.name,200),code:text(v.code,80),barcode:text(v.barcode,80),price:price(v.price),priceMode:mode(v.priceMode),image:M.image(v.image)}));
   if(!row.variants.length)throw Error('Empty public variant group');
   row.price=Math.min(...row.variants.map(v=>v.price));row.priceMax=Math.max(...row.variants.map(v=>v.price));
  }
  return row;
 });
 if(new Set(products.map(p=>p.key)).size!==products.length)throw Error('Duplicate public product identity');
 return {version:base.version,header:base.header,sections:base.sections,categories:base.categories,products,published:true,revision:x.revision,publishedAt:text(x.publishedAt,80)};
}
module.exports={snapshot};
