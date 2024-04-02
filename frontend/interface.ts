interface CarItem {
  _id: string;
  name: string;
  address: string;
  telephone: string;
  price: number;
  src?: string;
}

interface CarJson {
  success: boolean;
  count: number;
  data: CarItem[];
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
  src?: string;
  name: string;
  telephone: string;
  price: number;
  address: string;
}
