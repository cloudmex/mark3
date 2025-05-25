import Head from "next/head";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// Placeholder para el header, podrías crear un componente reutilizable
const Header = () => (
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

// Placeholder para el footer
const Footer = () => (
  <footer className="py-12 bg-gray-900 border-t border-gray-700">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Mark3. All rights reserved.
      </p>
    </div>
  </footer>
);

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register Your IP - Mark3</title>
        <meta
          name="description"
          content="Start the process of registering your intellectual property on the blockchain with Mark3."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen bg-gray-800 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans flex flex-col`}>
        <Header />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-300 mb-8">
            Register Your Intellectual Property
          </h2>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-12">
            Begin the secure and transparent on-chain registration process for your trademarks, creative works, and other intellectual assets.
          </p>
          
          {/* Formulario de Registro (Placeholder) */}
          <div className="bg-gray-700/50 p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl mx-auto text-left">
            <h3 className="text-2xl font-semibold mb-6 text-green-400">Registration Form</h3>
            <form>
              <div className="mb-6">
                <label htmlFor="ipName" className="block text-gray-300 text-sm font-bold mb-2">
                  Name of your Intellectual Property:
                </label>
                <input 
                  type="text" 
                  id="ipName" 
                  name="ipName"
                  className="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 bg-gray-800 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., My Awesome Logo, Super Secret Formula" 
                />
              </div>

              <div className="mb-6">
                <label htmlFor="ipDescription" className="block text-gray-300 text-sm font-bold mb-2">
                  Brief Description:
                </label>
                <textarea 
                  id="ipDescription" 
                  name="ipDescription"
                  rows={4}
                  className="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 bg-gray-800 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your IP in a few sentences." 
                />
              </div>

              <div className="mb-8">
                <label htmlFor="ipFile" className="block text-gray-300 text-sm font-bold mb-2">
                  Upload File (e.g., image, document, code snippet):
                </label>
                <input 
                  type="file" 
                  id="ipFile" 
                  name="ipFile"
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
                <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPG, PNG, PDF, TXT.</p>
              </div>

              <div className="flex items-center justify-center">
                <button 
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                  Proceed to Verification
                </button>
              </div>
            </form>
          </div>
          <p className="mt-10 text-gray-400 text-sm">
            Need help? <Link href="/faq" passHref><span className="text-blue-400 hover:underline cursor-pointer">Check our FAQ</span></Link> or <Link href="/contact" passHref><span className="text-blue-400 hover:underline cursor-pointer">contact support</span></Link>.
          </p>
        </main>

        <Footer />
      </div>
    </>
  );
} 