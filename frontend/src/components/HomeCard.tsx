import Image from "next/image";
import React from "react";

const HomeCard = ({
  src,
  alt,
  text,
  onClick,
}: {
  src: string;
  alt: string;
  text: string;
  onClick?: Function;
}) => {
  return (
    <div
      onClick={onClick ? () => onClick() : () => {}}
      className="bg-white w-[35rem] h-[45rem] rounded-lg relative flex items-center justify-center hover:scale-105 transition duration-300 ease-in-out"
    >
      <Image
        alt={alt}
        src={src}
        fill={true}
        className="object-cover rounded-lg"
      />
      <div className="h-fit w-fit bg-white-400 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 hover:scale-105 transition duration-300 ease-in-out hover:backdrop-blur-3xl">
        <div className=" p-5">
          <button className="text-white font-bold text-xl">{text}</button>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
