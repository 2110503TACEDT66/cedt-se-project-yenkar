import Image from "next/image"
export default function CarProviderCard({name,address, telephone }:CarProvider) {
    return(
        <div className="w-full h-full">
      <div className="w-full h-[75%] relative">
        <Image
          alt="image"
          fill={true}
          src={"/img/car_placeholder.png"}
          className="object-cover rounded-lg"
        />
      </div>
      <div className="bg-white rounded-b-lg w-full h-[30%] absolute bottom-0 flew flex-col">
        <div className="text-black pt-5 pl-7">
          <h1 className="text-2xl font-poppins font-bold">{name}</h1>
        </div>
        <div className="text-black pt-2 pl-7">
          <h1 className="text-lg font-poppins font-normal">{`${address} | ${telephone}`}</h1>
        </div>
      </div>
    </div>
    )
}