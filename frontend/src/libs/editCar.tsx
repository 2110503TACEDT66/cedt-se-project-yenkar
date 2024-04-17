export default async function editCar(
  token: string,
  cid: string,
  brand?: string,
  model?: string,
  price?: number,
  src?: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/cars/${cid}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        brand: brand,
        model: model,
        price: price,
        src: src,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
