"use client";

import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
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
import createUser from "@/libs/createUser";
import { signIn } from "next-auth/react";
import providerRegister from "@/libs/providerRegister";
import { Textarea } from "@/components/ui/textarea";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CommandMenu } from "@/components/CommandMenu";

const page = () => {
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();
  const [roles, setRoles] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(1, {
        message: "This field has to be filled.",
      })
      .email("Invalid email address."),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    phone: z.string().length(10, {
      message: "Phone number must be 10 characters.",
    }),

    location: z
      .string()
      .min(2, {
        message: "Location must be at least 2 characters.",
      })
      .max(100, {}),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (roles === false) {
      createUser({
        userName: values.name,
        userEmail: values.email,
        userPassword: values.password,
        userPhone: values.phone,
        userLocation: values.location,
      })
        .then((data) => {
          console.log(data);
          signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      providerRegister(
        values.name,
        values.phone,
        values.location,
        values.email,
        values.password
      )
        .then((data) => {
          console.log(data);
          signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <main>
      <CommandMenu session={null} />
      <NavBar stickyState={isSticky} />;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-fit flex flex-row justify-around items-center mb-10">
          <div className=" w-[45vw] h-[120vh] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-3">
              <h1 className="text-6xl z-40 text-white font-Poppins ">
                Sign-up
              </h1>
              <h1 className="text-base z-40 text-white font-kiona ">
                Already Have an account?
                <span
                  onClick={() => {
                    router.push("/sign-in");
                  }}
                  className="pl-2 text-lg z-40 font-kiona bg-gradient-to-r from-[#F05B80] to-[#4158F0] inline-block text-transparent bg-clip-text hover:scale-105 transition duration-300 ease-in-out hover:invert active:scale-100"
                >
                  Go to log-in
                </span>
              </h1>
            </div>
          </div>

          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 grid grid-cols-2 gap-4 items-center"
                >
                  <div className="col-span-1">
                    <div className="text-white font-kiona text-lg">
                      I am a...
                    </div>
                    <div className="w-[150%]">
                      <button
                        onClick={() => setRoles(false)}
                        type="button"
                        className={
                          roles
                            ? "rounded-tl-lg rounded-bl-lg w-[50%] h-12 bg-[#222529]"
                            : "rounded-tl-lg rounded-bl-lg w-[50%] h-12 bg-[#2d3034] border-gray-400 border-2"
                        }
                      >
                        <div
                          className={
                            roles
                              ? "text-xl bg-zinc-500 inline-block text-transparent bg-clip-text"
                              : "text-xl bg-gradient-to-r from-[#F05B80] to-[#4158F0] inline-block text-transparent bg-clip-text"
                          }
                        >
                          User
                        </div>
                      </button>
                      <button
                        onClick={() => setRoles(true)}
                        type="button"
                        className={
                          roles
                            ? "rounded-tr-lg rounded-br-lg w-[50%] h-12 bg-[#2d3034] border-gray-400 border-2"
                            : "rounded-tr-lg rounded-br-lg w-[50%] h-12 bg-[#222529]"
                        }
                      >
                        <div
                          className={
                            roles
                              ? "text-xl bg-gradient-to-r from-[#F05B80] to-[#4158F0] inline-block text-transparent bg-clip-text"
                              : "text-xl bg-zinc-500 inline-block text-transparent bg-clip-text"
                          }
                        >
                          Provider
                        </div>
                      </button>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2 w-fit">
                        <FormLabel className="text-white font-kiona text-lg">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-[#222529] text-white"
                            placeholder="Your Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-2 w-fit">
                        <FormLabel className="text-white font-kiona text-lg">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-[#222529] text-white"
                            placeholder="Example@domain.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="col-span-2 w-fit">
                        <FormLabel className="text-white font-kiona text-lg">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={10}
                            className="text-white"
                            {...field}
                          >
                            <InputOTPGroup className="text-white">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator className=" text-white" />
                            <InputOTPGroup className="text-white">
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                            <InputOTPSeparator className="text-white" />
                            <InputOTPGroup className="text-white">
                              <InputOTPSlot index={6} />
                              <InputOTPSlot index={7} />
                              <InputOTPSlot index={8} />
                              <InputOTPSlot index={9} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="col-span-2 w-fit">
                        <FormLabel className="text-white font-kiona text-lg">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-[#222529] text-white w-[228%] h-30 border-none"
                            placeholder="Address"
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
                      <FormItem className="col-span-2 w-fit">
                        <FormLabel className="text-white font-kiona text-lg">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            className="bg-[#222529] text-white"
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
