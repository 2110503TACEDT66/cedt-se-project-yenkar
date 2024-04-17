'use client'
import ExplorePanel from "@/components/ExplorePanel";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/libs/auth";
import getAllCarProviders from "@/libs/getAllCarProviders";
import getAllCars from "@/libs/getAllCars";
import { getServerSession } from "next-auth";
import React, { useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import ProviderPanel from "@/components/ProviderPanel";
const page =  () => {
  //const carProviders = getAllCarProviders();
  const carJson = getAllCars();
  const providerJson = getAllCarProviders();
  const {data : session} = useSession();
  const [showCar, setShowCar] = useState(true);



  return (
    <main>
      <NavBar
        stickyState={false}
        showSignIn={session? false : true}
        session={session? false : true}
      />
      <div className="flex flex-col items-center">
        <div className="flex flex-row w-[93%] p-6  items-center justify-between">
          <h1 className="text-3xl font-poppins text-white">
            Explore the Available Cars
          </h1>
          <div className="flex flex-row items-center">
          <div className="text-white text-xl mr-5">Car</div>
          <div onClick={()=>setShowCar(!showCar)}><Image src={showCar? '/img/toggleright.svg':'/img/toggleleft.svg'} alt='togglepic' width={100} height={100}/></div>
          <div className="text-white text-xl ml-5">Car Provider</div>
          </div>
          <Input
            placeholder="Search"
            type="text"
            className="w-1/4 h-12 rounded-2xl bg-[#1E1E1E] text-white hidden"
          />
        </div>
        {showCar?  <ProviderPanel providerJson={providerJson}/>:<ExplorePanel carJson={carJson} />}
        
      </div>
    </main>
  );
};

export default page;
