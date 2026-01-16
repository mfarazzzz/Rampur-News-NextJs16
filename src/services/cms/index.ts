// CMS Service - Main export with provider switching
import type { CMSProvider, CMSConfig, CMSProviderType } from './provider';
import type {
  CMSArticle,
  CMSCategory,
  CMSAuthor,
  CMSMedia,
  CMSSettings,
  ArticleQueryParams,
  PaginatedResponse
} from './types';
import { mockCMSProvider } from './mockProvider';
import { createWordPressProvider } from './wordpressProvider';

export * from './types';
export * from './provider';
export { createWordPressProvider } from './wordpressProvider';

const createRestCMSProvider = (config: CMSConfig): CMSProvider => {
  const baseUrl = (config.baseUrl || '').replace(/\/+$/, '');

  const buildUrl = (path: string, params?: Record<string, string | number | boolean | undefined>) => {
    const url = new URL(`${baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  };

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {};
    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }
    return headers;
  };

  const fetchJson = async <T>(input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = (await response.json()) as T;
    return data;
  };

  const buildArticleQuery = (params?: ArticleQueryParams) => {
    if (!params) return undefined;
    const query: Record<string, string | number | boolean | undefined> = {};
    if (params.category) query.category = params.category;
    if (params.status) query.status = params.status;
    if (params.featured !== undefined) query.featured = params.featured;
    if (params.breaking !== undefined) query.breaking = params.breaking;
    if (params.limit !== undefined) query.limit = params.limit;
    if (params.offset !== undefined) query.offset = params.offset;
    if (params.search) query.search = params.search;
    if (params.author) query.author = params.author;
    if (params.orderBy) query.orderBy = params.orderBy;
    if (params.order) query.order = params.order;
    return query;
  };

  const getArticles = async (params?: ArticleQueryParams): Promise<PaginatedResponse<CMSArticle>> => {
    const query = buildArticleQuery(params);
    const result = await fetchJson<PaginatedResponse<CMSArticle>>(buildUrl('/articles', query), {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!result) {
      return {
        data: [],
        total: 0,
        page: 1,
        pageSize: params?.limit || 10,
        totalPages: 0,
      };
    }
    return result;
  };

  return {
    async getArticles(params?: ArticleQueryParams): Promise<PaginatedResponse<CMSArticle>> {
      return getArticles(params);
    },

    async getArticleById(id: string): Promise<CMSArticle | null> {
      const result = await fetchJson<CMSArticle | null>(buildUrl(`/articles/${id}`), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return result;
    },

    async getArticleBySlug(slug: string): Promise<CMSArticle | null> {
      const result = await fetchJson<CMSArticle | null>(buildUrl(`/articles/slug/${encodeURIComponent(slug)}`), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return result;
    },

    async createArticle(article: Omit<CMSArticle, 'id'>): Promise<CMSArticle> {
      const result = await fetchJson<CMSArticle>(buildUrl('/articles'), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      if (!result) {
        throw new Error('Article creation failed');
      }
      return result;
    },

    async updateArticle(id: string, article: Partial<CMSArticle>): Promise<CMSArticle> {
      const result = await fetchJson<CMSArticle>(buildUrl(`/articles/${id}`), {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      if (!result) {
        throw new Error('Article update failed');
      }
      return result;
    },

    async deleteArticle(id: string): Promise<void> {
      await fetchJson<null>(buildUrl(`/articles/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },

    async getCategories(): Promise<CMSCategory[]> {
      const result = await fetchJson<CMSCategory[] | null>(buildUrl('/categories'), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return result || [];
    },

    async getCategoryById(id: string): Promise<CMSCategory | null> {
      const result = await fetchJson<CMSCategory | null>(buildUrl(`/categories/${id}`), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return result;
    },

    async getCategoryBySlug(slug: string): Promise<CMSCategory | null> {
      const result = await fetchJson<CMSCategory | null>(buildUrl(`/categories/slug/${encodeURIComponent(slug)}`), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return result;
    },

    async createCategory(category: Omit<CMSCategory, 'id'>): Promise<CMSCategory> {
      const result = await fetchJson<CMSCategory>(buildUrl('/categories'), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      if (!result) {
        throw new Error('Category creation failed');
      }
      return result;
    },

    async updateCategory(id: string, category: Partial<CMSCategory>): Promise<CMSCategory> {
      const result = await fetchJson<CMSCategory>(buildUrl(`/categories/${id}`), {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      if (!result) {
        throw new Error('Category update failed');
      }
      return result;
    },

    async deleteCategory(id: string): Promise<void> {
      await fetchJson<null>(buildUrl(`/categories/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },

    async getAuthors(): Promise<CMSAuthor[]> {
      const result = await fetchJson<CMSAuthor[] | null>(buildUrl('/authors'), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return result || [];
    },

    async getAuthorById(id: string): Promise<CMSAuthor | null> {
      const result = await fetchJson<CMSAuthor | null>(buildUrl(`/authors/${id}`), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return result;
    },

    async createAuthor(author: Omit<CMSAuthor, 'id'>): Promise<CMSAuthor> {
      const result = await fetchJson<CMSAuthor>(buildUrl('/authors'), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(author),
      });
      if (!result) {
        throw new Error('Author creation failed');
      }
      return result;
    },

    async updateAuthor(id: string, author: Partial<CMSAuthor>): Promise<CMSAuthor> {
      const result = await fetchJson<CMSAuthor>(buildUrl(`/authors/${id}`), {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(author),
      });
      if (!result) {
        throw new Error('Author update failed');
      }
      return result;
    },

    async deleteAuthor(id: string): Promise<void> {
      await fetchJson<null>(buildUrl(`/authors/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },

    async getMedia(limit?: number): Promise<CMSMedia[]> {
      const params = limit ? { limit } : undefined;
      const result = await fetchJson<CMSMedia[] | null>(buildUrl('/media', params), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return result || [];
    },

    async uploadMedia(file: File): Promise<CMSMedia> {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(buildUrl('/media'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Media upload failed with status ${response.status}`);
      }

      const result = (await response.json()) as CMSMedia;
      return result;
    },

    async deleteMedia(id: string): Promise<void> {
      await fetchJson<null>(buildUrl(`/media/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },

    async getSettings(): Promise<CMSSettings> {
      const result = await fetchJson<CMSSettings | null>(buildUrl('/settings'), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (result) {
        return result;
      }
      const fallback: CMSSettings = {
        siteName: 'Rampur News',
        siteNameHindi: 'रामपुर न्यूज़',
        tagline: '',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        socialLinks: {},
      };
      return fallback;
    },

    async updateSettings(settings: Partial<CMSSettings>): Promise<CMSSettings> {
      const result = await fetchJson<CMSSettings>(buildUrl('/settings'), {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!result) {
        throw new Error('Settings update failed');
      }
      return result;
    },

    async getFeaturedArticles(limit = 5): Promise<CMSArticle[]> {
      const result = await getArticles({ featured: true, status: 'published', limit });
      return result.data;
    },

    async getBreakingNews(limit = 5): Promise<CMSArticle[]> {
      const result = await getArticles({ breaking: true, status: 'published', limit });
      return result.data;
    },

    async getTrendingArticles(limit = 5): Promise<CMSArticle[]> {
      const result = await getArticles({ status: 'published', orderBy: 'views', order: 'desc', limit });
      return result.data;
    },

    async getArticlesByCategory(categorySlug: string, limit = 10): Promise<CMSArticle[]> {
      const result = await getArticles({ category: categorySlug, status: 'published', limit });
      return result.data;
    },

    async searchArticles(query: string, limit = 20): Promise<CMSArticle[]> {
      const result = await getArticles({ search: query, status: 'published', limit });
      return result.data;
    },
  };
};

let currentConfig: CMSConfig = {
  provider: 'mock',
};

const providerInstances: Partial<Record<CMSProviderType, CMSProvider>> = {
  mock: mockCMSProvider,
};

export const getCMSProvider = (): CMSProvider => {
  const provider = providerInstances[currentConfig.provider];
  if (!provider) {
    console.warn(`CMS provider "${currentConfig.provider}" not available, falling back to mock`);
    return mockCMSProvider;
  }
  return provider;
};

export const configureCMS = (config: CMSConfig): void => {
  currentConfig = config;
  
  if (config.provider === 'wordpress' && config.baseUrl) {
    providerInstances.wordpress = createWordPressProvider({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      username: config.options?.username as string,
      password: config.options?.password as string,
    });
  }

  if ((config.provider === 'strapi' || config.provider === 'django' || config.provider === 'custom') && config.baseUrl) {
    providerInstances[config.provider] = createRestCMSProvider(config);
  }
};

export const getCMSConfig = (): CMSConfig => currentConfig;

export const registerCMSProvider = (type: CMSProviderType, provider: CMSProvider): void => {
  providerInstances[type] = provider;
};

export const cms = {
  get provider() {
    return getCMSProvider();
  },
  configure: configureCMS,
  getConfig: getCMSConfig,
  register: registerCMSProvider,
};

export default cms;
