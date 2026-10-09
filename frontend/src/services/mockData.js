// Rich mock data for GitHub Pages static preview when backend is offline

export const MOCK_USER = {
  id: '3cef7b62-9a22-4725-a32b-4383cdcfff53',
  name: 'Demo Diary Explorer',
  email: 'demo@memoai.com',
  profileImage: null,
};

export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Travel', color: '#0284c7' },
  { id: 'cat-2', name: 'Achievement', color: '#16a34a' },
  { id: 'cat-3', name: 'Personal', color: '#d97706' },
  { id: 'cat-4', name: 'Family', color: '#9333ea' },
  { id: 'cat-5', name: 'Study', color: '#2563eb' },
  { id: 'cat-6', name: 'University', color: '#0d9488' },
];

export const MOCK_MEMORIES = [
  {
    id: 'mem-1',
    title: "Sunset Walk at Cox's Bazar Sea Beach",
    content: "Walked along the world's longest unbroken sea beach as the sun dipped into the Bay of Bengal. The waves rolled in gently, reflecting golden and violet hues across the water. We sat on the sand, enjoyed fresh green coconuts, and listened to the soothing rhythm of the ocean. It felt like time slowed down, washing away the stress of the entire semester.",
    memoryDate: "2026-10-05",
    mood: "Happy",
    category: { id: 'cat-1', name: 'Travel' },
    tags: [{ id: 't-1', name: 'beach' }, { id: 't-2', name: 'sunset' }, { id: 't-3', name: 'nature' }],
    locationName: "Cox's Bazar Beach, Bangladesh",
    latitude: 21.4272,
    longitude: 91.9702,
    images: [],
    aiAnalysis: {
      emotion: "Happy",
      summary: "A peaceful evening walk along Cox's Bazar sea beach, enjoying golden sunsets and the ocean breeze.",
      keywords: ["beach", "sunset", "ocean", "calm"]
    }
  },
  {
    id: 'mem-2',
    title: "Final Capstone Project Defense",
    content: "Today was our final capstone project defense! Our team presented MemoAI in front of the faculty panel. The live demo of semantic vector search and real-time map visualization went flawlessly without a single hitch. Professor Rahman commended our clean layered architecture and user privacy model. Months of hard work, sleepless nights, and endless debugging finally paid off. Truly proud of our teamwork.",
    memoryDate: "2026-10-02",
    mood: "Proud",
    category: { id: 'cat-2', name: 'Achievement' },
    tags: [{ id: 't-4', name: 'university' }, { id: 't-5', name: 'presentation' }, { id: 't-6', name: 'milestone' }],
    locationName: "Curzon Hall, University of Dhaka",
    latitude: 23.7265,
    longitude: 90.4007,
    images: [],
    aiAnalysis: {
      emotion: "Proud",
      summary: "Successfully defended MemoAI capstone project with commendations from faculty on system architecture.",
      keywords: ["university", "defense", "engineering", "success"]
    }
  },
  {
    id: 'mem-3',
    title: "Morning Clouds above Sajek Valley",
    content: "Woke up at 5:30 AM on the wooden balcony of our cottage in Konglak Para. The entire valley below was completely submerged in a thick sea of white clouds floating right below our feet. The cool mountain breeze was exhilarating. We hiked up to the peak, shared hot bamboo tea with friendly locals, and soaked in the breathtaking panorama. Moments like this remind me why I love exploring.",
    memoryDate: "2026-09-18",
    mood: "Excited",
    category: { id: 'cat-1', name: 'Travel' },
    tags: [{ id: 't-7', name: 'mountains' }, { id: 't-8', name: 'clouds' }, { id: 't-9', name: 'adventure' }],
    locationName: "Sajek Valley, Rangamati",
    latitude: 23.3820,
    longitude: 92.2938,
    images: [],
    aiAnalysis: {
      emotion: "Excited",
      summary: "Witnessed breathtaking sea of clouds over Sajek Valley at dawn and shared bamboo tea with locals.",
      keywords: ["sajek", "clouds", "mountains", "hike"]
    }
  },
  {
    id: 'mem-4',
    title: "Rainy Afternoon Coffee & Journaling in Dhanmondi",
    content: "Heavy autumn rain showered over Dhanmondi Lake this afternoon. I found a cozy corner table beside the glass window, ordered a warm hazelnut cappuccino, and spent two uninterrupted hours reading and reflecting. The sound of rain tapping against the glass paired with acoustic lo-fi music brought such deep tranquility. Sometimes doing nothing at all is the most productive thing you can do for your soul.",
    memoryDate: "2026-09-28",
    mood: "Calm",
    category: { id: 'cat-3', name: 'Personal' },
    tags: [{ id: 't-10', name: 'coffee' }, { id: 't-11', name: 'rain' }, { id: 't-12', name: 'peace' }],
    locationName: "Dhanmondi Lake Cafe, Dhaka",
    latitude: 23.7461,
    longitude: 90.3742,
    images: [],
    aiAnalysis: {
      emotion: "Calm",
      summary: "Spent a serene rainy afternoon at Dhanmondi Lake sipping cappuccino and reading peacefully.",
      keywords: ["coffee", "rain", "journaling", "tranquility"]
    }
  },
  {
    id: 'mem-5',
    title: "Exploring the Ancient Tea Estates of Sreemangal",
    content: "Cycled through the endless undulating green hills of the tea gardens. The fragrance of fresh wet tea leaves after the monsoon drizzle was unforgettable. We explored the dense canopy of Lawachara National Park and spotted hoolock gibbons swinging through the treetops. Later, we tasted the famous seven-layer tea at Nilkantha Tea Cabin. A nostalgic, earthy trip that felt like stepping into an old storybook.",
    memoryDate: "2026-08-14",
    mood: "Nostalgic",
    category: { id: 'cat-1', name: 'Travel' },
    tags: [{ id: 't-13', name: 'tea' }, { id: 't-14', name: 'rainforest' }, { id: 't-15', name: 'nature' }],
    locationName: "Lawachara National Park, Sreemangal",
    latitude: 24.3188,
    longitude: 91.7850,
    images: [],
    aiAnalysis: {
      emotion: "Nostalgic",
      summary: "Scenic cycling tour across Sreemangal tea estates and walking through Lawachara rainforest canopy.",
      keywords: ["sreemangal", "tea", "rainforest", "greenery"]
    }
  },
  {
    id: 'mem-6',
    title: "Family Rooftop BBQ & Stargazing",
    content: "Gathered the whole family up on the rooftop for a weekend barbecue dinner. My cousins helped set up fairy lights while uncle grilled chicken tikka and parathas. We talked and laughed until late midnight under a clear starry sky, reminiscing about childhood stories and sharing plans for the upcoming year. Deeply grateful for warm family moments like these that keep us grounded.",
    memoryDate: "2026-09-08",
    mood: "Grateful",
    category: { id: 'cat-4', name: 'Family' },
    tags: [{ id: 't-16', name: 'family' }, { id: 't-17', name: 'bbq' }, { id: 't-18', name: 'gratitude' }],
    locationName: "Gulshan, Dhaka",
    latitude: 23.7925,
    longitude: 90.4078,
    images: [],
    aiAnalysis: {
      emotion: "Grateful",
      summary: "Memorable rooftop family barbecue with fairy lights, storytelling, and stargazing under midnight sky.",
      keywords: ["family", "barbecue", "rooftop", "gratitude"]
    }
  },
  {
    id: 'mem-7',
    title: "Mastering TypeScript and NestJS Architecture",
    content: "Spent the entire weekend deep-diving into clean architecture, dependency injection, and TypeORM repository patterns. Finally clicked how decorators and metadata reflection work under the hood in NestJS. Built a small prototype with custom pipes and exception filters. Feeling a surge of momentum as full-stack software development concepts become second nature.",
    memoryDate: "2026-08-25",
    mood: "Excited",
    category: { id: 'cat-5', name: 'Study' },
    tags: [{ id: 't-19', name: 'coding' }, { id: 't-20', name: 'nestjs' }, { id: 't-21', name: 'typescript' }],
    locationName: "Home Library, Dhaka",
    latitude: 23.7500,
    longitude: 90.3900,
    images: [],
    aiAnalysis: {
      emotion: "Excited",
      summary: "Intensive study weekend mastering TypeScript decorators, NestJS dependency injection, and clean architecture.",
      keywords: ["typescript", "nestjs", "architecture", "coding"]
    }
  }
];

export const MOCK_INSIGHTS = {
  totalMemories: 7,
  moodDistribution: {
    Happy: 1,
    Proud: 1,
    Calm: 1,
    Excited: 2,
    Grateful: 1,
    Nostalgic: 1,
  },
  categoryDistribution: {
    Travel: 3,
    Achievement: 1,
    Personal: 1,
    Family: 1,
    Study: 1,
  },
  topLocations: [
    { name: "Cox's Bazar Beach, Bangladesh", count: 1 },
    { name: "Curzon Hall, University of Dhaka", count: 1 },
    { name: "Sajek Valley, Rangamati", count: 1 },
    { name: "Dhanmondi Lake Cafe, Dhaka", count: 1 },
    { name: "Lawachara National Park, Sreemangal", count: 1 },
  ],
  aiInsights: [
    "Your memories reflect a balanced emotional life with a strong curiosity for nature and travel.",
    "You have captured 7 meaningful moments, building a healthy lifelong journaling practice."
  ]
};
