"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/utils/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "email address is missing." }),
  password: z.string().min(8, { message: "password is missing." }),
});

type FormSchema = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(data.email, data.password);
      if (response.token) {
        localStorage.setItem("token", response.token); // Save the token
        router.push("/home");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-center tracking-tight mb-4">
          Login to your account
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >

            {error && <p className="text-red-500 text-center">{error}</p>}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label>Password</Label>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
          </form>
        </Form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t" />
          <span className="px-2 text-muted-foreground">OR</span>
          <hr className="flex-grow border-t" />
        </div>

        {/* "Already have an account?" text */}
        <p className="text-center text-muted-foreground">Don't have an account?</p>

        {/* Outline button for login */}
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => router.push("/register")}
        >
          Sign Up
        </Button>
      </div>


    </div>
  )
}

export default Page;