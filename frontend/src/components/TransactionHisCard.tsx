import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { TransactionHis } from "../../interface";

const TransactionHisCard = ({
  type,
  amount,
  createdAt,
  stripeId,
  userId,
  carProviderId,
  direction,
  currentUserId,
  userRole,
}: TransactionHis & { currentUserId: string; userRole: string }) => {
  const leftToRight = "img/payment_his_arrow.svg";
  const rightToLeft = "img/refund_his_arrow.svg";
  const topUp = "img/topUp_icon.svg";
  let transactionArrow;

  if (userRole === "user") {
    if (
      currentUserId === userId._id &&
      direction === "userToCarProvider" &&
      type !== "topUp"
    ) {
      transactionArrow = leftToRight;
    } else if (
      currentUserId === userId._id &&
      direction === "carProviderToUser" &&
      type !== "topUp"
    ) {
      transactionArrow = rightToLeft;
    } else {
      transactionArrow = topUp;
    }
  } else {
    if (direction === "carProviderToUser" && type !== "topUp") {
      transactionArrow = leftToRight;
    } else if (direction === "userToCarProvider" && type !== "topUp") {
      transactionArrow = rightToLeft;
    } else {
      transactionArrow = topUp;
    }
  }

  let transactionMessage;
  if (type === "topUp") {
    transactionMessage = "Top Up";
  } else if (userRole === "user") {
    if (direction === "userToCarProvider") {
      transactionMessage = `Paid for ${carProviderId?.name}`;
    } else {
      transactionMessage = `Refund from ${carProviderId?.name}`;
    }
  } else {
    if (direction === "userToCarProvider") {
      transactionMessage = `Paid by ${userId.name}`;
    } else {
      transactionMessage = `Refund to ${userId.name}`;
    }
  }

  let amountMessage;
  let amountSign;
  if (direction === "userToCarProvider" && userRole === "user") {
    amountMessage = `- $${amount}`;
    amountSign = false;
  } else if (direction === "carProviderToUser" && userRole === "user") {
    amountMessage = `+ $${amount}`;
    amountSign = true;
  } else if (direction === "carProviderToUser" && userRole === "carProvider") {
    amountMessage = `- $${amount}`;
    amountSign = false;
  } else {
    amountMessage = `+ $${amount}`;
    amountSign = true;
  }

  return (
    <div className="w-full h-full flex flex-row justify-evenly items-center p-3">
      <div className="w-[10%] h-[70%]  relative">
        <Image src={transactionArrow} alt="arrow" fill={true} />
      </div>
      <div className="w-[75%] h-full ">
        {
          <div className="w-full h-full flex flex-col justify-evenly items-center gap-2">
            <div className="w-full h-1/3 flex flex-row justify-between items-center gap-2 pt-2">
              <p className="text-[14px] font-bold text-white ">
                {transactionMessage}
              </p>
              <p
                className={`text-[14px] font-bold ${
                  amountSign ? "text-emerald-500" : "text-red-600"
                }`}
              >
                {amountMessage}
              </p>
            </div>
            <div className="w-full h-1/3 flex flex-row justify-between items-center">
              <p className="text-[12px] font-light text-gray-400">
                {format(new Date(createdAt), " MMMM dd, yyyy , hh:mm a")}
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default TransactionHisCard;
