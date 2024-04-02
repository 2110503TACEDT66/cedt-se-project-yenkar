import NavBar from "@/components/NavBar";
import { getServerSession } from "next-auth";
import React from "react";
import getMe from "@/libs/getMe";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(`server-session: ${session?.user.name}`);

  if (!session || !session.user.token) {
    redirect("/sign-in");
  }

  const profile = await getMe(session?.user.token);
  console.log(profile);

  return (
    <main>
      <NavBar stickyState={false} showSignIn={false} session={false} />;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-around items-center">
          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            ''
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-3">
              <h1 className="font-kiona text-white text-xl">Name</h1>
              <h1 className="text-6xl z-40 text-white font-poppins text-wrap ">
                {session?.user.name}
              </h1>
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>
          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-8">
              <div>
                <h1 className="font-kiona text-white text-xl py-3">Email</h1>
                <h1 className="text-5xl z-40 text-white font-poppins text-wrap ">
                  {profile?.data.email}
                </h1>
              </div>
              <div>
                <h1 className="font-kiona text-white text-xl py-3">Phone</h1>
                <h1 className="text-5xl z-40 text-white font-poppins text-wrap ">
                  {profile?.data.telephone}
                </h1>
              </div>
              <div>
                <h1 className="font-kiona text-white text-xl py-3">Address</h1>
                <h1 className="text-5xl z-40 text-white font-poppins text-wrap ">
                  {profile?.data.address}
                </h1>
              </div>
              <div>
                <h1 className="font-kiona text-white text-xl py-3">Balance</h1>
                <h1 className="text-5xl z-40 text-white font-poppins text-wrap ">
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
