import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto p-4 max-w-2xl min-h-dvh flex items-center justify-center">
      {children}
    </main>
  );
}
