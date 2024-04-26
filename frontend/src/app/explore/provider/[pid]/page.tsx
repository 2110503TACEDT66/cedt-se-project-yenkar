"use client";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import getSingleCarProvider from "@/libs/getSingleCarProvider";
import { useRouter } from "next/navigation";
import CarProviderCard from "@/components/CarProviderCard";
import getCarForOneProvider from "@/libs/getCarForOneProvider";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import ProviderCard from "@/components/ProviderCard";
import ExploreCard from "@/components/ExploreCard";
const page = ({ params }: { params: { pid: string } }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [providerData, setproviderData] = useState<CarProvider>();
  const [carArray, setCarArray] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      const providerJson = getSingleCarProvider(params.pid).then((res) => {
        setproviderData(res.data);
      });
    };
    const fetchCarForProvider = () => {
      const cars = getCarForOneProvider(params.pid).then((res) => {
        setCarArray(res.data);
      });
    };
    fetchData();
    fetchCarForProvider();
  }, []);

  if (!session || !session.user.token) {
    router.push("/sign-in");
    return null;
  }
  console.log(carArray);
  return (
    <main>
      <NavBar stickyState={false} session={session} />;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-evenly items-center">
          <div className=" w-[30%] h-[100%] flex flex-col relative justify-center items-center">
            <div className=" w-full h-[80%]  flex flex-col relative">
              <ProviderCard
                _id={providerData?._id!}
                name={providerData?.name!}
                address={providerData?.address!}
                telephone={providerData?.telephone!}
                src={providerData?.src!}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[65%] h-[100%] flex flex-col relative overflow-y-scroll overflow-x-hidden">
            <div className="pt-5">
              <div className=" w-full h-fit flex flex-col  space-y-3 pt-9 pl-6 mb-5">
                <h1 className="text-4xl font-kiona text-white">
                  Store Information
                </h1>
                <div className="flex flex-row gap-1 items-baseline pt-3">
                  <h1 className="text-xl font-kiona text-white">name |</h1>
                  <h1 className="text-xl font-poppins  font-bold text-white">
                    {providerData?.name ?? ""}
                  </h1>
                </div>
                <div className="pt-3 grid grid-cols-3 ">
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-white">address |</h1>
                    <h1 className="text-xl font-poppins  font-bold text-white">
                      {providerData?.address ?? ""}
                    </h1>
                  </div>{" "}
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-white">
                      telephone |
                    </h1>
                    <h1 className="text-xl font-poppins  font-bold text-white">
                      {providerData?.telephone.slice(0, 3) +
                        "-" +
                        providerData?.telephone.slice(3, 6) +
                        "-" +
                        providerData?.telephone.slice(6, 10) ?? ""}
                    </h1>
                  </div>{" "}
                  {/* <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-white">price |</h1>
                    <h1 className="text-xl font-poppins text-white">
                      {carData?.price ?? ""}
                    </h1>
                  </div> */}
                </div>
              </div>
              <div className="w-[95%] h-[1px] flex flex-col  mt-10 bg-white"></div>
            </div>

            <div className="flex flex-col w-full h-fit p-6 justify-center">
              <div className="flex flex-row w-full h-fit justify-end">
                <h1 className="text-4xl font-kiona text-white">
                  Available Car
                </h1>
              </div>

              <div className="grid grid-cols-2 w-full h-full mt-10 ml-5">
                {carArray
                  ? carArray.map((carItem: CarItem) => (
                      //  <AvaliableCarCard _id={carItem._id} src={carItem.src} model={carItem.model} brand={carItem.brand} price={carItem.price} carProvider={carItem.carProvider}/>
                      <Link
                        href={`/reserve?pid=${providerData?._id}&cid=${carItem._id}`}
                      >
                        <div className="w-[90%] h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow ">
                          <CarProviderCard
                            _id={carItem._id}
                            src={carItem.src}
                            model={carItem.model}
                            brand={carItem.brand}
                            price={carItem.price}
                            carProvider={carItem.carProvider}
                          />
                        </div>
                      </Link>
                    ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
