"use client";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const params = useSearchParams();
    return (
        <div>
            <h1>Searched for {params.get("q")}</h1>
        </div>
    );
}