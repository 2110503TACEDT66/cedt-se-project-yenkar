"use client";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import getSingleCarProvider from "@/libs/getSingleCarProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import CarProviderCard from "@/components/CarProviderCard";
import getCarForOneProvider from "@/libs/getCarForOneProvider";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CldImage,
} from "next-cloudinary";

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
import updataCarProvider from "@/libs/updateCarProvider";
import ProviderCard from "@/components/ProviderCard";

const page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);
  const [isSticky, setIsSticky] = useState(false);
  const [providerData, setproviderData] = useState<CarProvider>();
  const [userProfile, setUserProfile] = useState();
  const [carArray, setCarArray] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingImageData, setEditingImageData] = useState<string | undefined>(
    undefined
  );

  const fetchData = () => {
    const providerJson = getSingleCarProvider(session?.user?._id!).then(
      (res) => {
        setproviderData(res.data);
      }
    );
  };
  const fetchCarForProvider = () => {
    const cars = getCarForOneProvider(session?.user?._id!).then((res) => {
      setCarArray(res.data);
      setisLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    fetchCarForProvider();
  }, []);

  if (!session || !session.user.token) {
    router.push("/sign-in");
    return null;
  }
  console.log(carArray);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Your model must be at least 2 characters long",
    }),
    address: z.string().min(2, {
      message: "Your brand must be at least 2 characters long",
    }),
    telephone: z.string().min(2, {
      message: "Your price must be at least 2 characters long",
    }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: providerData?.name!,
      address: providerData?.address!,
      telephone: providerData?.telephone!,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>): void {
    try {
      updataCarProvider(
        session?.user?._id!,
        values.name,
        values.address,
        values.telephone,
        editingImageData!,
        session?.user.token!
      ).then((res) => {
        if (res) {
          toast({
            title: "Update Success",
            description: "Your provider has been updated",
          });
          setIsEditing(false);
          fetchData();
        } else {
          toast({
            title: "Update Failed",
            description: "Your provider has not been updated",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Your provider has not been updated",
      });
    }
  }
  return (
    <main>
      <NavBar stickyState={false} session={session} />;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-evenly items-center">
          <div className=" w-[30%] h-[100%] flex flex-col relative justify-center items-center">
            <div className=" w-full h-[80%]  flex flex-col relative">
              {/* <CarProviderCard
                name={providerData?.name!}
                address={providerData?.address!}
                telephone={providerData?.telephone!}
              /> */}

              {isEditing ? (
                <div className="w-full h-full">
                  <CldUploadWidget
                    uploadPreset="YenKar"
                    onSuccess={(results) => {
                      setEditingImageData(
                        (results?.info as CloudinaryUploadWidgetInfo)?.public_id
                      );
                      toast({
                        title: "Upload Success",
                        description:
                          "Image has been uploaded waiting for submit",
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
                                editingImageData ??
                                "YenKar/ivrxoeccbri8gxjb4pnx"
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
              ) : (
                <ProviderCard
                  _id={providerData?._id!}
                  name={providerData?.name!}
                  address={providerData?.address!}
                  telephone={providerData?.telephone!}
                  src={providerData?.src ?? "YenKar/ivrxoeccbri8gxjb4pnx"}
                />
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[65%] h-[100%] flex flex-col relative overflow-y-scroll overflow-x-hidden">
            {/* <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Provider Name</h1>
              <h1 className="text-5xl font-poppins text-white">
                {providerData?.name ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Location</h1>
              <h1 className="text-4xl font-poppins text-white">
                {providerData?.address ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Phone</h1>
              <h1 className="text-4xl font-poppins text-white">
                {providerData?.telephone ?? ""}
              </h1>
            </div> */}

            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 pt-[10%] text-white pl-3"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-kiona text-xl">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter new car model"
                            className="w-[50%] text-black"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-kiona text-xl">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter new car brand"
                            className="w-[50%] text-black"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-kiona text-xl">
                          Telephone
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter new rental price"
                            className="w-[50%] text-black"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="py-1 px-5 bg-gradient-to-r from-[#F05B80] to-[#4158F0] text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="pt-5 pl-5">
                <div className=" w-full h-fit flex flex-col  space-y-3 pt-9 pl-6 mb-5">
                  <h1 className="text-4xl font-kiona text-white">
                    Store Information
                  </h1>
                  <div className="flex flex-row gap-1 items-baseline pt-3">
                    <h1 className="text-xl font-kiona text-white">name |</h1>
                    <h1 className="text-xl font-poppins  font-bold text-white">
                      {providerData?.name ?? ""}
                    </h1>
                  </div>
                  <div className="pt-3 grid grid-cols-3 ">
                    <div className="flex flex-row gap-1 items-baseline">
                      <h1 className="text-xl font-kiona text-white">
                        address |
                      </h1>
                      <h1 className="text-xl font-poppins  font-bold text-white">
                        {providerData?.address ?? ""}
                      </h1>
                    </div>{" "}
                    <div className="flex flex-row gap-1 items-baseline">
                      <h1 className="text-xl font-kiona text-white">
                        telephone |
                      </h1>
                      <h1 className="text-xl font-poppins  font-bold text-white">
                        {providerData?.telephone.slice(0, 3) +
                          "-" +
                          providerData?.telephone.slice(3, 6) +
                          "-" +
                          providerData?.telephone.slice(6, 10) ?? ""}
                      </h1>
                    </div>{" "}
                    {/* <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-white">price |</h1>
                    <h1 className="text-xl font-poppins text-white">
                      {carData?.price ?? ""}
                    </h1>
                  </div> */}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col w-full h-fit p-6 justify-center">
              <div className="flex flex-row self-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(!isEditing);
                  }}
                  className={
                    isEditing
                      ? "self-end w-fit mr-5 py-2 px-5 bg-gradient-to-r from-[#F05B80] to-red-700 text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                      : "self-end w-fit mr-5 py-2 px-5 bg-gradient-to-r from-[#F05B80] to-[#4158F0] text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                  }
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/add");
                  }}
                  className=" self-end w-fit mr-5 py-2 px-5 bg-white text-black rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                >
                  Add Car
                </button>
              </div>
              <div className="w-full h-[1px] flex flex-col items-center my-5">
                <div className="bg-white w-[95%] h-full"></div>
              </div>
              <div className="flex flex-row w-full h-fit justify-end pr-5">
                <h1 className="text-4xl font-kiona text-white">
                  Available Car
                </h1>
              </div>
              {isLoading ? (
                <div>loading</div>
              ) : (
                <div className="grid grid-cols-2 w-full h-full mt-10 ml-5">
                  {carArray
                    ? carArray.map((carItem: CarItem) => (
                        //  <AvaliableCarCard _id={carItem._id} src={carItem.src} model={carItem.model} brand={carItem.brand} price={carItem.price} carProvider={carItem.carProvider}/>
                        <Link href={`/mystore/${carItem._id}`}>
                          <div className="w-[90%] h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow ">
                            <CarProviderCard
                              _id={carItem._id}
                              src={carItem.src}
                              model={carItem.model}
                              brand={carItem.brand}
                              price={carItem.price}
                              carProvider={carItem.carProvider}
                            />
                          </div>
                        </Link>
                      ))
                    : ""}
                  <Link href="/add">
                    <div className="w-[90%] h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow rounded-2xl border-white border flex flex-col items-center justify-center">
                      <Image
                        src="/img/plus_sign.svg"
                        alt="plus"
                        width={50}
                        height={50}
                      />
                      <h1 className="p-6 text-white font-kiona text-lg font-medium">
                        Add more car
                      </h1>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
