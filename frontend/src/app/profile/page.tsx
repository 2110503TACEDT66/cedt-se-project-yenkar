"use client";

import NavBar from "@/components/NavBar";
import { getServerSession } from "next-auth";
import React, { useEffect } from "react";
import getMe from "@/libs/getMe";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/auth";
import { useSession } from "next-auth/react";
import { CommandMenu } from "@/components/CommandMenu";

interface Profile {
  data: {
    email: string;
    telephone: string;
    address: string;
    balance: number;
  };
}

const page = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = React.useState<Profile | null>(null);

  // const profile: {
  //   data: {
  //     email: string;
  //     telephone: string;
  //     address: string;
  //     balance: number;
  //   };
  // } = getMe(session?.user.token);
  // console.log(profile);

  const fetchProfile = () => {
    const response = getMe(session?.user.token).then((data) => {
      console.log(data);
      setProfile(data);
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <main>
      <CommandMenu session={session} />
      <NavBar stickyState={false} session={session} />
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-around items-center">
          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-3">
              <h1 className="font-kiona text-white text-xl">Name</h1>
              <h1 className="text-6xl z-40 text-white font-Poppins text-wrap font-light">
                {session?.user.name}
              </h1>
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>
          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-8">
              <div>
                <h1 className="font-kiona text-white text-xl py-3">Email</h1>
                <h1 className="text-5xl z-40 text-white font-Poppins text-wrap font-light">
                  {profile?.data.email}
                </h1>
              </div>
              <div>
                <h1 className="font-kiona text-white text-xl py-3">Phone</h1>
                <h1 className="text-5xl z-40 text-white font-Poppins text-wrap font-light">
                  {profile?.data.telephone.slice(0, 3) +
                    "-" +
                    profile?.data.telephone.slice(3, 6) +
                    "-" +
                    profile?.data.telephone.slice(6, 10)}
                </h1>
              </div>
              <div>
                <h1 className="font-kiona text-white text-xl py-3">Address</h1>
                <h1 className="text-5xl z-40 text-white font-Poppins text-wrap font-light">
                  {profile?.data.address}
                </h1>
              </div>
              <div>
                <h1 className="font-kiona text-white text-xl py-3">Balance</h1>
                <h1 className="text-5xl z-40 text-white font-Poppins text-wrap font-light">
                  {profile?.data.balance}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
