"use client";
import NavBar from "@/components/NavBar";
import React, { useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

// form////
import { nan, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import addCar from "@/libs/addCar";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { Cargo, Transmission } from "../../../interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command } from "cmdk";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/libs/utils";
///////

const page = ({ params }: { params: { cid: string } }) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const [editingImageData, setEditingImageData] = useState<string | undefined>(
    undefined
  );
  //   const fetchData = () => {
  //     const carJson = getSingleCar(params.cid).then((res) => {
  //       setCarItem(res.data);
  //     });
  //   };

  //   useEffect(() => {

  //     fetchData();

  //   }, []);

  if (!session || !session.user.token) {
    router.push("/sign-in");
    return null;
  }

  const cargoOptions = [
    { label: "-", value: Cargo.none },
    { label: "small", value: Cargo.small },
    { label: "medium", value: Cargo.medium },
    { label: "large", value: Cargo.large },
    { label: "super large", value: Cargo.superLarge },
  ] as const;
  const transmissionOptions = [
    { label: "manual", value: Transmission.manual },
    { label: "auto", value: Transmission.auto },
    { label: "AWT", value: Transmission.AWT },
    { label: "other", value: Transmission.other },
  ] as const;

  // console.log(carArray);

  // form ////

  const formSchema = z.object({
    model: z.string().min(2, {
      message: "Your model must be at least 2 characters long",
    }),
    brand: z.string().min(2, {
      message: "Your brand must be at least 2 characters long",
    }),
    price: z.coerce.number().int().positive().gte(1),
    doors: z.coerce.number().int().positive().gte(1),
    seats: z.coerce.number().int().positive().gte(1),
    transmission: z.enum(["manual", "auto", "AWT", "other"]),
    cargo: z.enum(["-", "small", "medium", "large", "super large"]),
    radio: z.boolean(),
    air: z.boolean(),
    vrm: z.string(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "",
      brand: "",
      price: undefined,
      doors: undefined,
      seats: undefined,
      transmission: undefined,
      cargo: undefined,
      radio: false,
      air: false,
      vrm: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>): void {
    try {
      addCar(
        session?.user?.token!,
        session?.user?._id!,
        values.brand,
        values.model,
        values.price,
        values.doors,
        values.seats,
        values.vrm,
        values.transmission,
        values.cargo,
        values.radio,
        values.air,
        editingImageData
      ).then((res) => {
        if (res) {
          toast({
            title: "Success",
            description: "Car added successfully",
            duration: 3000,
          });
          router.back();
        } else {
          toast({
            title: "Error",
            description: "Car not added",
            variant: "destructive",
            duration: 3000,
          });
        }
      });
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    }
  }
  ///////////

  return (
    <main>
      <NavBar stickyState={false} session={session} />;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-evenly items-center">
          <div className=" w-[25%] h-[100%] flex flex-col relative justify-center items-center">
            <div className=" w-full h-[80%]  flex flex-col relative">
              <div className="w-full h-full">
                <CldUploadWidget
                  uploadPreset="YenKar"
                  onSuccess={(results) => {
                    setEditingImageData(
                      (results?.info as CloudinaryUploadWidgetInfo)?.public_id
                    );
                    toast({
                      title: "Upload Success",
                      description: "Image has been updated",
                      duration: 3000,
                    });
                  }}
                >
                  {({ open }) => {
                    return (
                      <div
                        className=" w-full h-full  border-white border-2 rounded-xl flex flex-col justify-center items-center gap-4"
                        onClick={() => {
                          open();
                        }}
                      >
                        {editingImageData ? (
                          <CldImage
                            alt="image"
                            src={
                              editingImageData ?? "YenKar/ivrxoeccbri8gxjb4pnx"
                            }
                            fill={true}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <Image
                            src="/img/plus_sign.svg"
                            alt="image"
                            width={50}
                            height={50}
                            className="hover:scale-105 transition duration-300 ease-in-out"
                          />
                        )}

                        <div className="text-white font-kiona">
                          Upload Image
                        </div>
                      </div>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </div>
            {/* <div className="flex flex-col gap-3 p-4 font-poppins">
                <div className="text-xl">{carItem?.model!}</div>
                <div>{carItem?.brand!}</div>
                <div>{`${carItem?.price!} $`}</div>
              </div> */}
            {/* </div> */}
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[65%] h-[100%] flex flex-col relative overflow-y-scroll overflow-x-hidden">
            {/* <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">model</h1>
              <h1 className="text-5xl font-poppins text-white">
                {carItem?.model ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">brand</h1>
              <h1 className="text-4xl font-poppins text-white">
                {carItem?.brand ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">price</h1>
              <h1 className="text-4xl font-poppins text-white">
                {carItem?.price ?? ""}
              </h1>
            </div> */}

            {/* {!isAdding ? (
              <div>
                <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
                  <h1 className="text-2xl font-kiona text-white">model</h1>
                  <h1 className="text-5xl font-poppins text-white">
                    {carItem?.model ?? ""}
                  </h1>
                </div>
                <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
                  <h1 className="text-2xl font-kiona text-white">brand</h1>
                  <h1 className="text-4xl font-poppins text-white">
                    {carItem?.brand ?? ""}
                  </h1>
                </div>
                <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
                  <h1 className="text-2xl font-kiona text-white">price</h1>
                  <h1 className="text-4xl font-poppins text-white">
                    {carItem?.price ?? ""}
                  </h1>
                </div>
              </div> */}
            {
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 h-fit pt-10"
                >
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona">
                          Model
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[80%] bg-black border-white border-[1px] text-base text-white"
                            placeholder="Enter your car model"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona">
                          Brand
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[80%] bg-black border-white border-[1px] text-base text-white"
                            placeholder="Enter your car brand"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vrm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona">
                          Plate Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[80%] bg-black border-white border-[1px] text-base text-white"
                            placeholder="Enter your car plate number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona">
                          Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-[80%] bg-black border-white border-[1px] text-base text-white"
                            placeholder="Enter your car price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona">
                          doors
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-[80%] bg-black border-white border-[1px] text-base text-white"
                            placeholder="Enter your car doors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-kiona">
                          seats
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-[80%] bg-black border-white border-[1px] text-base text-white"
                            placeholder="Enter your car seats"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-kiona text-white">
                          transmission
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[300px] justify-between bg-black text-white",
                                  !field.value && "text-white"
                                )}
                              >
                                {field.value
                                  ? transmissionOptions.find(
                                      (transmission) =>
                                        transmission.value === field.value
                                    )?.label
                                  : "Select transmission size"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command className="bg-zinc-950">
                              <CommandInput
                                placeholder="Search transmission size"
                                className="text-white"
                              />
                              <CommandEmpty>
                                No transmission size found.
                              </CommandEmpty>
                              <CommandGroup className=" text-white">
                                <CommandList>
                                  {transmissionOptions.map((transmission) => (
                                    <CommandItem
                                      className="hover:invert bg-zinc-950"
                                      value={transmission.label}
                                      key={transmission.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "transmission",
                                          transmission.value
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          transmission.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {transmission.label}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-kiona text-white">
                          cargo
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[300px] justify-between bg-black text-white",
                                  !field.value && "text-white"
                                )}
                              >
                                {field.value
                                  ? cargoOptions.find(
                                      (cargo) => cargo.value === field.value
                                    )?.label
                                  : "Select cargo size"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command className="bg-zinc-950">
                              <CommandInput
                                placeholder="Search cargo size"
                                className="text-white"
                              />
                              <CommandEmpty>No cargo size found.</CommandEmpty>
                              <CommandGroup className=" text-white">
                                <CommandList>
                                  {cargoOptions.map((cargo) => (
                                    <CommandItem
                                      className="hover:invert bg-zinc-950"
                                      value={cargo.label}
                                      key={cargo.value}
                                      onSelect={() => {
                                        form.setValue("cargo", cargo.value);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          cargo.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {cargo.label}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="air"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            className={cn("text-white")}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-kiona text-white">
                            Air conditioner
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="radio"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            className={cn("text-white")}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-kiona text-white">
                            Radio
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    {...form}
                    type="submit"
                    className="px-3 py-1 bg-white text-black "
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            }

            <div className="w-full h-[1px] flex flex-col items-center mt-10">
              <div className="bg-white w-[95%] h-full"></div>
            </div>
            <div className="flex flex-col w-full h-fit p-6 justify-center">
              <div className="flex flex-row w-full h-fit justify-end">
                <h1 className="text-4xl font-kiona text-white">
                  add to the store
                </h1>
              </div>
              {/* <div className="flex flex-row gap-4 justify-end pt-5">
                <button
                  onClick={(e) => {
                    setIsAdding(!isAdding);
                    e.stopPropagation();
                  }}
                  className="py-1 px-5 bg-rose-600 text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                >
                  {isAdding ? "Cancel" : "Add"}
                </button>
             
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
