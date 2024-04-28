export default async function createPaymentTransaction(token:string,amount:number,buyerId:string,sellerId:string,rentingId:string) {
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/paymenttransactions`,{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            authorization:`Bearer ${token}`
        },
        body: JSON.stringify({
            amount : amount,
            buyerId : buyerId,
            sellerId : sellerId,
            rentingId : rentingId
        }),
    })
    if(!response.ok){
        throw new Error("failed to create payment transaction") 
    }
    return await response.json()
}