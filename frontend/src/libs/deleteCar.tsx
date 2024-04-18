export default async function deleteCar(id: string, token: string) {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/cars/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete car");
    }
    return response.json();
  }
  