import { expect, test } from 'bun:test';
import { countEnrichmentBacklog, getEnrichmentCompleteness, selectEnrichmentBacklog } from './enrichment-backlog';
import type { Product } from '@/types';

const p=(slug:string,date:string,extra:Partial<Product>={}):Product=>({
  id:slug,date,rank:1,name:slug,slug,tagline:slug,description:slug,category:'AI',
  url:`https://www.producthunt.com/posts/${slug}`,votes:1,websiteUrl:'',comments:[{user:'A',text:'Real launch comment'}],...extra
});

test('completeness reports missing fields',()=>{
  const s=getEnrichmentCompleteness(p('a','2026-08-01',{faDescription:'توضیح',aiReview:'تحلیل'}));
  expect(s.completeFields).toBe(2); expect(s.missingFields).toBe(2);
});

test('backlog prioritizes least complete then oldest',()=>{
  const r=selectEnrichmentBacklog([
    p('newer','2026-08-20'), p('older','2026-08-01'),
    p('partial','2026-07-01',{faDescription:'توضیح'})
  ],2);
  expect(r.map(x=>x.product.slug)).toEqual(['older','newer']);
});

test('batch is bounded',()=>{
  expect(selectEnrichmentBacklog(Array.from({length:20},(_,i)=>p(`p${i}`,'2026-08-01')),5)).toHaveLength(5);
});

test('metrics expose backlog',()=>{
  const m=countEnrichmentBacklog([p('a','2026-08-01'),p('b','2026-08-02',{faDescription:'توضیح'})]);
  expect(m.backlog).toBe(2); expect(m.missingAiReview).toBe(2);
});
