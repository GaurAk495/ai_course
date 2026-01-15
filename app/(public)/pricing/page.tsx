import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

function page() {
  return (
    <>
      <h2 className="text-3xl text-center font-bold my-4">Pricing</h2>
      <div className="w-full max-w-5xl mx-auto">
        <PricingTable appearance={{ theme: dark }} ctaPosition="bottom" />
      </div>
    </>
  );
}

export default page;
