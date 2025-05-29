import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
//Se importa el ConnectionButton para MetaMask
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
//Importar RainbowKit para el botón de conexión
import { ConnectButton } from '@rainbow-me/rainbowkit';

// import { useTomo } from '@tomo-inc/tomo-web-sdk'; // Importar useTomo

// Para animaciones sutiles, considera instalar y usar framer-motion
// import { motion } from "framer-motion";

// Iconos (placeholders, idealmente usarías una librería como Heroicons o SVGs personalizados)
const IconPlaceholder = ({ className = "w-12 h-12 text-blue-500" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

// Placeholder para el logo de Story Protocol
const StoryProtocolLogo = () => (
  <svg className="h-10 w-auto text-gray-400" fill="currentColor" viewBox="0 0 135 40"> {/* Ajusta el viewBox al del logo real */} 
    <text x="0" y="30" fontSize="30" fontWeight="bold">Story Protocol</text> {/* Placeholder SVG Text */} 
  </svg>
);

export default function HomePage() {
  // const { openConnectModal, connected, walletState, disconnect } = useTomo(); 
  // const solanaAddress = walletState?.solanaAddress; 

  return (
    <>
      <Head>
        <title>Mark3 - Secure Your Trademarks On-Chain</title>
        <meta
          name="description"
          content="Mark3 offers a revolutionary way to register and protect your trademarks and brand assets immutably on the blockchain, powered by Story Protocol."
        />
        <link rel="icon" href="/favicon.ico" /> {/* Make sure you have a favicon */}
      </Head>

      <div className={`min-h-screen bg-gray-900 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans overflow-x-hidden`}>
        {/* Header/Nav (Simplified for now) */}
        <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-md shadow-lg fixed w-full z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" passHref>
              <h1 className="text-3xl font-bold text-blue-400 cursor-pointer">
                Mark<span className="text-green-400">3</span>
              </h1>
            </Link>
            <nav className="space-x-4 flex items-center">
              <Link href="#features" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Benefits</span></Link>
              <Link href="#how-it-works" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">How It Works</span></Link>
              <Link href="#story-protocol" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Technology</span></Link>
              <Link href="/portfolio" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Portfolio</span></Link>
              <Link href="/register" passHref>
                <span className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
                  Register Trademark
                </span>
              </Link>
              </nav>
          </div>  
          <div className="wallet"><ConnectButton /></div>  
        </header>

                      

        {/* Hero Section */}
        {/* Sugerencia de Imagen/Animación: Un logo moderno y abstracto (quizás con una 'M' o '3') 
             que se transforma o está rodeado por una red de blockchain protectora, 
             o un escudo digital brillante formándose alrededor de varios iconos de marcas (®, ™). 
             Podría ser un video corto de fondo o una animación Lottie. */}
        <section className="relative pt-40 pb-24 sm:pt-48 sm:pb-32 text-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-800">
          {/* Efecto de partículas sutiles en el fondo (opcional) */}
          {/* <div className="absolute inset-0 opacity-20"> <ParticlesComponent /> </div> */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Usar framer-motion para animar la aparición del texto */}
            {/* <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} 
                       className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            */} 
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Mark3: <span className="text-blue-400">Secure Your Trademarks</span> <br className="hidden sm:block"/> with <span className="text-green-400">On-Chain Proof</span>.
            </h2>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-300 mb-12">
              Leverage the power of blockchain for immutable, transparent, and globally verifiable trademark registration. Protect your brand identity in the Web3 era.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/register" passHref>
                <span 
                  // whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} (ejemplo con framer-motion)
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition-colors shadow-2xl cursor-pointer inline-block"
                >
                  Register Your Trademark
                </span>




              </Link>
              <Link href="#how-it-works" passHref>
                <span 
                  // whileHover={{ scale: 1.05 }} (ejemplo con framer-motion)
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-4 px-10 rounded-lg text-xl transition-colors shadow-2xl cursor-pointer inline-block"
                >
                  Learn How
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section - Enfocado en Marcas */} 
        <section id="problem-solution" className="py-16 sm:py-24 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-300">Traditional Trademark Hurdles vs. <br className="sm:hidden"/>The Mark3 Advantage</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Usar framer-motion para animar la aparición de las tarjetas */}
              <div className="bg-gray-700/50 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h4 className="text-2xl font-semibold mb-4 text-red-400 flex items-center">
                  <IconPlaceholder className="w-8 h-8 text-red-400 mr-3" /> The Old Way: Complex & Opaque
                </h4>
                <ul className="space-y-3 text-gray-300 pl-11">
                  <li>Expensive legal fees and lengthy processes.</li>
                  <li>Lack of transparency in registration status.</li>
                  <li>Geographical limitations and bureaucratic hurdles.</li>
                  <li>Difficulty in proving first use and ownership.</li>
                  <li>Vulnerability to counterfeiting and infringement.</li>
                </ul>
              </div>
              <div className="bg-gray-700/50 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h4 className="text-2xl font-semibold mb-4 text-green-400 flex items-center">
                  <IconPlaceholder className="w-8 h-8 text-green-400 mr-3" /> The Mark3 Way: Simple & Secure
                </h4>
                <ul className="space-y-3 text-gray-200 pl-11">
                  <li>Streamlined on-chain registration: fast and cost-effective.</li>
                  <li>Immutable timestamp and transparent record on the blockchain.</li>
                  <li>Global, verifiable proof of your trademark rights.</li>
                  <li>Clear establishment of ownership and usage history.</li>
                  <li>Enhanced protection against unauthorized use.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Enfocado en Marcas */} 
        {/* Sugerencia de Animación: Iconos animados (Lottie) para cada paso. 
             Al hacer scroll, cada paso podría animarse en secuencia. */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-300">Register Your Trademark in 3 Simple Steps</h3>
              <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Secure your brand identity quickly and efficiently with our blockchain-powered process.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[ 
                { title: "1. Define Your Trademark", description: "Submit your brand name, logo, and relevant classification details.", icon: "✏️" },
                { title: "2. Create On-Chain Record", description: "We generate a unique, verifiable digital certificate for your trademark.", icon: "🔗" },
                { title: "3. Secure on Blockchain", description: "Your trademark certificate is immutably registered and timestamped.", icon: "🛡️" }
              ].map((step, index) => (
                // Usar framer-motion para animar la aparición de las tarjetas de pasos
                <div key={index} className="bg-gray-800 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="text-5xl mx-auto mb-6">{step.icon}</div> {/* Reemplazar con Icono Animado Lottie o SVG */} 
                  <h4 className="text-xl font-semibold mb-3 text-green-300">{step.title}</h4>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Powered by Story Protocol Section */}
        <section id="story-protocol" className="py-16 sm:py-24 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Cutting-Edge Technology</p>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">Powered by Story Protocol</h3>
                <div className="flex justify-center mb-8">
                    <StoryProtocolLogo />
                </div>
                <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-4">
                    Mark3 leverages <a href="https://story.foundation/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Story Protocol</a> to anchor your trademarks as programmable IP Assets on the blockchain. This provides an open, permissionless, and globally accessible layer for your brand's intellectual property.
                </p>
                <p className="max-w-3xl mx-auto text-lg text-gray-300">
                    Benefit from verifiable provenance, enhanced composability, and access to a growing ecosystem of on-chain applications and services for your registered trademarks.
                </p>
            </div>
            {/* Podríamos agregar algunos logos de beneficios o características de Story Protocol aquí si es relevante */}
          </div>
        </section>

        {/* Key Benefits Section - Reenfocado en Marcas */} 
        {/* Sugerencia de Animación: Efecto de "revelación" al hacer scroll sobre cada tarjeta. */}
        <section id="features" className="py-16 sm:py-24 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-300">Unlock Key Advantages for Your Brand</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Immutable Record", description: "Once registered, your trademark's existence and timestamp are permanent.", icon: "💎" },
                { title: "Global Verification", description: "Anyone, anywhere can verify your trademark registration on-chain.", icon: "🌍" },
                { title: "Enhanced Security", description: "Protect against counterfeiting and unauthorized use with blockchain proof.", icon: "🛡️" },
                { title: "Future-Proof Your Brand", description: "Step into the future of IP management with Web3 technology.", icon: "🚀" },
              ].map((benefit) => (
                <div key={benefit.title} className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-5xl mb-6">{benefit.icon}</div> {/* Reemplazar con Icono Animado Lottie o SVG */} 
                  <h4 className="text-xl font-semibold mb-3 text-green-300">{benefit.title}</h4>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section id="cta-register" className="py-20 sm:py-32 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-800 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 text-white">
              Ready to Secure Your Brand On-Chain?
            </h3>
            <p className="max-w-xl mx-auto text-lg text-gray-300 mb-12">
              Join Mark3 and give your trademarks the robust protection of blockchain technology. 
              Start building your brand's future today.
            </p>
            <Link href="/register" passHref>
              <span
                // whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} (ejemplo con framer-motion)
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-lg text-xl transition-colors shadow-2xl cursor-pointer inline-block"
              >
                Register Trademark Now
              </span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="py-12 bg-gray-900 border-t border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
            <div className="mb-6">
              <Link href="/#features" passHref><span className="hover:text-blue-300 px-3 cursor-pointer">Benefits</span></Link>
              <Link href="/faq" passHref><span className="hover:text-blue-300 px-3 cursor-pointer">FAQ</span></Link>
              <Link href="/contact-us" passHref><span className="hover:text-blue-300 px-3 cursor-pointer">Contact</span></Link>
              <Link href="/terms" passHref><span className="hover:text-blue-300 px-3 cursor-pointer">Terms of Service</span></Link>
              <Link href="/privacy" passHref><span className="hover:text-blue-300 px-3 cursor-pointer">Privacy Policy</span></Link>
            </div>
            <div className="mb-4">
              {/* Placeholder para iconos de redes sociales */}
              {/* <SocialMediaIcons /> */}
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Mark3. All rights reserved.
            </p>
            <p className="text-xs mt-2">
              Pioneering On-Chain Trademark Registration with Story Protocol.
            </p>
          </div>
      </footer>
    </div>
    </>
  );
}

// Si decides usar framer-motion, necesitarás crear componentes como este:
// const AnimatedDiv = ({ children, ...props }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true, amount: 0.3 }}
//     transition={{ duration: 0.6 }}
//     {...props}
//   >
//     {children}
//   </motion.div>
// );

// Y un componente de partículas si lo deseas (ej. usando react-tsparticles o similar)
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull` function
// const ParticlesComponent = () => {
//   const particlesInit = async (main) => {
//     await loadFull(main);
//   };
// return <Particles id="tsparticles" url="/particles.json" init={particlesInit} />
// }
// Necesitarías un archivo public/particles.json con la configuración de las partículas
