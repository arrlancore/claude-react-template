import React from "react";
import MainLayout from "@/components/layout/main-layout";
import { AuthForm } from "./client";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function AuthPage({ searchParams }: Props) {
  const formType = searchParams?.form === "signUp" ? "signUp" : "signIn";

  return (
    <MainLayout fullWidth>
      <div className="flex flex-col items-center justify-center py-6">
        <AuthForm />
      </div>
    </MainLayout>
  );
}
