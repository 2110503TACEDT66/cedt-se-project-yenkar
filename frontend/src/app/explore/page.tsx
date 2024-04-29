"use client";
import ExplorePanel from "@/components/ExplorePanel";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import getAllCarProviders from "@/libs/getAllCarProviders";
import getAllCars from "@/libs/getAllCars";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import ProviderPanel from "@/components/ProviderPanel";
import getAvailableCars from "@/libs/getAvailableCars";
import { CommandMenu } from "@/components/CommandMenu";
const page = () => {
  //const carProviders = getAllCarProviders();
  const carJson = getAllCars();
  const providerJson = getAvailableCars();
  const { data: session } = useSession();
  const [showCar, setShowCar] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main>
      <CommandMenu session={session} />
      <NavBar stickyState={isSticky} session={session} className="z-50" />
      <div className="flex flex-col items-center">
        <div className="flex flex-row w-[93%] p-6  items-center justify-between">
          <h1 className="text-3xl font-Poppins text-white">
            {!showCar ? (
              <div>Explore the Available Cars</div>
            ) : (
              <div>Explore the Car Providers</div>
            )}
          </h1>
          <div className="flex flex-row items-center">
            <div
              className={
                showCar
                  ? "text-zinc-400 text-xl mr-5"
                  : "text-white text-xl font-bold mr-5"
              }
            >
              Car
            </div>
            <div onClick={() => setShowCar(!showCar)}>
              <div className="relative w-10 h-10">
                <Image
                  className="invert hover:scale-110 transition duration-100 ease-in-out cursor-pointer"
                  src={showCar ? "/img/toggleright.svg" : "/img/toggleleft.svg"}
                  alt="togglepic"
                  fill={true}
                />
              </div>
            </div>
            <div
              className={
                showCar
                  ? "text-white text-xl font-bold ml-5"
                  : "text-zinc-400 text-xl ml-5"
              }
            >
              Car Provider
            </div>
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
