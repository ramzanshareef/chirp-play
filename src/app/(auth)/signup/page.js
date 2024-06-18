import SignupForm from "@/components/SignupForm";

export default async function SignupPage() {
    return (
        <>
            <SignupForm />
        </>
    );
}

export const metadata = {
    title: "Chirp Play - Signup",
    description: "Create your account",
};