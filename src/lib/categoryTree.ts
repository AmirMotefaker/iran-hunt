export interface CategoryNode { name: string; fa: string; icon: string; color: string; subcategories: string[]; }

// دقیقاً مطابق https://www.producthunt.com/categories
export const CATEGORY_TREE: CategoryNode[] = [
  { name: 'Productivity', fa: 'بهره‌وری', icon: '⚡', color: 'from-blue-500 to-cyan-500', subcategories: ['AI notetakers','AI Presentation Software','AI Workflow Automation','Ad blockers','App switcher','Calendar apps','Email clients','File storage and sharing apps','Meeting software','Note and writing apps','Password managers','Project management software','Scheduling software','Search','Spreadsheets','Team collaboration software','Time tracking apps','Video conferencing','Writing assistants'] },
  { name: 'Engineering & Development', fa: 'مهندسی و توسعه', icon: '💻', color: 'from-indigo-500 to-purple-500', subcategories: ['A/B testing tools','AI Code Editors','AI Code Testing','AI Coding Agents','Automation tools','Cloud Computing Platforms','Code editors','Command line tools','Databases and backend frameworks','Git clients','Observability tools','Testing and QA software','VPN client','Web hosting services','Website builders'] },
  { name: 'Design & Creative', fa: 'طراحی و خلاقیت', icon: '🎨', color: 'from-pink-500 to-rose-500', subcategories: ['3D & Animation','AI Characters','AI Generative Media','Avatar generators','Background removal tools','Design inspiration websites','Design resources','Digital whiteboards','Graphic design tools','Icon sets','Photo editing','Stock photo sites','UI frameworks','Video editing','Wireframing'] },
  { name: 'Finance', fa: 'مالی', icon: '💰', color: 'from-emerald-500 to-green-500', subcategories: ['Accounting software','Budgeting apps','Credit score tools','Financial planning','Fundraising resources','Investing','Invoicing tools','Money transfer','Neobanks','Payroll software','Savings apps','Stock trading platforms','Tax preparation'] },
  { name: 'Social & Community', fa: 'اجتماعی و انجمن', icon: '👥', color: 'from-blue-400 to-indigo-400', subcategories: ['Blogging platforms','Community management','Dating apps','Link in bio tools','Live streaming platforms','Messaging apps','Newsletter platforms','Photo sharing','Professional networking platforms','Social Networking','Video and Voice calling'] },
  { name: 'Marketing & Sales', fa: 'بازاریابی و فروش', icon: '📈', color: 'from-orange-500 to-amber-500', subcategories: ['AI sales tools','Advertising tools','Affiliate marketing','CRM software','Email marketing','Influencer marketing platforms','Keyword research tools','Landing page builders','Lead generation software','Marketing automation platforms','SEO tools','Social media management tools','Survey and form builders'] },
  { name: 'Health & Fitness', fa: 'سلامت و تناسب اندام', icon: '💪', color: 'from-red-500 to-pink-500', subcategories: ['Activity tracking','Health Insurance','Medical','Meditation apps','Mental Health','Sleep apps','Therapy apps','Workout platforms'] },
  { name: 'Travel', fa: 'سفر', icon: '✈️', color: 'from-sky-500 to-blue-500', subcategories: ['Flight booking apps','Hotel booking app','Maps and GPS','Outdoors platforms','Short term rentals','Travel Planning','Travel apps','Weather apps'] },
  { name: 'Platforms', fa: 'پلتفرم‌ها', icon: '🖥️', color: 'from-slate-500 to-gray-600', subcategories: ['Crowdfunding','Event software','Job boards','Language Learning','News','Online learning','Real estate','Startup communities','Virtual events'] },
  { name: 'Product add-ons', fa: 'افزونه‌های محصول', icon: '🧩', color: 'from-teal-500 to-cyan-500', subcategories: ['Chrome Extensions','Figma Plugins','Figma Templates','Notion Templates','Slack apps','Twitter apps','Wordpress Plugins','Wordpress themes'] },
  { name: 'AI Agents', fa: 'ایجنت‌های هوش مصنوعی', icon: '🤖', color: 'from-fuchsia-500 to-pink-500', subcategories: ['AI Chief Of Staff','AI Data Scientist','AI Designer','AI Engineer','AI SDR','AI Voice Agents'] },
  { name: 'LLMs', fa: 'مدل‌های زبانی بزرگ', icon: '🧠', color: 'from-violet-500 to-purple-500', subcategories: ['AI Chatbots','AI Infrastructure Tools','AI Metrics and Evaluation','Foundation Models','LLM Developer Tools','LLM Fine Tuning','Prompt Engineering Tools'] },
  { name: 'Physical Products', fa: 'محصولات فیزیکی', icon: '📦', color: 'from-amber-500 to-yellow-500', subcategories: ['Books','Fitness','Furniture','Games','Toys','Wearables','Webcams'] },
  { name: 'Web3', fa: 'وب۳', icon: '🔗', color: 'from-purple-600 to-indigo-600', subcategories: ['Crypto exchanges','Crypto tools','Crypto wallets','DAOs','Defi','NFT creation tools','NFT marketplaces'] },
  { name: 'Voice AI Tools', fa: 'ابزارهای صوتی AI', icon: '🎙️', color: 'from-red-400 to-orange-400', subcategories: ['AI Dictation Apps','AI Voice Agent Infrastructure','Realtime Voice AI','Text-to-Speech Software','Transcription','Translation'] },
  { name: 'Ecommerce', fa: 'تجارت الکترونیک', icon: '🛒', color: 'from-green-500 to-emerald-500', subcategories: ['Ecommerce platforms','Marketplace sites','Payment processors','Shopify Apps'] },
  { name: 'Family', fa: 'خانواده', icon: '👨‍👩‍👧', color: 'from-pink-400 to-rose-400', subcategories: ['Apps for kids','Family Care','Pregnancy apps'] },
  { name: 'Data analysis tools', fa: 'تحلیل داده', icon: '📊', color: 'from-blue-600 to-indigo-600', subcategories: ['Analytics Databases','Business intelligence software','Data visualization tools'] },
  { name: 'No-code Platforms', fa: 'پلتفرم‌های بدون کد', icon: '🧱', color: 'from-cyan-500 to-blue-500', subcategories: ['No-Code AI Agent Builder','No-Code App Builder','No-Code Website Builder'] },
  { name: 'Lifestyle', fa: 'سبک زندگی', icon: '🌿', color: 'from-lime-500 to-green-500', subcategories: ['Shopping'] },
];

// نگاشت تاپیک‌های قدیمی (داده اسکرپ) به دسته‌های اصلی برای نمایش ایده‌ها
export const MAIN_TOPICS: Record<string, string[]> = {
  'Productivity': ['Productivity','Notes','Task Management','Calendars','Email','Time Tracking','Team Collaboration','Documents'],
  'Engineering & Development': ['Developer Tools','APIs','Databases','DevOps','Cloud','GitHub','Open Source','Programming','Software','Web App','Code'],
  'Design & Creative': ['Design Tools','Design','Illustration','Photography','Video','Photo Editing','Animation','Typography'],
  'Finance': ['Finance','Fintech','Banking','Crypto','Blockchain','Investing','Payments'],
  'Social & Community': ['Social Media','Social','Communication','Messaging','Dating','Community'],
  'Marketing & Sales': ['Marketing','SEO','Sales','CRM','Analytics','Email Marketing','Ads'],
  'Health & Fitness': ['Health','Fitness','Medical','Mental Health','Wellness','Meditation'],
  'Travel': ['Travel','Transportation','Maps'],
  'Platforms': ['Platforms','Mobile','iOS','Android','Mac','Windows','Linux','Browsers'],
  'Product add-ons': ['Chrome Extensions','Plugins','Integrations','Figma Plugins'],
  'AI Agents': ['AI Agents','Autonomous Agents','Workflow Automation'],
  'LLMs': ['Artificial Intelligence','AI','Machine Learning','LLMs','ChatGPT','Claude','Gemini'],
  'Physical Products': ['Physical Products','Hardware','Gadgets','Wearables','IoT','Smart Home'],
  'Web3': ['Web3','NFTs','DeFi','DAOs','Crypto wallets'],
  'Voice AI Tools': ['Voice AI Tools','Text-to-Speech','Transcription','Audio','Music','Podcasts'],
  'Ecommerce': ['Ecommerce','Online Stores','Marketplaces','Shopping','Retail'],
  'Family': ['Family','Parenting','Kids','Baby','Education'],
  'Data analysis tools': ['Analytics','Business Intelligence','Data Visualization','Data','Dashboards'],
  'No-code Platforms': ['No-code','Low-code','Website Builders','App Builders','Automation'],
  'Lifestyle': ['Lifestyle','Fashion','Beauty','Food','Food & Drink','Cooking','Home','Hobbies','Books','News','Media','Entertainment','Games','Gaming'],
};

export function slugifyMainCategory(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function findParentCategory(sub: string): CategoryNode | null {
  const lower = sub.toLowerCase().trim();
  return CATEGORY_TREE.find((c) => c.subcategories.some((s) => s.toLowerCase() === lower) || (MAIN_TOPICS[c.name] ?? []).some((t) => t.toLowerCase() === lower)) ?? null;
}
