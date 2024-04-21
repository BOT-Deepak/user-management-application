import nodemailer from "nodemailer";

const my_email = process.env.EMAIL_ID;
const pass = process.env.EMAIL_PASSWORD;

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: my_email,
        pass,
    },
});