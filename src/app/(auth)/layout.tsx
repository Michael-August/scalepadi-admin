import AuthNav from "@/components/auth-nav";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col">
            <AuthNav />
            {children}
            <Footer />
        </main>
    );
}
