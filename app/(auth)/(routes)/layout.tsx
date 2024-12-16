// import ""

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`{openSans.variable} antialiased`}>
        <main className="h-screen  flex justify-center items-center">
          {" "}
          {children}
        </main>
      </body>
    </html>
  );
}
