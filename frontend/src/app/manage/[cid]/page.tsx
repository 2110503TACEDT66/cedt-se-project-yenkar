"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import { useSession } from "next-auth/react";
import getSingleCar from "@/libs/getSingleCar";
import { CarJson } from "@/index";

export default function Page({ params }: { params: { cid: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSticky, setIsSticky] = useState(false);
  const [car, setCar] = useState<CarJson>();

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const carData = await getSingleCar(params.cid);
        setCar(carData);
      } catch (error) {
        console.error("Error fetching car:", error);
      }
    };

    fetchCarData();
  }, [params.cid]);
  console.log(car);
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!session) {
    router.push("/sign-in");
    return null; // Return null while redirecting
  }

  return (
    <main>
      <NavBar stickyState={isSticky} session={session} />
      <div className="w-full flex justify-center rounded-2xl font-kiona">
        <div className="bg-[#17191C] w-[88vw] h-[75vh] flex justify-center rounded-xl">
          <div className="flex flex-col mt-[7%]">
            <div className="flex flex-row gap-10 justify-center">
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
            <div className="ml-16">
              <div className=" text-green-700 flex justify-center text-4xl font-bold">
                REFUND SUCCESSFULLY
              </div>
              <div className="text-white flex justify-center text-2xl mt-5">
                Thanks for choosing Yenkar. We hope to serve you again in the
                future.
              </div>
              <div className="flex justify-center">
                <div className="text-black bg-white rounded-lg p-2 mt-7 w-[57%] flex justify-center text-3xl font-bold">
                  {car?.data[0].price}$ IS ADDED TO YOUR BALANCE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
