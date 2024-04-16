"use client";

import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import getMe from "@/libs/getMe";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkoutCredits } from "@/libs/topUpTransaction.actions";

const page = () => {
  const { data: session } = useSession();

  if (!session || !session.user.token) {
    redirect("/sign-in");
  }

  const [userProfile, setUserProfile]: any = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = () => {
      const response = getMe(session?.user.token).then((data) => {
        setUserProfile(data);
        setIsLoading(false);
      });
      setUserProfile(response);
    };
    fetchProfile();
  }, []);

  const formSchema = z.object({
    topupamount: z.coerce.number().gte(1, "Amount must be greater than 0"),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topupamount: undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    {
      try {
        await checkoutCredits(
          {
            plan: "Top Up to Wallet",
            amount: values.topupamount,
            buyerId: session?.user._id!,
          },
          session?.user.token!
        ).then((res) => {
          console.log(res);
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <main>
      <NavBar stickyState={false} showSignIn={false} session={true} />
      <div className="flex flex-row items-center justify-center gap-[3%]">
        <div
          className="bg-[#17191C]
         rounded-xl w-[25%] h-[72vh] flex flex-row justify-around items-center"
        >
          <div className=" w-full h-[100%] flex flex-col relative justify-center items-center">
            <div className="w-[60%] h-[40%] relative ">
              <Image
                alt="walleticon"
                src="/img/wallet_svg.svg"
                fill={true}
                className="object-cover "
              />
            </div>
            <div className=" w-fit h-fit left-8 flex flex-col space-y-6 text-center">
              {/*Please change walletplaceholder to wallet icon you'll actually use*/}
              <h1 className="font-kiona text-white text-4xl">
                Current Balance
              </h1>
              <h1 className="text-5xl z-40 text-white font-poppins text-wrap">
                {/* {userProfile.data.balance} $ */}
                {isLoading ? "Loading..." : userProfile.data.balance + " $"}
              </h1>
            </div>
          </div>
        </div>
        <div
          className="bg-[#17191C]
         rounded-xl w-[60%] h-[72vh] flex flex-row justify-start items-center relative"
        >
          <div className="w-[60%] h-full absolute top-0 right-0">
            <Image
              src="/img/line_art.svg"
              alt="lineart"
              fill={true}
              className="object-cover "
            />
          </div>
          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className="font-poppins text-white absolute top-12 left-16 text-4xl flex flex-row">
              Add to Balance
              <Image alt="carticon" src="/img/addbalancecarticon.png" width={40} height={40} className="ml-3"/>
            </div>
            <div className=" w-fit h-fit absolute left-16  flex flex-col space-y-8 ">
              <div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="topupamount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-kiona text-lg">
                            Top Up Amount
                          </FormLabel>
                          <FormControl>
                            <Input
                              typeof="number"
                              className="bg-[#222529] text-white"
                              placeholder="Enter amount in $"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-rose-600" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="p-3 bg-gradient-to-r font-kiona text-xl from-[#F05B80] to-[#4158F0] text-white hover:scale-105 transition duration-300 ease-in-out hover:saturate-150 active:scale-100"
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          ;
        </div>
      </div>
    </main>
  );
};

export default page;
