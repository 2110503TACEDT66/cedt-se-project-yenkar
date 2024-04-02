"use client";

import ExploreCard from "@/components/ExploreCard";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import React, { useEffect, useReducer, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { any, z } from "zod";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import ManageCard from "@/components/ManageCard";
import { useSession } from "next-auth/react";
import getUserReservation from "@/libs/getUserReservation";
import getSingleCarProvider from "@/libs/getSingleCarProvider";
import getAllCarProviders from "@/libs/getAllCarProviders";
import deleteReservation from "@/libs/deleteReservation";
import { useRouter } from "next/navigation";
import { ro } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface ReservationItem {
  _id: string;
  rentDate: string;
  rentTo: string;
  user: User;
  carProvider: CarProvider;
  createAt: string;
  returned: boolean;
  __v: number;
}

interface CarProvider {
  _id: string;
  name: string;
  address: string;
  price: number;
  telephone: string;
  id: string;
  src: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const page = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const { toast } = useToast();

  if (!session) {
    router.push("/sign-in");
  }

  const reservationReducer = (
    state: Array<ReservationItem>,
    action: { type: string; payload: Array<ReservationItem> }
  ) => {
    switch (action.type) {
      case "ADD":
        const newState = new Array<ReservationItem>();
        action.payload.forEach((item: ReservationItem) => {
          newState.push(item);
        });
        return newState;
      case "REMOVE":
        return state.filter(
          (item: ReservationItem) => item._id !== action.payload[0]._id
        );
      default:
        return state;
    }
  };

  const [userReservationState, userReservationDispatch] = useReducer(
    reservationReducer,
    []
  );
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    const fetchReservation = async () => {
      const res = await getUserReservation(session?.user.token);
      userReservationDispatch({ type: "ADD", payload: res.data });
    };

    fetchReservation();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isAdmin = session?.user.role === "admin";
  console.log(isAdmin);
  console.log(userReservationState);
  return (
    <main>
      <NavBar
        stickyState={isSticky}
        showSignIn={false}
        session={session ? true : false}
      />
      <div className="flex flex-col items-center ">
        <div className=" rounded-xl w-[90vw] h-[80vh] flex flex-col justify-start space-y-4 items-center">
          <div className="w-full flex flex-row justify-end py-1 text-black text-2xl font-kiona relative">
            <h1 className="bg-white rounded-lg px-4 absolute top-[-40px] z-20">
              {`${userReservationState.length}/3`}
            </h1>
          </div>
          {userReservationState.map((item) => (
            <ManageCard
              src={item.carProvider.src}
              id={item._id}
              name={item.carProvider.name}
              rentDate={new Date(item.rentDate)}
              returnDate={new Date(item.rentTo)}
              onRemove={(_id: any) => {
                userReservationDispatch({
                  type: "REMOVE",
                  payload: [
                    {
                      _id,
                      rentDate: "",
                      rentTo: "",
                      user: {
                        _id: "",
                        name: "",
                        email: "",
                      },
                      carProvider: {
                        _id: "",
                        name: "",
                        address: "",
                        price: 0,
                        telephone: "",
                        id: "",
                        src: "",
                      },
                      createAt: "",
                      returned: false,
                      __v: 0,
                    },
                  ],
                });
              }}
              deleteReservation={(_id: any, token: string) =>
                deleteReservation(_id, token).then(() =>
                  toast({
                    title: "Reservation Deleted",
                    description: "Your reservation has been deleted",
                    duration: 3000,
                  })
                )
              }
              carId={item.carProvider._id}
              adminView={isAdmin}
              userName={item.user.name}
            />
          ))}
          {userReservationState.length < 3 ? (
            <div className="w-full h-[31%] bg-[#3c4047] flex flex-col items-center justify-center">
              <div
                className="w-fit h-fit flex flex-col items-center hover:scale-105 transition duration-150 ease-in-out active:scale-100"
                onClick={(e) => {
                  router.push("/explore");
                }}
              >
                <Image
                  src="/img/plus_sign.svg"
                  alt="plus"
                  width={50}
                  height={50}
                />
                <h1 className="text-white pt-6">Add More Reservation</h1>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </main>
  );
};

export default page;
