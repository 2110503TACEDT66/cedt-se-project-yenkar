interface CarProvider {
  _id: string;
  //email:string,
  name: string;
  address: string;
  telephone: string;
  src: string;
}

interface CarItem {
  _id: string;
  model: string;
  brand: string;
  carProvider: CarProvider;
  price: number;
  src?: string;
}

interface CarJson {
  success: boolean;
  count: number;
  data: CarItem[];
}

interface CarProviderJson {
  success: boolean;
  count: number;
  data: CarProvider[];
}

type CarJsonPromise = Promise<CarJson>;

interface CreateUserProps {
  userName: string;
  userEmail: string;
  userPassword: string;
  userPhone: string;
  userLocation: string;
  balance?: number;
}

interface CarProps {
  _id: string;
  model: string;
  brand: string;
  carProvider: CarProvider;
  price: number;
  src?: string;
}

interface CheckoutTransactionParams {
  plan: string;
  amount: number;
  buyerId: string;
}

interface CreateTransactionProps {
  stripeId: string;
  amount: number;
  plan: string;
  buyerId: string;
  createdAt: Date;
}
