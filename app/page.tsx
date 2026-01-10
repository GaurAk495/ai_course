"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <Button className="bg-primary" onClick={() => setCount(count + 1)}>
        Click me
      </Button>
    </>
  );
}
