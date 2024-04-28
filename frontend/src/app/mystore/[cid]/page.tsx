"use client";
import ExploreCard from "@/components/ExploreCard";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import getSingleCar from "@/libs/getSingleCar";

// form////
import { z } from "zod";
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
import editCar from "@/libs/editCar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import deleteCar from "@/libs/deleteCar";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import getCarForOneProvider from "@/libs/getCarForOneProvider";
import { Label } from "@radix-ui/react-label";
import EditCarCard from "@/components/EditCarCard";
///////

const page = ({ params }: { params: { cid: string } }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const [carItem, setCarItem] = useState<CarItem | null>(null);
  const { toast } = useToast();
  const [editingImageData, setEditingImageData] = useState<string | undefined>(
    undefined
  );
  const [editedCarName, setEditedCarName] = useState<string | undefined>("");
  const [editedCarBrand, setEditedCarBrand] = useState<string | undefined>("");
  const [editedCarPrice, setEditedCarPrice] = useState<number | undefined>(0);
  const [numberOfCars, setNumberOfCars] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    model: z.string().min(2, {
      message: "Your model must be at least 2 characters long",
    }),
    brand: z.string().min(2, {
      message: "Your brand must be at least 2 characters long",
    }),
    price: z.coerce.number().int().positive(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: carItem?.model!,
      brand: carItem?.brand!,
      price: carItem?.price!,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>): void {
    try {
      editCar(
        session?.user?.token!,
        params.cid,
        values.brand,
        values.model,
        values.price,
        editingImageData
      ).then((res) => {
        if (res) {
          toast({
            title: "Success",
            description: "Car updated successfully",
            duration: 3000,
          });
          fetchData();
          setOpen(false);
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
    const carJson = getSingleCar(params.cid).then((res) => {
      setCarItem(res.data);
      form.setValue("model", res.data.model);
      form.setValue("brand", res.data.brand);
      form.setValue("price", res.data.price);
      console.log(res.data);
    });
  };

  const getNumberOfCars = (): number => {
    const numberOfCars = getCarForOneProvider(session?.user?._id!).then(
      (res) => {
        console.log(res.data.length);
        return setNumberOfCars(res.data.length);
      }
    );
    return 0;
  };
  useEffect(() => {
    fetchData();
    getNumberOfCars();
  }, []);

  const isTheLastCar = () => {
    return numberOfCars === 1;
  };

  if (!session || !session.user.token) {
    router.push("/sign-in");
    return null;
  }

  return (
    <main>
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
                  editCar(
                    session?.user?.token!,
                    params.cid,
                    carItem?.brand,
                    carItem?.model,
                    carItem?.price,
                    (results?.info as CloudinaryUploadWidgetInfo)?.public_id
                  ).then((res) => {
                    if (res) {
                      toast({
                        title: "Success",
                        description: "Car updated successfully",
                        duration: 3000,
                      });

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
                }}
              >
                {({ open }) => {
                  return (
                    <div className=" w-full h-full flex flex-col justify-center items-center gap-4">
                      <Button
                        onClick={(e) => {
                          open();
                        }}
                        className="font-kiona font-bold p-3 drop-shadow-lg absolute z-50 bottom-[33%]  right-4
            bg-black bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 rounded-xl text-white hover:scale-105 transition duration-300 ease-in-out active:scale-100 active:bg-opacity-100 active:duration-75"
                      >
                        Change the car profile
                      </Button>
                      <EditCarCard
                        _id={carItem?._id!}
                        src={carItem?.src}
                        brand={carItem?.brand!}
                        model={carItem?.model!}
                        price={carItem?.price!}
                        carProvider={carItem?.carProvider!}
                        key={carItem?._id}
                      />
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>
          </div>

          <div className=" w-[65%] h-[100%] flex flex-col relative overflow-y-scroll overflow-x-hidden">
            <div className="pt-5 pl-5">
              <div className=" w-full h-fit flex flex-col  space-y-3 pt-9 pl-6 mb-5">
                <h1 className="text-4xl font-kiona text-white">
                  Car Information
                </h1>
                <div className="flex flex-row gap-1 items-baseline pt-3">
                  <h1 className="text-xl font-kiona text-white">model |</h1>
                  <h1 className="text-xl font-poppins  font-bold text-white">
                    {carItem?.model ?? ""}
                  </h1>
                </div>
                <div className="pt-3 grid grid-cols-3 ">
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-white">Brand |</h1>
                    <h1 className="text-xl font-poppins  font-bold text-white">
                      {carItem?.brand ?? ""}
                    </h1>
                  </div>{" "}
                  <div className="flex flex-row gap-1 items-baseline">
                    <h1 className="text-xl font-kiona text-white">price |</h1>
                    <h1 className="text-xl font-poppins  font-bold text-white">
                      {carItem?.price + " $" ?? ""}
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

            <div className="w-full h-[1px] flex flex-col items-center mt-10">
              <div className="bg-white w-[95%] h-full"></div>
            </div>
            <div className="flex flex-col w-full h-fit p-6 justify-center">
              <div className="flex flex-row w-full h-fit justify-end">
                <h1 className="text-4xl font-kiona text-white">
                  manage your car
                </h1>
              </div>
              <div className="flex flex-row gap-4 justify-end pt-5">
                <Dialog
                  open={open}
                  onOpenChange={(e) => {
                    setOpen(e);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="p-3 mr-2 rounded-lg bg-gradient-to-r font-light text-base from-[#F05B80] to-[#4158F0] text-white hover:scale-105 transition duration-300 ease-in-out hover:saturate-150 active:scale-100"
                    >
                      Edit Car
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[30%] bg-[#0b0b0c] text-white">
                    <DialogHeader>
                      <DialogTitle>Edit your car</DialogTitle>
                      <DialogDescription>
                        Make change to your car information. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    {/* <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="model" className="text-right">
                          Model
                        </Label>
                        <Input
                          id="model"
                          placeholder="Enter your car model"
                          defaultValue={carItem?.model!}
                          value={editedCarName}
                          onChange={(e) => {
                            setEditedCarName(e.target.value);
                          }}
                          className="col-span-3 text-white w-fit h-12 bg-[#0b0b0c] border-white border-[1px] text-base"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brand" className="text-right">
                          Brand
                        </Label>
                        <Input
                          id="brand"
                          placeholder="Enter your car brand"
                          defaultValue={carItem?.brand!}
                          value={editedCarBrand}
                          onChange={(e) => {
                            setEditedCarBrand(e.target.value);
                          }}
                          className="col-span-3 text-white w-fit h-12 bg-[#0b0b0c] border-white border-[1px] text-base"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price
                        </Label>
                        <Input
                          id="price"
                          placeholder="Enter new price"
                          defaultValue={carItem?.price!}
                          value={editedCarPrice}
                          onChange={(e) => {
                            setEditedCarPrice(parseInt(e.target.value));
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
                          name="model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-kiona">
                                Model
                              </FormLabel>
                              <FormControl>
                                <Input
                                  defaultValue={carItem?.model!}
                                  className="w-[80%] bg-black border-white border-[1px] text-base "
                                  placeholder="shadcn"
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
                              <FormLabel className="font-kiona">
                                Brand
                              </FormLabel>
                              <FormControl>
                                <Input
                                  defaultValue={carItem?.brand!}
                                  className="w-[80%] bg-black border-white border-[1px] text-base "
                                  placeholder="shadcn"
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
                              <FormLabel className="font-kiona">
                                Model
                              </FormLabel>
                              <FormControl>
                                <Input
                                  defaultValue={carItem?.price!}
                                  className="w-[80%] bg-black border-white border-[1px] text-base "
                                  placeholder="shadcn"
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
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="px-1 py-[1px] bg-rose-600 text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100">
                      <Button>Delete</Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-[#222529] py-5 px-10 ">
                    <DialogHeader className="text-white font-kiona mb-5">
                      <DialogTitle className="mt-2 mb-5 text-2xl">
                        ARE YOU ABSOLUTELY SURE?
                      </DialogTitle>
                      <DialogDescription>
                        {/* This action cannot be undone. This will permanently
                        delete your car form our servers. */}

                        {isTheLastCar()
                          ? "This is your last car, If you proceed your profile will not show in the store."
                          : "This action cannot be undone. This will permanently delete your car from our servers."}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="justify-end">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          className="bg-[#222529] border border-white text-white hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          className="bg-rose-600 text-white rounded-lg hover:scale-105 transition duration-300 ease-in-out active:scale-100"
                          onClick={() => {
                            deleteCar(params.cid, session.user.token);
                            router.prefetch("/mystore");
                            router.push("/mystore");
                          }}
                        >
                          Delete
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
