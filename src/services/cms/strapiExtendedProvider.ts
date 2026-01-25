// Strapi v4 Extended Provider for microsites
import type {
  CMSExam,
  CMSResult,
  CMSInstitution,
  CMSHoliday,
  CMSRestaurant,
  CMSFashionStore,
  CMSShoppingCentre,
  CMSFamousPlace,
  CMSEvent,
  CalendarEvent,
  ExtendedQueryParams,
} from './extendedTypes';
import type { ExtendedCMSProvider } from './extendedProvider';
import type { PaginatedResponse } from './types';

export interface StrapiExtendedConfig {
  baseUrl: string;
  apiToken?: string;
}

// Strapi response types
interface StrapiResponse<T> {
  data: StrapiData<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: StrapiData<T> | null;
}

interface StrapiData<T> {
  id: number;
  attributes: T;
}

// Helper to get media URL
const getMediaUrl = (baseUrl: string, media: any): string => {
  if (!media?.data?.attributes?.url) return '';
  const url = media.data.attributes.url;
  return url.startsWith('http') ? url : `${baseUrl}${url}`;
};

// Helper to get gallery URLs
const getGalleryUrls = (baseUrl: string, gallery: any): string[] => {
  if (!gallery?.data) return [];
  return gallery.data.map((item: any) => {
    const url = item.attributes?.url || '';
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  });
};

// Build query string from params
const buildQueryString = (params: ExtendedQueryParams, filters: Record<string, any> = {}): string => {
  const queryParts: string[] = [];
  
  // Pagination
  if (params.limit) queryParts.push(`pagination[pageSize]=${params.limit}`);
  if (params.offset) {
    const page = Math.floor(params.offset / (params.limit || 10)) + 1;
    queryParts.push(`pagination[page]=${page}`);
  }
  
  // Sorting
  if (params.orderBy) {
    queryParts.push(`sort=${params.orderBy}:${params.order || 'desc'}`);
  }
  
  // Search
  if (params.search) {
    queryParts.push(`filters[$or][0][title][$containsi]=${encodeURIComponent(params.search)}`);
    queryParts.push(`filters[$or][1][titleHindi][$containsi]=${encodeURIComponent(params.search)}`);
  }
  
  // Additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParts.push(`filters[${key}][$eq]=${encodeURIComponent(String(value))}`);
    }
  });
  
  // Featured filter
  if (params.featured) {
    queryParts.push(`filters[isFeatured][$eq]=true`);
  }
  
  // Category/type filters
  if (params.category) {
    queryParts.push(`filters[category][$eq]=${encodeURIComponent(params.category)}`);
  }
  if (params.type) {
    queryParts.push(`filters[type][$eq]=${encodeURIComponent(params.type)}`);
  }
  if (params.status) {
    queryParts.push(`filters[status][$eq]=${encodeURIComponent(params.status)}`);
  }
  if (params.city) {
    queryParts.push(`filters[city][$eq]=${encodeURIComponent(params.city)}`);
  }
  
  // Populate all relations and media
  queryParts.push('populate=*');
  
  return queryParts.join('&');
};

export const createStrapiExtendedProvider = (config: StrapiExtendedConfig): ExtendedCMSProvider => {
  const { baseUrl, apiToken } = config;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }
  
  const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T | null> => {
    try {
      const response = await fetch(`${baseUrl}/api${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
      });
      
      if (!response.ok) {
        console.error(`Strapi API error: ${response.status} ${response.statusText}`);
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Strapi API fetch error:', error);
      return null;
    }
  };

  // ============ MAPPING FUNCTIONS ============
  
  const mapExam = (data: StrapiData<any>): CMSExam => ({
    id: String(data.id),
    title: data.attributes.title,
    titleHindi: data.attributes.titleHindi || data.attributes.title,
    slug: data.attributes.slug,
    examDate: data.attributes.examDate,
    applicationStartDate: data.attributes.applicationStartDate,
    applicationEndDate: data.attributes.applicationEndDate,
    admitCardDate: data.attributes.admitCardDate,
    resultDate: data.attributes.resultDate,
    organization: data.attributes.organization,
    organizationHindi: data.attributes.organizationHindi || data.attributes.organization,
    category: data.attributes.category || 'competitive',
    subcategory: data.attributes.subcategory,
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi,
    eligibility: data.attributes.eligibility,
    eligibilityHindi: data.attributes.eligibilityHindi,
    officialWebsite: data.attributes.officialWebsite,
    applicationLink: data.attributes.applicationLink,
    image: getMediaUrl(baseUrl, data.attributes.image),
    status: data.attributes.status || 'upcoming',
    applicationStatus: data.attributes.applicationStatus || 'upcoming',
    admitCardStatus: data.attributes.admitCardStatus || 'not-released',
    resultStatus: data.attributes.resultStatus || 'not-declared',
    isPopular: data.attributes.isPopular,
    isFeatured: data.attributes.isFeatured,
    isNew: data.attributes.isNew,
    isLive: data.attributes.isLive,
    totalPosts: data.attributes.totalPosts,
    lastUpdated: data.attributes.updatedAt,
    seoTitle: data.attributes.seoTitle,
    seoDescription: data.attributes.seoDescription,
  });

  const mapResult = (data: StrapiData<any>): CMSResult => ({
    id: String(data.id),
    title: data.attributes.title,
    titleHindi: data.attributes.titleHindi || data.attributes.title,
    slug: data.attributes.slug,
    resultDate: data.attributes.resultDate,
    expectedDate: data.attributes.expectedDate,
    organization: data.attributes.organization,
    organizationHindi: data.attributes.organizationHindi || data.attributes.organization,
    category: data.attributes.category || 'competitive',
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi,
    resultLink: data.attributes.resultLink,
    alternateLinks: data.attributes.alternateLinks,
    image: getMediaUrl(baseUrl, data.attributes.image),
    totalCandidates: data.attributes.totalCandidates,
    passPercentage: data.attributes.passPercentage,
    cutoffMarks: data.attributes.cutoffMarks,
    status: data.attributes.status || 'expected',
    isNew: data.attributes.isNew,
    isFeatured: data.attributes.isFeatured,
    lastUpdated: data.attributes.updatedAt,
  });

  const mapInstitution = (data: StrapiData<any>): CMSInstitution => ({
    id: String(data.id),
    name: data.attributes.name,
    nameHindi: data.attributes.nameHindi || data.attributes.name,
    slug: data.attributes.slug,
    type: data.attributes.type || 'college',
    address: data.attributes.address,
    addressHindi: data.attributes.addressHindi || data.attributes.address,
    city: data.attributes.city,
    district: data.attributes.district,
    state: data.attributes.state || 'Uttar Pradesh',
    pincode: data.attributes.pincode,
    phone: data.attributes.phone,
    email: data.attributes.email,
    website: data.attributes.website,
    establishedYear: data.attributes.establishedYear,
    affiliation: data.attributes.affiliation,
    affiliationHindi: data.attributes.affiliationHindi,
    courses: data.attributes.courses,
    coursesHindi: data.attributes.coursesHindi,
    fees: data.attributes.fees,
    admissionProcess: data.attributes.admissionProcess,
    admissionProcessHindi: data.attributes.admissionProcessHindi,
    examsAccepted: data.attributes.examsAccepted,
    facilities: data.attributes.facilities,
    facilitiesHindi: data.attributes.facilitiesHindi,
    image: getMediaUrl(baseUrl, data.attributes.image),
    gallery: getGalleryUrls(baseUrl, data.attributes.gallery),
    rating: data.attributes.rating,
    reviews: data.attributes.reviews,
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi || data.attributes.description,
    about: data.attributes.about,
    aboutHindi: data.attributes.aboutHindi,
    seoTitle: data.attributes.seoTitle,
    seoDescription: data.attributes.seoDescription,
    isVerified: data.attributes.isVerified,
    isFeatured: data.attributes.isFeatured,
    contactPerson: data.attributes.contactPerson,
    contactPersonHindi: data.attributes.contactPersonHindi,
  });

  const mapHoliday = (data: StrapiData<any>): CMSHoliday => ({
    id: String(data.id),
    name: data.attributes.name,
    nameHindi: data.attributes.nameHindi || data.attributes.name,
    slug: data.attributes.slug,
    date: data.attributes.date,
    endDate: data.attributes.endDate,
    type: data.attributes.type || 'cultural',
    religion: data.attributes.religion,
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi || data.attributes.description,
    significance: data.attributes.significance,
    significanceHindi: data.attributes.significanceHindi,
    rituals: data.attributes.rituals,
    ritualsHindi: data.attributes.ritualsHindi,
    image: getMediaUrl(baseUrl, data.attributes.image),
    isRecurring: data.attributes.isRecurring ?? true,
    recurringType: data.attributes.recurringType,
    isPublicHoliday: data.attributes.isPublicHoliday ?? false,
    region: data.attributes.region,
    googleCalendarLink: data.attributes.googleCalendarLink,
  });

  const mapRestaurant = (data: StrapiData<any>): CMSRestaurant => ({
    id: String(data.id),
    name: data.attributes.name,
    nameHindi: data.attributes.nameHindi || data.attributes.name,
    slug: data.attributes.slug,
    type: data.attributes.type || 'restaurant',
    cuisine: data.attributes.cuisine || [],
    address: data.attributes.address,
    addressHindi: data.attributes.addressHindi || data.attributes.address,
    city: data.attributes.city,
    district: data.attributes.district,
    phone: data.attributes.phone,
    priceRange: data.attributes.priceRange || 'moderate',
    rating: data.attributes.rating,
    reviews: data.attributes.reviews,
    openingHours: data.attributes.openingHours,
    image: getMediaUrl(baseUrl, data.attributes.image),
    gallery: getGalleryUrls(baseUrl, data.attributes.gallery),
    specialties: data.attributes.specialties,
    specialtiesHindi: data.attributes.specialtiesHindi,
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi || data.attributes.description,
    isVeg: data.attributes.isVeg,
    hasDelivery: data.attributes.hasDelivery,
    isFeatured: data.attributes.isFeatured,
    mapLink: data.attributes.mapLink,
  });

  const mapFashionStore = (data: StrapiData<any>): CMSFashionStore => ({
    id: String(data.id),
    name: data.attributes.name,
    nameHindi: data.attributes.nameHindi || data.attributes.name,
    slug: data.attributes.slug,
    type: data.attributes.type || 'clothing',
    category: data.attributes.category || 'all',
    address: data.attributes.address,
    addressHindi: data.attributes.addressHindi || data.attributes.address,
    city: data.attributes.city,
    district: data.attributes.district,
    phone: data.attributes.phone,
    priceRange: data.attributes.priceRange || 'moderate',
    rating: data.attributes.rating,
    image: getMediaUrl(baseUrl, data.attributes.image),
    gallery: getGalleryUrls(baseUrl, data.attributes.gallery),
    brands: data.attributes.brands,
    specialties: data.attributes.specialties,
    specialtiesHindi: data.attributes.specialtiesHindi,
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi || data.attributes.description,
    isFeatured: data.attributes.isFeatured,
  });

  const mapShoppingCentre = (data: StrapiData<any>): CMSShoppingCentre => ({
    id: String(data.id),
    name: data.attributes.name,
    nameHindi: data.attributes.nameHindi || data.attributes.name,
    slug: data.attributes.slug,
    type: data.attributes.type || 'market',
    address: data.attributes.address,
    addressHindi: data.attributes.addressHindi || data.attributes.address,
    city: data.attributes.city,
    district: data.attributes.district,
    phone: data.attributes.phone,
    openingHours: data.attributes.openingHours,
    image: getMediaUrl(baseUrl, data.attributes.image),
    gallery: getGalleryUrls(baseUrl, data.attributes.gallery),
    storeCount: data.attributes.storeCount,
    amenities: data.attributes.amenities,
    amenitiesHindi: data.attributes.amenitiesHindi,
    parkingAvailable: data.attributes.parkingAvailable,
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi || data.attributes.description,
    isFeatured: data.attributes.isFeatured,
    mapLink: data.attributes.mapLink,
  });

  const mapFamousPlace = (data: StrapiData<any>): CMSFamousPlace => ({
    id: String(data.id),
    name: data.attributes.name,
    nameHindi: data.attributes.nameHindi || data.attributes.name,
    slug: data.attributes.slug,
    type: data.attributes.type || 'landmark',
    address: data.attributes.address,
    addressHindi: data.attributes.addressHindi || data.attributes.address,
    city: data.attributes.city,
    district: data.attributes.district,
    image: getMediaUrl(baseUrl, data.attributes.image),
    gallery: getGalleryUrls(baseUrl, data.attributes.gallery),
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi || data.attributes.description,
    history: data.attributes.history,
    historyHindi: data.attributes.historyHindi,
    timings: data.attributes.timings,
    entryFee: data.attributes.entryFee,
    bestTimeToVisit: data.attributes.bestTimeToVisit,
    isFeatured: data.attributes.isFeatured,
    rating: data.attributes.rating,
  });

  const mapEvent = (data: StrapiData<any>): CMSEvent => ({
    id: String(data.id),
    title: data.attributes.title,
    titleHindi: data.attributes.titleHindi || data.attributes.title,
    slug: data.attributes.slug,
    date: data.attributes.date,
    endDate: data.attributes.endDate,
    time: data.attributes.time,
    venue: data.attributes.venue,
    venueHindi: data.attributes.venueHindi || data.attributes.venue,
    address: data.attributes.address,
    city: data.attributes.city,
    district: data.attributes.district,
    category: data.attributes.category || 'cultural',
    organizer: data.attributes.organizer,
    organizerHindi: data.attributes.organizerHindi,
    description: data.attributes.description,
    descriptionHindi: data.attributes.descriptionHindi || data.attributes.description,
    image: getMediaUrl(baseUrl, data.attributes.image),
    ticketPrice: data.attributes.ticketPrice,
    registrationLink: data.attributes.registrationLink,
    isFree: data.attributes.isFree,
    isFeatured: data.attributes.isFeatured,
    status: data.attributes.status || 'upcoming',
  });

  // ============ PROVIDER IMPLEMENTATION ============
  
  return {
    // Education - Exams
    async getExams(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/exams?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapExam),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getExamBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/exams?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapExam(response.data[0]);
    },
    
    // Education - Results
    async getResults(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/results?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapResult),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getResultBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/results?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapResult(response.data[0]);
    },
    
    // Education - Institutions
    async getInstitutions(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/institutions?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapInstitution),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getInstitutionBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/institutions?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapInstitution(response.data[0]);
    },
    
    // Culture - Holidays
    async getHolidays(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/holidays?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapHoliday),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getHolidayBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/holidays?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapHoliday(response.data[0]);
    },
    
    async getHolidaysByMonth(year, month) {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const response = await fetchApi<StrapiResponse<any>>(
        `/holidays?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&populate=*`
      );
      
      if (!response) return [];
      return response.data.map(mapHoliday);
    },
    
    // Food & Lifestyle - Restaurants
    async getRestaurants(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/restaurants?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapRestaurant),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getRestaurantBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/restaurants?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapRestaurant(response.data[0]);
    },
    
    // Fashion Stores
    async getFashionStores(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/fashion-stores?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapFashionStore),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getFashionStoreBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/fashion-stores?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapFashionStore(response.data[0]);
    },
    
    // Shopping Centres
    async getShoppingCentres(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/shopping-centres?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapShoppingCentre),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getShoppingCentreBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/shopping-centres?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapShoppingCentre(response.data[0]);
    },
    
    // Famous Places
    async getFamousPlaces(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/places?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapFamousPlace),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getFamousPlaceBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/places?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapFamousPlace(response.data[0]);
    },
    
    // Events
    async getEvents(params = {}) {
      const query = buildQueryString(params);
      const response = await fetchApi<StrapiResponse<any>>(`/events?${query}`);
      
      if (!response) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
      }
      
      return {
        data: response.data.map(mapEvent),
        total: response.meta.pagination.total,
        page: response.meta.pagination.page,
        pageSize: response.meta.pagination.pageSize,
        totalPages: response.meta.pagination.pageCount,
      };
    },
    
    async getEventBySlug(slug) {
      const response = await fetchApi<StrapiResponse<any>>(`/events?filters[slug][$eq]=${slug}&populate=*`);
      if (!response?.data?.[0]) return null;
      return mapEvent(response.data[0]);
    },
    
    async getUpcomingEvents(limit = 5) {
      const now = new Date().toISOString().split('T')[0];
      const response = await fetchApi<StrapiResponse<any>>(
        `/events?filters[date][$gte]=${now}&filters[status][$eq]=upcoming&sort=date:asc&pagination[pageSize]=${limit}&populate=*`
      );
      
      if (!response) return [];
      return response.data.map(mapEvent);
    },
    
    // Calendar - Combined events view
    async getCalendarEvents(year, month) {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      const events: CalendarEvent[] = [];
      
      // Fetch all content types in parallel
      const [examsRes, resultsRes, holidaysRes, eventsRes] = await Promise.all([
        fetchApi<StrapiResponse<any>>(`/exams?filters[examDate][$gte]=${startDate}&filters[examDate][$lte]=${endDate}&populate=*`),
        fetchApi<StrapiResponse<any>>(`/results?filters[resultDate][$gte]=${startDate}&filters[resultDate][$lte]=${endDate}&populate=*`),
        fetchApi<StrapiResponse<any>>(`/holidays?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&populate=*`),
        fetchApi<StrapiResponse<any>>(`/events?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&populate=*`),
      ]);
      
      // Add exams
      examsRes?.data?.forEach(exam => {
        const mapped = mapExam(exam);
        events.push({
          id: mapped.id,
          title: mapped.title,
          titleHindi: mapped.titleHindi,
          date: mapped.examDate,
          type: 'exam',
          category: mapped.category,
          color: '#3b82f6',
          link: `/education-jobs/exams/${mapped.slug}`,
        });
      });
      
      // Add results
      resultsRes?.data?.forEach(result => {
        const mapped = mapResult(result);
        events.push({
          id: mapped.id,
          title: mapped.title,
          titleHindi: mapped.titleHindi,
          date: mapped.resultDate,
          type: 'result',
          category: mapped.category,
          color: '#22c55e',
          link: `/education-jobs/results/${mapped.slug}`,
        });
      });
      
      // Add holidays
      holidaysRes?.data?.forEach(holiday => {
        const mapped = mapHoliday(holiday);
        events.push({
          id: mapped.id,
          title: mapped.name,
          titleHindi: mapped.nameHindi,
          date: mapped.date,
          endDate: mapped.endDate,
          type: 'holiday',
          category: mapped.type,
          color: mapped.type === 'national' ? '#ef4444' : '#f59e0b',
          link: `/religion-culture/holidays/${mapped.slug}`,
        });
      });
      
      // Add events
      eventsRes?.data?.forEach(event => {
        const mapped = mapEvent(event);
        events.push({
          id: mapped.id,
          title: mapped.title,
          titleHindi: mapped.titleHindi,
          date: mapped.date,
          endDate: mapped.endDate,
          type: 'event',
          category: mapped.category,
          color: '#8b5cf6',
          link: `/food-lifestyle/events/${mapped.slug}`,
        });
      });
      
      return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    
    // ============ CRUD OPERATIONS ============
    
    // Exams CRUD
    async createExam(exam) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/exams', {
        method: 'POST',
        body: JSON.stringify({ data: exam }),
      });
      if (!response?.data) throw new Error('Failed to create exam');
      return mapExam(response.data);
    },
    
    async updateExam(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/exams/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update exam');
      return mapExam(response.data);
    },
    
    async deleteExam(id) {
      await fetchApi(`/exams/${id}`, { method: 'DELETE' });
    },
    
    // Results CRUD
    async createResult(result) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/results', {
        method: 'POST',
        body: JSON.stringify({ data: result }),
      });
      if (!response?.data) throw new Error('Failed to create result');
      return mapResult(response.data);
    },
    
    async updateResult(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/results/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update result');
      return mapResult(response.data);
    },
    
    async deleteResult(id) {
      await fetchApi(`/results/${id}`, { method: 'DELETE' });
    },
    
    // Institutions CRUD
    async createInstitution(institution) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/institutions', {
        method: 'POST',
        body: JSON.stringify({ data: institution }),
      });
      if (!response?.data) throw new Error('Failed to create institution');
      return mapInstitution(response.data);
    },
    
    async updateInstitution(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/institutions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update institution');
      return mapInstitution(response.data);
    },
    
    async deleteInstitution(id) {
      await fetchApi(`/institutions/${id}`, { method: 'DELETE' });
    },
    
    // Holidays CRUD
    async createHoliday(holiday) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/holidays', {
        method: 'POST',
        body: JSON.stringify({ data: holiday }),
      });
      if (!response?.data) throw new Error('Failed to create holiday');
      return mapHoliday(response.data);
    },
    
    async updateHoliday(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/holidays/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update holiday');
      return mapHoliday(response.data);
    },
    
    async deleteHoliday(id) {
      await fetchApi(`/holidays/${id}`, { method: 'DELETE' });
    },
    
    // Restaurants CRUD
    async createRestaurant(restaurant) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/restaurants', {
        method: 'POST',
        body: JSON.stringify({ data: restaurant }),
      });
      if (!response?.data) throw new Error('Failed to create restaurant');
      return mapRestaurant(response.data);
    },
    
    async updateRestaurant(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/restaurants/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update restaurant');
      return mapRestaurant(response.data);
    },
    
    async deleteRestaurant(id) {
      await fetchApi(`/restaurants/${id}`, { method: 'DELETE' });
    },
    
    // Fashion Stores CRUD
    async createFashionStore(store) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/fashion-stores', {
        method: 'POST',
        body: JSON.stringify({ data: store }),
      });
      if (!response?.data) throw new Error('Failed to create fashion store');
      return mapFashionStore(response.data);
    },
    
    async updateFashionStore(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/fashion-stores/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update fashion store');
      return mapFashionStore(response.data);
    },
    
    async deleteFashionStore(id) {
      await fetchApi(`/fashion-stores/${id}`, { method: 'DELETE' });
    },
    
    // Shopping Centres CRUD
    async createShoppingCentre(centre) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/shopping-centres', {
        method: 'POST',
        body: JSON.stringify({ data: centre }),
      });
      if (!response?.data) throw new Error('Failed to create shopping centre');
      return mapShoppingCentre(response.data);
    },
    
    async updateShoppingCentre(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/shopping-centres/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update shopping centre');
      return mapShoppingCentre(response.data);
    },
    
    async deleteShoppingCentre(id) {
      await fetchApi(`/shopping-centres/${id}`, { method: 'DELETE' });
    },
    
    // Famous Places CRUD
    async createFamousPlace(place) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/places', {
        method: 'POST',
        body: JSON.stringify({ data: place }),
      });
      if (!response?.data) throw new Error('Failed to create famous place');
      return mapFamousPlace(response.data);
    },
    
    async updateFamousPlace(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/places/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update famous place');
      return mapFamousPlace(response.data);
    },
    
    async deleteFamousPlace(id) {
      await fetchApi(`/places/${id}`, { method: 'DELETE' });
    },
    
    // Events CRUD
    async createEvent(event) {
      const response = await fetchApi<StrapiSingleResponse<any>>('/events', {
        method: 'POST',
        body: JSON.stringify({ data: event }),
      });
      if (!response?.data) throw new Error('Failed to create event');
      return mapEvent(response.data);
    },
    
    async updateEvent(id, updates) {
      const response = await fetchApi<StrapiSingleResponse<any>>(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: updates }),
      });
      if (!response?.data) throw new Error('Failed to update event');
      return mapEvent(response.data);
    },
    
    async deleteEvent(id) {
      await fetchApi(`/events/${id}`, { method: 'DELETE' });
    },
  };
};
