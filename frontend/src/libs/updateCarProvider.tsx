export default async function updataCarProvider(
  pid: string,
  name: string,
  address: string,
  telephone: string,
  src: string,
  token?: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/carproviders/${pid}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        address: address,
        telephone: telephone,
        src: src,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch car providers");
  }
  return response.json();
}
