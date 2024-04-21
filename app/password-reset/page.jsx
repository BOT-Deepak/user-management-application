// importing required libraries

import PasswordResetPage from "../componenets/passPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

// Verify() function to checks for the session of the current state and always put the user into the current session
// User won't be able to make 2 sessions at the same time.

export default async function Verify() {
    const session = await getServerSession(authOptions);
    if(session) redirect("/dashboard");

    return <PasswordResetPage/>
}