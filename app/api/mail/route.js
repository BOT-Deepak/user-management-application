// importing required libraries

import { Resend } from "resend";
import { NextResponse } from "next/server";

import { transporter } from "../nodemailer/nodemailer";
 
// POST() function to send the mail to the user email with the link to verify link
// Can be also used to send the password verification link with information at sendL

export async function POST(req) {

    const { email, data, organization, sendL } = await req.json();
    const token = data;

    // making object of resend with the api key.
    // const resend = new Resend(process.env.RESEND_API_KEY)
    const my_email = process.env.EMAIL_ID;

    // creating the link to be send to the email of the user.
    const confirmationLink = `${process.env.DOMAIN_NAME}/${sendL}?token=${token}&mail=${email}&org=${organization}`;

    let messageSubject = "Verify your email";
    let messageOrganization = `Requested to join organization: ${organization}`;
    let messageLinkSpace = `Click <a href="${confirmationLink}">here<a/> to verify your email with ${organization}`;

    if(sendL == "password-reset") {
        messageSubject = "Reset your password";
        messageOrganization = `Organization: ${organization}`;
        messageLinkSpace = `Click <a href="${confirmationLink}">here<a/> to reset your password with ${organization}`;
    }

    try {
        await transporter.sendMail({
            from: my_email,
            to: email,
            subject: messageSubject,
            html: 
            `<div className="grid place-items-center h-screen">
            <h1>Welcome to Deepak's User Managerment Application</h1>
            <h3>Here are your details!</h3>
            <h3>Email: ${email}</h3>
            <h3>${messageOrganization}</h3>
            <h3>${messageLinkSpace}</h3>
            </div>`,
        })

        return NextResponse.json(
            { message: 'Email Send.' },
            { status: 201 },
        );

    }catch(e) {
        console.error('Problem with sending email: ', e);
        return NextResponse.json(
            { message: 'An error occured.'},
            { status: 500 },
        );
    }
}