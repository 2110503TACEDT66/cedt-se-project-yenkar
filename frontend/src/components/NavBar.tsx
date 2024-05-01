"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Session } from "next-auth";

const NavBar = ({
  stickyState,
  session,
  className,
}: {
  stickyState: boolean;
  session?: Session | null;
  className?: string;
}) => {
  const router = useRouter();
  const isSticky = stickyState;
  return (
    <div className={`py-12  sticky top-[-3rem] z-[40] ${className}`}>
      <div
        className={`flex flex-row  justify-between items-center px-12 h-20 ${
          isSticky
            ? "top-0 bg-white transition duration-300 ease-in-out shadow-xl"
            : "top-[-2rem] transition duration-300 ease-in-out"
        }`}
      >
        <div className="flex flex-row items-center">
          <Link href={"/"}>
            <Image
              alt="logo"
              src={`${
                isSticky
                  ? "/img/yenkor_logo_black.png"
                  : "/img/yenkor_logo_trans.png"
              }`}
              width={255}
              height={55}
              className="z-40 hover:scale-110 transition duration-300 ease-in-out w-auto h-auto"
              priority={true}
            />
          </Link>

          <div className="flex flex-row space-x-8 ml-12">
            <button
              onClick={() => router.push("/")}
              className={`font-normal text-xl hover:font-bold hover:scale-105 transition duration-300 ease-in-out active:font-normal ${
                isSticky ? "text-black  " : "text-white"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => router.push("/explore")}
              className={`font-normal text-xl hover:font-bold hover:scale-105 transition duration-300 ease-in-out active:font-normal ${
                isSticky ? "text-black  " : "text-white"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => router.push("/manage")}
              className={`font-normal text-xl hover:font-bold hover:scale-105 transition duration-300 ease-in-out active:font-normal ${
                isSticky ? "text-black  " : "text-white"
              }`}
            >
              Reservation
            </button>
            {session?.user.role === "carProvider" ? (
              <button
                onClick={() => router.push("/mystore")}
                className={`font-normal text-xl hover:font-bold hover:scale-105 transition duration-300 ease-in-out active:font-normal ${
                  isSticky ? "text-black  " : "text-white"
                }`}
              >
                My Store
              </button>
            ) : (
              ""
            )}

            {session && (
              <button
                onClick={() => router.push("/dashboard")}
                className={`font-normal text-xl hover:font-bold hover:scale-105 transition duration-300 ease-in-out active:font-normal ${
                  isSticky ? "text-black  " : "text-white"
                }`}
              >
                Dashboard
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-row space-x-4">
          {!session ? (
            <button
              onClick={() => router.push("/sign-in")}
              className={`px-6 py-2 rounded-md font-bold shadow-lg
            ${
              isSticky
                ? "bg-gray-900 text-white hover:bg-gray-600 transition duration-300 ease-in-out hover:scale-105 active:bg-gray-600 active:scale-95 active:shadow-inner"
                : "bg-white text-black hover:bg-gray-300 hover:scale-105 transition duration-300 ease-in-out active:bg-gray-300 active:scale-95 active:shadow-inner"
            }`}
            >
              Sign in
            </button>
          ) : (
            ""
          )}

          {session ? (
            <Popover>
              <PopoverTrigger>
                <Image
                  alt="profile"
                  src={`${
                    isSticky ? "/img/profileblack.png" : "/img/profile.png"
                  }`}
                  width={30}
                  height={30}
                  className="z-40 hover:scale-110 transition duration-300 ease-in-out w-auto h-auto"
                  priority={true}
                />
              </PopoverTrigger>
              <PopoverContent className="bg-white w-36 p-3 mr-3 mt-3 flex flex-col space-y-4">
                <button
                  className="p-2 hover:bg-slate-300 rounded-md text-black"
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="p-2 hover:bg-slate-300 rounded-md text-black"
                  onClick={() => {
                    router.push("/balance");
                  }}
                >
                  Balance
                </button>

                <button
                  className="p-2 hover:bg-slate-300 rounded-md text-black"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sign-out
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
