"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExploreCard from "./ExploreCard";
import ProviderCard from "./ProviderCard";
const ProviderPanel = ({
  providerJson,
}: {
  providerJson: Promise<CarProviderJson>;
}) => {
  const [providerData, setProviderData] = useState<CarProviderJson>();
  const resolve = () => {
    const carJsonReady = providerJson.then((res) => {
      setProviderData(res);
    });
  };

  useEffect(() => {
    resolve();
  }, []);
  //console.log(carJsonReady);
  return (
    <div className="w-[93%] h-2 flex flex-row flex-wrap">
      {providerData?.data.map((providerItem: CarProvider) => (
        <div className="w-[24%] h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow">
          <Link href={`/explore/provider/${providerItem._id}`}>
            <ProviderCard
              _id={providerItem._id}
              name={providerItem.name}
              address={providerItem.address}
              telephone={providerItem.telephone}
            />
          </Link>
        </div>
      ))}
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
