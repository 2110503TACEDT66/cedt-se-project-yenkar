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
interface TransactionHisResponse {
  success: boolean;
  count: number;
  data: TransactionHis[];
}

interface TransactionHis {
  _id: string;
  stripeId?: string;
  amount: number;
  userId: UserId;
  carProviderId?: CarProviderId;
  direction: Direction;
  type: string;
  createdAt: string;
}

interface UserId {
  _id: string;
  name: string;
  email: string;
}

interface CarProviderId {
  _id: string;
  email: string;
  name: string;
  id: string;
}

enum Direction {
  userToCarProvider = "userToCarProvider",
  carProviderToUser = "carProviderToUser",
  userTopUp = "userTopUp",
}
