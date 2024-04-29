"use client";
import ExplorePanel from "@/components/ExplorePanel";
import NavBar from "@/components/NavBar";
import getAllCarProviders from "@/libs/getAllCarProviders";
import getAllCars from "@/libs/getAllCars";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import ProviderPanel from "@/components/ProviderPanel";
import getAvailableCars from "@/libs/getAvailableCars";
import { CommandMenu } from "@/components/CommandMenu";
import { Input } from "@/components/ui/input";

const page = () => {
  //const carProviders = getAllCarProviders();
  const carJson = getAllCars();
  const providerJson = getAvailableCars();
  const { data: session } = useSession();
  const [showCar, setShowCar] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [query, setQuery] = useState("");
  const [inputField, setInputField] = useState("");

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

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const handleChange = ({ query }: { query: string }) => {
    debounce(() => {
      setQuery(query);
    }, 500)();
  };

  return (
    <main>
      <CommandMenu session={session} />
      <NavBar stickyState={isSticky} session={session} className="z-50" />
      <div className="flex flex-col items-center">
        <div className="flex flex-row w-[93%] p-6  items-center justify-between relative">
          <h1 className="text-3xl font-Poppins text-white">
            {!showCar ? (
              <div>Explore the Available Cars</div>
            ) : (
              <div>Explore the Car Providers</div>
            )}
          </h1>
          <div className="absolute w-full h-full flex flex-col justify-center items-center">
            <Input
              value={inputField}
              placeholder="What are you looking for?"
              onChange={(event) => {
                handleChange({ query: event.target.value });
                setInputField(event.target.value);
              }}
              className="w-[30%] h-10 bg-zinc-600 rounded-2xl text-white"
            ></Input>
          </div>
          <div className="flex flex-row items-center ">
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
          <ProviderPanel providerJson={providerJson} query={query} />
        ) : (
          <ExplorePanel carJson={carJson} query={query} />
        )}
      </div>
    </main>
  );
};

export default page;
