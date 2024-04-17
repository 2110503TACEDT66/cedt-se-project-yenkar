"use client";
import ExploreCard from "@/components/ExploreCard";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import getSingleCarProvider from "@/libs/getSingleCarProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import CarProviderCard from "@/components/CarProviderCard";
import getCarForOneProvider from "@/libs/getCarForOneProvider";
// import AvaliableCarCard from "@/components/AvaliableCarCard";
import Image from "next/image";
import getSingleCar from "@/libs/getSingleCar";

// form////
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
///////

const page = ({ params }: { params: { cid: string } }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSticky, setIsSticky] = useState(false);
  const [carItem, setCarItem] = useState<CarItem | null>(null);
  const [userProfile, setUserProfile] = useState();
  const [carArray, setCarArray] = useState([]);
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
      const carJson = await getSingleCar(params.cid);
      setCarItem(carJson.data);
    };
    const fetchCarForProvider = async () => {
      const cars = await getCarForOneProvider(params.cid);
      setCarArray(cars.data);
    };
    fetchData();
    fetchCarForProvider();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [carItem]);

  if (!session || !session.user.token) {
    router.push("/sign-in");
    return null;
  }
  console.log(carArray);

  // form ////

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  ///////////

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
            <div className="w-[25vw] h-[40vh] bg-white  rounded-2xl ">
              <Image
                src={carItem?.src!}
                alt="carpic"
                width={300}
                height={100}
                className="w-full h-52 rounded-t-2xl"
              />
              <div>{carItem?.model!}</div>
              <div>{carItem?.brand!}</div>
              <div>{carItem?.price!}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[65%] h-[100%] flex flex-col relative overflow-y-scroll overflow-x-hidden">
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">model</h1>
              <h1 className="text-5xl font-poppins text-white">
                {carItem?.model ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">brand</h1>
              <h1 className="text-4xl font-poppins text-white">
                {carItem?.brand ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">price</h1>
              <h1 className="text-4xl font-poppins text-white">
                {carItem?.price ?? ""}
              </h1>
            </div>

            <div className="w-full h-[1px] flex flex-col items-center mt-10">
              <div className="bg-white w-[95%] h-full"></div>
            </div>
            <div className="flex flex-col w-full h-fit p-6 justify-center">
              <div className="flex flex-row w-full h-fit justify-end">
                <h1 className="text-4xl font-kiona text-white">
                  manage your car
                </h1>
              </div>
              <div className="flex flex-row gap-4 justify-end pt-5">
                <button
                            onClick={(e) => {
                e.stopPropagation();
                            }}
                            className="py-1 px-5 bg-gradient-to-r from-[#F05B80] to-[#4158F0] text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                }}
                            className="py-1 px-5 bg-rose-600 text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                          >
                            Delete
                          </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
