export default async function createReservation(
  rentTo: Date,
  rentDate: Date,
  user: string,
  token: string,
  pid: string,
  carModel?:string,
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/carproviders/${pid}/rentings/`,
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
        carModel:carModel,
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
