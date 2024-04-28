"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExploreCard from "./ExploreCard";
import { Skeleton } from "./ui/skeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ExplorePanel = ({ carJson }: { carJson: Promise<CarJson> }) => {
  const { data: session } = useSession();
  const [carData, setCardData] = useState<CarJson>();
  const [isLoading, setIsLoading] = useState(true);
  const [myCar, setMyCar] = useState<CarItem[]>();
  const router = useRouter();

  const resolve = () => {
    const carJsonReady = carJson.then((res) => {
      setCardData(res);
      setIsLoading(false);
      if (session?.user.role === "carProvider") {
        const myCarRes = res.data.filter(
          (carItem: CarItem) => carItem.carProvider._id === session?.user._id
        );

        console.log(myCarRes);
        setMyCar(myCarRes);
      }
    });
  };

  useEffect(() => {
    resolve();
  }, []);
  //console.log(carJsonReady);
  return (
    <>
      {myCar?.length! > 0 ? (
        <>
          <h1 className="self-start text-white ml-[4vw] font-kiona text-2xl font-medium">
            {" "}
            Your Car
          </h1>
          <div className="w-[93%] h-fit grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 drop-shadow-md">
            {isLoading ? (
              <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
            ) : (
              myCar?.map((carItem: CarItem) => {
                return (
                  <div className="h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow ">
                    <Link
                      href={`/reserve?pid=${carItem.carProvider._id}&cid=${carItem._id}`}
                    >
                      <ExploreCard
                        key={carItem._id}
                        _id={carItem._id}
                        model={carItem.model}
                        brand={carItem.brand}
                        carProvider={carItem.carProvider}
                        price={carItem.price}
                        src={carItem.src}
                        myCar={true}
                      />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
          <h1 className="self-start text-white ml-[4vw] font-kiona pt-8 pb-2 text-2xl font-medium">
            {" "}
            Other Cars
          </h1>
        </>
      ) : (
        <>
          <h1 className="self-start text-white ml-[4vw] font-kiona text-2xl font-medium">
            {" "}
            Your Car
          </h1>
          <div className="w-[93%] h-fit grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 drop-shadow-md">
            {isLoading ? (
              <>
                <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
                <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
                <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
                <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
                <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
                <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
                <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
                <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
              </>
            ) : (
              <div
                onClick={(e) => {
                  router.push("/add");
                }}
                className=" h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow bg-zinc-900 flex flex-col justify-center items-center"
              >
                <h1 className="text-2xl text-white">You don't have any car.</h1>
                <h1 className=" font-kiona text-white">
                  Click here to add one
                </h1>
              </div>
            )}
          </div>
          <h1 className="self-start text-white ml-[4vw] font-kiona pt-8 pb-2 text-2xl font-medium">
            {" "}
            Other Cars
          </h1>
        </>
      )}

      <div className="w-[93%] h-fit grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 drop-shadow-md">
        {isLoading ? (
          <>
            <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
            <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
            <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
            <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
            <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
            <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
            <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
            <Skeleton className=" h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow" />
          </>
        ) : (
          carData?.data.map((carItem: CarItem) => {
            if (myCar?.find((item) => item._id === carItem._id)) {
              return <></>;
            }
            return (
              <div className=" h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow ">
                <Link
                  href={`/reserve?pid=${carItem.carProvider._id}&cid=${carItem._id}`}
                >
                  <ExploreCard
                    key={carItem._id}
                    _id={carItem._id}
                    model={carItem.model}
                    brand={carItem.brand}
                    carProvider={carItem.carProvider}
                    price={carItem.price}
                    src={carItem.src}
                  />
                </Link>
              </div>
            );
          })
        )}

        {carData?.data?.length! % 4 === 0
          ? null
          : Array.from({ length: 4 - (carData?.data?.length! % 4) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="w-[24%] h-[35rem] m-2 rounded-lg relative flex-grow"
                ></div>
              )
            )}
      </div>
    </>
  );
};

export default ExplorePanel;
