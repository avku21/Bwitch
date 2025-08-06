import Link from "next/link";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";


const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300" , "400", "500", "600", "700" , "800"],
});

export const Logo = () => {
    return(
        <Link href="/">
            <div className="hidden lg:flex items-center gap-x-4 hover:opacity-75 transition">
                <div className="rounded-full bg-white p-1">
                    <Image
                        src="/bimg.svg"
                        alt="Bwitch"
                        height="32"
                        width="32"
                    />
                </div>
                <div className={cn("text-white text-xl font-semibold" , 
                    font.className
                )}>
                    Bwitch
                </div>        
            </div>
        </Link>
    )
}
