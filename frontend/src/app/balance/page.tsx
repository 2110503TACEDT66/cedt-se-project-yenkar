"use client"

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

const page = () => {
    const { data:session } = useSession();

    if (!session || !session.user.token) {
    redirect("/sign-in");
    }

    const [userProfile, setUserProfile] : any = useState();

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getMe(session.user.token);
            setUserProfile(data);
        }
        fetchProfile();
    },[]);

    const formSchema = z.object({
        topupamount: z.number().min(1, {
          message: "Amount must be at least 1 $.",
        }),
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        topupamount: 0
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values); {/*Add top-up function*/}
    }

    return (
        <main>
            <NavBar stickyState={false} showSignIn={false} session={true}/>
            <div className="flex flex-col items-center">
                <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-around items-center">
                <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
                    <div className=" w-fit h-fit absolute left-8 flex flex-col space-y-6 text-center">
                        <Image alt="walleticon" src="/img/walletplaceholder.png"
                        width={512} height={512}/> {/*Please change walletplaceholder to wallet icon you'll actually use*/}
                    <h1 className="font-kiona text-white text-4xl">Current Balance</h1>
                    <h1 className="text-6xl z-40 text-white font-poppins text-wrap">
                        {userProfile.data.balance} $
                    </h1>
                    </div>
                </div>
                <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
                    <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-8">
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
                                    Amount
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        className="bg-[#222529] text-white"
                                        {...field}
                                    /> {/*ทำไม่เป็นอะที่ทำให้มี $ ขึ้นตลอด ไม่ต้องพิมพ์ซ้ำ*/}
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
                </div>
            </div>
        </main>
    );
};

export default page;