"ues client";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import React from "react";
import { CarProps } from "..";

const CarProviderCard = ({
  _id,
  src,
  model,
  brand,
  price,
  carProvider,
}: CarProps) => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-[75%] relative">
        <CldImage
          alt="image"
          src={src ?? "YenKar/ivrxoeccbri8gxjb4pnx"}
          fill={true}
          className="w-full h-full rounded-xl object-cover"
          sizes="33vw"
          priority={true}
        />
      </div>
      <div className="bg-white rounded-b-lg w-full h-[30%] absolute bottom-0 flew flex-col">
        <div className="relative">
          <div className="absolute -top-16 right-4">
            <h1
              className="font-kiona font-bold p-3 drop-shadow-lg
            bg-black bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 rounded-xl text-white "
            >{`${price} $`}</h1>
          </div>
          <div className="text-black pt-5 pl-7">
            <h1 className="text-2xl font-Poppins font-bold">{model}</h1>
          </div>
          <div className="grid grid-cols-2 px-7 py-1 text-black gap-y-1">
            <div className="col-span-2">
              <h1 className="font-Poppins">
                <span className="font-kiona text-lg">BRAND | </span> {brand}
              </h1>
            </div>
            {/* <div>
              <h1 className="font-Poppins">
                <span className="font-kiona text-lg">PRICE | </span>{" "}
                {`${price} $`}
              </h1>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarProviderCard;
