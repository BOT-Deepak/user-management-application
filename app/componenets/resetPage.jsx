// this page helps for password reset, with checking email, organization presense in the database
// sets a new token, and send it to the mail of the user if registered and verified.

'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPage() {
    
    const [email, setEmail] = useState("");
    const [organization, setOrganization] = useState("");

    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();

        // checks if the email and organization fields are not empty.

        if(!email || !organization) {
            toast.warning("All fields are necessary!");
            return;
        }

        try {

            // getting the document id in the database of the user details.

            const user_id = await fetch('api/getdoc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, organization }),
            })

            const { docid } = await user_id.json();

            // checks if the document id is not present, then credentials are not available in database
            if(docid == "") {
                toast.error("User not verified OR registered with this organization!");
                return;
            }

            // fetching a newToken from the method, also setting in the database.

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

            // send the token to the user mail

            const sendToken = await fetch('api/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, data, organization,
                    sendL: "password-reset",
                }),
            });

            toast.info(`Please check your email: ${email} for password reset link!`);
            form.reset();
            router.replace("/");
        }
        catch(e) {
            console.log(e);
        }
    };

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
                <h1 className="text-xl font-bold my-4">Reset Password</h1>
                <form className="flex flex-col gap-3" onSubmit={handleReset}>
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <input type="text" placeholder="Ogranization" onChange={(e) => setOrganization(e.target.value)}/>
                    <button type="submit" className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Reset Password</button>
                    <Link className="text-sm mt-3 text-right" href={'/'}>
                        Already have an account? <span className="underline">Login</span>
                    </Link>
                </form>
            </div>
        </div>
    )
}