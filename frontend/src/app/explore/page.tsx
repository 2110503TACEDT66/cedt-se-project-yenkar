"use client";
import ExplorePanel from "@/components/ExplorePanel";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import getAllCarProviders from "@/libs/getAllCarProviders";
import getAllCars from "@/libs/getAllCars";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import ProviderPanel from "@/components/ProviderPanel";
const page = () => {
  //const carProviders = getAllCarProviders();
  const carJson = getAllCars();
  const providerJson = getAllCarProviders();
  const { data: session } = useSession();
  const [showCar, setShowCar] = useState(false);
  return (
    <main>
      <NavBar stickyState={false} session={session} />
      <div className="flex flex-col items-center">
        <div className="flex flex-row w-[93%] p-6  items-center justify-between">
          <h1 className="text-3xl font-poppins text-white">
            {!showCar ? (
              <div>Explore the Available Cars</div>
            ) : (
              <div>Explore the Car Providers</div>
            )}
          </h1>
          <div className="flex flex-row items-center">
            <div className="text-white text-xl mr-5">Car</div>
            <div onClick={() => setShowCar(!showCar)}>
              <div className="relative w-10 h-10">
                <Image
                  className="invert"
                  src={showCar ? "/img/toggleright.svg" : "/img/toggleleft.svg"}
                  alt="togglepic"
                  fill={true}
                />
              </div>
            </div>
            <div className="text-white text-xl ml-5">Car Provider</div>
          </div>
          <Input
            placeholder="Search"
            type="text"
            className="w-1/4 h-12 rounded-2xl bg-[#1E1E1E] text-white hidden"
          />
        </div>
        {showCar ? (
          <ProviderPanel providerJson={providerJson} />
        ) : (
          <ExplorePanel carJson={carJson} />
        )}
      </div>
    </main>
  );
};

export default page;
