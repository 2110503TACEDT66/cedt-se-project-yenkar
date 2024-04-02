import Link from "next/link";
import React from "react";
import ExploreCard from "./ExploreCard";

const ExplorePanel = async ({ carJson }: { carJson: Promise<CarJson> }) => {
  const carJsonReady = await carJson;
  console.log(carJsonReady);
  return (
    <div className="w-[93%] h-2 flex flex-row flex-wrap">
      {carJsonReady.data.map((carItem: CarItem) => (
        <div className="w-[24%] h-[30rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100">
          <Link href={`/reserve/${carItem._id}`}>
            <ExploreCard
              key={carItem._id}
              _id={carItem._id}
              name={carItem.name}
              telephone={carItem.telephone}
              price={carItem.price}
              src={carItem.src}
              address={carItem.address}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ExplorePanel;
