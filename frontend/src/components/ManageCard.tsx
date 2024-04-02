"use client";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import deleteReservation from "@/libs/deleteReservation";
import editReservation from "@/libs/editReservation";
import { useToast } from "./ui/use-toast";

const ManageCard = ({
  id,
  name,
  rentDate,
  returnDate,
  onRemove,
  deleteReservation,
  carId,
  adminView,
  userName,
  src,
}: {
  id: string;
  rentDate: Date;
  returnDate: Date;
  name: string;
  onRemove: Function;
  deleteReservation: Function;
  carId: string;
  adminView: boolean;
  userName: string;
  src: string;
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
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
    editReservation(
      values.returnDate,
      values.rentDate,
      id,
      session?.user?.token ?? ""
    ).then(() => {
      toast({
        title: "Success",
        description: "Reservation updated successfully",
        duration: 3000,
      });
      location.reload();
      setIsEditing(false);
    });
    console.log(values);
  }
  return (
    <div className="w-full h-[31%]">
      <div className="flex flex-row w-full h-full bg-[#17191C]  rounded-lg shadow-lg relative">
        <div className="absolute text-xl right-0 top-0 flex flex-row space-x-3 px-10 py-5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="py-1 px-5 bg-gradient-to-r from-[#F05B80] to-[#4158F0] text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={(e) => {
              onRemove(id);
              deleteReservation(id, session?.user.token);
            }}
            className="py-1 px-5 bg-rose-600 text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
          >
            Delete
          </button>
        </div>
        <div className="w-[30%] h-full bg-red-100 relative rounded-lg">
          <Image
            src={src ?? "/img/place_holder.jpg"}
            fill={true}
            alt="car"
            onClick={() => router.push(`/reserve/${carId}`)}
            className="object-cover rounded-l-lg shadow-xl hover:contrast-150  transition duration-300 ease-in-out "
          />
        </div>
        <div className="p-6 w-[50%] ">
          <h1
            onClick={() => router.push(`/reserve/${carId}`)}
            className="text-white font-poppins font-bold text-4xl hover:text-gray-300 transition duration-100 ease-in-out hover:scale-[101%] active:scale-100"
          >
            {adminView ? (
              <div>
                <h1>{name}</h1>
                <span className="text-sm"> | Reserve by {userName}</span>
              </div>
            ) : (
              <h1>{name}</h1>
            )}
          </h1>
          {isEditing ? (
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
          ) : (
            <div className="flex flex-row pt-12 space-x-16">
              <div>
                <h1 className="text-white font-kiona text-lg">Rent Date</h1>
                <h1 className="text-white pt-3 text-3xl font-poppins font-">
                  {format(rentDate, "PPP")}
                </h1>
              </div>
              <div>
                <h1 className="text-white font-kiona text-lg">Return Date</h1>
                <h1 className="text-white pt-3 text-3xl font-poppins font-">
                  {format(returnDate, "PPP")}
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCard;
