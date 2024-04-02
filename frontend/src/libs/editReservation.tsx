export default async function editReservation(
  rentTo: Date,
  rentDate: Date,
  id: string,
  token: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/rentings/${id}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rentTo: rentTo,
        rentDate: rentDate,
        returned: false,
      }),
    }
  );

  if (!response.status) {
    console.log(response);
  }
  return response.json();
}
