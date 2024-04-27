"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExploreCard from "./ExploreCard";
import { Skeleton } from "./ui/skeleton";

const ExplorePanel = ({ carJson }: { carJson: Promise<CarJson> }) => {
  const [carData, setCardData] = useState<CarJson>();
  const [isLoading, setIsLoading] = useState(true);
  const resolve = () => {
    const carJsonReady = carJson.then((res) => {
      setCardData(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    resolve();
  }, []);
  //console.log(carJsonReady);
  return (
    <div className="w-[93%] h-2 flex flex-row flex-wrap drop-shadow-md">
      {isLoading ? (
        <>
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-black" />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-black" />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-black" />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-black" />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-black" />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-black" />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-black" />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-black" />
        </>
      ) : (
        carData?.data.map((carItem: CarItem) => (
          <div className="w-[24%] h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow ">
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
        ))
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
  );
};

export default ExplorePanel;
