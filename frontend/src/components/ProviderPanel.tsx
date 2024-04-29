"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExploreCard from "./ExploreCard";
import ProviderCard from "./ProviderCard";
import { Skeleton } from "./ui/skeleton";
import Fuse from "fuse.js";
import { CarProvider, CarProviderJson } from "..";
const ProviderPanel = ({
  providerJson,
  query,
}: {
  providerJson: Promise<CarProviderJson>;
  query?: string;
}) => {
  const [providerData, setProviderData] = useState<CarProviderJson>();
  const [isLoading, setIsLoading] = useState(true);
  const [originalProviderData, setOriginalProviderData] =
    useState<CarProviderJson>();
  const resolve = () => {
    const carJsonReady = providerJson.then((res) => {
      setOriginalProviderData(res);
      setProviderData(res);
      setIsLoading(false);
    });
  };

  const options = {
    keys: ["name", "address"],
    threshold: 0.4, // Adjust this as needed
  };

  const fuse = new Fuse(originalProviderData?.data || [], options);
  const handleQuery = (query: string) => {
    if (query === "") {
      setProviderData(originalProviderData);
      return;
    }
    console.log(fuse);
    const result = fuse.search(query);
    console.log(result);

    setProviderData({
      success: true,
      count: result.length,
      data: result.map((item) => item.item),
    });
  };

  useEffect(() => {
    resolve();
  }, []);

  useEffect(() => {
    handleQuery(query!);
  }, [query]);
  //console.log(carJsonReady);
  return (
    <div className="w-[93%] h-fit flex flex-row flex-wrap">
      {isLoading ? (
        <>
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow " />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow " />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow " />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow " />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow " />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow " />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow " />
          <Skeleton className="w-[24%] h-[35rem] m-2 rounded-lg bg-zinc-700 flex-grow " />
        </>
      ) : (
        providerData?.data.map((providerItem: CarProvider) => (
          <div
            key={providerItem._id}
            className="w-[24%] h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow"
          >
            <Link href={`/explore/provider/${providerItem._id}`}>
              <ProviderCard
                _id={providerItem._id}
                name={providerItem.name}
                address={providerItem.address}
                telephone={providerItem.telephone}
                src={providerItem.src}
              />
            </Link>
          </div>
        ))
      )}

      {providerData?.data?.length! % 4 === 0
        ? null
        : Array.from({ length: 4 - (providerData?.data?.length! % 4) }).map(
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

export default ProviderPanel;
