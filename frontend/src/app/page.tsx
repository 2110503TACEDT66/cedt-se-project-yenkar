"use client";
import { CommandMenu } from "@/components/CommandMenu";
import HomeCard from "@/components/HomeCard";
import NavBar from "@/components/NavBar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(() => {
      setIsFirst(false);
    }, 100);
    router.prefetch("/explore");
    router.prefetch("/manage");
    router.prefetch("/dashboard");
    router.prefetch("/balance");
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="h-[200vh]">
      <CommandMenu session={session} />
      <NavBar stickyState={isSticky} session={session} />

      {/* Background */}
      <div className="overflow-hidden">
        <Image
          className={`absolute  z-0 h-[100vh] w-auto h-auto ${
            isSticky || isFirst
              ? "top-[-100vh] right-[-16rem] transition-[top,right] duration-1000 ease-in-out"
              : "top-0 right-64 transition-[top,right] duration-1000 ease-in-out"
          }`}
          alt="background"
          src="/img/home_background.png"
          width={1000}
          height={1200}
        />

        {/*  Discover your rental car */}
        <div>
          <div className="flex flex-col items-center py-8 relative">
            <div className="flex flex-col items-start  ">
              <h1 className="text-3xl font-kiona text-white ml-3">
                DISCOVER YOUR
              </h1>
              <h1 className="text-9xl font-kiona text-white">RENTAL CAR</h1>
              <div
                className={`flex flex-row w-full justify-center h-[10vh] ${
                  isSticky || isFirst
                    ? "pl-[200vw] transition-transform-[padding]  duration-1000 ease-in-out"
                    : "transition-transform-[padding]  duration-1000 ease-in-out"
                }`}
              >
                <Image
                  className="absolute top-[-100px] w-[65vw] mt-3"
                  alt="car"
                  src="/img/porsche-model.png"
                  width={1000}
                  height={1000}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-row p-12 justify-between items-center pt-[22rem] z-30">
          <div className="flex flex-row pl-5 space-x-5 items-center z-0">
            <Image
              alt="logo"
              src="/img/explore_icon.png"
              width={50}
              height={50}
              className="z-0 w-auto h-auto"
            />
            <div className="flex flex-col">
              <h1 className="text-white text-lg">Explore the </h1>
              <h1 className="text-white text-lg">new travel experience</h1>
              {/* {
                session? <div className="text-white">Hello {session.data?.user.name}</div> : <div className="text-white">Not logged in</div>
              } */}
            </div>
          </div>
          <div className="absolute flex flex-row w-full h-fit justify-center left-0">
            <div className=" rounded-2xl w-fit h-12 z-[35] flex flex-row justify-center items-center drop-shadow-md p-3 shadow-lg backdrop-blur-xl backdrop-brightness-150 ">
              <h1 className="text-white relative">⌘K to Show Command Menu</h1>
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <Image
              alt="dec"
              src="/img/dec_1.png"
              width={100}
              height={100}
              className="w-auto h-auto"
            />
          </div>
        </div>
      </div>

      {/* Showcase */}
      <div>
        <h1 className="pt-8 text-4xl font-kiona text-white text-center mt-20">
          The next Experience for you
        </h1>
        <div className="flex flex-row p-16 space-x-8">
          <HomeCard
            onClick={() => {
              router.push("/explore");
            }}
            src="/img/menu_1.jpg"
            alt="Select Your Car"
            text="Select Your Car"
          />
          <HomeCard
            onClick={() => {
              if (session) {
                router.push("/explore");
              } else {
                router.push("/sign-up");
              }
            }}
            src="/img/menu_2.jpg"
            alt="Rental Car Provider"
            text="Start Your Journey Now"
          />
          <HomeCard
            onClick={() => {
              router.push("/manage");
            }}
            src="/img/menu_3.jpg"
            alt="Reservation"
            text="Reservation"
          />
        </div>
      </div>

      {/* For payment testing */}
      {/* <div
        className="bg-red-600 w-[100%] h-96 flex flex-col 
      justify-center items-center mt-20 gap-3
      "
      >
        <button
          className="
        bg-white text-black p-4 rounded-lg
        hover:bg-black hover:text-white
        "
          onClick={async () => {
            console.log("Create Transaction Test");
            try {
              await createTransaction(session?.user.token!, {
                stripeId: "stripeId",
                amount: 1000,
                plan: "plan",
                buyerId: session?.user._id!,
                createdAt: new Date(),
              }).then((res) => {
                console.log(res);
              });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Create Transaction Test
        </button>
        <button
          className="
        bg-white text-black p-4 rounded-lg
        hover:bg-black hover:text-white
        "
          onClick={async () => {
            console.log("Create Transaction Test");
            try {
              await checkoutCredits(
                {
                  plan: "plan",
                  amount: 1000,
                  buyerId: session?.user._id!,
                },
                session?.user.token!
              ).then((res) => {
                console.log(res);
              });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Create Check Out Session
        </button>
      </div> */}
    </main>
  );
}
