"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CarItem } from "..";
import getSingleCar from "@/libs/getSingleCar";
import Image from "next/image";

const deleteRefund = ({
  id,
  deletePromise,
}: {
  id: string;
  deletePromise: Promise<Response>;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [car, setCar] = useState<CarItem>();
  const [isProcessing, setIsProcessing] = useState(true);
  const fetchCarData = () => {
    const carData = getSingleCar(id);
    carData.then((res) => {
      console.log(res);
      setCar(res.data);
    });
  };

  useEffect(() => {
    fetchCarData();
    deletePromise.then((res) => {
      if (res.status === 200) {
        setIsProcessing(false);
        setTimeout(() => {
          router.push("/manage");
        }, 500);
      }
    });
  }, []);

  if (!session) {
    router.push("/sign-in");
    return null; // Return null while redirecting
  }

  return (
    <div className="w-full flex flex-row justify-center rounded-2xl font-kiona">
      <div className="bg-[#17191C] w-[88vw] h-[75vh] flex flex-row justify-center rounded-xl">
        <div className="flex flex-col mt-[7%]">
          <div className="flex flex-row gap-10 justify-center mr-16">
            <Image
              src="/img/wallet_svg.svg"
              alt="walletPic"
              width={300}
              height={300}
            />
            <Image
              src="/img/refund_arrow.svg"
              alt="arrowPic"
              width={100}
              height={100}
            />
            <Image
              src="/img/dollar_sign.svg"
              alt="dollarPic"
              width={250}
              height={250}
            />
          </div>
          <div className="">
            <div
              className={` ${
                isProcessing ? "text-white" : "text-[#6dd375]"
              } flex justify-center text-4xl font-bold`}
            >
              {isProcessing ? "Processing" : "REFUND SUCCESSFULLY"}
            </div>
            <div className="text-white flex justify-center text-2xl mt-5">
              {isProcessing
                ? "we are working on Process"
                : "Thanks for choosing Yenkar. We hope to serve you again in the future."}
            </div>
            <div className="flex justify-center">
              <div
                className={`${
                  isProcessing ? "animate-ping" : ""
                } backdrop-brightness-[175%] shadow-2xl drop-shadow-xl backdrop-blur-lg text-white rounded-2xl p-3 mt-7 w-fit flex justify-center text-2xl font-bold `}
              >
                {!isProcessing && <>{car?.price!}$ IS ADDED TO YOUR BALANCE</>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default deleteRefund;
