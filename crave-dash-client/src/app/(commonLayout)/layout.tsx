import Navbar from "@/components/modules/shared/Navbar";
import Footer from "@/components/modules/shared/Footer";

export default function CommonLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <div className="mt-16">
                {children}
            </div>
            <Footer />
        </div>
    )
}
