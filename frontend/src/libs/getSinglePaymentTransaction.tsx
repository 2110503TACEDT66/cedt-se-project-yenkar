export default async function getSinglePaymentTransaction(pid: string, token?: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/paymenttransactions/${pid}`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch single payment transaction");
  }
  return response.json();
}
