import axios from 'axios';
import { MOCK_USER, MOCK_MEMORIES, MOCK_CATEGORIES, MOCK_INSIGHTS } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('memoai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback interceptor for GitHub Pages static hosting & offline demonstration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network');
    const is404 = error.response?.status === 404;

    // If backend is offline or mixed content blocks it on static host (GitHub Pages)
    if (isNetworkError) {
      console.warn('Backend unavailable (running in static demo mode):', error.config?.url);
      const url = error.config?.url || '';

      if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/profile')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              token: 'demo_mock_jwt_token_github_pages',
              user: MOCK_USER,
            },
          },
        });
      }

      if (url.includes('/memories/locations') || url.includes('/locations')) {
        const locations = MOCK_MEMORIES.map((m) => ({
          locationName: m.locationName,
          latitude: m.latitude,
          longitude: m.longitude,
          memoryCount: 1,
          memories: [m],
        }));
        return Promise.resolve({ data: { success: true, data: locations } });
      }

      if (url.includes('/memories/calendar')) {
        const days = {};
        MOCK_MEMORIES.forEach((m) => {
          const d = m.memoryDate;
          if (!days[d]) {
            days[d] = { count: 0, moods: [], entries: [] };
          }
          days[d].count++;
          if (m.mood && !days[d].moods.includes(m.mood)) {
            days[d].moods.push(m.mood);
          }
          days[d].entries.push(m);
        });
        return Promise.resolve({
          data: {
            success: true,
            data: {
              year: 2026,
              month: 10,
              days,
            },
          },
        });
      }

      if (url.includes('/memories') && error.config?.method === 'post') {
        const body = JSON.parse(error.config?.data || '{}');
        const newMemory = {
          id: `mem-local-${Date.now()}`,
          title: body.title || 'Untitled Memory',
          content: body.content || '',
          memoryDate: body.memoryDate || new Date().toISOString().split('T')[0],
          mood: body.mood || 'Reflective',
          entryType: body.entryType || 'regular',
          category: { id: 'cat-3', name: 'Personal', color: '#d97706' },
          tags: body.tags?.map((t) => ({ id: `t-${t}`, name: t })) || [],
          locationName: body.locationName || null,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
          images: [],
          createdAt: new Date().toISOString(),
        };
        MOCK_MEMORIES.unshift(newMemory);
        return Promise.resolve({ data: { success: true, data: newMemory } });
      }

      if (url.includes('/memories')) {
        return Promise.resolve({ data: { success: true, data: MOCK_MEMORIES } });
      }

      if (url.includes('/categories')) {
        return Promise.resolve({ data: { success: true, data: MOCK_CATEGORIES } });
      }

      if (url.includes('/insights')) {
        return Promise.resolve({ data: { success: true, data: MOCK_INSIGHTS } });
      }

      if (url.includes('/ask')) {
        const body = JSON.parse(error.config?.data || '{}');
        return Promise.resolve({
          data: {
            success: true,
            data: {
              question: body.question || 'Your question',
              answer: `Based on your diary memories, you explored Cox's Bazar beach on October 5, 2026, and gave a triumphant presentation of MemoAI at Curzon Hall on October 2. You also relaxed beside Dhanmondi Lake and experienced the clouds over Sajek Valley!`,
              sources: MOCK_MEMORIES.slice(0, 2),
            },
          },
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
