import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <div className="text-2xl mx-auto w-full ">HI my name is shubhu</div>
      <nav className="w-full bg-red-400">
        <UserButton />
        <ModeToggle />
      </nav>
    </>
  );
}
