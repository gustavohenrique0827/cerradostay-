export type PropertyCategory = 
  | 'todos'
  | 'apartamentos'
  | 'casas'
  | 'luxo'
  | 'centro'
  | 'praia'
  | 'familia'
  | 'pet_friendly';

export interface Amenity {
  id: string;
  name: string;
  iconName: string;
  category: 'conforto' | 'tecnologia' | 'cozinha' | 'lazer' | 'seguranca';
}

export interface PropertyReview {
  id: string;
  authorName: string;
  authorLocation: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  status?: 'approved' | 'hidden';
  createdAt?: string;
}

export type PropertyStatus = 'active' | 'inactive';

export interface PropertyUnavailability {
  id: string;
  propertyId: string;
  startDate: string; // ISO format 'YYYY-MM-DD'
  endDate: string;   // ISO format 'YYYY-MM-DD'
  reason?: string;   // e.g. 'Imóvel reservado', 'Manutenção', 'Uso próprio', 'Bloqueio manual', 'Outro'
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'manager';
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string[];
  location: string;
  neighborhood: string;
  address?: string;
  city: string;
  state: string;
  status?: PropertyStatus;
  category: PropertyCategory[];
  coverImage: string;
  images: string[];
  pricePerNight: number;
  cleaningFee: number;
  serviceFeePercentage: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  isSuperhost: boolean;
  amenities: string[];
  houseRules: string[];
  checkInTime: string;
  checkOutTime: string;
  bookedDates: string[]; // ISO format 'YYYY-MM-DD'
  featuredReview?: PropertyReview;
  reviews: PropertyReview[];
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentMethod = 
  | 'pix'
  | 'credit_card'
  | 'apple_pay'
  | 'google_pay'
  | 'boleto';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  installments?: number;
  installmentValue?: number;
  cardLast4?: string;
  cardBrand?: string;
  cardHolderName?: string;
  pixCopyPasteKey?: string;
  pixExpirationTime?: string;
  receiptNumber?: string;
  digitalLockPasscode?: string;
  wifiNetwork?: string;
  wifiPassword?: string;
  guestCpf?: string;
}

export interface BookingRequest {
  id?: string;
  propertyId: string;
  propertyName: string;
  propertyLocation?: string;
  propertyImage?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCpf?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  pets?: boolean;
  specialRequests?: string;
  arrivalTime?: string;
  nights: number;
  pricePerNight: number;
  totalNightsCost: number;
  cleaningFee: number;
  serviceFee: number;
  discountAmount?: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed';
  payment?: PaymentDetails;
  createdAt: string;
}

export interface MetricItem {
  id: string;
  value: string;
  numericValue: number;
  suffix: string;
  prefix?: string;
  label: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  city: string;
  propertyName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'reserva' | 'checkin' | 'estadia' | 'pagamento';
}

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
  highlight: string;
}

export interface SearchFilterState {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  category: PropertyCategory;
  priceRange?: [number, number];
}
