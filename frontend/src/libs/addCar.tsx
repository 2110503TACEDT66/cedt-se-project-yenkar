import { Cargo, Transmission } from "../../interface";

export default async function addCar(
  token: string,
  pid: string,
  model: string,
  brand: string,
  price: number,
  doors: number,
  seats: number,
  vrm: string,
  transmission?: Transmission,
  cargo?: Cargo,
  radio?: boolean,
  air?: boolean,
  src?: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/carproviders/${pid}/cars`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: model,
        brand: brand,
        price: price,
        doors: doors,
        seats: seats,
        vrm: vrm,
        transmission: transmission,
        cargo: cargo,
        radio: radio,
        air: air,
        src: src,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("failed to add booking");
  }
  return await response.json();
}
