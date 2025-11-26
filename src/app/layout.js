import { Geist, Geist_Mono , Inter} from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/providers";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from 'react-hot-toast';
import ProtectedLayout from "@/components/ProtectedRoute";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});
const sfPro = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sf-pro",
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "ShuttleDesk BQAB",
  description: "Admin Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} font-poppins antialiased`}>
        <ReduxProvider>
          <AuthProvider>
            <ProtectedLayout>
              {children}
            </ProtectedLayout>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  fontSize: '14px',
                  fontFamily: 'var(--font-poppins)',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
                loading: {
                  duration: Infinity,
                },
              }}
            />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}