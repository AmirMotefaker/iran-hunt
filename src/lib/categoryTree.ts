export interface CategoryNode {
  name: string;
  fa: string;
  icon: string;
  color: string;
  subcategories: string[];
}

// دسته‌بندی‌های اصلی ProductHunt با زیردسته‌ها
export const CATEGORY_TREE: CategoryNode[] = [
  {
    name: 'Productivity', fa: 'بهره‌وری', icon: '⚡', color: 'from-blue-500 to-cyan-500',
    subcategories: ['Notes', 'Task Management', 'Calendars', 'Email', 'Time Tracking', 'Work Management', 'Team Collaboration', 'Documents', 'Keyboard Tools', 'File Management']
  },
  {
    name: 'Engineering & Development', fa: 'مهندسی و توسعه', icon: '💻', color: 'from-indigo-500 to-purple-500',
    subcategories: ['Developer Tools', 'APIs', 'Databases', 'DevOps', 'Cloud', 'Code Editors', 'Testing', 'Version Control', 'Web App', 'Software', 'Programming', 'GitHub']
  },
  {
    name: 'Design & Creative', fa: 'طراحی و خلاقیت', icon: '🎨', color: 'from-pink-500 to-rose-500',
    subcategories: ['Design Tools', 'Design', 'Illustration', 'Photography', 'Video', 'Photo Editing', '3D Modeling', 'Animation', 'Typography', 'Colors']
  },
  {
    name: 'Finance', fa: 'مالی', icon: '💰', color: 'from-emerald-500 to-green-500',
    subcategories: ['Finance', 'Fintech', 'Banking', 'Crypto', 'Blockchain', 'Investing', 'Accounting', 'Budgeting', 'Payments', 'Taxes']
  },
  {
    name: 'Social & Community', fa: 'اجتماعی و انجمن', icon: '👥', color: 'from-blue-400 to-indigo-400',
    subcategories: ['Social Media', 'Social', 'Communication', 'Messaging', 'Forums', 'Dating', 'Relationships', 'Community Platforms', 'Groups']
  },
  {
    name: 'Marketing & Sales', fa: 'بازاریابی و فروش', icon: '📈', color: 'from-orange-500 to-amber-500',
    subcategories: ['Marketing', 'SEO', 'Sales', 'CRM', 'Analytics', 'Email Marketing', 'Social Media Marketing', 'Lead Generation', 'Ads', 'Branding']
  },
  {
    name: 'Health & Fitness', fa: 'سلامت و تناسب اندام', icon: '💪', color: 'from-red-500 to-pink-500',
    subcategories: ['Health', 'Fitness', 'Medical', 'Mental Health', 'Wellness', 'Yoga', 'Meditation', 'Nutrition', 'Sleep']
  },
  {
    name: 'Travel', fa: 'سفر', icon: '✈️', color: 'from-sky-500 to-blue-500',
    subcategories: ['Travel', 'Transportation', 'Booking', 'Local Discovery', 'Maps', 'Guides']
  },
  {
    name: 'Platforms', fa: 'پلتفرم‌ها', icon: '🖥️', color: 'from-slate-500 to-gray-600',
    subcategories: ['Platforms', 'Web App', 'Mobile', 'iOS', 'Android', 'Mac', 'Windows', 'Linux', 'Browsers']
  },
  {
    name: 'Product add-ons', fa: 'افزونه‌های محصول', icon: '🧩', color: 'from-teal-500 to-cyan-500',
    subcategories: ['Chrome Extensions', 'Plugins', 'Integrations', 'Figma Plugins', 'VSCode Extensions']
  },
  {
    name: 'LLMs', fa: 'مدل‌های زبانی بزرگ', icon: '🧠', color: 'from-violet-500 to-purple-500',
    subcategories: ['LLMs', 'ChatGPT', 'Claude', 'Gemini', 'LLM APIs', 'Prompt Engineering']
  },
  {
    name: 'AI Agents', fa: 'ایجنت‌های هوش مصنوعی', icon: '🤖', color: 'from-fuchsia-500 to-pink-500',
    subcategories: ['AI Agents', 'Autonomous Agents', 'Workflow Automation', 'AI Assistants']
  },
  {
    name: 'Web3', fa: 'وب۳', icon: '🔗', color: 'from-purple-600 to-indigo-600',
    subcategories: ['Web3', 'NFTs', 'DeFi', 'DAOs', 'Wallets', 'Metaverse']
  },
  {
    name: 'Physical Products', fa: 'محصولات فیزیکی', icon: '📦', color: 'from-amber-500 to-yellow-500',
    subcategories: ['Physical Products', 'Hardware', 'Gadgets', 'Wearables', 'IoT', 'Smart Home']
  },
  {
    name: 'Voice AI Tools', fa: 'ابزارهای هوش مصنوعی صوتی', icon: '🎙️', color: 'from-red-400 to-orange-400',
    subcategories: ['Voice AI Tools', 'Text-to-Speech', 'Voice Assistants', 'Transcription', 'Audio', 'Music', 'Podcasts']
  },
  {
    name: 'Ecommerce', fa: 'تجارت الکترونیک', icon: '🛒', color: 'from-green-500 to-emerald-500',
    subcategories: ['Ecommerce', 'Online Stores', 'Marketplaces', 'Dropshipping', 'Shopping', 'Retail']
  },
  {
    name: 'No-code Platforms', fa: 'پلتفرم‌های بدون کد', icon: '🧱', color: 'from-cyan-500 to-blue-500',
    subcategories: ['No-code', 'Low-code', 'Website Builders', 'App Builders', 'Automation', 'Zapier Alternatives']
  },
  {
    name: 'Family', fa: 'خانواده', icon: '👨‍👩‍👧', color: 'from-pink-400 to-rose-400',
    subcategories: ['Family', 'Parenting', 'Kids', 'Baby', 'Education']
  },
  {
    name: 'Data analysis tools', fa: 'ابزارهای تحلیل داده', icon: '📊', color: 'from-blue-600 to-indigo-600',
    subcategories: ['Data analysis tools', 'Analytics', 'Business Intelligence', 'Data Visualization', 'Dashboards', 'Data']
  },
  {
    name: 'Lifestyle', fa: 'سبک زندگی', icon: '🌿', color: 'from-lime-500 to-green-500',
    subcategories: ['Lifestyle', 'Fashion', 'Beauty', 'Food', 'Food & Drink', 'Cooking', 'Home', 'Hobbies', 'Books', 'News', 'Media', 'Entertainment', 'Games', 'Gaming']
  },
  {
    name: 'LLM Memory', fa: 'حافظه مدل‌های زبانی', icon: '💾', color: 'from-purple-500 to-indigo-500',
    subcategories: ['LLM Memory', 'RAG', 'Vector Databases', 'Context Management', 'Embeddings']
  },
  {
    name: 'AI', fa: 'هوش مصنوعی', icon: '🤖', color: 'from-rose-500 to-pink-600',
    subcategories: ['Artificial Intelligence', 'AI', 'Machine Learning', 'Computer Vision', 'NLP', 'Robotics', 'Deep Learning']
  },
];

// پیدا کردن دسته اصلی برای یک زیردسته
export function findParentCategory(subcategoryName: string): CategoryNode | null {
  const lower = subcategoryName.toLowerCase().trim();
  return CATEGORY_TREE.find((cat) =>
    cat.subcategories.some((s) => s.toLowerCase() === lower)
  ) ?? null;
}

// همه زیردسته‌های یک دسته اصلی
export function getSubcategories(parentName: string): string[] {
  const cat = CATEGORY_TREE.find((c) => c.name === parentName || c.name.toLowerCase() === parentName.toLowerCase());
  return cat?.subcategories ?? [];
}

// اسلاگ پایدار برای دسته اصلی
export function slugifyMainCategory(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
