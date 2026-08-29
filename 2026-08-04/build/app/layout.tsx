import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "San Fabian Family Roster",
  description: "Private household roster, case-management and document workspace for MOO San Fabian."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
