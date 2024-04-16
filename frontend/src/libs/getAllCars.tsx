export default async function getAllCars() {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/cars`,
      {cache:'no-store'}
    );
    if (!response.ok) {
      throw new Error("Failed to fetch car providers");
    }
    return response.json();
  }
  