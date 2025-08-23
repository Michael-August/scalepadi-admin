import AuthNav from "@/components/auth-nav";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col lg:w-[1440px] lg:max-w-[1440px] lg:mx-auto w-screen">
            <AuthNav />
            {children}
            <Footer />
        </main>
    );
}
