import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'TripMate – Smart Travel Planning & International Booking Platform',
  description: 'International travel agency platform for Bangladeshi travelers flying from Dhaka to Dubai (DXB & DWC). Smart trip budget planning, Dubai hotel bookings, and 20% discount rewards.',
  keywords: 'TripMate, Dhaka to Dubai flights, DXB vs DWC, Dubai hotel booking, Dubai tour package, travel budget calculator, BDT travel agency',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900 font-sans antialiased selection:bg-teal selection:text-navy">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
