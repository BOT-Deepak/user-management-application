// Login Page for all users of the application, it takes 3 parameters:
// 1) Email 2) Password 3) Organization
// As one user with one email can be a part of multiple organization. 
// hence, Logging in with permission given on that organization

'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next-nprogress-bar';
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginForm() {

    // useState() function to get and set parametric values
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organization, setOrganization] = useState("");

    // Router to move between pages of the application
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Checking if all the parameters are filled.

        if(!email || !password || !organization) {
            toast.warning("All fields are necessary!");
            return;
        }

        try {

            // Trying to sign in with the credentials only if the account is verified.

            const res = await signIn("credentials", {
                email,
                password,
                organization,
                redirect: false,
            });

            // If user is not logged in, show wrong credentials.

            if(!res.ok) {
                toast.warning("Wrong Credentials OR User not verified!");
                return;
            }

            toast.success("Login Successful!");

            // redirecting to the dashboard of the user if logged in.

            router.replace("/dashboard");
        }
        catch(e) {
            toast.error(`Error: ${e}`);
            console.log(e);
        }
    };

    return (

        // Html code which consists of a form which takes input: Email, password and organization data.
        // There are 2 links down, one for reset password, another for register page.

        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-4 border-orange-300">
                <h1 className="text-xl font-bold my-4">Login</h1>
                <form className="flex flex-col gap-3" onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <input type="text" placeholder="Ogranization" onChange={(e) => setOrganization(e.target.value)}/>
                    <button type="submit" className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Login</button>

                    <Link className="text-sm mt-3 text-right" href={'/reset'}>
                        Forgot Password? <span className="underline">Reset</span>
                    </Link>
                    <Link className="text-sm text-right" href={'/register'}>
                        Don't have an account? <span className="underline">Register</span>
                    </Link>
                </form>
            </div>
        </div>
    )
}