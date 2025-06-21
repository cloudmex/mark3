import { useState, useEffect } from 'react';
import Head from 'next/head';

interface StatusItem {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  details?: string;
}

interface StatusData {
  environment: StatusItem[];
  connections: StatusItem[];
  services: StatusItem[];
}

export default function StatusPage() {
  const [statusData, setStatusData] = useState<StatusData>({
    environment: [],
    connections: [],
    services: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatusData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'loading':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'loading':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const StatusSection = ({ title, items }: { title: string; items: StatusItem[] }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getStatusIcon(item.status)}</span>
              <div>
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className={`text-sm ${getStatusColor(item.status)}`}>{item.message}</p>
                {item.details && (
                  <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getOverallStatus = () => {
    const allItems = [...statusData.environment, ...statusData.connections, ...statusData.services];
    const hasErrors = allItems.some(item => item.status === 'error');
    const hasLoading = allItems.some(item => item.status === 'loading');
    
    if (hasErrors) return { status: 'error', message: 'Algunos servicios tienen problemas' };
    if (hasLoading) return { status: 'loading', message: 'Verificando servicios...' };
    return { status: 'success', message: 'Todos los servicios están funcionando correctamente' };
  };

  const overallStatus = getOverallStatus();

  return (
    <>
      <Head>
        <title>Status - Mark3</title>
        <meta name="description" content="Estado de los servicios y conexiones de Mark3" />
      </Head>

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Estado del Sistema</h1>
            <p className="text-gray-600">Verificación de variables de entorno y conexiones</p>
            
            {/* Overall Status */}
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">{getStatusIcon(overallStatus.status)}</span>
                <div>
                  <h2 className={`text-lg font-semibold ${getStatusColor(overallStatus.status)}`}>
                    Estado General
                  </h2>
                  <p className="text-gray-600">{overallStatus.message}</p>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="mt-4">
              <button
                onClick={checkStatus}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {isLoading ? 'Verificando...' : 'Actualizar Estado'}
              </button>
              
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-2">
                  Última actualización: {lastUpdated.toLocaleString('es-ES')}
                </p>
              )}
            </div>
          </div>

          {/* Status Sections */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verificando servicios...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <StatusSection title="Variables de Entorno" items={statusData.environment} />
              <StatusSection title="Conexiones" items={statusData.connections} />
              <StatusSection title="Servicios" items={statusData.services} />
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500">
            <p>Mark3 - Sistema de Registro de Marcas en Blockchain</p>
            <p className="text-sm mt-1">Esta página verifica automáticamente el estado de todos los servicios</p>
          </div>
        </div>
      </div>
    </>
  );
} 