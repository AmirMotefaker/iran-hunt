import type { PHComment } from '@/types';

const PH_API = 'https://api.producthunt.com/v2/api/graphql';
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36' };

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function walk(obj: any, out: any[], depth = 0): void {
  if (!obj || typeof obj !== 'object' || depth > 14) return;
  if (Array.isArray(obj)) { for (const x of obj) walk(x, out, depth + 1); return; }
  if (typeof obj.body === 'string' && obj.user && typeof obj.user === 'object') out.push(obj);
  for (const v of Object.values(obj)) walk(v, out, depth + 1);
}

function namesFromHtml(html: string): { name: string; body: string }[] {
  const users: { name: string; body: string }[] = [];
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    try {
      const nodes: any[] = [];
      walk(JSON.parse(m[1]), nodes);
      for (const n of nodes) {
        const name = n.user?.name || n.user?.username || '';
        if (name && !name.includes('REDACTED')) users.push({ name, body: stripHtml(n.body ?? '') });
      }
    } catch { /* ignore */ }
  }
  return users;
}

export interface FetchResult { list: PHComment[]; real: boolean }

export async function fetchRealComments(token: string, slug: string): Promise<FetchResult> {
  // 1) GraphQL رسمی
  let fromApi: PHComment[] = [];
  try {
    const query = `query { post(slug: "${slug}") { comments(first: 8) { edges { node { body user { name username } } } } } }`;
    const res = await fetch(PH_API, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ query }) });
    if (res.ok) {
      const json: any = await res.json();
      fromApi = (json.data?.post?.comments?.edges ?? [])
        .map((e: any) => ({ user: e.node?.user?.name || e.node?.user?.username || '', text: stripHtml(e.node?.body ?? '') }))
        .filter((c: PHComment) => c.text.length > 10);
    }
  } catch { /* ignore */ }

  if (fromApi.length && fromApi.some((c) => c.user && !c.user.includes('REDACTED'))) return { list: fromApi, real: true };

  // 2) Wayback Machine — آرشیو بدون Cloudflare
  try {
    const av = await fetch(`https://archive.org/wayback/available?url=www.producthunt.com/posts/${slug}`);
    if (av.ok) {
      const aj: any = await av.json();
      const snap: string | undefined = aj?.archived_snapshots?.closest?.url;
      if (snap) {
        const sr = await fetch(snap.replace('http://', 'https://'), { headers: UA });
        if (sr.ok) {
          const users = namesFromHtml(await sr.text());
          if (users.length) {
            console.log(`   📜 wayback: ${users.length} real names`);
            const base = fromApi.length ? fromApi : users.map((u) => ({ user: '', text: u.body })).filter((c) => c.text.length > 10);
            return { list: base.map((c, i) => ({ user: users[i]?.name || c.user || `کاربر ProductHunt ${i + 1}`, text: c.text })), real: true };
          }
        }
      }
    }
  } catch { /* ignore */ }

  return { list: fromApi, real: false };
}
