import React, { useState } from "react";
import Background from "@/assets/login2.png";
import victory from "@/assets/victory.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api-client";
import { SIGNUP_ROUTE } from "@/utils/constant";
import { signup_api } from "@/service/auth.service.api";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function Auth() {
  const navigate=useNavigate()
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    reset: resetSignup,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = (data) => {
    console.log("Login Data:", data);
    toast.success("Login form submitted successfully!");
    resetLogin();
  };
  const handleSignup = async(data) => {
 try {
     console.log("Signup Data:", data);
     await signup_api(data.email,data.password)
     toast.success("Signup form submitted successfully!");
     navigate("/profile")
     resetSignup();

 } catch (error) {
  console.log("errrr",error)
 }
  };

  const handleLoginError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  const handleSignupError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl ">Welcome</h1>
              <img src={victory} alt="victory emoji" className="h-20" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-10">
                <form
                  onSubmit={handleLoginSubmit(handleLogin, handleLoginError)}
                  className="flex flex-col gap-5"
                >
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    {...loginRegister("email")}
                  />

                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    {...loginRegister("password")}
                  />
                  <Button type="submit" className="rounded-full p-6">
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent className="mt-5" value="signup">
                <form
                  onSubmit={handleSignupSubmit(handleSignup, handleSignupError)}
                  className="flex flex-col gap-5"
                >
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                    {...signupRegister("email")}
                  />

                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                    {...signupRegister("password")}
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="rounded-full p-6"
                    {...signupRegister("confirmPassword")}
                  />
                  <Button type="submit" className="rounded-full p-6">
                    Signup
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className=" hidden xl:flex justify-center items-center">
          <img src={Background} alt="background login" className="h-[700px]" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
