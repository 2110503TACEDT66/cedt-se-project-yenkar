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
  FormDescription,
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
  // console.log(carArray);

  // form ////

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
      model: "",
      brand: "",
      price: undefined,
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
        editingImageData
      ).then((res) => {
        toast({
          title: "Success",
          description: "Car added successfully",
        });
        router.back();
        // fetchData();
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
                      description: "Image has been uploaded waiting for submit",
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
                  className="space-y-8 pt-[10%] text-white pl-3"
                >
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-kiona text-xl">
                          Model
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
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-kiona text-xl">
                          Brand
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-kiona text-xl">
                          Price
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
                    Add
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
