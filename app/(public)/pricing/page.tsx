"use client";
import { PricingTable } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";

function page() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <h2 className="text-3xl text-center font-bold my-4">Pricing</h2>
      <div className="w-full max-w-5xl mx-auto">
        <PricingTable
          appearance={{ theme: resolvedTheme == "dark" ? dark : neobrutalism }}
          ctaPosition="bottom"
        />
      </div>
    </>
  );
}

export default page;
