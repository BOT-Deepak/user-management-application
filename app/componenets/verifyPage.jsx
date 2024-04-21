// this is the page for verifying the email verification process.

'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import db from '../firebaseConfig';
import {doc, getDocs, query, collection, setDoc, updateDoc, deleteDoc, where } from "firebase/firestore";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function VerifyPage() {

    // some parameters to be taken from the link, and use them for verifying with the database document information.

    const searchParams = useSearchParams();
    const ctoken = searchParams.get("token");
    const email = searchParams.get("mail");
    const organization = searchParams.get("org");

    const router = useRouter();

    const handleVerify = async (e) => {
        e.preventDefault();

        const q = query(collection(db, 'users'), where("email", "==", email), where("organization", "==", organization));
        const querySnapshot = await getDocs(q);
    
        querySnapshot.forEach( async (docm) => {
            const { token } = docm.data();
            const rep = docm.id;

            // if token is same, then we can update document verified information to "true"

            if(ctoken == token) {

                const newToken = uuidv4();

                await updateDoc(doc(db, 'users', rep), {
                    verified: "true",
                    token: newToken,
                });

                toast.success("Email has been verified!");
                router.replace('/');
            }
            else {
                toast.error("Token has been expired!");
                router.replace('/register');
            }
        });
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
                <h1 id="changethis" className="text-xl font-bold my-4">Verification Page!</h1>
                <button 
                        onClick={handleVerify}
                        id="moveback"
                        className="bg-blue-500 text-white font-bold px-6 py-2 my-3 mx-3">
                        Click to Verify
                    </button>
            </div>
        </div>
    )
}