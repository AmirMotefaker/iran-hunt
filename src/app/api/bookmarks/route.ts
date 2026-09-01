import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import sql from '@/lib/db';
import { loadCorpusProducts } from '@/lib/corpus';

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 401 },
    );
  }

  const rows = await sql`
    SELECT slug, created_at
    FROM bookmarks
    WHERE email=${user.email}
    ORDER BY created_at DESC
  `;

  const corpus = await loadCorpusProducts();
  const productsBySlug = new Map(
    corpus.map((product) => [product.slug, product]),
  );

  const products = rows
    .map((bookmark: any) => {
      const product = productsBySlug.get(bookmark.slug);

      if (!product) return null;

      return {
        slug: product.slug,
        name: product.name,
        tagline: product.tagline,
        faTagline: product.faTagline,
        faDescription: product.faDescription,
        thumbnail: product.thumbnail,
        votes: product.votes ?? 0,
        category: product.category,
        savedAt: bookmark.created_at,
      };
    })
    .filter(Boolean);

  return NextResponse.json({
    bookmarks: rows,
    products,
  });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'ابتدا وارد شوید' }, { status: 401 });
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: 'bad request' }, { status: 400 });

  const exists = await sql`SELECT 1 FROM bookmarks WHERE email=${user.email} AND slug=${slug}`;
  if (exists.length) {
    await sql`DELETE FROM bookmarks WHERE email=${user.email} AND slug=${slug}`;
    return NextResponse.json({ bookmarked: false });
  }
  if (user.plan === 'free') {
    const count = await sql`SELECT count(*)::int AS n FROM bookmarks WHERE email=${user.email}`;
    if (count[0].n >= 20)
      return NextResponse.json({ error: 'در پلن رایگان حداکثر ۲۰ بوکمارک مجاز است — برای بوکمارک نامحدود، پلن حرفه‌ای را فعال کنید.' }, { status: 403 });
  }
  await sql`INSERT INTO bookmarks (email, slug) VALUES (${user.email}, ${slug})`;
  return NextResponse.json({ bookmarked: true });
}
