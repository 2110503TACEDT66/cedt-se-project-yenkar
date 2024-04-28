export async function getTransactions(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/transactions/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}
