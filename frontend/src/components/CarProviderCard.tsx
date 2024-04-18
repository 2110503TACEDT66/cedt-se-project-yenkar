import { CldImage } from "next-cloudinary";
import Image from "next/image";
export default function CarProviderCard({
  name,
  address,
  telephone,
  src,
}: {
  name: string;
  address: string;
  telephone: string;
  src: string;
}) {
  return (
    <div className="w-full h-full">
      <div className="w-full h-[75%] relative">
        {/* <Image
          alt="image"
          fill={true}
          src={"/img/place_holder.jpg"}
          className="object-cover rounded-lg"
        /> */}
        <CldImage
          alt="image"
          src={src ?? "YenKar/ivrxoeccbri8gxjb4pnx"}
          fill={true}
          className="w-full h-full rounded-xl object-cover"
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
  );
}
