import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATSInfra - See How ATS Systems Read Your Resume",
  description: "Infrastructure-grade ATS Resume Debugger. Simulate parsing, detect issues, repair PDFs, and export ATS-safe resumes.",
  keywords: ["ATS", "resume", "parser", "PDF", "job application", "applicant tracking system"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
