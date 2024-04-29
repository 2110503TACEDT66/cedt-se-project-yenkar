import Image from "next/image";
import React from "react";

export const CommandCard = ({
  className,
  src,
  title,
  action,
}: {
  action: string;
  className?: string;
  src?: string;
  title: string;
}) => {
  return (
    <div className=" w-full h-full  bg-black rounded-lg ">
      <div className=" rounded-lg flex flex-row py-3  items-center gap-5 group">
        <div className="ml-3 w-8 h-8 relative">
          <Image alt="" src={src!} fill={true} className="mr- 2 invert " />
        </div>
        <div className="">
          <h1 className="text-white">{title}</h1>
        </div>
      </div>
    </div>
  );
};
