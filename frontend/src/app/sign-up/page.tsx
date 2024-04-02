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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import createUser from "@/libs/createUser";
import { signIn } from "next-auth/react";

const page = () => {
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();

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
      message: "name must be at least 2 characters.",
    }),
    email: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
      message: "password must be at least 2 characters.",
    }),
    phone: z
      .string()
      .min(10, {
        message: "phone number must be exactly 10 digits.",
      })
      .max(10, {
        message: "phone number must be exactly 10 digits.",
      }),

    location: z.string().min(2, {
      message: "location must be at least 2 characters.",
    }),
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
  }

  return (
    <main>
      <NavBar stickyState={isSticky} showSignIn={false} session={false} />;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-around items-center">
          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-3">
              <h1 className="text-6xl z-40 text-white font-poppins ">
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
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[45%] h-[100%] flex flex-col relative justify-center">
            <div className=" w-fit h-fit absolute left-16 flex flex-col space-y-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
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
                      <FormItem>
                        <FormLabel className="text-white font-kiona text-lg">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-[#222529] text-white"
                            placeholder="Phone Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona text-lg">
                          location
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-[#222529] text-white"
                            placeholder="Location"
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
