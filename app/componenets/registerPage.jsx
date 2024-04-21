// Page for registering user into the database and send verification token on the email

'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm() {

    // Setting name, email, password and organization from the fields.

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organization, setOrganization] = useState("");

    const router = useRouter();

    // handleSubmit() function is called with user clicks on register button to proceed with token generation and checks.

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!name || !email || !password || !organization) {
            toast.warning("All fields are necessary!");
            return;
        }

        try {

            // checks if user already exists or not
            const user_exists = await fetch('api/userExists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, organization }),
            })

            const { data, message, status } = await user_exists.json();
            
            // if user exists, then return;
            if(data == true) {
                toast.warning(`Email with ${organization}, already exists!`);
                return;
            }

            // Registering the user into the database.
            const res = await fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name, email, password, organization
                }),
            })

            if(res.ok) {
                const form = e.target;
                const { docid, message, status  } = await res.json();

                const verificationToken = await fetch('api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        docid, organization
                    }),
                });

                const { data } = await verificationToken.json();

                const sendToken = await fetch('api/mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email, data, organization,
                        sendL: "verify",
                    }),
                });

                toast.info(`Please check your email: ${email} for verification link!`);
                form.reset();
                router.replace("/");
            } else {
                console.log('User registration failed.')
            }
        } catch(e) {
            console.log('Error during registration: ', e);
        }
    };

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
                <h1 className="text-xl font-bold my-4">Register</h1>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)}/>
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <input type="text" placeholder="Organization" onChange={(e) => setOrganization(e.target.value)}/>

                    <button type="submit" className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Register</button>
                    <Link className="text-sm mt-3 text-right" href={'/'}>
                        Already have an account? <span className="underline">Login</span>
                    </Link>
                </form>
            </div>
        </div>
    )
}