import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-100">{children}</div>;
}
