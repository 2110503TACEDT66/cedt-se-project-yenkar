export default async function getUserReservation(token?: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/rentings/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch car providers");
  }
  return response.json();
}
