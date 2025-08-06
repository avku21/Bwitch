import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";


const font = Poppins({
    subsets: ["latin"],
    weight: ["200", "300" , "400", "500", "600", "700" , "800"],
});

export const Logo = () => {
    return(
        <div className="flex flex-col items-center gap-y-2">
            <div className="roundded-full bg-white p-1">
                <Image
                    src = "/bimg.svg"
                    alt = "Bwitch"
                    height="80"
                    width="80"
                />
                <div className="flec flex-col items-center">
                    <p className={cn(
                        "text-xl font-semibold",
                        font.className
                    )}> 
                        Bwitch
                    </p>

                </div>

            </div>
        </div>
    )
}
