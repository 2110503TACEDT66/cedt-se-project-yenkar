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
import { Cargo, ReservationItem, Transmission } from "@/index";

const page = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

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
                src={item.car.src ?? "/img/place_holder.jpg"}
                id={item._id}
                name={item.car.model}
                rentDate={new Date(item.rentDate)}
                returnDate={new Date(item.rentTo)}
                carProviderId={item.carProvider._id}
                onRemove={(_id: any) => {}}
                deleteReservation={(_id: any, token: string) =>
                  deleteReservation(_id, token).then((res) => {
                    if (res.status === 200) {
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
                  })
                }
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
    </main>
  );
};

export default page;
