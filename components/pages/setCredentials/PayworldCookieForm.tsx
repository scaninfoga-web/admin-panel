import { CustomForm } from "@/components/custom/custom-form";
import { CustomInput } from "@/components/custom/custom-input";
import { Button } from "@/components/ui/button";
import { post } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PayworldCookieForm: React.FC = () => {
    const [loading, setloading] = useState(false);
  const payWorldform = useForm<{
    cookie: string;
  }>({
    resolver: zodResolver(
      z.object({
        cookie: z.string().min(1, "Cookie is required"),
      })
    ),
    defaultValues: {
      cookie: "",
    },
  });

  const handlePayWorldSubmit = async () => {
    setloading(true);
    const { cookie } = payWorldform.getValues();
    try {
      const res = await post("api/secondary/set-cookies", {
        cookie: cookie,
      });
      toast.success("PayWorld cookie set successfully!");
    } catch (error) {
      toast.error("Failed to set PayWorld cookie.");
    } finally {
      setloading(false);
    }
  };
  return (
    // <div className="grid grid-cols-4 gap-4">
      <CustomForm
        form={payWorldform}
        onSubmit={handlePayWorldSubmit}
        className="space-y-4"
      >
        <CustomInput
          name="cookie"
          label="PayWorld Cookie"
          type="text"
          placeholder="enter payworld cookie"
        />
        <Button
          type="submit"
          className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
          disabled={loading}
        >
          {loading ? "Loading..." : "Set Cookie Payworld"}
        </Button>
      </CustomForm>
    // </div>
  );
}

export default PayworldCookieForm;