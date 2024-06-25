import SignupForm from "./SignupForm";

export default async function SignupPage() {
    return (
        <>
            <SignupForm />
        </>
    );
}

export const metadata = {
    title: "Signup",
    description: "Create your account",
};