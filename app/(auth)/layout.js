import { Logo } from "./_components/logo";

export default function authlayout({ children }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <Logo />
      {children}
    </div>
  );
}
