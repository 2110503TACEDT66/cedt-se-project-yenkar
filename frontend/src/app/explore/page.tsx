import ExplorePanel from "@/components/ExplorePanel";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/libs/auth";
import getAllCarProviders from "@/libs/getAllCarProviders";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const carJson = getAllCarProviders();
  const session = await getServerSession(authOptions);
  console.log(`server-session: ${session}`);
  var activeAuth = true;
  if (!session || !session.user.token) {
    activeAuth = false;
  }

  return (
    <main>
      <NavBar
        stickyState={false}
        showSignIn={!activeAuth}
        session={activeAuth}
      />
      <div className="flex flex-col items-center">
        <div className="flex flex-row w-[93%] p-6  items-center justify-between">
          <h1 className="text-3xl font-poppins text-white">
            Explore the Available Cars
          </h1>
          <Input
            placeholder="Search"
            type="text"
            className="w-1/4 h-12 rounded-2xl bg-[#1E1E1E] text-white hidden"
          />
        </div>
        <ExplorePanel carJson={carJson} />
      </div>
    </main>
  );
};

export default page;
