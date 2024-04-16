"use client";
import ExploreCard from "@/components/ExploreCard";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import getSingleCarProvider from "@/libs/getSingleCarProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import CarProviderCard from "@/components/CarProviderCard";
const page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSticky, setIsSticky] = useState(false);
  const [providerData, setproviderData] = useState<CarProvider>();
  const [userProfile, setUserProfile] = useState();
  const { toast } = useToast();
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    const fetchData = async () => {
      const providerJson = await getSingleCarProvider(params.id);
      setproviderData(providerJson.data)
    };
    fetchData();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [providerData]);

  if (!session || !session.user.token) {
    router.push("/sign-in");
    return null;
  }
  return (
    <main>
      <NavBar
        stickyState={false}
        showSignIn={false}
        session={session ? true : false}
      />
      ;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-evenly items-center">
          <div className=" w-[25%] h-[100%] flex flex-col relative justify-center items-center">
            <div className=" w-full h-[80%]  flex flex-col relative">
              <CarProviderCard 
              name={providerData?.name}
              address={providerData?.address}
              telephone={providerData?.telephone}/>
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[65%] h-[100%] flex flex-col relative ">
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Provider Name</h1>
              <h1 className="text-5xl font-poppins text-white">
                {providerData?.name ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Location</h1>
              <h1 className="text-4xl font-poppins text-white">
                {providerData?.address ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Phone</h1>
              <h1 className="text-4xl font-poppins text-white">
                {providerData?.telephone ?? ""}
              </h1>
            </div>

            <div className="w-full h-[1px] flex flex-col items-center mt-10">
              <div className="bg-white w-[95%] h-full"></div>
            </div>
            <div className="flex flex-col w-full h-fit p-6 justify-center">
              <div className="flex flex-row w-full h-fit justify-end">
                <h1 className="text-4xl font-kiona text-white">
                  Avaliable Car
                </h1>
              </div>

              <div className="flex flex-row pt-5">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
