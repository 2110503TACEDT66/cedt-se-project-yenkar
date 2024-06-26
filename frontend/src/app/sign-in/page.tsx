"use client";

import NavBar from "@/components/NavBar";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CommandMenu } from "@/components/CommandMenu";

const page = () => {
  const router = useRouter();

  const formSchema = z.object({
    email: z
      .string()
      .min(2, {
        message: "email must be at least 2 characters.",
      })
      .email("Invalid email address."),
    password: z.string().min(8, {
      message: "password must be at least 8 characters.",
    }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: true,
      callbackUrl: "/",
    });
  }

  return (
    <main>
      <CommandMenu session={null} />
      <NavBar stickyState={false} />;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-around items-center">
          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-3">
              <h1 className="text-6xl z-40 text-white font-Poppins ">Log-in</h1>
              <h1 className="text-base z-40 text-white font-kiona ">
                Doesn’t have one?
                <span
                  onClick={() => {
                    router.push("/sign-up");
                  }}
                  className="pl-2 text-lg z-40 font-kiona bg-gradient-to-r from-[#F05B80] to-[#4158F0] inline-block text-transparent bg-clip-text hover:scale-105 transition duration-300 ease-in-out hover:invert active:scale-100"
                >
                  Go to sign-up
                </span>
              </h1>
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona text-lg">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-[#222529] text-white"
                            placeholder="Example@domain.com"
                            id="emailInput"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona text-lg">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            className="bg-[#222529] text-white"
                            id="passwordInput"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600 " />
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
    </main>
  );
};

export default page;
