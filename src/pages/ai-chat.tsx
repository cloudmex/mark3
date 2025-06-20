import Head from "next/head";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";
import { useStoryProtocolTransactions, TrademarkRegistrationData, formatTransactionHash, getExplorerUrl } from "../utils/storyProtocolTransactions";
import TrademarkRegistrationForm from "../components/TrademarkRegistrationForm";
import MarkdownRenderer from "../components/MarkdownRenderer";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  transactionData?: {
    type: 'trademark_registration';
    data: TrademarkRegistrationData;
  };
}

export default function AIChatPage() {
  const { isConnected, address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hook para transacciones de Story Protocol
  const {
    registerTrademark,
    transactionState,
    resetTransaction,
    isConnected: walletConnected,
  } = useStoryProtocolTransactions();

  // Función helper para obtener la wallet activa
  const getActiveWallet = () => {
    if (!isConnected || !address) {
      return null;
    }
    return address;
  };

  // Log cuando cambia el estado de la wallet
  useEffect(() => {
    // Estado de wallet actualizado
  }, [isConnected, address]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para detectar si el usuario quiere registrar una marca
  const detectTrademarkRegistration = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // Patrones para detectar intención de registro de marca
    const patterns = [
      /i want to register (?:a )?trademark/i,
      /register (?:a )?trademark/i,
      /i want to register (?:my )?trademark/i,
      /register (?:a )?trademark/i,
      /i need to register (?:a )?trademark/i,
      /i want to register (?:a )?brand/i,
      /register (?:a )?brand/i,
      /i want to register (?:my )?brand/i,
    ];

    return patterns.some(pattern => pattern.test(lowerMessage));
  };

  // Función para detectar si el usuario quiere ver sus NFTs
  const detectNFTRequest = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    const patterns = [
      // Patrones que requieren wallet especificada
      /show nfts of 0x/i,
      /view nfts of 0x/i,
      /list nfts of 0x/i,
      /what nfts does 0x/i,
      /nfts of 0x/i,
      /tokens of 0x/i,
      /registered trademarks of 0x/i,
      /collection of 0x/i,
      
      // Patrones generales (que requerirán wallet especificada)
      /show nfts/i,
      /view nfts/i,
      /list nfts/i,
      /what nfts/i,
      /my nfts/i,
      /my tokens/i,
      /my registered trademarks/i,
      /my collections/i,
      /view my collection/i,
      /show my collection/i,
      /nfts/i,
      /tokens/i,
      /registered trademarks/i,
      /collection/i,
    ];

    return patterns.some(pattern => pattern.test(lowerMessage));
  };

  // Función para detectar direcciones de wallet en el mensaje
  const detectWalletAddress = (message: string): string | null => {
    // Patrón para direcciones Ethereum (0x seguido de 40 caracteres hexadecimales)
    const ethAddressPattern = /0x[a-fA-F0-9]{40}/g;
    const matches = message.match(ethAddressPattern);
    
    if (matches && matches.length > 0) {
      const address = matches[0];
      if (isValidWalletAddress(address)) {
        return address;
      }
    }
    
    // Patrón para ENS names (terminan en .eth)
    const ensPattern = /[a-zA-Z0-9-]+\.eth/g;
    const ensMatches = message.match(ensPattern);
    
    if (ensMatches && ensMatches.length > 0) {
      // Por ahora solo detectamos ENS, pero necesitaríamos resolverlo a una dirección
      // Para simplificar, retornamos null y el usuario deberá usar la dirección completa
      return null;
    }
    
    // Patrón para direcciones abreviadas (0x seguido de al menos 6 caracteres)
    const shortAddressPattern = /0x[a-fA-F0-9]{6,}/g;
    const shortMatches = message.match(shortAddressPattern);
    
    if (shortMatches && shortMatches.length > 0) {
      // Las direcciones abreviadas no son válidas, pero las detectamos para dar feedback
      return null;
    }
    
    return null;
  };

  // Función para validar direcciones de wallet
  const isValidWalletAddress = (address: string): boolean => {
    // Verificar formato básico
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return false;
    }
    
    // Verificar checksum (opcional, pero recomendado)
    try {
      // Convertir a checksum address para validar
      const checksumAddress = address.toLowerCase();
      return checksumAddress === address.toLowerCase();
    } catch {
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Detectar si el usuario quiere registrar una marca
    const wantsToRegister = detectTrademarkRegistration(inputMessage);
    
    // Detectar si el usuario quiere ver sus NFTs
    const wantsToSeeNFTs = detectNFTRequest(inputMessage);

    // Detectar si el usuario especificó una wallet en el mensaje
    const specifiedWallet = detectWalletAddress(inputMessage);
    
    // Determinar qué wallet usar: para NFTs solo la especificada, para registro la activa
    const walletToUse = wantsToSeeNFTs ? specifiedWallet : (specifiedWallet || getActiveWallet());

    // Verificar si necesita wallet conectada (solo para registro de marcas)
    if (wantsToRegister && !walletToUse) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'To register a trademark, you need to connect your wallet first. Please connect your wallet and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage, errorMessage]);
      setInputMessage('');
      return;
    }

    // Verificar si quiere ver NFTs pero no especificó wallet
    if (wantsToSeeNFTs && !specifiedWallet) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'To view NFTs, you need to specify a wallet address in the message. Example: "Show NFTs of 0x1234567890123456789012345678901234567890"',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage, errorMessage]);
      setInputMessage('');
      return;
    }

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          hasTransactionIntent: wantsToRegister,
          wantsToSeeNFTs: wantsToSeeNFTs,
          walletAddress: walletToUse
        }),
      });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Si el usuario quiere registrar una marca, mostrar el formulario
      if (wantsToRegister && walletToUse) {
        setShowRegistrationForm(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrademarkRegistration = async (trademarkData: TrademarkRegistrationData) => {
    const success = await registerTrademark(trademarkData);
    
    if (success) {
      setShowRegistrationForm(false);
      resetTransaction();
      
      const successMessage: Message = {
        role: 'assistant',
        content: 'Great! Your trademark registration transaction has been submitted. Please wait for confirmation on the blockchain.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, successMessage]);
    }
  };

  const handleCancelRegistration = () => {
    setShowRegistrationForm(false);
    resetTransaction();
    
    const cancelMessage: Message = {
      role: 'assistant',
      content: 'Trademark registration has been cancelled. You can try again anytime.',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, cancelMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <Head>
        <title>AI Chat - Mark3</title>
        <meta
          name="description"
          content="AI Chat to help you with trademark registration and blockchain queries"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen bg-gray-900 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-md shadow-lg fixed w-full z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" passHref>
              <h1 className="text-3xl font-bold text-blue-400 cursor-pointer">
                Mark<span className="text-green-400">3</span>
              </h1>
            </Link>
            <nav className="space-x-4 flex items-center">
              <Link href="/" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Home</span></Link>
              <Link href="/gallery" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Gallery</span></Link>
              <Link href="/portfolio" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Portfolio</span></Link>
              <Link href="/ai-chat" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">AI Chat</span></Link>
              <Link href={isConnected ? "/register" : "#"} passHref>
                <span className={`font-semibold px-4 py-2 rounded-lg transition-colors ${
                  isConnected 
                    ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                    : 'bg-gray-500 cursor-not-allowed'
                }`}>
                  Register Trademark
                </span>
              </Link>
            </nav>
            <div className="wallet"><ConnectButton /></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="pt-24 pb-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            {/* Chat Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-blue-400 mb-4">
                AI Chat Assistant
              </h2>
              <p className="text-gray-300 text-lg">
                Ask me about trademark registration, blockchain, or any Mark3-related queries
              </p>
              {isConnected && address ? (
                <div className="mt-4 p-3 bg-green-600/20 border border-green-500 rounded-lg">
                  <p className="text-green-400 text-sm font-semibold">
                    ✅ Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                  <p className="text-green-300 text-xs mt-1">
                    You can register trademarks on blockchain
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-500 rounded-lg">
                  <p className="text-yellow-400 text-sm font-semibold">
                    ⚠️ Wallet not connected
                  </p>
                  <p className="text-yellow-300 text-xs mt-1">
                    Connect your wallet to register trademarks
                  </p>
                </div>
              )}
            </div>

            {/* Transaction Status */}
            {transactionState.isLoading && (
              <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                  <div>
                    <p className="text-blue-400 font-semibold">Processing transaction...</p>
                    {transactionState.hash && (
                      <p className="text-sm text-gray-300">
                        Hash: {formatTransactionHash(transactionState.hash)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {transactionState.isSuccess && (
              <div className="bg-green-600/20 border border-green-500 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-green-400 text-2xl">✅</div>
                    <div>
                      <p className="text-green-400 font-semibold">Trademark registered successfully!</p>
                      {transactionState.hash && (
                        <p className="text-sm text-gray-300">
                          Hash: {formatTransactionHash(transactionState.hash)}
                        </p>
                      )}
                    </div>
                  </div>
                  {transactionState.hash && (
                    <a
                      href={getExplorerUrl(transactionState.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View on explorer →
                    </a>
                  )}
                </div>
              </div>
            )}

            {transactionState.isError && (
              <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-red-400 text-2xl">❌</div>
                  <div>
                    <p className="text-red-400 font-semibold">Transaction error</p>
                    <p className="text-sm text-gray-300">{transactionState.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Form */}
            {showRegistrationForm && (
              <div className="mb-6">
                <TrademarkRegistrationForm
                  onRegister={handleTrademarkRegistration}
                  onCancel={handleCancelRegistration}
                  isLoading={transactionState.isLoading}
                />
              </div>
            )}

            {/* Chat Container */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-6xl mb-4">🤖</div>
                    <p className="text-lg">Hello! I'm your AI assistant. How can I help you today?</p>
                    <p className="text-sm mt-2">You can ask me about trademark registration, blockchain, or any Mark3-related topics.</p>
                    {isConnected && address ? (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-green-400 font-semibold">💡 Available features:</p>
                        <div className="text-xs text-gray-300 space-y-1">
                          <p>• "I want to register a trademark" - Register a new trademark on blockchain</p>
                          <p>• "Show NFTs of 0x1234..." - Query NFTs from any wallet</p>
                          <p>• "What NFTs does 0x..." - Query NFTs from another wallet</p>
                          <p>• "My registered trademarks of 0x..." - List Story Protocol NFTs</p>
                          <p>• "Show collection of 0x..." - View NFT collection</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-yellow-400 font-semibold">💡 Available features:</p>
                        <div className="text-xs text-gray-300 space-y-1">
                          <p>• "Show NFTs of 0x1234..." - Query NFTs from any wallet</p>
                          <p>• "What NFTs does 0x..." - Query NFTs from another wallet</p>
                          <p>• "My registered trademarks of 0x..." - List Story Protocol NFTs</p>
                          <p>• "Show collection of 0x..." - View NFT collection</p>
                          <p>• Connect your wallet to register trademarks</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        <div className="text-sm mb-1 opacity-75">
                          {message.role === 'user' ? 'You' : 'AI Assistant'} • {formatTime(message.timestamp)}
                        </div>
                        {message.role === 'user' ? (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                          <MarkdownRenderer content={message.content} />
                        )}
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 max-w-xs lg:max-w-md px-4 py-3 rounded-lg">
                      <div className="text-sm mb-1 opacity-75">AI Assistant • Thinking...</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex space-x-4">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={1}
                    disabled={isLoading || showRegistrationForm}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || showRegistrationForm}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Send
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Legal Advice</h3>
                <p className="text-gray-300">Get information about trademark registration and intellectual property protection</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">NFT Query</h3>
                <p className="text-gray-300">View all NFTs and registered trademarks in your connected wallet</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Complete Registration</h3>
                <p className="text-gray-300">Register your trademark with all required data using your connected wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 