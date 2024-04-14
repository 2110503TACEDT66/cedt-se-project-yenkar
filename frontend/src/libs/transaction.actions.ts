"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },

        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/profile`,
    cancel_url: `${process.env.FRONTEND_URL}/`,
  });

  redirect(session.url!);
}

//TODO test createTransaction function
export async function createTransaction(
  token: string,
  transaction: CreateTransactionProps
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/transactions/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create transaction");
  }

  await updateBalance(token, transaction.amount);

  return response.json();
}

export async function updateBalance(token: string, balance: number) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/topUp/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ balance }),
  });
}
