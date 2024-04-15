export default async function getCarForOneProvider(pid: string, token?: string) {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/carproviders/${pid}/cars`,
      {
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch car providers");
    }
    return response.json();
  }
  