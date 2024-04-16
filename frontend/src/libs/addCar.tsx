export default async function addCar(token:string,pid:string,brand:string,model:string,price:number,src?:string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/carproviders/${pid}/cars`,{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            authorization:`Bearer ${token}`
        },
        body: JSON.stringify({
            brand : brand,
            model : model,
            price : price,
            src : src
        }),
    })
    if(!response.ok){
        throw new Error("failed to add booking") 
    }
    return await response.json()
}