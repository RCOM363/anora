"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
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

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";

function Page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      if (!data.code.trim()) {
        return;
      }
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast.success("Success", {
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Signup failed", {
        description: axiosError.response?.data.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[90%] max-w-md p-8 space-y-8 rounded-lg border-solid border-[2px]">
        <div className="text-center">
          <h1 className="text-3xl text-[#8a2be2] font-extrabold tracking-tight lg:text-4xl mb-6">
            Verify your account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} name="code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#8a2be2] hover:bg-[#7424c9] text-white"
            >
              Submit code
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
