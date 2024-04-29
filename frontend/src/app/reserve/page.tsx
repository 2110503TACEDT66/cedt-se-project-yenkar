"use client";
import ExploreCard from "@/components/ExploreCard";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, set } from "date-fns";
import { cn } from "@/libs/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import createReservation from "@/libs/createReservation";
import { useToast } from "@/components/ui/use-toast";
import getSingleCar from "@/libs/getSingleCar";
import { CarItem } from "../../../interface";
import { CommandMenu } from "@/components/CommandMenu";

//const page = ({ params }: { params: { pid: string, cid:string } }) => {
const page = () => {
  const urlParams = useSearchParams();
  const cid = urlParams.get("cid");
  const pid = urlParams.get("pid");
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);
  console.log(session?.user.token);
  console.log(session?.user._id);
  const [carData, setCarData] = useState<CarItem>();
  const [isSticky, setIsSticky] = useState(false);

  const { toast } = useToast();
  useEffect(() => {
    const fetchData = () => {
      if (cid) {
        const carJson = getSingleCar(cid).then((res) => {
          setCarData(res.data);
        });
      }
    };
    fetchData();

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

  if (!session || !session.user.token) {
    router.push("/sign-in");
    return null;
  }

  const formSchema = z.object({
    rentDate: z.date({
      required_error: "Rent date is required",
    }),
    returnDate: z.date({
      required_error: "Return date is required",
    }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (pid) {
      createReservation(
        values.returnDate,
        values.rentDate,
        session?.user?._id ?? "",
        session?.user?.token ?? "",
        pid,
        carData?.model
      )
        .then(() => {
          toast({
            title: "Reservation created",
            description: "Your reservation has been created",
            duration: 3000,
          });
          router.push("/manage");
        })
        .catch(() => {
          toast({
            title: "Failed to create reservation",
            description: "Failed to create reservation",
            variant: "destructive",
            duration: 3000,
          });
        });
    }
  }

  return (
    <main>
      <CommandMenu session={session} />

      <NavBar stickyState={false} session={session} />

      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-fit flex flex-row justify-evenly items-center py-4">
          <div className=" w-[30%] h-[100%] flex flex-col relative justify-center items-center">
            <div className=" w-full h-[35rem]  flex flex-col relative">
              <ExploreCard
                src={carData?.src}
                _id={carData?._id ?? ""}
                model={carData?.model ?? ""}
                brand={carData?.brand ?? ""}
                carProvider={carData?.carProvider!}
                price={carData?.price ?? 0}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[65%] h-[100%] flex flex-col relative ">
            {/* Car information section */}
            <div className="">
              <div className=" w-full h-fit flex flex-col  space-y-3 pt-9 pl-6 mb-5">
                <h1 className="text-4xl font-kiona text-white">
                  {carData?.model ?? "Loading..."}
                </h1>
                {/* <div className="flex flex-row gap-1 items-baseline pt-3">
                  <h1 className="text-xl font-kiona text-zinc-400">model |</h1>
                  <h1 className="text-xl font-Poppins  font-bold text-white">
                    {carData?.model ?? ""}
                  </h1>
                </div> */}
                <div className="pt-3 grid grid-cols-3 gap-y-6">
                  {/* <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">Model |</h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.model ?? ""}
                    </h1>
                  </div> */}
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      Brand |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.brand ?? ""}
                    </h1>
                  </div>{" "}
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      price |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.price + " $" ?? ""}
                    </h1>
                  </div>
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      Plate number |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.vrm ?? ""}
                    </h1>
                  </div>
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      Doors |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.doors ?? ""}
                    </h1>
                  </div>
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      Seats |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.seats ?? ""}
                    </h1>
                  </div>
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      transmission |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.transmission ?? ""}
                    </h1>
                  </div>
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      cargo |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.cargo ?? ""}
                    </h1>
                  </div>
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      radio |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.radio ? "Yes" : "No" ?? ""}
                    </h1>
                  </div>
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">air |</h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.air ? "Yes" : "No" ?? ""}
                    </h1>
                  </div>
                  {/* <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">price |</h1>
                    <h1 className="text-xl font-Poppins text-white">
                      {carData?.price ?? ""}
                    </h1>
                  </div> */}
                </div>
              </div>
            </div>
            {/*End of Car information section */}
            {/* CarProvider information */}
            <div className="">
              <div className=" w-full h-fit flex flex-col space-y-3 pt-9 pl-6 mb-5">
                <h1 className="text-4xl font-kiona   text-white">
                  Provider Information
                </h1>
                <div className="flex flex-row gap-1 items-baseline pt-3">
                  <h1 className="text-xl font-kiona text-zinc-400">Name |</h1>
                  <h1 className="text-xl font-Poppins   font-bold text-white">
                    {carData?.carProvider.name ?? ""}
                  </h1>
                </div>
                <div className="pt-3 grid grid-cols-3 ">
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      Address |
                    </h1>
                    <h1 className="text-xl font-Poppins  font-bold text-white">
                      {carData?.carProvider.address ?? ""}
                    </h1>
                  </div>{" "}
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">
                      Telephone |
                    </h1>
                    <h1 className="text-xl font-Poppins font-bold text-white">
                      {carData?.carProvider.telephone.slice(0, 3) +
                        "-" +
                        carData?.carProvider.telephone.slice(3, 6) +
                        "-" +
                        carData?.carProvider.telephone.slice(6, 10) ?? ""}
                    </h1>
                  </div>{" "}
                  {/* <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-zinc-400">price |</h1>
                    <h1 className="text-xl font-Poppins text-white">
                      {carData?.price ?? ""}
                    </h1>
                  </div> */}
                </div>
              </div>
            </div>
            {/*End of CarProvider information */}

            <div className="w-full h-[1px] flex flex-col items-center mt-10">
              <div className="bg-white w-[95%] h-full"></div>
            </div>
            <div className="flex flex-col w-full h-fit p-6 justify-center">
              <div className="flex flex-row w-full h-fit justify-end">
                <h1 className="text-4xl font-kiona text-white">
                  Make Reservation
                </h1>
              </div>

              <div className="flex flex-row pt-5">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-x-4 flex flex-row items-start justify-between w-full"
                  >
                    <FormField
                      control={form.control}
                      name="rentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white font-kiona text-lg">
                            Rent Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[170%] text-white text-lg h-16 pl-3 text-left font-normal bg-[#222529]",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span className="text-white">
                                      Pick a rent date
                                    </span>
                                  )}
                                  <CalendarIcon
                                    className="ml-auto h-4 w-4 opacity-50 "
                                    color="white"
                                  />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-white"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-rose-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="returnDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white font-kiona text-lg">
                            return Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[170%] text-white text-lg h-16 pl-3 text-left font-normal bg-[#222529]",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span className="text-white">
                                      Pick a return date
                                    </span>
                                  )}
                                  <CalendarIcon
                                    className="ml-auto h-4 w-4 opacity-50 "
                                    color="white"
                                  />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-white"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-rose-600" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="mt-12 bg-gradient-to-r font-kiona text-xl from-[#F05B80] to-[#4158F0] text-white hover:scale-105 transition duration-300 ease-in-out hover:saturate-150 active:scale-100"
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
