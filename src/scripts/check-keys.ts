const ph = process.env.PH_API_TOKEN ?? '';
const q = `query { post(slug: "coldtea") { name makers { name } comments(first: 3) { edges { node { body user { name username } } } } } }`;
const r = await fetch('https://api.producthunt.com/v2/api/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ph}` },
  body: JSON.stringify({ query: q }),
});
console.log('PH HTTP:', r.status);
if (r.ok) {
  const j: any = await r.json();
  console.log('محصول:', j.data?.post?.name);
  console.log('سازنده واقعی:', j.data?.post?.makers?.[0]?.name);
  (j.data?.post?.comments?.edges ?? []).forEach((e: any) =>
    console.log('   نام کاربر واقعی:', e.node?.user?.name ?? e.node?.user?.username));
} else {
  console.log('❌ توکن PH معتبر نیست!');
}

const g = process.env.GEMINI_API_KEY ?? '';
if (g) {
  const gr = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${g}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: 'سلام' }] }] }),
  });
  console.log('Gemini HTTP:', gr.status, gr.status === 200 ? '✅' : '❌');
} else console.log('Gemini: کلید لوکال نیست (در GitHub مهمه)');
