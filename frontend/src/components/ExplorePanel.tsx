import Link from "next/link";
import React from "react";
import ExploreCard from "./ExploreCard";

const ExplorePanel = async ({ carJson }: { carJson: Promise<CarJson> }) => {
  const carJsonReady = await carJson;
  console.log(carJsonReady);
  return (
    <div className="w-[93%] h-2 flex flex-row flex-wrap">
      {carJsonReady.data.map((carItem: CarItem) => (
        <div className="w-[24%] h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100">
          <Link href={`/reserve?pid=${carItem.carProvider._id}&cid=${carItem._id}`}>
            <ExploreCard
              key={carItem._id}
              _id= {carItem._id}
              model={carItem.model}
              brand={carItem.brand}
              carProvider={carItem.carProvider}
              price={carItem.price}
              src={carItem.src}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ExplorePanel;
