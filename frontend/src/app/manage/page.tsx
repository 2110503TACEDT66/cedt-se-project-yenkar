"use client";

import NavBar from "@/components/NavBar";
import React, { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import ManageCard from "@/components/ManageCard";
import { useSession } from "next-auth/react";
import getUserReservation from "@/libs/getUserReservation";
import deleteReservation from "@/libs/deleteReservation";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CommandMenu } from "@/components/CommandMenu";
import { Cargo, CarItem, ReservationItem, Transmission } from "@/index";

const page = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingPromise, setDeletingPromise] =
    useState<Promise<Response> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletingCar, setDeletingCar] = useState<CarItem>();

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
    const fetchReservation = () => {
      const res = getUserReservation(session?.user.token).then((res) => {
        userReservationDispatch({ type: "ADD", payload: res.data });
        setIsLoading(false);
      });
    };

    fetchReservation();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const isAdmin = session?.user.role === "admin";
  console.log(userReservationState);
  return (
    <main>
      <CommandMenu session={session} />
      <NavBar stickyState={isSticky} session={session} />
      {isDeleting ? (
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
                    {!isProcessing && (
                      <>{deletingCar?.price!}$ IS ADDED TO YOUR BALANCE</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <div className=" rounded-xl w-[90vw] h-[80vh] flex flex-col justify-start space-y-4 items-center">
            <div className="w-full flex flex-row justify-end py-1 text-black text-2xl font-kiona relative">
              <h1 className="bg-white rounded-lg px-4 absolute top-[-40px] z-20">
                {`${userReservationState.length}/3`}
              </h1>
            </div>
            {isLoading ? (
              <>
                <Skeleton className="w-[100%] h-[31%] bg-zinc-700" />
                <Skeleton className="w-[100%] h-[31%] bg-zinc-700" />
                <Skeleton className="w-[100%] h-[31%] bg-zinc-700" />
              </>
            ) : (
              userReservationState?.map((item) => (
                <ManageCard
                  key={item._id}
                  src={item.car.src ?? "/img/place_holder.jpg"}
                  id={item._id}
                  name={item.car.model}
                  rentDate={new Date(item.rentDate)}
                  returnDate={new Date(item.rentTo)}
                  carProviderId={item.carProvider._id}
                  onRemove={(_id: any) => {}}
                  deleteReservation={(_id: any, token: string) => {
                    setIsDeleting(true);
                    setDeletingCar(item.car);
                    setIsProcessing(true);
                    deleteReservation(_id, token).then((res) => {
                      if (res.status === 200) {
                        setIsProcessing(false);
                        setTimeout(() => {
                          setIsDeleting(false);
                          setDeletingCar(undefined);
                        }, 3000);
                        toast({
                          title: "Reservation Deleted",
                          description: "Your reservation has been deleted",
                          duration: 3000,
                        });

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
                                telephone: "",
                                src: "",
                              },
                              car: {
                                _id: "",
                                brand: "",
                                model: "",
                                price: 0,
                                src: "",
                                air: true,
                                cargo: Cargo.large,
                                doors: 0,
                                radio: true,
                                seats: 0,
                                transmission: Transmission.auto,
                                id: "",
                                vrm: "",
                                carProvider: {
                                  _id: "",
                                  name: "",
                                  address: "",
                                  telephone: "",
                                  src: "",
                                },
                              },
                              createAt: "",
                              returned: false,
                              __v: 0,
                            },
                          ],
                        });
                      } else {
                        const errorMess = res.json().then((res) => res.message);
                        toast({
                          title: "Reservation Delete Failed",
                          description: errorMess ?? "Something went wrong!",
                          variant: "destructive",
                          duration: 3000,
                        });
                      }
                    });
                  }}
                  carId={item.car._id}
                  adminView={isAdmin}
                  userName={item.user.name}
                />
              ))
            )}

            {isLoading ? (
              ""
            ) : userReservationState.length < 3 ? (
              <div className="w-full h-[31%] bg-[#3c4047] flex flex-col items-center justify-center">
                <div
                  className="w-fit h-fit flex flex-col items-center hover:scale-105 transition duration-150 ease-in-out active:scale-100 hover:font-bold"
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
                  <h1 className="text-white font-Poppins pt-6">
                    Add More Reservation
                  </h1>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default page;
