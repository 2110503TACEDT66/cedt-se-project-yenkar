"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { signOut } from "next-auth/react";
import Link from "next/link";

const NavBar = ({
  stickyState,
  showSignIn,
  session,
}: {
  stickyState: boolean;
  showSignIn: boolean;
  session: boolean;
}) => {
  const router = useRouter();
  const isSticky = stickyState;
  return (
    <div className="py-12  sticky top-[-3rem] z-50">
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
              className="z-50 hover:scale-110 transition duration-300 ease-in-out"
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
          </div>
        </div>

        <div className="flex flex-row space-x-4">
          {showSignIn ? (
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
                  src="/img/profile.png"
                  width={30}
                  height={30}
                  className="z-50 hover:scale-110 transition duration-300 ease-in-out"
                />
              </PopoverTrigger>
              <PopoverContent className="bg-white w-36 p-3 mr-3 mt-3 flex flex-col space-y-4">
                <button
                  className="p-2 hover:bg-slate-300 rounded-md"
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="p-2 hover:bg-slate-300 rounded-md"
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
