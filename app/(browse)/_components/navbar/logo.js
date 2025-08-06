import Link from "next/link";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";


const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const Logo = () => {
    return (
        <Link href="/">
            <div className="flex items-center gap-x-4 hover:opacity-75 transition">
                <div className="rounded-full bg-white p-1 mr-12 shrink-0 lg:mr-0 lg:shrink">
                    <Image
                        src="/bimg.svg"
                        alt="Bwitch"
                        height="32"
                        width="32"
                    />
                </div>
                <div className={cn(
                    "hidden lg:block",
                    font.className
                )}>
                    <p className="text-white text-xl font-semibold">
                        Bwitch
                    </p>
                </div>
            </div>
        </Link>
    )
}
