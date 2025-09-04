import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn 
        routing="path"
        path="/sign-in"
        forceRedirectUrl="/dashboard" 
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          }
        }}
      />
    </div>
  );
}