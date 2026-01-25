// Extended CMS Provider for new content modules
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
import {
  mockExams,
  mockResults,
  mockInstitutions,
  mockHolidays,
  mockRestaurants,
  mockFashionStores,
  mockShoppingCentres,
  mockFamousPlaces,
  mockEvents,
} from './extendedMockData';
import type { PaginatedResponse } from './types';
import { createStrapiExtendedProvider } from './strapiExtendedProvider';

// Helper function for filtering and pagination
const applyFiltersAndPagination = <T extends { id: string }>(
  items: T[],
  params: ExtendedQueryParams,
  filterFn?: (item: T) => boolean
): PaginatedResponse<T> => {
  const filtered = filterFn ? items.filter(filterFn) : [...items];
  
  const limit = params.limit || 10;
  const offset = params.offset || 0;
  const total = filtered.length;
  const data = filtered.slice(offset, offset + limit);
  
  return {
    data,
    total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
};

export interface ExtendedCMSProvider {
  // Education
  getExams: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSExam>>;
  getExamBySlug: (slug: string) => Promise<CMSExam | null>;
  getResults: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSResult>>;
  getResultBySlug: (slug: string) => Promise<CMSResult | null>;
  getInstitutions: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSInstitution>>;
  getInstitutionBySlug: (slug: string) => Promise<CMSInstitution | null>;
  
  // Culture
  getHolidays: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSHoliday>>;
  getHolidayBySlug: (slug: string) => Promise<CMSHoliday | null>;
  getHolidaysByMonth: (year: number, month: number) => Promise<CMSHoliday[]>;
  
  // Food & Lifestyle
  getRestaurants: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSRestaurant>>;
  getRestaurantBySlug: (slug: string) => Promise<CMSRestaurant | null>;
  getFashionStores: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSFashionStore>>;
  getFashionStoreBySlug: (slug: string) => Promise<CMSFashionStore | null>;
  getShoppingCentres: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSShoppingCentre>>;
  getShoppingCentreBySlug: (slug: string) => Promise<CMSShoppingCentre | null>;
  getFamousPlaces: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSFamousPlace>>;
  getFamousPlaceBySlug: (slug: string) => Promise<CMSFamousPlace | null>;
  
  // Events
  getEvents: (params?: ExtendedQueryParams) => Promise<PaginatedResponse<CMSEvent>>;
  getEventBySlug: (slug: string) => Promise<CMSEvent | null>;
  getUpcomingEvents: (limit?: number) => Promise<CMSEvent[]>;
  
  // Calendar
  getCalendarEvents: (year: number, month: number) => Promise<CalendarEvent[]>;
  
  // CRUD Operations (for admin)
  createExam: (exam: Omit<CMSExam, 'id'>) => Promise<CMSExam>;
  updateExam: (id: string, exam: Partial<CMSExam>) => Promise<CMSExam>;
  deleteExam: (id: string) => Promise<void>;
  
  createResult: (result: Omit<CMSResult, 'id'>) => Promise<CMSResult>;
  updateResult: (id: string, result: Partial<CMSResult>) => Promise<CMSResult>;
  deleteResult: (id: string) => Promise<void>;
  
  createInstitution: (institution: Omit<CMSInstitution, 'id'>) => Promise<CMSInstitution>;
  updateInstitution: (id: string, institution: Partial<CMSInstitution>) => Promise<CMSInstitution>;
  deleteInstitution: (id: string) => Promise<void>;
  
  createHoliday: (holiday: Omit<CMSHoliday, 'id'>) => Promise<CMSHoliday>;
  updateHoliday: (id: string, holiday: Partial<CMSHoliday>) => Promise<CMSHoliday>;
  deleteHoliday: (id: string) => Promise<void>;
  
  createRestaurant: (restaurant: Omit<CMSRestaurant, 'id'>) => Promise<CMSRestaurant>;
  updateRestaurant: (id: string, restaurant: Partial<CMSRestaurant>) => Promise<CMSRestaurant>;
  deleteRestaurant: (id: string) => Promise<void>;
  
  createFashionStore: (store: Omit<CMSFashionStore, 'id'>) => Promise<CMSFashionStore>;
  updateFashionStore: (id: string, store: Partial<CMSFashionStore>) => Promise<CMSFashionStore>;
  deleteFashionStore: (id: string) => Promise<void>;
  
  createShoppingCentre: (centre: Omit<CMSShoppingCentre, 'id'>) => Promise<CMSShoppingCentre>;
  updateShoppingCentre: (id: string, centre: Partial<CMSShoppingCentre>) => Promise<CMSShoppingCentre>;
  deleteShoppingCentre: (id: string) => Promise<void>;
  
  createFamousPlace: (place: Omit<CMSFamousPlace, 'id'>) => Promise<CMSFamousPlace>;
  updateFamousPlace: (id: string, place: Partial<CMSFamousPlace>) => Promise<CMSFamousPlace>;
  deleteFamousPlace: (id: string) => Promise<void>;
  
  createEvent: (event: Omit<CMSEvent, 'id'>) => Promise<CMSEvent>;
  updateEvent: (id: string, event: Partial<CMSEvent>) => Promise<CMSEvent>;
  deleteEvent: (id: string) => Promise<void>;
}

// In-memory storage for mock data mutations
let examsData = [...mockExams];
let resultsData = [...mockResults];
let institutionsData = [...mockInstitutions];
let holidaysData = [...mockHolidays];
let restaurantsData = [...mockRestaurants];
let fashionStoresData = [...mockFashionStores];
let shoppingCentresData = [...mockShoppingCentres];
let famousPlacesData = [...mockFamousPlaces];
let eventsData = [...mockEvents];

export const extendedMockProvider: ExtendedCMSProvider = {
  // Education - Exams
  async getExams(params = {}) {
    return applyFiltersAndPagination(examsData, params, (exam) => {
      if (params.category && exam.category !== params.category) return false;
      if (params.status && exam.status !== params.status) return false;
      if (params.search && !exam.titleHindi.includes(params.search) && !exam.title.toLowerCase().includes(params.search.toLowerCase())) return false;
      return true;
    });
  },
  
  async getExamBySlug(slug) {
    return examsData.find(e => e.slug === slug) || null;
  },
  
  // Education - Results
  async getResults(params = {}) {
    return applyFiltersAndPagination(resultsData, params, (result) => {
      if (params.category && result.category !== params.category) return false;
      if (params.search && !result.titleHindi.includes(params.search) && !result.title.toLowerCase().includes(params.search.toLowerCase())) return false;
      return true;
    });
  },
  
  async getResultBySlug(slug) {
    return resultsData.find(r => r.slug === slug) || null;
  },
  
  // Education - Institutions
  async getInstitutions(params = {}) {
    return applyFiltersAndPagination(institutionsData, params, (inst) => {
      if (params.type && inst.type !== params.type) return false;
      if (params.city && inst.city !== params.city) return false;
      if (params.featured && !inst.isFeatured) return false;
      if (params.search && !inst.nameHindi.includes(params.search) && !inst.name.toLowerCase().includes(params.search.toLowerCase())) return false;
      return true;
    });
  },
  
  async getInstitutionBySlug(slug) {
    return institutionsData.find(i => i.slug === slug) || null;
  },
  
  // Culture - Holidays
  async getHolidays(params = {}) {
    return applyFiltersAndPagination(holidaysData, params, (holiday) => {
      if (params.type && holiday.type !== params.type) return false;
      if (params.search && !holiday.nameHindi.includes(params.search) && !holiday.name.toLowerCase().includes(params.search.toLowerCase())) return false;
      return true;
    });
  },
  
  async getHolidayBySlug(slug) {
    return holidaysData.find(h => h.slug === slug) || null;
  },
  
  async getHolidaysByMonth(year, month) {
    return holidaysData.filter(h => {
      const date = new Date(h.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  },
  
  // Food & Lifestyle - Restaurants
  async getRestaurants(params = {}) {
    return applyFiltersAndPagination(restaurantsData, params, (rest) => {
      if (params.type && rest.type !== params.type) return false;
      if (params.city && rest.city !== params.city) return false;
      if (params.featured && !rest.isFeatured) return false;
      if (params.search && !rest.nameHindi.includes(params.search) && !rest.name.toLowerCase().includes(params.search.toLowerCase())) return false;
      return true;
    });
  },
  
  async getRestaurantBySlug(slug) {
    return restaurantsData.find(r => r.slug === slug) || null;
  },
  
  // Fashion Stores
  async getFashionStores(params = {}) {
    return applyFiltersAndPagination(fashionStoresData, params, (store) => {
      if (params.type && store.type !== params.type) return false;
      if (params.category && store.category !== params.category) return false;
      if (params.featured && !store.isFeatured) return false;
      return true;
    });
  },
  
  async getFashionStoreBySlug(slug) {
    return fashionStoresData.find(s => s.slug === slug) || null;
  },
  
  // Shopping Centres
  async getShoppingCentres(params = {}) {
    return applyFiltersAndPagination(shoppingCentresData, params, (centre) => {
      if (params.type && centre.type !== params.type) return false;
      if (params.featured && !centre.isFeatured) return false;
      return true;
    });
  },
  
  async getShoppingCentreBySlug(slug) {
    return shoppingCentresData.find(c => c.slug === slug) || null;
  },
  
  // Famous Places
  async getFamousPlaces(params = {}) {
    return applyFiltersAndPagination(famousPlacesData, params, (place) => {
      if (params.type && place.type !== params.type) return false;
      if (params.featured && !place.isFeatured) return false;
      return true;
    });
  },
  
  async getFamousPlaceBySlug(slug) {
    return famousPlacesData.find(p => p.slug === slug) || null;
  },
  
  // Events
  async getEvents(params = {}) {
    return applyFiltersAndPagination(eventsData, params, (event) => {
      if (params.category && event.category !== params.category) return false;
      if (params.status && event.status !== params.status) return false;
      if (params.city && event.city !== params.city) return false;
      if (params.featured && !event.isFeatured) return false;
      if (params.search && !event.titleHindi.includes(params.search) && !event.title.toLowerCase().includes(params.search.toLowerCase())) return false;
      return true;
    });
  },
  
  async getEventBySlug(slug) {
    return eventsData.find(e => e.slug === slug) || null;
  },
  
  async getUpcomingEvents(limit = 5) {
    const now = new Date();
    return eventsData
      .filter(e => new Date(e.date) >= now && e.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  },
  
  // Calendar - Combined events view
  async getCalendarEvents(year, month) {
    const events: CalendarEvent[] = [];
    
    // Add exams
    examsData.forEach(exam => {
      const date = new Date(exam.examDate);
      if (date.getFullYear() === year && date.getMonth() === month) {
        events.push({
          id: exam.id,
          title: exam.title,
          titleHindi: exam.titleHindi,
          date: exam.examDate,
          type: 'exam',
          category: exam.category,
          color: '#3b82f6',
          link: `/education-jobs/exams/${exam.slug}`,
        });
      }
    });
    
    // Add results
    resultsData.forEach(result => {
      const date = new Date(result.resultDate);
      if (date.getFullYear() === year && date.getMonth() === month) {
        events.push({
          id: result.id,
          title: result.title,
          titleHindi: result.titleHindi,
          date: result.resultDate,
          type: 'result',
          category: result.category,
          color: '#22c55e',
          link: `/education-jobs/results/${result.slug}`,
        });
      }
    });
    
    // Add holidays
    holidaysData.forEach(holiday => {
      const date = new Date(holiday.date);
      if (date.getFullYear() === year && date.getMonth() === month) {
        events.push({
          id: holiday.id,
          title: holiday.name,
          titleHindi: holiday.nameHindi,
          date: holiday.date,
          endDate: holiday.endDate,
          type: 'holiday',
          category: holiday.type,
          color: holiday.type === 'national' ? '#ef4444' : '#f59e0b',
          link: `/religion-culture/holidays/${holiday.slug}`,
        });
      }
    });
    
    // Add events
    eventsData.forEach(event => {
      const date = new Date(event.date);
      if (date.getFullYear() === year && date.getMonth() === month && event.status === 'upcoming') {
        events.push({
          id: event.id,
          title: event.title,
          titleHindi: event.titleHindi,
          date: event.date,
          endDate: event.endDate,
          type: 'event',
          category: event.category,
          color: '#8b5cf6',
          link: `/food-lifestyle/events/${event.slug}`,
        });
      }
    });
    
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
  
  // CRUD Operations
  async createExam(exam) {
    const newExam = { ...exam, id: `exam-${Date.now()}` };
    examsData.push(newExam);
    return newExam;
  },
  
  async updateExam(id, updates) {
    const index = examsData.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Exam not found');
    examsData[index] = { ...examsData[index], ...updates };
    return examsData[index];
  },
  
  async deleteExam(id) {
    examsData = examsData.filter(e => e.id !== id);
  },
  
  async createResult(result) {
    const newResult = { ...result, id: `result-${Date.now()}` };
    resultsData.push(newResult);
    return newResult;
  },
  
  async updateResult(id, updates) {
    const index = resultsData.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Result not found');
    resultsData[index] = { ...resultsData[index], ...updates };
    return resultsData[index];
  },
  
  async deleteResult(id) {
    resultsData = resultsData.filter(r => r.id !== id);
  },
  
  async createInstitution(institution) {
    const newInst = { ...institution, id: `inst-${Date.now()}` };
    institutionsData.push(newInst);
    return newInst;
  },
  
  async updateInstitution(id, updates) {
    const index = institutionsData.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Institution not found');
    institutionsData[index] = { ...institutionsData[index], ...updates };
    return institutionsData[index];
  },
  
  async deleteInstitution(id) {
    institutionsData = institutionsData.filter(i => i.id !== id);
  },
  
  async createHoliday(holiday) {
    const newHoliday = { ...holiday, id: `holiday-${Date.now()}` };
    holidaysData.push(newHoliday);
    return newHoliday;
  },
  
  async updateHoliday(id, updates) {
    const index = holidaysData.findIndex(h => h.id === id);
    if (index === -1) throw new Error('Holiday not found');
    holidaysData[index] = { ...holidaysData[index], ...updates };
    return holidaysData[index];
  },
  
  async deleteHoliday(id) {
    holidaysData = holidaysData.filter(h => h.id !== id);
  },
  
  async createRestaurant(restaurant) {
    const newRest = { ...restaurant, id: `rest-${Date.now()}` };
    restaurantsData.push(newRest);
    return newRest;
  },
  
  async updateRestaurant(id, updates) {
    const index = restaurantsData.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Restaurant not found');
    restaurantsData[index] = { ...restaurantsData[index], ...updates };
    return restaurantsData[index];
  },
  
  async deleteRestaurant(id) {
    restaurantsData = restaurantsData.filter(r => r.id !== id);
  },
  
  async createFashionStore(store) {
    const newStore = { ...store, id: `fashion-${Date.now()}` };
    fashionStoresData.push(newStore);
    return newStore;
  },
  
  async updateFashionStore(id, updates) {
    const index = fashionStoresData.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Fashion store not found');
    fashionStoresData[index] = { ...fashionStoresData[index], ...updates };
    return fashionStoresData[index];
  },
  
  async deleteFashionStore(id) {
    fashionStoresData = fashionStoresData.filter(s => s.id !== id);
  },
  
  async createShoppingCentre(centre) {
    const newCentre = { ...centre, id: `shop-${Date.now()}` };
    shoppingCentresData.push(newCentre);
    return newCentre;
  },
  
  async updateShoppingCentre(id, updates) {
    const index = shoppingCentresData.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Shopping centre not found');
    shoppingCentresData[index] = { ...shoppingCentresData[index], ...updates };
    return shoppingCentresData[index];
  },
  
  async deleteShoppingCentre(id) {
    shoppingCentresData = shoppingCentresData.filter(c => c.id !== id);
  },
  
  async createFamousPlace(place) {
    const newPlace = { ...place, id: `place-${Date.now()}` };
    famousPlacesData.push(newPlace);
    return newPlace;
  },
  
  async updateFamousPlace(id, updates) {
    const index = famousPlacesData.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Famous place not found');
    famousPlacesData[index] = { ...famousPlacesData[index], ...updates };
    return famousPlacesData[index];
  },
  
  async deleteFamousPlace(id) {
    famousPlacesData = famousPlacesData.filter(p => p.id !== id);
  },
  
  async createEvent(event) {
    const newEvent = { ...event, id: `event-${Date.now()}` };
    eventsData.push(newEvent);
    return newEvent;
  },
  
  async updateEvent(id, updates) {
    const index = eventsData.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    eventsData[index] = { ...eventsData[index], ...updates };
    return eventsData[index];
  },
  
  async deleteEvent(id) {
    eventsData = eventsData.filter(e => e.id !== id);
  },
};

// Provider factory - switches between mock and Strapi based on environment
let strapiExtendedProviderInstance: ExtendedCMSProvider | null = null;

export const getExtendedCMSProvider = (): ExtendedCMSProvider => {
  const provider = typeof window !== 'undefined' 
    ? (import.meta.env?.VITE_CMS_PROVIDER as string | undefined)
    : process.env.VITE_CMS_PROVIDER;
  
  if (provider === 'strapi') {
    if (!strapiExtendedProviderInstance) {
      const baseUrl = typeof window !== 'undefined'
        ? (import.meta.env?.VITE_STRAPI_URL as string | undefined) || 'http://localhost:1337'
        : process.env.VITE_STRAPI_URL || 'http://localhost:1337';
      
      const apiToken = typeof window !== 'undefined'
        ? (import.meta.env?.VITE_STRAPI_TOKEN as string | undefined)
        : process.env.VITE_STRAPI_TOKEN;
      
      strapiExtendedProviderInstance = createStrapiExtendedProvider({
        baseUrl,
        apiToken,
      });
    }
    return strapiExtendedProviderInstance;
  }
  
  // Default to mock provider
  return extendedMockProvider;
};
