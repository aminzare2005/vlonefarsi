import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="mx-auto pt-28 pb-8 px-4 max-w-5xl">{children}</div>
    </>
  );
}
