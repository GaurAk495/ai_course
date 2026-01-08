import { ModeToggle } from "@/components/theme/toggleButton";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1>Hello</h1>
      <Button className="bg-primary">Click me</Button>
      <ModeToggle />
    </div>
  );
}
