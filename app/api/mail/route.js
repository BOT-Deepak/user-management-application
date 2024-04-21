// importing required libraries

import { Resend } from "resend";
import { NextResponse } from "next/server";

// POST() function to send the mail to the user email with the link to verify link
// Can be also used to send the password verification link with information at sendL

export async function POST(req) {

    const { email, data, organization, sendL } = await req.json();
    const token = data;

    // making object of resend with the api key.
    const resend = new Resend(process.env.RESEND_API_KEY)

    // creating the link to be send to the email of the user.
    const confirmationLink = `${process.env.DOMAIN_NAME}/${sendL}?token=${token}&mail=${email}&org=${organization}`;
    let messageSubject = "Verify your email";

    if(sendL == "password-reset") {
        messageSubject = "Reset your password";
    }

    try {
        await resend.emails.send({
            from: "user-management-application@resend.dev",
            to: email,
            subject: `${messageSubject}`,
            html: `<p>Click <a href="${confirmationLink}">here<a/> to verify your email with ${organization}.</p>`,
        })

        return NextResponse.json(
            { message: 'Token generated.' },
            { status: 201 },
        );
    } catch(e) {
        console.error('Problem with token: ', e);
        return NextResponse.json(
            { message: 'An error occured.'},
            { status: 500 },
        );
    }
}