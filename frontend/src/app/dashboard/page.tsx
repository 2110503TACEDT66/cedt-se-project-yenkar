"use client";

import NavBar from "@/components/NavBar";
import { getServerSession } from "next-auth";
import React, { useEffect, useState } from "react";
import getMe from "@/libs/getMe";
import { redirect, useRouter } from "next/navigation";
import { authOptions } from "@/libs/auth";
import { useSession } from "next-auth/react";
import getUserReservation from "@/libs/getUserReservation";
import { CldImage } from "next-cloudinary";
import { format, set } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionHis from "@/components/TransactionHisCard";
import { getTransactions } from "@/libs/transaction.action";
import TransactionHisCard from "@/components/TransactionHisCard";

interface Profile {
  data: {
    email: string;
    telephone: string;
    address: string;
    balance: number;
  };
}

interface ReservationItem {
  _id: string;
  rentDate: string;
  rentTo: string;
  user: User;
  carProvider: CarProvider;
  createAt: string;
  returned: boolean;
  __v: number;
  car: CarItem;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const page = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reservation, setReservation] = useState<ReservationItem[] | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingCar, setIsLoadingCar] = useState(true);
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionHis[] | null>(null);

  const fetchHistory = (token: string) => {
    getTransactions(token).then((res) => {
      console.log(res);
      setTransaction(res.data);
    });
  };

  const fetchData = (token: string) => {
    const userProfile = getMe(token).then((res) => {
      setProfile(res);
      setIsLoadingProfile(false);
    });
  };

  const fetchReservation = (token: string) => {
    getUserReservation(token).then((res) => {
      console.log(res);
      setReservation(res.data);
      setIsLoadingCar(false);
    });
  };

  if (!session || !session.user.token) {
    redirect("/sign-in");
  }

  useEffect(() => {
    fetchData(session.user.token);
    fetchReservation(session.user.token);
    fetchHistory(session.user.token);
  }, []);

  return (
    <main>
      <NavBar stickyState={false} session={session} />
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-evenly items-start">
          <div className=" basis-[25%] h-fit">
            <div className="flex flex-col w-full h-full py-6 justify-between">
              <div className="py-6 h-full w-full bg-[#0b0c0c] shadow-lg  rounded-lg">
                {isLoadingProfile ? (
                  <div>
                    <div className="px-8 py-2">
                      <div className="text-xl text-white font-kiona">
                        Profile
                      </div>
                      <h1 className="text-3xl text-white  font-poppins pt-2 pb-4">
                        {session.user.name}
                      </h1>
                      <div className="grid grid-cols-3 justify-center items-start gap-y-2">
                        <h1 className="text-zinc-400 text-xl">Email </h1>
                        <Skeleton className="text-white text-xl col-span-2 break-words bg-zinc-700 w-30 h-8"></Skeleton>
                        <h1 className="text-zinc-400 text-xl">Address </h1>
                        <Skeleton className="text-white text-xl col-span-2 break-words bg-zinc-700 w-30 h-8"></Skeleton>
                        <h1 className="text-zinc-400 text-xl">Telephone </h1>
                        <Skeleton className="text-white text-xl col-span-2 bg-zinc-700 w-30 h-8"></Skeleton>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-8 py-2">
                    <h1 className="text-xl text-white font-kiona">Profile</h1>
                    <h1 className="text-3xl text-white  font-poppins pt-2 pb-4">
                      {session.user.name}
                    </h1>
                    <div className="grid grid-cols-3 justify-center items-start gap-y-2">
                      <h1 className="text-zinc-400 text-xl font-kiona">
                        Email{" "}
                      </h1>
                      <h1 className="text-white text-xl col-span-2 break-words">
                        {profile?.data.email}
                      </h1>
                      <h1 className="text-zinc-400 text-xl font-kiona">
                        Address{" "}
                      </h1>
                      <h1 className="text-white text-xl col-span-2 break-words">
                        {profile?.data.address}
                      </h1>
                      <h1 className="text-zinc-400 text-xl font-kiona">
                        Telephone{" "}
                      </h1>
                      <h1 className="text-white text-xl col-span-2 ">
                        {profile?.data.telephone.slice(0, 3) +
                          "-" +
                          profile?.data.telephone.slice(3, 6) +
                          "-" +
                          profile?.data.telephone.slice(6, 10)}
                      </h1>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className=" basis-[45%] h-full">
            <div className="flex flex-col w-full h-full py-6 justify-between">
              <div className="py-6 h-full w-full bg-[#0b0c0c] shadow-lg rounded-lg">
                <div className="px-8 py-2 h-full">
                  <div className="w-full flex flex-row justify-between">
                    <h1 className="text-xl text-white font-kiona">
                      Reservation
                    </h1>
                    <h1 className="text-xl text-white font-kiona">
                      {reservation?.length}/3
                    </h1>
                  </div>
                  <div className="flex flex-col w-full h-full py-2  gap-3">
                    {isLoadingCar ? (
                      <>
                        <Skeleton className="w-full h-[33%] rounded-2xl bg-zinc-700"></Skeleton>
                        <Skeleton className="w-full h-[33%] rounded-2xl bg-zinc-700"></Skeleton>
                        <Skeleton className="w-full h-[33%] rounded-2xl bg-zinc-700"></Skeleton>
                      </>
                    ) : (
                      reservation?.map((item) => (
                        <Link
                          className="w-full h-[33%]"
                          href={`/reserve?pid=${item.carProvider._id}&cid=${item.car._id}`}
                        >
                          <div
                            key={item._id}
                            className="flex flex-row justify-between items-center bg-[#17191C] w-full h-full rounded-2xl hover:scale-[101%] transition-all duration-300 ease-in-out group hover:bg-white hover:cursor-pointer active:duration-75 active:scale-100"
                          >
                            <div className="w-[35%] h-full relative shadow-lg">
                              <CldImage
                                src={item.car.src!}
                                alt="car"
                                fill={true}
                                className="rounded-l-2xl object-cover"
                              />
                            </div>
                            <div className="w-[65%] h-full flex flex-col p-5 relative group-hover:invert">
                              <h1 className="text-white font-poppins text-xl">
                                {item.car.model}
                              </h1>
                              <h1 className="text-white">
                                <span className="font-kiona">Provider | </span>
                                {item.carProvider.name}
                              </h1>
                              <div className="grid grid-cols-3 text-white justify-center absolute bottom-6">
                                <h1 className="font-kiona">Pickup Date </h1>
                                <h1 className="justify-self-center">{}</h1>
                                <h1 className="font-kiona">Return Date </h1>
                                <h1>
                                  {format(
                                    new Date(item.rentDate),
                                    "MMMM do, yyyy"
                                  )}
                                </h1>
                                <h1 className="justify-self-center">-</h1>
                                <h1>
                                  {format(
                                    new Date(item.rentTo),
                                    "MMMM do, yyyy"
                                  )}
                                </h1>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}

                    {reservation?.length! < 3 && (
                      <div
                        onClick={() => router.push("/explore")}
                        className="flex flex-col justify-center items-center bg-[#17191C] w-full h-[33%] rounded-2xl hover:invert hover:scale-[101%] transition-all duration-300 ease-in-out hover:cursor-pointer active:duration-75 active:scale-100"
                      >
                        <Image
                          alt="car"
                          src="img/plus_sign.svg"
                          width={40}
                          height={40}
                        />
                        <h1 className="text-white font-kiona pt-2">
                          Add more reservation
                        </h1>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" basis-[25%] h-full">
            <div className="flex flex-col w-full h-full py-6 justify-between">
              <div className="bg-[#0b0c0c] shadow-lg h-[28%] w-full rounded-lg py-6">
                <div className="px-8 py-2 h-full">
                  <h1 className="text-xl text-white font-kiona">
                    Current Balance
                  </h1>
                  <div className="flex flex-col w-full h-full justify-center pb-8">
                    <div className="flex flex-row gap-3 w-full h-fit justify-start items-center">
                      {isLoadingProfile ? (
                        <Skeleton className="text-xl text-white font-poppins bg-zinc-700 w-20 h-10"></Skeleton>
                      ) : (
                        <h1 className="text-xl text-white font-poppins">
                          <span>$ </span> {profile?.data.balance}
                        </h1>
                      )}

                      <button
                        onClick={() => router.push("/balance")}
                        className="py-1  px-2 text-white bg-[#0b0c0c] rounded-lg border-[0.5px] border-white hover:invert hover:scale-[103%] transition-all duration-300 ease-in-out active:scale-100 active:duration-100 font-kiona"
                      >
                        Add more
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#0b0c0c] shadow-lg h-[70%] w-full rounded-lg py-6">
                <div className="px-8 py-2 h-full">
                  <h1 className="text-xl text-white font-kiona pb-2">
                    Transaction History
                  </h1>
                  <div className=" w-full h-[95%] flex flex-col gap-1 overflow-y-scroll">
                    {transaction?.map((transaction) => (
                      <div
                        key={transaction._id}
                        className=" w-full h-fit bg-[#17191C] rounded-lg"
                      >
                        <TransactionHisCard
                          type={transaction.type}
                          _id={transaction?._id!}
                          amount={transaction?.amount!}
                          createdAt={transaction?.createdAt!}
                          stripeId={transaction?.stripeId!}
                          userId={transaction?.userId!}
                          carProviderId={transaction?.carProviderId!}
                          direction={transaction?.direction!}
                          currentUserId={session.user._id}
                          userRole={session.user.role}
                        />
                      </div>
                    ))}
                    <div className=" w-full h-[25%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
