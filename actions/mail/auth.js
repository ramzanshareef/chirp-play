"use server";

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
import Otp from "@root/models/Otp";
import moment from "moment";
import connectDB from "../db/connectDB";

export async function sendEmailForOTP(state, formData) {
    try {
        let email = formData.get("email");
        let name = formData.get("name");
        let username = formData.get("username");
        let password = formData.get("password");
        if (!email || !name) {
            return {
                status: 400,
                message: "Both Name and Email are required",
            };
        }
        let otp = Math.floor(1000 + Math.random() * 9000);
        const { error } = await resend.emails.send({
            from: "Auth | Chirp Play <chirpplay@ramzanshareef.me>",
            to: email,
            subject: "OTP Verification for Chirp Play",
            react: EmailTemplateForSignUpOTP({ email, name, otp }),
        });
        if (error) {
            return {
                status: 400,
                message: error.message,
            };
        }
        await connectDB();
        if (await Otp.findOne({ email })) {
            return {
                status: 400,
                message: "OTP already sent. Please check your email.",
            };
        }
        await Otp.create({ name, email, otp });
        return {
            status: 200,
            message: "OTP sent successfully",
            email,
            username,
            name,
            password,
        };
    }
    catch (error) {
        return {
            status: 400,
            message: error.message,
        };
    }
}

const EmailTemplateForSignUpOTP = ({ email, name, otp }) => {
    const containerStyle = {
        margin: "0 auto",
        maxWidth: "600px",
        padding: "0 20px",
        paddingBottom: "10px",
        borderRadius: "5px",
        lineHeight: "1.8",
        fontFamily: "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
        color: "#333",
        backgroundColor: "#fff"
    };

    const headerStyle = {
        borderBottom: "1px solid #eee"
    };

    const headerLinkStyle = {
        fontSize: "1.4em",
        color: "#000",
        textDecoration: "none",
        fontWeight: "600"
    };

    const otpStyle = {
        background: "linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%)",
        margin: "0 auto",
        width: "max-content",
        padding: "0 10px",
        color: "#fff",
        borderRadius: "4px"
    };

    const footerStyle = {
        color: "#aaa",
        fontSize: "0.8em",
        lineHeight: "1",
        fontWeight: "300",
        marginTop: "0.5rem"
    };

    const emailInfoStyle = {
        color: "#666666",
        fontWeight: "400",
        fontSize: "13px",
        lineHeight: "18px",
        paddingBottom: "6px"
    };

    const emailLinkStyle = {
        textDecoration: "none",
        color: "#00bc69"
    };
    return <>
        <div style={containerStyle}>
            <div className="header" style={headerStyle}>
                <a style={headerLinkStyle}>Prove Your Chirp Play Identity</a>
            </div>
            <br />
            <strong>Dear {name},</strong>
            <p>
                We have received a login request for your Chirp Play account. For
                security purposes, please verify your identity by providing the
                following One-Time Password (OTP).
                <br />
                <b>Your One-Time Password (OTP) verification code is:</b>
            </p>
            <h2 className="otp" style={otpStyle}>{otp}</h2>
            <p style={{ fontSize: "0.9em" }}>
                <br />
                <br />
                If you did not initiate this login request, please disregard this
                message. Please ensure the confidentiality of your OTP and do not share
                it with anyone.<br />
                <strong>Do not forward or give this code to anyone.</strong>
                <br />
                <br />
                <strong>Thank you for using Chirp Play.</strong>
                <br />
                <br />
                Best regards,
                <br />
                <strong>Chirp Play</strong>
            </p>

            <hr style={{ border: "none", borderTop: "0.5px solid #131111" }} />
            <div className="footer" style={footerStyle}>
                <p>This email cannot receive replies.</p>
                <p>
                    For more information about Chirp Play and your account, visit &nbsp;
                    <a href="http://localhost:3000">Chirp Play</a>
                </p>
            </div>

            <div style={{ textAlign: "center" }}>
                <div className="email-info" style={emailInfoStyle}>
                    <span>
                        This email was sent to &nbsp;
                        <a href={`mailto:${email}`} style={emailLinkStyle}>{email}</a>
                    </span>
                </div>
                <div className="email-info" style={emailInfoStyle}>
                    <a href="/" style={emailLinkStyle}>Chrip Play</a> | Hyderabad
                    | Telangana - 500001, India
                </div>
                <div className="email-info" style={emailInfoStyle}>
                    &copy; {moment(new Date()).format("YYYY")} Chirp Play. All rights reserved.
                </div>
            </div>
        </div>
    </>;
};