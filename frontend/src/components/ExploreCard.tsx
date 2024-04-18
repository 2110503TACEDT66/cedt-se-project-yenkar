"ues client";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import React from "react";

const ExploreCard = ({
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
          src={src!}
          fill={true}
          className="w-full h-full rounded-xl object-cover"
        />
      </div>
      <div className="bg-white rounded-b-lg w-full h-[30%] absolute bottom-0 flew flex-col">
        <div className="text-black pt-5 pl-7">
          <h1 className="text-2xl font-poppins font-bold">{model}</h1>
        </div>
        <div className="text-black pt-1 pl-7">
          <h1 className="text-xl font-poppins font-bold">{brand}</h1>
        </div>
        <div className="text-black pt-2 pl-7">
          <h1 className="text-lg font-poppins font-normal">{`${carProvider?.address} | ${price} Bath`}</h1>
          <h1 className="text-lg mt-1 font-poppins font-normal">{`📞${carProvider?.telephone}`}</h1>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
