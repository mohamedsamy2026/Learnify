
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Learnify | Skills for a Brighter Tomorrow",
  description:
    "Discover courses, develop new skills, and grow with Learnify.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        <Navbar />

        <div className="min-h-screen pt-28">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
