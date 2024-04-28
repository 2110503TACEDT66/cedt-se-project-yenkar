export default function deleteReservation(id: string, token?: string) {
  const response = fetch(`${process.env.BACKEND_URL}/api/v1/rentings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}
