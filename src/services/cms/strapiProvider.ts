// Strapi v4 CMS Provider - Maps Strapi REST API to CMSProvider interface
import type { CMSProvider } from './provider';
import type {
  CMSArticle,
  CMSCategory,
  CMSAuthor,
  CMSMedia,
  CMSSettings,
  ArticleQueryParams,
  PaginatedResponse
} from './types';

// Strapi v4 response types
interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiData<T> {
  id: number;
  attributes: T;
}

interface StrapiMediaData {
  id: number;
  attributes: {
    url: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    size: number;
    mime: string;
    createdAt: string;
  };
}

interface StrapiRelation<T> {
  data: StrapiData<T> | StrapiData<T>[] | null;
}

// Strapi Article attributes matching our schema
interface StrapiArticleAttributes {
  title: string;
  titleHindi?: string;
  slug: string;
  excerpt?: string;
  excerptHindi?: string;
  content: string;
  contentHindi?: string;
  publishedAt?: string;
  updatedAt?: string;
  createdAt: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  views?: number;
  readTime?: number;
  videoUrl?: string;
  videoType?: 'youtube' | 'upload' | 'none';
  videoTitle?: string;
  scheduledAt?: string;
  featuredImage?: { data: StrapiMediaData | null };
  category?: StrapiRelation<StrapiCategoryAttributes>;
  author?: StrapiRelation<StrapiAuthorAttributes>;
  tags?: StrapiRelation<{ name: string; slug: string }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface StrapiCategoryAttributes {
  titleHindi: string;
  titleEnglish?: string;
  slug: string;
  description?: string;
  path: string;
  order?: number;
  parent?: StrapiRelation<StrapiCategoryAttributes>;
  icon?: { data: StrapiMediaData | null };
}

interface StrapiAuthorAttributes {
  name: string;
  nameHindi?: string;
  email: string;
  bio?: string;
  role: 'admin' | 'editor' | 'author' | 'contributor';
  avatar?: { data: StrapiMediaData | null };
}

interface StrapiSiteSettingsAttributes {
  siteName: string;
  siteNameHindi: string;
  tagline?: string;
  logo?: { data: StrapiMediaData | null };
  favicon?: { data: StrapiMediaData | null };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
    whatsapp?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface StrapiProviderConfig {
  baseUrl: string;
  apiToken?: string;
}

// Helper to get full media URL
const getMediaUrl = (baseUrl: string, media: { data: StrapiMediaData | null } | undefined): string => {
  if (!media?.data) return '';
  const url = media.data.attributes.url;
  if (url.startsWith('http')) return url;
  return `${baseUrl}${url}`;
};

// Helper to get single relation data
const getSingleRelation = <T>(relation: StrapiRelation<T> | undefined): (StrapiData<T> & { attributes: T }) | null => {
  if (!relation?.data) return null;
  if (Array.isArray(relation.data)) return relation.data[0] || null;
  return relation.data as StrapiData<T> & { attributes: T };
};

export const createStrapiProvider = (config: StrapiProviderConfig): CMSProvider => {
  const baseUrl = config.baseUrl.replace(/\/+$/, '');
  const apiUrl = `${baseUrl}/api`;

  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (config.apiToken) {
      headers.Authorization = `Bearer ${config.apiToken}`;
    }
    return headers;
  };

  const fetchApi = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> => {
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options?.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Strapi API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Strapi API error:', error);
      throw error;
    }
  };

  // Transform Strapi article to CMS article
  const transformArticle = (item: StrapiData<StrapiArticleAttributes>): CMSArticle => {
    const attrs = item.attributes;
    const category = getSingleRelation(attrs.category);
    const author = getSingleRelation(attrs.author);
    const tags = attrs.tags?.data;

    return {
      id: String(item.id),
      title: attrs.title,
      slug: attrs.slug,
      excerpt: attrs.excerpt || '',
      content: attrs.content,
      image: getMediaUrl(baseUrl, attrs.featuredImage),
      category: category?.attributes?.slug || '',
      categoryHindi: category?.attributes?.titleHindi || '',
      author: author?.attributes?.name || 'Unknown',
      publishedDate: attrs.publishedAt || attrs.createdAt,
      modifiedDate: attrs.updatedAt,
      readTime: attrs.readTime ? `${attrs.readTime} min` : undefined,
      isFeatured: attrs.isFeatured || false,
      isBreaking: attrs.isBreaking || false,
      views: attrs.views || 0,
      status: attrs.publishedAt ? 'published' : 'draft',
      tags: Array.isArray(tags) ? tags.map(t => t.attributes.name) : [],
      seoTitle: attrs.seo?.metaTitle,
      seoDescription: attrs.seo?.metaDescription,
      videoUrl: attrs.videoUrl,
      videoType: attrs.videoType,
      videoTitle: attrs.videoTitle,
      scheduledAt: attrs.scheduledAt,
    };
  };

  // Transform Strapi category to CMS category
  const transformCategory = (item: StrapiData<StrapiCategoryAttributes>): CMSCategory => {
    const attrs = item.attributes;
    const parent = getSingleRelation(attrs.parent);

    return {
      id: String(item.id),
      slug: attrs.slug,
      titleHindi: attrs.titleHindi,
      titleEnglish: attrs.titleEnglish || '',
      description: attrs.description || '',
      path: attrs.path,
      parentId: parent ? String(parent.id) : undefined,
      order: attrs.order || 0,
    };
  };

  // Transform Strapi author to CMS author
  const transformAuthor = (item: StrapiData<StrapiAuthorAttributes>): CMSAuthor => {
    const attrs = item.attributes;
    return {
      id: String(item.id),
      name: attrs.name,
      nameHindi: attrs.nameHindi || '',
      email: attrs.email,
      avatar: getMediaUrl(baseUrl, attrs.avatar),
      bio: attrs.bio || '',
      role: attrs.role,
    };
  };

  // Build Strapi filters from query params
  const buildArticleFilters = (params?: ArticleQueryParams): string => {
    const filters: string[] = [];
    const urlParams = new URLSearchParams();

    // Populate relations
    urlParams.append('populate[featuredImage]', '*');
    urlParams.append('populate[category]', '*');
    urlParams.append('populate[author]', '*');
    urlParams.append('populate[tags]', '*');
    urlParams.append('populate[seo]', '*');

    if (params?.category) {
      filters.push(`filters[category][slug][$eq]=${encodeURIComponent(params.category)}`);
    }
    if (params?.status === 'published') {
      filters.push('publicationState=live');
    } else if (params?.status === 'draft') {
      filters.push('publicationState=preview');
      filters.push('filters[publishedAt][$null]=true');
    }
    if (params?.featured !== undefined) {
      filters.push(`filters[isFeatured][$eq]=${params.featured}`);
    }
    if (params?.breaking !== undefined) {
      filters.push(`filters[isBreaking][$eq]=${params.breaking}`);
    }
    if (params?.search) {
      filters.push(`filters[$or][0][title][$containsi]=${encodeURIComponent(params.search)}`);
      filters.push(`filters[$or][1][content][$containsi]=${encodeURIComponent(params.search)}`);
    }
    if (params?.author) {
      filters.push(`filters[author][id][$eq]=${params.author}`);
    }

    // Pagination
    if (params?.limit) {
      urlParams.append('pagination[pageSize]', String(params.limit));
    }
    if (params?.offset) {
      const page = Math.floor(params.offset / (params.limit || 10)) + 1;
      urlParams.append('pagination[page]', String(page));
    }

    // Sorting
    const sortField = params?.orderBy === 'views' ? 'views' :
                     params?.orderBy === 'title' ? 'title' :
                     'publishedAt';
    const sortOrder = params?.order === 'asc' ? 'asc' : 'desc';
    urlParams.append('sort', `${sortField}:${sortOrder}`);

    const filterStr = filters.join('&');
    const paramStr = urlParams.toString();
    return filterStr ? `${paramStr}&${filterStr}` : paramStr;
  };

  return {
    // Article operations
    async getArticles(params?: ArticleQueryParams): Promise<PaginatedResponse<CMSArticle>> {
      const queryString = buildArticleFilters(params);
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiArticleAttributes>[]>>(
        `/articles?${queryString}`
      );

      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: params?.limit || 10, totalPages: 0 };
      }

      return {
        data: response.data.map(transformArticle),
        total: response.meta?.pagination?.total || response.data.length,
        page: response.meta?.pagination?.page || 1,
        pageSize: response.meta?.pagination?.pageSize || params?.limit || 10,
        totalPages: response.meta?.pagination?.pageCount || 1,
      };
    },

    async getArticleById(id: string): Promise<CMSArticle | null> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiArticleAttributes>>>(
        `/articles/${id}?populate=*`
      );
      if (!response?.data) return null;
      return transformArticle(response.data);
    },

    async getArticleBySlug(slug: string): Promise<CMSArticle | null> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiArticleAttributes>[]>>(
        `/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
      );
      if (!response?.data?.[0]) return null;
      return transformArticle(response.data[0]);
    },

    async createArticle(article: Omit<CMSArticle, 'id'>): Promise<CMSArticle> {
      const strapiData = {
        data: {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          isFeatured: article.isFeatured || false,
          isBreaking: article.isBreaking || false,
          videoUrl: article.videoUrl,
          videoType: article.videoType,
          videoTitle: article.videoTitle,
          scheduledAt: article.scheduledAt,
          seo: article.seoTitle || article.seoDescription ? {
            metaTitle: article.seoTitle,
            metaDescription: article.seoDescription,
          } : undefined,
        },
      };

      const response = await fetchApi<StrapiResponse<StrapiData<StrapiArticleAttributes>>>(
        '/articles',
        {
          method: 'POST',
          body: JSON.stringify(strapiData),
        }
      );

      if (!response?.data) throw new Error('Failed to create article');
      return transformArticle(response.data);
    },

    async updateArticle(id: string, article: Partial<CMSArticle>): Promise<CMSArticle> {
      const strapiData: Record<string, unknown> = { data: {} };
      const data = strapiData.data as Record<string, unknown>;

      if (article.title !== undefined) data.title = article.title;
      if (article.slug !== undefined) data.slug = article.slug;
      if (article.excerpt !== undefined) data.excerpt = article.excerpt;
      if (article.content !== undefined) data.content = article.content;
      if (article.isFeatured !== undefined) data.isFeatured = article.isFeatured;
      if (article.isBreaking !== undefined) data.isBreaking = article.isBreaking;
      if (article.videoUrl !== undefined) data.videoUrl = article.videoUrl;
      if (article.videoType !== undefined) data.videoType = article.videoType;
      if (article.videoTitle !== undefined) data.videoTitle = article.videoTitle;
      if (article.scheduledAt !== undefined) data.scheduledAt = article.scheduledAt;
      if (article.seoTitle || article.seoDescription) {
        data.seo = {
          metaTitle: article.seoTitle,
          metaDescription: article.seoDescription,
        };
      }

      const response = await fetchApi<StrapiResponse<StrapiData<StrapiArticleAttributes>>>(
        `/articles/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(strapiData),
        }
      );

      if (!response?.data) throw new Error('Failed to update article');
      return transformArticle(response.data);
    },

    async deleteArticle(id: string): Promise<void> {
      await fetchApi(`/articles/${id}`, { method: 'DELETE' });
    },

    // Category operations
    async getCategories(): Promise<CMSCategory[]> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiCategoryAttributes>[]>>(
        '/categories?populate=*&sort=order:asc'
      );
      if (!response?.data) return [];
      return response.data.map(transformCategory);
    },

    async getCategoryById(id: string): Promise<CMSCategory | null> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiCategoryAttributes>>>(
        `/categories/${id}?populate=*`
      );
      if (!response?.data) return null;
      return transformCategory(response.data);
    },

    async getCategoryBySlug(slug: string): Promise<CMSCategory | null> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiCategoryAttributes>[]>>(
        `/categories?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
      );
      if (!response?.data?.[0]) return null;
      return transformCategory(response.data[0]);
    },

    async createCategory(category: Omit<CMSCategory, 'id'>): Promise<CMSCategory> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiCategoryAttributes>>>(
        '/categories',
        {
          method: 'POST',
          body: JSON.stringify({
            data: {
              titleHindi: category.titleHindi,
              titleEnglish: category.titleEnglish,
              slug: category.slug,
              description: category.description,
              path: category.path,
              order: category.order || 0,
              parent: category.parentId ? { connect: [{ id: parseInt(category.parentId) }] } : undefined,
            },
          }),
        }
      );

      if (!response?.data) throw new Error('Failed to create category');
      return transformCategory(response.data);
    },

    async updateCategory(id: string, category: Partial<CMSCategory>): Promise<CMSCategory> {
      const data: Record<string, unknown> = {};
      if (category.titleHindi !== undefined) data.titleHindi = category.titleHindi;
      if (category.titleEnglish !== undefined) data.titleEnglish = category.titleEnglish;
      if (category.slug !== undefined) data.slug = category.slug;
      if (category.description !== undefined) data.description = category.description;
      if (category.path !== undefined) data.path = category.path;
      if (category.order !== undefined) data.order = category.order;

      const response = await fetchApi<StrapiResponse<StrapiData<StrapiCategoryAttributes>>>(
        `/categories/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ data }),
        }
      );

      if (!response?.data) throw new Error('Failed to update category');
      return transformCategory(response.data);
    },

    async deleteCategory(id: string): Promise<void> {
      await fetchApi(`/categories/${id}`, { method: 'DELETE' });
    },

    // Author operations
    async getAuthors(): Promise<CMSAuthor[]> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiAuthorAttributes>[]>>(
        '/authors?populate=*'
      );
      if (!response?.data) return [];
      return response.data.map(transformAuthor);
    },

    async getAuthorById(id: string): Promise<CMSAuthor | null> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiAuthorAttributes>>>(
        `/authors/${id}?populate=*`
      );
      if (!response?.data) return null;
      return transformAuthor(response.data);
    },

    async createAuthor(author: Omit<CMSAuthor, 'id'>): Promise<CMSAuthor> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiAuthorAttributes>>>(
        '/authors',
        {
          method: 'POST',
          body: JSON.stringify({
            data: {
              name: author.name,
              nameHindi: author.nameHindi,
              email: author.email,
              bio: author.bio,
              role: author.role,
            },
          }),
        }
      );

      if (!response?.data) throw new Error('Failed to create author');
      return transformAuthor(response.data);
    },

    async updateAuthor(id: string, author: Partial<CMSAuthor>): Promise<CMSAuthor> {
      const data: Record<string, unknown> = {};
      if (author.name !== undefined) data.name = author.name;
      if (author.nameHindi !== undefined) data.nameHindi = author.nameHindi;
      if (author.email !== undefined) data.email = author.email;
      if (author.bio !== undefined) data.bio = author.bio;
      if (author.role !== undefined) data.role = author.role;

      const response = await fetchApi<StrapiResponse<StrapiData<StrapiAuthorAttributes>>>(
        `/authors/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ data }),
        }
      );

      if (!response?.data) throw new Error('Failed to update author');
      return transformAuthor(response.data);
    },

    async deleteAuthor(id: string): Promise<void> {
      await fetchApi(`/authors/${id}`, { method: 'DELETE' });
    },

    // Media operations
    async getMedia(limit = 50): Promise<CMSMedia[]> {
      const response = await fetchApi<StrapiMediaData[]>(
        `/upload/files?pagination[pageSize]=${limit}&sort=createdAt:desc`
      );
      
      if (!response || !Array.isArray(response)) return [];
      
      return response.map((file) => ({
        id: String(file.id),
        url: file.attributes.url.startsWith('http') ? file.attributes.url : `${baseUrl}${file.attributes.url}`,
        title: file.attributes.name,
        altText: file.attributes.alternativeText || '',
        mimeType: file.attributes.mime,
        size: file.attributes.size * 1024, // Strapi returns KB
        width: file.attributes.width,
        height: file.attributes.height,
        uploadedAt: file.attributes.createdAt,
        uploadedBy: 'Unknown',
      }));
    },

    async uploadMedia(file: File): Promise<CMSMedia> {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: config.apiToken ? { Authorization: `Bearer ${config.apiToken}` } : {},
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Media upload failed: ${response.status}`);
      }

      const [uploaded] = await response.json() as StrapiMediaData[];
      return {
        id: String(uploaded.id),
        url: uploaded.attributes.url.startsWith('http') ? uploaded.attributes.url : `${baseUrl}${uploaded.attributes.url}`,
        title: uploaded.attributes.name,
        altText: uploaded.attributes.alternativeText || '',
        mimeType: uploaded.attributes.mime,
        size: uploaded.attributes.size * 1024,
        width: uploaded.attributes.width,
        height: uploaded.attributes.height,
        uploadedAt: uploaded.attributes.createdAt,
        uploadedBy: 'Current User',
      };
    },

    async deleteMedia(id: string): Promise<void> {
      await fetchApi(`/upload/files/${id}`, { method: 'DELETE' });
    },

    // Settings operations
    async getSettings(): Promise<CMSSettings> {
      const response = await fetchApi<StrapiResponse<StrapiData<StrapiSiteSettingsAttributes>>>(
        '/site-setting?populate=*'
      );

      if (!response?.data) {
        return {
          siteName: 'Rampur News',
          siteNameHindi: 'रामपुर न्यूज़',
          tagline: '',
          logo: '/logo.png',
          favicon: '/favicon.ico',
          socialLinks: {},
        };
      }

      const attrs = response.data.attributes;
      return {
        siteName: attrs.siteName,
        siteNameHindi: attrs.siteNameHindi,
        tagline: attrs.tagline || '',
        logo: getMediaUrl(baseUrl, attrs.logo) || '/logo.png',
        favicon: getMediaUrl(baseUrl, attrs.favicon) || '/favicon.ico',
        socialLinks: attrs.socialLinks || {},
        contactEmail: attrs.contact?.email,
        contactPhone: attrs.contact?.phone,
        address: attrs.contact?.address,
      };
    },

    async updateSettings(settings: Partial<CMSSettings>): Promise<CMSSettings> {
      const data: Record<string, unknown> = {};
      
      if (settings.siteName !== undefined) data.siteName = settings.siteName;
      if (settings.siteNameHindi !== undefined) data.siteNameHindi = settings.siteNameHindi;
      if (settings.tagline !== undefined) data.tagline = settings.tagline;
      if (settings.socialLinks !== undefined) data.socialLinks = settings.socialLinks;
      if (settings.contactEmail || settings.contactPhone || settings.address) {
        data.contact = {
          email: settings.contactEmail,
          phone: settings.contactPhone,
          address: settings.address,
        };
      }

      await fetchApi('/site-setting', {
        method: 'PUT',
        body: JSON.stringify({ data }),
      });

      return this.getSettings();
    },

    // Special queries
    async getFeaturedArticles(limit = 5): Promise<CMSArticle[]> {
      const result = await this.getArticles({ featured: true, status: 'published', limit });
      return result.data;
    },

    async getBreakingNews(limit = 5): Promise<CMSArticle[]> {
      const result = await this.getArticles({ breaking: true, status: 'published', limit });
      return result.data;
    },

    async getTrendingArticles(limit = 5): Promise<CMSArticle[]> {
      const result = await this.getArticles({ status: 'published', orderBy: 'views', order: 'desc', limit });
      return result.data;
    },

    async getArticlesByCategory(categorySlug: string, limit = 10): Promise<CMSArticle[]> {
      const result = await this.getArticles({ category: categorySlug, status: 'published', limit });
      return result.data;
    },

    async searchArticles(query: string, limit = 20): Promise<CMSArticle[]> {
      const result = await this.getArticles({ search: query, status: 'published', limit });
      return result.data;
    },
  };
};
