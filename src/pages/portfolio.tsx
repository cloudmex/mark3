import Head from "next/head";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// Placeholder para el header, igual que en register.tsx
// Idealmente, este sería un componente importado
export const Header = () => (
  <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-md shadow-lg fixed w-full z-50">
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" passHref>
        <h1 className="text-3xl font-bold text-blue-400 cursor-pointer">
          Mark<span className="text-green-400">3</span>
        </h1>
      </Link>
      <nav className="space-x-4 flex items-center">
        <Link href="/#features" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Features</span></Link>
        <Link href="/#how-it-works" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">How It Works</span></Link>
        <Link href="/gallery" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Gallery</span></Link>
        <Link href="/portfolio" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Portfolio</span></Link>
        <Link href="/register" passHref>
          <span className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
            Register
          </span>
        </Link>
      </nav>
    </div>
  </header>
);

// Placeholder para el footer, igual que en register.tsx
export const Footer = () => (
  <footer className="py-12 bg-gray-900 border-t border-gray-700">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Mark3. All rights reserved.
      </p>
    </div>
  </footer>
);

// Datos de ejemplo para el portafolio
const examplePortfolioItems = [
  {
    id: "1",
    name: "Innovatech Logo",
    type: "Trademark / Logo",
    registrationDate: "2023-10-26",
    status: "Active",
    imageUrl: "https://via.placeholder.com/150/007bff/FFFFFF?text=Logo1", // Placeholder image
    detailsUrl: "/portfolio/1"
  },
  {
    id: "2",
    name: "Quantum Leap Algorithm",
    type: "Patent / Software",
    registrationDate: "2024-01-15",
    status: "Active",
    imageUrl: "https://via.placeholder.com/150/28a745/FFFFFF?text=Algo1", // Placeholder image
    detailsUrl: "/portfolio/2"
  },
  {
    id: "3",
    name: "Synergy Artwork Series",
    type: "Copyright / Art",
    registrationDate: "2023-12-01",
    status: "Pending Verification",
    imageUrl: "https://via.placeholder.com/150/ffc107/000000?text=Art1", // Placeholder image
    detailsUrl: "/portfolio/3"
  }
];

export default function PortfolioPage() {
  return (
    <>
      <Head>
        <title>Your IP Portfolio - Mark3</title>
        <meta
          name="description"
          content="View and manage your registered intellectual property on Mark3."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen bg-gray-800 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans flex flex-col`}>
        <Header />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-300 mb-4">
              Your Intellectual Property Portfolio
            </h2>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
              Here you can view all the intellectual property you have registered through Mark3.
            </p>
          </div>

          {examplePortfolioItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {examplePortfolioItems.map((item) => (
                <div key={item.id} className="bg-gray-700/50 p-6 rounded-xl shadow-xl flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
                  <div>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="rounded-md mb-4 w-full h-48 object-cover"/>
                    )}
                    <h3 className="text-xl font-semibold text-green-400 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">Type: {item.type}</p>
                    <p className="text-sm text-gray-400 mb-1">Registered: {item.registrationDate}</p>
                    <p className={`text-sm font-semibold ${item.status === 'Active' ? 'text-green-500' : 'text-yellow-500'} mb-4`}>
                      Status: {item.status}
                    </p>
                  </div>
                  <Link href={item.detailsUrl} passHref>
                    <span className="block text-center mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer w-full">
                      View Details
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-400 mb-4">Your portfolio is currently empty.</p>
              <Link href="/register" passHref>
                <span className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-lg">
                  Register Your First IP
                </span>
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
} 