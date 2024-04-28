export default async function getAllPaymentTransaction() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/paymenttransactions`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch payment transaction");
  }
  return response.json();
}
