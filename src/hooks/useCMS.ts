// React hooks for CMS operations
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCMSProvider, type CMSArticle, type ArticleQueryParams, type CMSCategory, type CMSAuthor, type CMSSettings } from '@/services/cms';

// Query keys
export const cmsKeys = {
  all: ['cms'] as const,
  articles: () => [...cmsKeys.all, 'articles'] as const,
  article: (id: string) => [...cmsKeys.articles(), id] as const,
  articleBySlug: (slug: string) => [...cmsKeys.articles(), 'slug', slug] as const,
  articlesList: (params?: ArticleQueryParams) => [...cmsKeys.articles(), 'list', params] as const,
  featured: () => [...cmsKeys.articles(), 'featured'] as const,
  breaking: () => [...cmsKeys.articles(), 'breaking'] as const,
  trending: () => [...cmsKeys.articles(), 'trending'] as const,
  byCategory: (slug: string) => [...cmsKeys.articles(), 'category', slug] as const,
  categories: () => [...cmsKeys.all, 'categories'] as const,
  category: (id: string) => [...cmsKeys.categories(), id] as const,
  authors: () => [...cmsKeys.all, 'authors'] as const,
  author: (id: string) => [...cmsKeys.authors(), id] as const,
  media: () => [...cmsKeys.all, 'media'] as const,
  settings: () => [...cmsKeys.all, 'settings'] as const,
};

// Article hooks
export const useArticles = (params?: ArticleQueryParams) => {
  return useQuery({
    queryKey: cmsKeys.articlesList(params),
    queryFn: () => getCMSProvider().getArticles(params),
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: cmsKeys.article(id),
    queryFn: () => getCMSProvider().getArticleById(id),
    enabled: !!id,
  });
};

export const useArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: cmsKeys.articleBySlug(slug),
    queryFn: () => getCMSProvider().getArticleBySlug(slug),
    enabled: !!slug,
  });
};

export const useFeaturedArticles = (limit = 5) => {
  return useQuery({
    queryKey: cmsKeys.featured(),
    queryFn: () => getCMSProvider().getFeaturedArticles(limit),
  });
};

export const useBreakingNews = (limit = 5) => {
  return useQuery({
    queryKey: cmsKeys.breaking(),
    queryFn: () => getCMSProvider().getBreakingNews(limit),
  });
};

export const useTrendingArticles = (limit = 5) => {
  return useQuery({
    queryKey: cmsKeys.trending(),
    queryFn: () => getCMSProvider().getTrendingArticles(limit),
  });
};

export const useArticlesByCategory = (categorySlug: string, limit = 10) => {
  return useQuery({
    queryKey: cmsKeys.byCategory(categorySlug),
    queryFn: () => getCMSProvider().getArticlesByCategory(categorySlug, limit),
    enabled: !!categorySlug,
  });
};

export const useSearchArticles = (query: string, limit = 20) => {
  return useQuery({
    queryKey: [...cmsKeys.articles(), 'search', query],
    queryFn: () => getCMSProvider().searchArticles(query, limit),
    enabled: query.length > 2,
  });
};

// Article mutations
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (article: Omit<CMSArticle, 'id'>) => getCMSProvider().createArticle(article),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.articles() });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CMSArticle> }) => 
      getCMSProvider().updateArticle(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.articles() });
      queryClient.invalidateQueries({ queryKey: cmsKeys.article(id) });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => getCMSProvider().deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.articles() });
    },
  });
};

// Category hooks
export const useCategories = () => {
  return useQuery({
    queryKey: cmsKeys.categories(),
    queryFn: () => getCMSProvider().getCategories(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (category: Omit<CMSCategory, 'id'>) => getCMSProvider().createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.categories() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CMSCategory> }) => 
      getCMSProvider().updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.categories() });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => getCMSProvider().deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.categories() });
    },
  });
};

// Author hooks
export const useAuthors = () => {
  return useQuery({
    queryKey: cmsKeys.authors(),
    queryFn: () => getCMSProvider().getAuthors(),
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (author: Omit<CMSAuthor, 'id'>) => getCMSProvider().createAuthor(author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.authors() });
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CMSAuthor> }) => 
      getCMSProvider().updateAuthor(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.authors() });
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => getCMSProvider().deleteAuthor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.authors() });
    },
  });
};

// Settings hooks
export const useCMSSettings = () => {
  return useQuery({
    queryKey: cmsKeys.settings(),
    queryFn: () => getCMSProvider().getSettings(),
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<CMSSettings>) => getCMSProvider().updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.settings() });
    },
  });
};

// Media hooks
export const useMedia = (limit?: number) => {
  return useQuery({
    queryKey: cmsKeys.media(),
    queryFn: () => getCMSProvider().getMedia(limit),
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => getCMSProvider().uploadMedia(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.media() });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => getCMSProvider().deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.media() });
    },
  });
};
