export default async function getAllCarProviders() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/carproviders`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch car providers");
  }
  return response.json();
}
