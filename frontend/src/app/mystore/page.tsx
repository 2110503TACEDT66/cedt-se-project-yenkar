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
import updateCarProvider from "@/libs/updateCarProvider";
import ProviderCard from "@/components/ProviderCard";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommandMenu } from "@/components/CommandMenu";
import { CarItem, CarProvider } from "@/index";

const page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);
  const [isSticky, setIsSticky] = useState(false);
  const [providerData, setProviderData] = useState<CarProvider>();
  const [userProfile, setUserProfile] = useState();
  const [carArray, setCarArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingImageData, setEditingImageData] = useState<string | undefined>(
    undefined
  );
  const [editedName, setEditedName] = useState<string | undefined>(undefined);
  const [editedAddress, setEditedAddress] = useState<string | undefined>(
    undefined
  );
  const [editedTelephone, setEditedTelephone] = useState<string | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Your model must be at least 2 characters long",
    }),
    address: z
      .string()
      .min(2, {
        message: "Your brand must be at least 2 characters long",
      })
      .max(100, {
        message: "Your brand must be at most 100 characters long",
      }),
    telephone: z.string().length(10, {
      message: "Your telephone must be 10 characters long",
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
      updateCarProvider(
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
            duration: 3000,
          });
          setOpen(false);
          fetchData();
        } else {
          toast({
            title: "Update Failed",
            description: "Your provider has not been updated",
            variant: "destructive",
            duration: 3000,
          });
        }
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Your provider has not been updated",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  const fetchData = () => {
    const providerJson = getSingleCarProvider(session?.user?._id!).then(
      (res) => {
        setProviderData(res.data);
        form.setValue("name", res.data.name);
        form.setValue("address", res.data.address);
        form.setValue("telephone", res.data.telephone);
      }
    );
  };
  const fetchCarForProvider = () => {
    const cars = getCarForOneProvider(session?.user?._id!).then((res) => {
      setCarArray(res.data);
      setIsLoading(false);
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

  return (
    <main>
      <CommandMenu session={session} />
      <NavBar stickyState={false} session={session} />;
      <div className="flex flex-col items-center">
        <div className="bg-[#17191C] rounded-xl w-[90vw] h-[72vh] flex flex-row justify-evenly items-center">
          <div className=" w-[30%] h-[100%] flex flex-col relative justify-center items-center">
            <div className=" w-full h-[80%]  flex flex-col relative">
              <CldUploadWidget
                uploadPreset="YenKar"
                onSuccess={(results) => {
                  setEditingImageData(
                    (results?.info as CloudinaryUploadWidgetInfo)?.public_id
                  );
                  updateCarProvider(
                    session?.user?._id!,
                    providerData?.name!,
                    providerData?.address!,
                    providerData?.telephone!,
                    (results?.info as CloudinaryUploadWidgetInfo)?.public_id,
                    session?.user.token!
                  ).then((res) => {
                    if (res) {
                      toast({
                        title: "Upload Success",
                        description: "Image has been updated",
                        duration: 3000,
                      });
                      fetchData();
                    } else {
                      toast({
                        title: "Upload Failed",
                        description: "Image has not been uploaded",
                        variant: "destructive",
                        duration: 3000,
                      });
                    }
                  });
                }}
              >
                {({ open }) => {
                  return (
                    <div className=" w-full h-full flex flex-col justify-center items-center gap-4">
                      <Button
                        onClick={(e) => {
                          open();
                        }}
                        className="font-kiona font-bold p-3 drop-shadow-lg absolute z-50 bottom-[33%] right-4
            bg-black bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 rounded-xl text-white hover:scale-105 transition duration-300 ease-in-out active:scale-100 active:bg-opacity-100 active:duration-75"
                      >
                        Change profile image
                      </Button>

                      <ProviderCard
                        _id={providerData?._id!}
                        name={providerData?.name!}
                        address={providerData?.address!}
                        telephone={providerData?.telephone!}
                        src={providerData?.src ?? "YenKar/ivrxoeccbri8gxjb4pnx"}
                      />
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>
          </div>
          <div className="bg-white rounded-xl w-[3px] h-[85%]"></div>

          <div className=" w-[65%] h-[100%] flex flex-col relative overflow-y-scroll overflow-x-hidden no-scrollbar">
            {/* <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Provider Name</h1>
              <h1 className="text-5xl font-Poppins text-white">
                {providerData?.name ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Location</h1>
              <h1 className="text-4xl font-Poppins text-white">
                {providerData?.address ?? ""}
              </h1>
            </div>
            <div className=" w-fit h-fit flex flex-col space-y-3 pt-9 pl-6">
              <h1 className="text-2xl font-kiona text-white">Phone</h1>
              <h1 className="text-4xl font-Poppins text-white">
                {providerData?.telephone ?? ""}
              </h1>
            </div> */}

            <div className="pt-5 pl-5">
              <div className=" w-full h-fit flex flex-col  space-y-3 pt-9 pl-6 mb-5">
                <h1 className="text-4xl font-kiona text-white">
                  Store Information
                </h1>
                <div className="flex flex-row gap-1 items-baseline pt-5">
                  <h1 className="text-xl font-kiona text-white">name | </h1>
                  <h1 className="text-xl font-Poppins font-semibold text-white pl-2">
                    {providerData?.name ?? ""}
                  </h1>
                </div>
                <div className="flex flex-row gap-1 items-baseline pt-3">
                  <h1 className="text-xl font-kiona text-white">address | </h1>
                  <h1 className="text-xl font-Poppins font-semibold text-white pl-2">
                    {providerData?.address ?? ""}
                  </h1>
                </div>{" "}
                <div className="flex flex-row gap-1 items-baseline pt-3">
                  <h1 className="text-xl font-kiona text-white">telephone |</h1>
                  <h1 className="text-xl font-Poppins font-semibold text-white pl-2">
                    {providerData?.telephone.slice(0, 3) +
                      "-" +
                      providerData?.telephone.slice(3, 6) +
                      "-" +
                      providerData?.telephone.slice(6, 10) ?? ""}
                  </h1>
                </div>{" "}
                {/* <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-white">price |</h1>
                    <h1 className="text-xl font-Poppins text-white">
                      {carData?.price ?? ""}
                    </h1>
                  </div> */}
              </div>
            </div>

            <div className="flex flex-col w-full h-fit p-6 justify-center">
              <div className="flex flex-row self-end">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="p-3 mr-2 rounded-lg bg-gradient-to-r font-light text-base from-[#F05B80] to-[#4158F0] text-white hover:scale-105 transition duration-300 ease-in-out hover:saturate-150 active:scale-100"
                    >
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[30%] bg-[#0b0b0c] text-white">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    {/* <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter your stor bg-black name"
                          defaultValue={providerData?.name!}
                          value={editedName}
                          onChange={(e) => {
                            setEditedName(e.target.value);
                          }}
                          className="col-span-3 text-white w-fit h-12 bg-[#0b0b0c] border-white border-[1px] text-base"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Address
                        </Label>
                        <textarea
                          id="address"
                          placeholder="Enter your address"
                          defaultValue={providerData?.address!}
                          value={editedAddress}
                          onChange={(e) => {
                            setEditedAddress(e.target.value);
                          }}
                          className="col-span-2 text-white h-28 bg-[#0b0b0c] border-white border-[1px] text-base"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Telephone
                        </Label>
                        <Input
                          id="telephone"
                          placeholder="Enter bg-black your telephone number"
                          defaultValue={providerData?.telephone!}
                          value={editedTelephone}
                          onChange={(e) => {
                            setEditedTelephone(e.target.value);
                          }}
                          className="col-span-3 text-white w-fit h-12 bg-[#0b0b0c] border-white border-[1px] text-base"
                        />
                      </div>
                    </div> */}
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-kiona">Name</FormLabel>
                              <FormControl>
                                <Input
                                  defaultValue={providerData?.name!}
                                  className="w-[80%] bg-black border-white border-[1px] text-base "
                                  placeholder="Enter your store name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-rose-600" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-kiona">
                                Address
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  defaultValue={providerData?.address!}
                                  className="w-[80%] bg-black border-white border-[1px] text-base"
                                  placeholder="Enter your address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-rose-600" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="telephone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-kiona">
                                Telephone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  defaultValue={providerData?.telephone!}
                                  className="w-[80%] bg-black border-white border-[1px] text-base "
                                  placeholder="Enter your telephone number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-rose-600" />
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
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
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
                    <div className="w-[90%] h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow border-white border flex flex-col items-center justify-center">
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
