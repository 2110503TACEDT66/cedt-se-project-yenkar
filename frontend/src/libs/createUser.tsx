export default async function createUser({
  userName,
  userEmail,
  userPassword,
  userPhone,
  userLocation,
}: CreateUserProps) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        password: userPassword,
        telephone: userPhone,
        address: userLocation,
        balance: 10000,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json();
}
