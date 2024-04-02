export default async function createReservation(
  id: string,
  rentTo: Date,
  rentDate: Date,
  user: string,
  token: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/carproviders/${id}/rentings/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
        rentTo: rentTo,
        rentDate: rentDate,
        user: user,
        returned: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create reservation");
  }
  return response.json();
}
