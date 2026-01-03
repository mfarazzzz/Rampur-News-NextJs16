// Extended CMS Types for structured content modules

// ============ EDUCATION MODULE ============
export interface CMSExam {
  id: string;
  title: string;
  titleHindi: string;
  slug: string;
  examDate: string;
  applicationStartDate?: string;
  applicationEndDate?: string;
  resultDate?: string;
  organization: string;
  organizationHindi: string;
  category: 'board' | 'entrance' | 'government' | 'university' | 'competitive';
  description: string;
  eligibility?: string;
  officialWebsite?: string;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  isPopular?: boolean;
}

export interface CMSResult {
  id: string;
  title: string;
  titleHindi: string;
  slug: string;
  resultDate: string;
  organization: string;
  organizationHindi: string;
  category: 'board' | 'entrance' | 'government' | 'university' | 'competitive';
  description: string;
  resultLink?: string;
  image?: string;
  totalCandidates?: number;
  passPercentage?: number;
}

export interface CMSInstitution {
  id: string;
  name: string;
  nameHindi: string;
  slug: string;
  type: 'college' | 'school' | 'university' | 'coaching' | 'vocational';
  address: string;
  addressHindi: string;
  city: string;
  district: string;
  pincode: string;
  phone?: string;
  email?: string;
  website?: string;
  establishedYear?: number;
  affiliation?: string;
  courses?: string[];
  facilities?: string[];
  image?: string;
  gallery?: string[];
  rating?: number;
  reviews?: number;
  description: string;
  descriptionHindi: string;
  seoTitle?: string;
  seoDescription?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
}

// ============ CULTURE MODULE ============
export interface CMSHoliday {
  id: string;
  name: string;
  nameHindi: string;
  slug: string;
  date: string;
  endDate?: string; // For multi-day festivals
  type: 'national' | 'regional' | 'religious' | 'cultural' | 'bank';
  religion?: 'hindu' | 'muslim' | 'christian' | 'sikh' | 'buddhist' | 'jain' | 'secular';
  description: string;
  descriptionHindi: string;
  significance?: string;
  rituals?: string[];
  image?: string;
  isRecurring: boolean;
  recurringType?: 'yearly' | 'lunar';
  isPublicHoliday: boolean;
  region?: string[];
}

// ============ FOOD & LIFESTYLE MODULE ============
export interface CMSRestaurant {
  id: string;
  name: string;
  nameHindi: string;
  slug: string;
  type: 'restaurant' | 'cafe' | 'street-food' | 'sweet-shop' | 'dhaba' | 'fine-dining';
  cuisine: string[];
  address: string;
  addressHindi: string;
  city: string;
  district: string;
  phone?: string;
  priceRange: 'budget' | 'moderate' | 'expensive' | 'luxury';
  rating?: number;
  reviews?: number;
  openingHours?: string;
  image?: string;
  gallery?: string[];
  specialties?: string[];
  description: string;
  descriptionHindi: string;
  isVeg?: boolean;
  hasDelivery?: boolean;
  isFeatured?: boolean;
  mapLink?: string;
}

export interface CMSFashionStore {
  id: string;
  name: string;
  nameHindi: string;
  slug: string;
  type: 'clothing' | 'jewelry' | 'footwear' | 'accessories' | 'tailor' | 'boutique';
  category: 'men' | 'women' | 'kids' | 'all';
  address: string;
  addressHindi: string;
  city: string;
  district: string;
  phone?: string;
  priceRange: 'budget' | 'moderate' | 'expensive' | 'luxury';
  rating?: number;
  image?: string;
  gallery?: string[];
  brands?: string[];
  specialties?: string[];
  description: string;
  descriptionHindi: string;
  isFeatured?: boolean;
}

export interface CMSShoppingCentre {
  id: string;
  name: string;
  nameHindi: string;
  slug: string;
  type: 'mall' | 'market' | 'bazaar' | 'complex' | 'plaza';
  address: string;
  addressHindi: string;
  city: string;
  district: string;
  phone?: string;
  openingHours?: string;
  image?: string;
  gallery?: string[];
  storeCount?: number;
  amenities?: string[];
  parkingAvailable?: boolean;
  description: string;
  descriptionHindi: string;
  isFeatured?: boolean;
  mapLink?: string;
}

export interface CMSFamousPlace {
  id: string;
  name: string;
  nameHindi: string;
  slug: string;
  type: 'historical' | 'religious' | 'recreational' | 'market' | 'landmark' | 'food-hub';
  address: string;
  addressHindi: string;
  city: string;
  district: string;
  image?: string;
  gallery?: string[];
  description: string;
  descriptionHindi: string;
  history?: string;
  timings?: string;
  entryFee?: string;
  bestTimeToVisit?: string;
  isFeatured?: boolean;
  rating?: number;
}

export interface CMSEvent {
  id: string;
  title: string;
  titleHindi: string;
  slug: string;
  date: string;
  endDate?: string;
  time?: string;
  venue: string;
  venueHindi: string;
  address: string;
  city: string;
  district: string;
  category: 'cultural' | 'religious' | 'sports' | 'educational' | 'business' | 'entertainment' | 'food' | 'fashion';
  organizer?: string;
  organizerHindi?: string;
  description: string;
  descriptionHindi: string;
  image?: string;
  ticketPrice?: string;
  registrationLink?: string;
  isFree?: boolean;
  isFeatured?: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

// ============ COMMON TYPES ============
export interface CalendarEvent {
  id: string;
  title: string;
  titleHindi: string;
  date: string;
  endDate?: string;
  type: 'exam' | 'result' | 'holiday' | 'event';
  category?: string;
  color?: string;
  link?: string;
}

export interface Breadcrumb {
  label: string;
  labelHindi: string;
  path: string;
}

// Query params for extended types
export interface ExtendedQueryParams {
  type?: string;
  category?: string;
  city?: string;
  district?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}
