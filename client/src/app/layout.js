import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata = {
  title: "Learnify | Skills for a Brighter Tomorrow",
  description:
    "Discover courses, develop new skills, and grow with Learnify.",
};

// Applies the saved (or system) theme before the page paints.
const themeScript = `(function(){try{var t=localStorage.getItem('learnify-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={jakarta.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="bg-surface font-sans text-ink antialiased">
        <Navbar />

        <div className="min-h-screen pt-28">
          {children}
        </div>

        <Footer />

        <ThemeToggle />
      </body>
    </html>
  );
}
