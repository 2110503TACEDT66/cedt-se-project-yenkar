export enum Transmission {
  manual = "manual",
  auto = "auto",
  AWT = "AWT",
  other = "other",
}

export enum Cargo {
  none = "-",
  small = "small",
  medium = "medium",
  large = "large",
  superLarge = "super large",
}
export const cargoOptions = [
  { label: "-", value: Cargo.none },
  { label: "Small", value: Cargo.small },
  { label: "Medium", value: Cargo.medium },
  { label: "Large", value: Cargo.large },
  { label: "Super Large", value: Cargo.superLarge },
] as const;

export const transmissionOptions = [
  { label: "Manual", value: Transmission.manual },
  { label: "Auto", value: Transmission.auto },
  { label: "AWT", value: Transmission.AWT },
  { label: "Other", value: Transmission.other },
] as const;

export interface CarProvider {
  _id: string;
  //email:string,
  name: string;
  address: string;
  telephone: string;
  src: string;
}

export interface CarItem {
  _id: string;
  carProvider: CarProvider;
  brand: string;
  model: string;
  price: number;
  src?: string;
  air: boolean;
  cargo: Cargo;
  doors: number;
  radio: boolean;
  seats: number;
  transmission: Transmission;
  id: string;
  vrm: string;
}

export interface CarJson {
  success: boolean;
  count: number;
  data: CarItem[];
}

export interface CarProviderJson {
  success: boolean;
  count: number;
  data: CarProvider[];
}

export type CarJsonPromise = Promise<CarJson>;

export interface CreateUserProps {
  userName: string;
  userEmail: string;
  userPassword: string;
  userPhone: string;
  userLocation: string;
  balance?: number;
}

export interface CarProps {
  _id: string;
  model: string;
  brand: string;
  carProvider: CarProvider;
  price: number;
  src?: string;
}

export interface CheckoutTransactionParams {
  plan: string;
  amount: number;
  buyerId: string;
}

export interface CreateTransactionProps {
  stripeId: string;
  amount: number;
  plan: string;
  buyerId: string;
  createdAt: Date;
}
export interface TransactionHisResponse {
  success: boolean;
  count: number;
  data: TransactionHis[];
}

export interface TransactionHis {
  _id: string;
  stripeId?: string;
  amount: number;
  userId: UserId;
  carProviderId?: CarProviderId;
  direction: Direction;
  type: string;
  createdAt: string;
}

export interface UserId {
  _id: string;
  name: string;
  email: string;
}

export interface CarProviderId {
  _id: string;
  email: string;
  name: string;
  id: string;
}

export enum Direction {
  userToCarProvider = "userToCarProvider",
  carProviderToUser = "carProviderToUser",
  userTopUp = "userTopUp",
}

export interface Profile {
  data: {
    email: string;
    telephone: string;
    address: string;
    balance: number;
  };
}

export interface ReservationItem {
  _id: string;
  rentDate: string;
  rentTo: string;
  user: User;
  carProvider: CarProvider;
  createAt: string;
  returned: boolean;
  __v: number;
  car: CarItem;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export const addCarSchemaMessage = {
  model: "Your model must be at least 2 characters long",
  brand: "Your brand must be at least 2 characters long",
};

export enum ToastVariant {
  destructive = "destructive",
  default = "default",
}

export const toastIndex = {
  toastAddCarSuccess: {
    title: "Success",
    description: "Car added successfully",
    duration: 3000,
  },
  toastAddCarFail: {
    title: "Error",
    description: "Car has not been added",
    duration: 3000,
    variant: ToastVariant.destructive,
  },
  toastDeleteCarSuccess: {
    title: "Success",
    description: "Car deleted successfully",
    duration: 3000,
  },

  toastDeleteCarFail: {
    title: "Error",
    description: "Car has not been deleted",
    duration: 3000,
    variant: ToastVariant.destructive,
  },

  toastUpdateCarSuccess: {
    title: "Success",
    description: "Car updated successfully",
    duration: 3000,
  },

  toastUpdateCarFail: {
    title: "Error",
    description: "Car has not been updated",
    duration: 3000,
    variant: ToastVariant.destructive,
  },

  toastUploadImageSuccess: {
    title: "Success",
    description: "Image uploaded successfully",
    duration: 3000,
  },

  toastUploadImageFail: {
    title: "Error",
    description: "Image has not been uploaded",
    duration: 3000,
    variant: ToastVariant.destructive,
  },

  toastEditCarProviderSuccess: {
    title: "Success",
    description: "Your store information updated successfully",
    duration: 3000,
  },

  toastEditCarProviderFail: {
    title: "Error",
    description: "Your store information has not been updated",
    duration: 3000,
    variant: ToastVariant.destructive,
  },
  toastDeleteReservationSuccess: {
    title: "Success",
    description: "Reservation deleted successfully",
    duration: 3000,
  },

  toastDeleteReservationFail: {
    title: "Error",
    description: "Reservation has not been deleted",
    duration: 3000,
    variant: ToastVariant.destructive,
  },
};

export const formPlaceholder = {
  user: {
    email: "Enter your email",
    password: "Enter your password",
    name: "Enter your name",
    phone: "Enter your phone number",
    address: "Enter your address",
  },
  carProvider: {
    email: "Enter your email",
    password: "Enter your password",
    name: "Enter name for your store",
    phone: "Enter phone number for your store",
    address: "Enter address for your store",
  },

  car: {
    model: "Enter your car model",
    brand: "Enter your car brand",
    price: "Enter your car price",
    doors: "Enter your car doors",
    seats: "Enter your car seats",
    vrm: "Enter your car plate number",
    transmission: "Select your car transmission type",
    cargo: "Select your car cargo size",
  },

  balance: {
    amount: "Enter your top up amount",
  },
};
