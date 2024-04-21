// This page is for setting new password after getting the link into the mail.

'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import db from '../firebaseConfig';
import {doc, getDocs, query, collection, updateDoc, where } from "firebase/firestore";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function PasswordResetPage() {

    // getting the data from the url, which was send for verification consisting of: token, email & organization
    const searchParams = useSearchParams();
    const ctoken = searchParams.get("token");
    const email = searchParams.get("mail");
    const organization = searchParams.get("org");

    // useState() to know, when to show the fields for typing password for the user, so after verification success, show will be true.
    let [show, setShow] = useState("false");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const router = useRouter();

    // handleReset() function is called after token verification process is completed with success
    // it checks if the newPassword are both same or not, then changing password.

    const handleReset = async (e) => {
        e.preventDefault();

        if(!password1 || !password2) {
            toast.warning("All fields are necessary!");
            return;
        }

        if(password1 != password2) {
            toast.warning("Password doesn't match!");
            return;
        }

        const q = query(collection(db, 'users'), where("email", "==", email), where("organization", "==", organization));
        const querySnapshot = await getDocs(q);

        // updating the password and token ( don't want user to use this token again by clicking same link )
    
        querySnapshot.forEach( async (docm) => {
            const { token } = docm.data();
            const rep = docm.id;
            const newToken = uuidv4();

            await updateDoc(doc(db, 'users', rep), {
                password: password1,
                token: newToken,
            });
        });
        
        toast.success("Password has been changed!");
        router.replace("/");
    }

    // handleVerify() function is use to check for token verification
    // it checks if the token from the link and token stored in database for the user is same or not.

    const handleVerify = async (e) => {

        if(show == "true") {
            return;
        }

        const q = query(collection(db, 'users'), where("email", "==", email), where("organization", "==", organization));
        const querySnapshot = await getDocs(q);
    
        querySnapshot.forEach( async (docm) => {
            const { token } = docm.data();
            const rep = docm.id;

            // if token is same, setShow = true, hence show password fields

            if(ctoken == token) {
                toast.success("Verification successful!");
                setShow("true");
            }
            else {
                toast.error("Verification failed!");
            }
        });
    }

    // this block of code is shown when verification is not completed yet!

    let notShowData = (
        <div>
            <h1 id="changethis" className="text-xl font-bold my-4">Password Reset Page!</h1>
            <button 
                onClick={handleVerify}
                id="moveback"
                className="bg-blue-500 text-white font-bold px-6 py-2 my-3 mx-3">
                Click To Change Password
            </button>
        </div>
    );

    // this is a placeholder for switching between states.
    let spaceForDataShowing = notShowData;

    // this block of code asks for password and proceeds with it.

    let showData = (
        <div>
            <h1 className="text-xl font-bold my-4">Type New Password</h1>
                <form className="flex flex-col gap-3" onSubmit={handleReset}>
                    <input type="text" placeholder="New Password" onChange={(e) => setPassword1(e.target.value)}/>
                    <input type="password" placeholder="Confirm Password" onChange={(e) => setPassword2(e.target.value)}/>
                    <button id="moveforward" type="submit" className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Set Password</button>
                </form>
        </div>
    );

    // this handles the show value to switch between both states with ease.

    if(show == "true") {
        spaceForDataShowing = showData;
    } else {
        spaceForDataShowing = notShowData;
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
                {spaceForDataShowing}
            </div>
        </div>
    )
}