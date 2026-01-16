"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExtendedCMSProvider } from '@/services/cms/extendedProvider';
import type { ExtendedQueryParams } from '@/services/cms/extendedTypes';

const provider = getExtendedCMSProvider();

// Query keys
export const extendedCmsKeys = {
  exams: ['exams'] as const,
  exam: (slug: string) => ['exam', slug] as const,
  results: ['results'] as const,
  result: (slug: string) => ['result', slug] as const,
  institutions: ['institutions'] as const,
  institution: (slug: string) => ['institution', slug] as const,
  holidays: ['holidays'] as const,
  holiday: (slug: string) => ['holiday', slug] as const,
  holidaysByMonth: (year: number, month: number) => ['holidays', 'month', year, month] as const,
  restaurants: ['restaurants'] as const,
  restaurant: (slug: string) => ['restaurant', slug] as const,
  fashionStores: ['fashionStores'] as const,
  fashionStore: (slug: string) => ['fashionStore', slug] as const,
  shoppingCentres: ['shoppingCentres'] as const,
  shoppingCentre: (slug: string) => ['shoppingCentre', slug] as const,
  famousPlaces: ['famousPlaces'] as const,
  famousPlace: (slug: string) => ['famousPlace', slug] as const,
  events: ['events'] as const,
  event: (slug: string) => ['event', slug] as const,
  upcomingEvents: (limit: number) => ['events', 'upcoming', limit] as const,
  calendarEvents: (year: number, month: number) => ['calendar', year, month] as const,
};

// Education Hooks
export const useExams = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.exams, params],
    queryFn: () => provider.getExams(params),
  });
};

export const useExamBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.exam(slug),
    queryFn: () => provider.getExamBySlug(slug),
    enabled: !!slug,
  });
};

export const useResults = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.results, params],
    queryFn: () => provider.getResults(params),
  });
};

export const useResultBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.result(slug),
    queryFn: () => provider.getResultBySlug(slug),
    enabled: !!slug,
  });
};

export const useInstitutions = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.institutions, params],
    queryFn: () => provider.getInstitutions(params),
  });
};

export const useInstitutionBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.institution(slug),
    queryFn: () => provider.getInstitutionBySlug(slug),
    enabled: !!slug,
  });
};

// Culture Hooks
export const useHolidays = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.holidays, params],
    queryFn: () => provider.getHolidays(params),
  });
};

export const useHolidayBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.holiday(slug),
    queryFn: () => provider.getHolidayBySlug(slug),
    enabled: !!slug,
  });
};

export const useHolidaysByMonth = (year: number, month: number) => {
  return useQuery({
    queryKey: extendedCmsKeys.holidaysByMonth(year, month),
    queryFn: () => provider.getHolidaysByMonth(year, month),
  });
};

// Food & Lifestyle Hooks
export const useRestaurants = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.restaurants, params],
    queryFn: () => provider.getRestaurants(params),
  });
};

export const useRestaurantBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.restaurant(slug),
    queryFn: () => provider.getRestaurantBySlug(slug),
    enabled: !!slug,
  });
};

export const useFashionStores = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.fashionStores, params],
    queryFn: () => provider.getFashionStores(params),
  });
};

export const useFashionStoreBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.fashionStore(slug),
    queryFn: () => provider.getFashionStoreBySlug(slug),
    enabled: !!slug,
  });
};

export const useShoppingCentres = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.shoppingCentres, params],
    queryFn: () => provider.getShoppingCentres(params),
  });
};

export const useShoppingCentreBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.shoppingCentre(slug),
    queryFn: () => provider.getShoppingCentreBySlug(slug),
    enabled: !!slug,
  });
};

export const useFamousPlaces = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.famousPlaces, params],
    queryFn: () => provider.getFamousPlaces(params),
  });
};

export const useFamousPlaceBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.famousPlace(slug),
    queryFn: () => provider.getFamousPlaceBySlug(slug),
    enabled: !!slug,
  });
};

// Events Hooks
export const useEvents = (params?: ExtendedQueryParams) => {
  return useQuery({
    queryKey: [...extendedCmsKeys.events, params],
    queryFn: () => provider.getEvents(params),
  });
};

export const useEventBySlug = (slug: string) => {
  return useQuery({
    queryKey: extendedCmsKeys.event(slug),
    queryFn: () => provider.getEventBySlug(slug),
    enabled: !!slug,
  });
};

export const useUpcomingEvents = (limit = 5) => {
  return useQuery({
    queryKey: extendedCmsKeys.upcomingEvents(limit),
    queryFn: () => provider.getUpcomingEvents(limit),
  });
};

// Calendar Hook
export const useCalendarEvents = (year: number, month: number) => {
  return useQuery({
    queryKey: extendedCmsKeys.calendarEvents(year, month),
    queryFn: () => provider.getCalendarEvents(year, month),
  });
};

// Mutation Hooks for Admin
export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.exams }),
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateExam>[1] }) =>
      provider.updateExam(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.exams }),
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.exams }),
  });
};

export const useCreateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createResult,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.results }),
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateResult>[1] }) =>
      provider.updateResult(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.results }),
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteResult,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.results }),
  });
};

export const useCreateInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createInstitution,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.institutions }),
  });
};

export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateInstitution>[1] }) =>
      provider.updateInstitution(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.institutions }),
  });
};

export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteInstitution,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.institutions }),
  });
};

export const useCreateHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createHoliday,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.holidays }),
  });
};

export const useUpdateHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateHoliday>[1] }) =>
      provider.updateHoliday(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.holidays }),
  });
};

export const useDeleteHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteHoliday,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.holidays }),
  });
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.restaurants }),
  });
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateRestaurant>[1] }) =>
      provider.updateRestaurant(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.restaurants }),
  });
};

export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.restaurants }),
  });
};

export const useCreateFashionStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createFashionStore,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.fashionStores }),
  });
};

export const useUpdateFashionStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateFashionStore>[1] }) =>
      provider.updateFashionStore(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.fashionStores }),
  });
};

export const useDeleteFashionStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteFashionStore,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.fashionStores }),
  });
};

export const useCreateShoppingCentre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createShoppingCentre,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.shoppingCentres }),
  });
};

export const useUpdateShoppingCentre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateShoppingCentre>[1] }) =>
      provider.updateShoppingCentre(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.shoppingCentres }),
  });
};

export const useDeleteShoppingCentre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteShoppingCentre,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.shoppingCentres }),
  });
};

export const useCreateFamousPlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createFamousPlace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.famousPlaces }),
  });
};

export const useUpdateFamousPlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateFamousPlace>[1] }) =>
      provider.updateFamousPlace(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.famousPlaces }),
  });
};

export const useDeleteFamousPlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteFamousPlace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.famousPlaces }),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.events }),
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof provider.updateEvent>[1] }) =>
      provider.updateEvent(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.events }),
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: provider.deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: extendedCmsKeys.events }),
  });
};
