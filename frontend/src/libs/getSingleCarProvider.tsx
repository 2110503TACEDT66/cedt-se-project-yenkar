export default async function getSingleCarProvider(id: string, token?: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/carproviders/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch car providers");
  }
  return response.json();
}
