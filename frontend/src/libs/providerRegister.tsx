export default async function providerRegister(name:string, telephone:string, address:string, email:string, password:string) {

    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/register/carProvider`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  
        },
        body: JSON.stringify({
            email,
            password,
            name,
            address,
            telephone,
        })
    });

    if (!response.ok) {
        throw new Error("Failed to register");
    }

    return await response.json();
}