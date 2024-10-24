"use client";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Button from "./Components/Button";
import Image from "next/image";

export default function Home() {
  const generateClipboardID = () => uuidv4().toString();
  const router = useRouter();
  return (
    <>
      <div className="flex max-sm:gap-5 sm:gap-[1vw] max-sm:flex-col sm:w-4/5">
        <div
          onClick={() => router.push("/Clipboard/" + generateClipboardID())}
          className="flex flex-col justify-center items-center w-full overflow-hidden bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        >
          <div className="flex hover:scale-105 z-10 duration-300 transition-all shadow-md relative max-sm:w-[18rem] max-sm:h-[15rem] sm:w-[20vw] sm:h-[20vw]">
            <Image src={"/new.jpg"} alt="logo" fill objectFit="contain" />
          </div>
          <Button
            hoverColor="hover:bg-yellow-500/80"
            color="bg-yellow-500"
            title="New Clipboard"
          />
        </div>
        <div
          onClick={() => router.push("/Clipboard/" + generateClipboardID())}
          className="flex flex-col justify-center items-center w-full overflow-hidden bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        >
          <div className="flex hover:scale-105 z-10 duration-300 transition-all shadow-md relative max-sm:w-[18rem] max-sm:h-[15rem] sm:w-[20vw] sm:h-[20vw]">
            <Image src={"/join.jpg"} alt="logo" fill objectFit="contain" />
          </div>
          <Button
            hoverColor="hover:bg-blue-600/80"
            color="bg-blue-600"
            title="Join Clipboard"
          />
        </div>
      </div>
    </>
  );
}
