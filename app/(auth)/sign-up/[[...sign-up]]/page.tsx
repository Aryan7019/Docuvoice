import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp 
        routing="path"
        path="/sign-up"
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