
import { Asset, AssetType, WardrobeItem } from './types';

export const INITIAL_ASSETS: Asset[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', type: AssetType.CRYPTO, amount: 0.42, price: 92450.21, change24h: 2.45, icon: '₿' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', type: AssetType.CRYPTO, amount: 5.12, price: 2850.15, change24h: -1.20, icon: 'Ξ' },
  { id: '3', name: 'Silver / 白银', symbol: 'AG', type: AssetType.METAL, amount: 500, price: 34.20, change24h: 5.67, icon: 'Ag' },
  { id: '4', name: 'Nvidia', symbol: 'NVDA', type: AssetType.STOCK, amount: 20, price: 145.32, change24h: 0.85, icon: 'N' },
  { id: '5', name: 'USDC', symbol: 'USDC', type: AssetType.CASH, amount: 15200, price: 1.00, change24h: 0.01, icon: '$' },
];

export const EXCHANGE_RATE_USD_TO_CNY = 7.24;

export const WARDROBE_ITEMS: WardrobeItem[] = [
  // Head
  { id: 'h1', category: 'head', price: 50, name: { en: 'Neural Ribbon', cn: '神经发带' }, svgSnippet: `<path d="M7 3 Q12 1 17 3" fill="none" stroke="cyan" stroke-width="0.5" stroke-dasharray="1 1" />` },
  { id: 'h2', category: 'head', price: 120, name: { en: 'Anime Visor', cn: '萌系战术目镜' }, svgSnippet: `<path d="M8 8.5 Q12 7.5 16 8.5 L16 9.5 Q12 10.5 8 9.5 Z" fill="rgba(0,255,255,0.4)" stroke="cyan" stroke-width="0.1" />` },
  { id: 'h3', category: 'head', price: 500, name: { en: 'Martian Princess Crown', cn: '火星公主之冠' }, svgSnippet: `<path d="M9 5 L10 2 L12 4 L14 2 L15 5" fill="none" stroke="gold" stroke-width="0.5" stroke-linecap="round" />` },
  
  // Body
  { id: 'b1', category: 'body', price: 80, name: { en: 'Lace Void Cloak', cn: '蕾丝虚空斗篷' }, svgSnippet: `<path d="M5 12 Q12 24 19 12" fill="rgba(255,100,255,0.1)" stroke="white" stroke-width="0.1" stroke-dasharray="0.5 0.5"/>` },
  { id: 'b2', category: 'body', price: 300, name: { en: 'Silver Sailor Suit', cn: '白银水手服' }, svgSnippet: `<path d="M8 11.5 L16 11.5 L15 14 L9 14 Z" fill="rgba(192,192,192,0.6)" stroke="white" stroke-width="0.3"/>` },
  { id: 'b3', category: 'body', price: 1000, name: { en: 'Nebula Kimono', cn: '星云霓裳' }, svgSnippet: `<path d="M4 11.5 L20 11.5 L17 22 L7 22 Z" fill="rgba(255,100,250,0.15)" stroke="pink" stroke-width="0.2"/>` },
  
  // Legs
  { id: 'l1', category: 'legs', price: 150, name: { en: 'Zero-G Stockings', cn: '零重力长袜' }, svgSnippet: `<path d="M9.5 21 L9.5 23 M14.5 21 L14.5 23" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" />` },
  { id: 'l2', category: 'legs', price: 400, name: { en: 'Cyber Boots', cn: '赛博厚底靴' }, svgSnippet: `<rect x="8.5" y="21" width="2.5" height="2" rx="0.5" fill="#222" /><rect x="13" y="21" width="2.5" height="2" rx="0.5" fill="#222" />` },

  // Accessory
  { id: 'a1', category: 'accessory', price: 30, name: { en: 'Moe Heart Aura', cn: '萌力心形光环' }, svgSnippet: `<path d="M12 18 Q10 16 8 18 Q6 20 12 23 Q18 20 16 18 Q14 16 12 18" fill="none" stroke="hotpink" stroke-width="0.2" opacity="0.6"/>` },
  { id: 'a2', category: 'accessory', price: 1500, name: { en: 'Angel Wings', cn: '炽天使之翼' }, svgSnippet: `<path d="M6 10 Q-2 2 6 -2 M18 10 Q26 2 18 -2" fill="none" stroke="cyan" stroke-width="0.2" opacity="0.4" />` },

  // Special Daily Items
  { id: 's1', category: 'accessory', price: 0, name: { en: 'Saver Ribbon', cn: '攒钱少女缎带' }, isSpecial: true, svgSnippet: `<path d="M12 12 L14 14 M12 12 L10 14" stroke="yellow" stroke-width="0.5" />` },
  { id: 's2', category: 'head', price: 0, name: { en: 'Earner Halo', cn: '致富天使环' }, isSpecial: true, svgSnippet: `<ellipse cx="12" cy="1" rx="3" ry="0.6" stroke="cyan" stroke-width="0.2" fill="none" />` },
];

export const THEME_COLORS = {
  bg: '#0d0d0f',
  card: '#151517',
  border: 'rgba(255,255,255,0.08)',
  accent: '#0062ff',
  success: '#00df9a',
  danger: '#ff4b5c',
  secondary: '#7d33ff',
  warning: '#f3ba2f',
};

export const MARTIAN_QUOTES = [
  { cn: "要把白银攒起来，才能变成闪闪发光的火星少女哦！", en: "Save up your silver to become a sparkling Martian girl!" },
  { cn: "欧尼酱，今天的资产配置也要元气满满呢！", en: "Onii-chan, today's asset allocation must be full of energy!" },
  { cn: "即使是2026年的混乱，也挡不住理财少女的决心！", en: "Even the chaos of 2026 can't stop a financial girl's determination!" },
  { cn: "流动性就像星星一样，抓住了就能照亮未来。", en: "Liquidity is like stars; catch them to light up the future." },
  { cn: "波动性什么的，只要有爱（和AI）就能克服！", en: "Volatility can be overcome with love (and AI)!" },
  { cn: "今天的复利，是写给明天的情书。", en: "Today's compound interest is a love letter to tomorrow." }
];

export const TRANSLATIONS = {
  en: {
    home: 'Home',
    ai: 'AI Strategist',
    tools: 'Analysis',
    assets: 'Assets',
    studio: 'Studio',
    totalBalance: 'Total Balance',
    invest: 'Invest',
    ops: 'Operations',
    savings: 'Savings',
    income: 'Income Reference',
    risk: 'Strategy Preference',
    aiPrompt: 'Ask about 2026 financial shifts...',
    connect: 'Connect',
    trade: 'Trade',
    audit: '2026 AUDIT',
    logout: 'Sever Link',
    logoutConfirm: 'Are you sure you want to disconnect your neural profile?',
    allocationTitle: 'Capital Allocation Engine',
    aiRecommendation: 'AI Scientific Allocation Recommendation',
    whyThisRatio: 'Scientific Logic for 2026',
    strategicPK: 'Strategic Stance PK',
    pkStatus: 'Neural Positioning Analysis',
    plan: 'Plan',
    wallet: 'Wallet',
    silverInsight: 'Silver Insight',
    currency: 'Currency',
    dailyMartian: 'Daily Martian',
    portfolio: 'Portfolio',
    linkedAsset: 'Linked Asset',
    syncStatus: 'Neural Sync Status',
    encrypted: 'Encrypted',
    aiInsights: {
      title: 'AI Neural Insight',
      constructive: 'Strategic Suggestions',
      analyze: 'Analyze Core',
      silverAlert: 'Silver exposure high: Consider rebalancing 5% into BTC for Lunar Liquidity.',
      savingsAlert: 'Operational buffer is 12% below target. Sync daily saving goal.',
      marketShift: 'Global Order Shift detected. Silver volatility expected +12% this cycle.',
      viewMore: 'Open Strategy Hub'
    },
    pricing: {
      title: 'Upgrade to Xallet Pro',
      subtitle: 'Unlock the full potential of 2026 finance.',
      free: 'Standard',
      premium: 'Elite Pro',
      price: '$19/mo',
      credits: 'Includes 19,000 Martian Credits',
      features: [
        'Advanced Gemini 3 Pro reasoning',
        '2K/4K Asset Image Generation',
        'Unlimited Neural OCR Scanning',
        'Priority Martian Network Rank',
        'Exclusive Martian Goddess Skins'
      ],
      upgrade: 'Unlock Elite Access',
      current: 'Current Plan'
    },
    companion: {
      title: 'Martian Girl',
      tokens: 'Martian Credits',
      wardrobe: 'Galactic Boutique',
      buy: 'Acquire',
      equipped: 'Wearing',
      equip: 'Wear',
      notEnough: 'Insufficient Credits',
      mbtiPrompt: 'Select your Core Type (MBTI)',
      genderPrompt: 'Identify your Signal',
      male: 'Master',
      female: 'Lady',
      ranking: 'Popularity Rank',
      milestone: 'Star Milestone',
      milestoneDesc: 'Achieve 10,000 MC & Top 100 to unlock a custom physical Martian TEE for your companion.',
      teeUnlocked: 'TEE UNLOCKED!',
      claimTee: 'Claim Physical TEE',
      dailyGoal: 'Daily Wealth Synergy',
      goalEarn: 'Earning Mode',
      goalSave: 'Saving Mode',
      goalUnlock: 'Synergy Active!',
      goalClaim: 'Open Gacha Box'
    },
    imageEditor: {
      title: 'Neural Studio Pro',
      modeGen: 'Generate',
      modeScan: 'Expense Scan',
      modeIncome: 'Income Scan',
      upload: 'Upload Receipt',
      uploadIncome: 'Upload Galactic Emperor',
      promptGen: 'Describe new asset visual...',
      generating: 'Processing Core...',
      scanning: 'Extracting Data...',
      generate: 'Generate High-Res',
      scanAction: 'Analyze Receipt',
      scanIncomeAction: 'Analyze Income',
      scanSuccess: 'Expense recorded to Operations budget',
      incomeSuccess: 'Revenue recorded to Capital system',
      empty: 'No image selected',
      size: 'Resolution',
      aspect: 'Ratio',
      apiKeyRequired: 'High-quality generation requires your own API Key.'
    },
    strategy: {
      conservative: 'Conservative',
      balanced: 'Balanced',
      aggressive: 'Aggressive'
    },
    expenses: {
      title: 'Operating Expenses',
      remaining: 'Remaining Budget',
      totalSpent: 'Total Spent',
      recent: 'Recent Receipts',
      empty: 'No receipts scanned yet',
      actualIncome: 'Actual Revenue',
      projectedIncome: 'Projected'
    },
    logic: {
      aggressive: '2026 is a decade of high volatility. Suggest 50% Investment to maximize returns on Silver/Crypto breakouts while keeping Ops lean.',
      balanced: 'Optimal balance for 2026 order re-sorting. 35% in assets like Silver hedge against inflation while 20% ensures a safety buffer.',
      conservative: 'Prioritize survival in 2026. Suggest 30% savings and high allocation for operational stability. Only 20% in proven hard assets.'
    },
    pkFeedback: {
      conservative: "You are prioritizing fortress-level safety. Ideal for 2026 regime changes, but risk missing the Silver supercycle.",
      balanced: "You have achieved Martian equilibrium. Your posture is perfectly synced with the current 2026 neural re-ordering.",
      aggressive: "Maximum thrust detected. You are betting heavily on the new order assets. Ensure your liquid buffer covers 3 lunar cycles."
    }
  },
  cn: {
    home: '首页',
    ai: 'AI 策略师',
    tools: '财务分析',
    assets: '资产',
    studio: '影像中心',
    totalBalance: '资产总额',
    invest: '投资分配',
    ops: '运营支出',
    savings: '基础储蓄',
    income: '参考收入',
    risk: '投资偏好',
    aiPrompt: '询问关于 2026 金融变革...',
    connect: '连接钱包',
    trade: '交易',
    audit: '2026 审计',
    logout: '退出登录',
    logoutConfirm: '确定要断开当前的神经连接吗？',
    allocationTitle: '资金分配引擎',
    aiRecommendation: 'AI 科学分配建议',
    whyThisRatio: '2026 核心财务逻辑',
    strategicPK: '策略姿态 PK',
    pkStatus: '神经中枢定位分析',
    plan: '方案',
    wallet: '钱包',
    silverInsight: '白银洞察',
    currency: '币种',
    dailyMartian: '每日火星语',
    portfolio: '我的资产',
    linkedAsset: '已关联资产',
    syncStatus: '神经同步状态',
    encrypted: '已加密',
    aiInsights: {
      title: 'AI 神经洞察',
      constructive: '建设性投资建议',
      analyze: '分析核心',
      silverAlert: '白银敞口较高：建议将 5% 仓位轮动至 BTC 以获取流动性溢价。',
      savingsAlert: '运营缓冲区低于目标 12%。建议同步每日攒钱计划。',
      marketShift: '侦测到全球秩序剧剧变。白银波动率在本周期内预计上升 12%。',
      viewMore: '开启策略中心'
    },
    pricing: {
      title: '升级 Xallet Pro',
      subtitle: '解锁 2026 全球金融体系的全部潜能。',
      free: '普通版',
      premium: '精英版',
      price: '$19/月',
      credits: '包含 19,000 火星点券 (1:1000 兑换)',
      features: [
        '高级 Gemini 3 Pro 深度推理',
        '2K/4K 超清资产影像生成',
        '无限次神经 OCR 收据扫描',
        '火星网络优先排名权重',
        '专属火星女神限定装扮'
      ],
      upgrade: '开启精英权限',
      current: '当前方案'
    },
    companion: {
      title: '理财少女',
      tokens: '火星点券',
      wardrobe: '星际精品店',
      buy: '购买',
      equipped: '已穿戴',
      equip: '穿戴',
      notEnough: '点券不足',
      mbtiPrompt: '选择您的性格核 (MBTI)',
      genderPrompt: '识别您的身份 (角色)',
      male: '主人',
      female: '大小姐',
      ranking: '人气排名',
      milestone: '明星里程碑',
      milestoneDesc: '积攒 10,000 点券并进入全站前 100，即可获赠为您定制的实体火星 TEE。',
      teeUnlocked: '定制 TEE 已解锁！',
      claimTee: '领取实体 TEE',
      dailyGoal: '每日致富协同',
      goalEarn: '挣钱模式',
      goalSave: '攒钱模式',
      goalUnlock: '协同奖励已激活',
      goalClaim: '开启火星抽奖'
    },
    imageEditor: {
      title: '影像工作室 Pro',
      modeGen: '创意生成',
      modeScan: '记账扫描',
      modeIncome: '收入扫描',
      upload: '上传消费小票',
      uploadIncome: '上传宇宙大帝',
      promptGen: '描绘全新的资产愿景...',
      generating: '核心处理中...',
      scanning: '数据提取中...',
      generate: '生成高精图像',
      scanAction: '分析收据并记账',
      scanIncomeAction: '分析收入并入账',
      scanSuccess: '已成功记入运营支出方案',
      incomeSuccess: '创收数据已同步至财务中枢',
      empty: '尚未选择资产图片',
      size: '解析度',
      aspect: '纵横比',
      apiKeyRequired: '高质量生成需要选择您自己的 API 密钥。'
    },
    strategy: {
      conservative: '稳健型',
      balanced: '平衡型',
      aggressive: '激进型'
    },
    expenses: {
      title: '运营支出分析',
      remaining: '剩余预算',
      totalSpent: '累计支出',
      recent: '近期账单',
      empty: '暂无收据记录',
      actualIncome: '实收账款',
      projectedIncome: '预期收入'
    },
    logic: {
      aggressive: '2026 是高波动性的十年。建议每挣一笔钱拿出 50% 进行投资（尤其配置白银和优质加密资产），仅维持 40% 运营开支，最大化复利。',
      balanced: '针对 2026 全球金融秩序重排，建议采用 35% 投资（对冲贬值）、45% 运营（生活保障）、20% 储蓄（应对突发风险）的科学黄金配比。',
      conservative: '在秩序剧剧变中，生存优于增长。建议每笔收入保留 30% 现金储蓄， 50% 投入日常稳定运营，仅将 20% 用于波动性硬资产。',
    },
    pkFeedback: {
      conservative: "您的姿态极其保守。在2026年的秩序剧变中，您拥有极高的生存概率，但可能会错过资产重估的最佳红利期。",
      balanced: "您正处于“火星平衡点”。当前的资产分配与2026年的中性风险曲线完美重合，兼顾了安全与增值需求。",
      aggressive: "侦测到高强度扩张姿态。您正全力押注新金融秩序资产，建议确保您的流动性储备能覆盖至少 3 个月的紧急运营。"
    }
  }
};
