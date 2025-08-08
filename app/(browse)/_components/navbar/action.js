import { Button } from "@/components/ui/button";
import { SignIn, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server"

export const Action = async () => {

    const user = await currentUser();
    return (
        <div className="flex items-center gap-x-2 justify-end ml-4 lg:ml-0">
            {!user && (
                <SignInButton>
                    <Button>
                        Login
                    </Button>
                </SignInButton>
            )}
            {!!user && (
                <div className="flex items-center gap-x-4">
                    <UserButton
                        afterSignOutUrl="/" />
                </div>

            )}
        </div>
    )
}