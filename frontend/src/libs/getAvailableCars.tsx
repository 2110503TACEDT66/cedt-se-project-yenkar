export default async function getAvailableCars() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/carproviders/availablecars`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch car providers");
  }
  return response.json();
}
