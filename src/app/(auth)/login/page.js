import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
    return <>
        <LoginForm />
    </>;
}

export const metadata = {
    title: "Chirp Play - Login",
    description: "Login to your account",
};