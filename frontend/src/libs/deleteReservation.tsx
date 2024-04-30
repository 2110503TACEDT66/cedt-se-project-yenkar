export default function deleteReservation(id: string, token?: string) {
  const response = fetch(`${process.env.BACKEND_URL}/api/v1/rentings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // const response = new Promise<Response>((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(
  //       new Response(
  //         JSON.stringify({
  //           message: "Reservation deleted successfully",
  //         }),
  //         {
  //           status: 200,
  //           statusText: "OK",
  //           headers: {
  //             "Content-type": "application/json",
  //           },
  //         }
  //       )
  //     );
  //   }, 20000);
  // });

  return response;
}
