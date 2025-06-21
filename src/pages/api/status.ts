import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import axios from 'axios';

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

// Función para verificar variables de entorno
const checkEnvironmentVariables = (): StatusItem[] => {
  const checks: StatusItem[] = [];

  // Verificar OpenAI API Key
  if (process.env.OPENAI_API_KEY) {
    checks.push({
      name: 'OpenAI API Key',
      status: 'success',
      message: 'Configurada correctamente',
      details: `Key: ${process.env.OPENAI_API_KEY.substring(0, 8)}...`
    });
  } else {
    checks.push({
      name: 'OpenAI API Key',
      status: 'error',
      message: 'No configurada',
      details: 'Agrega OPENAI_API_KEY a tu archivo .env'
    });
  }

  // Verificar Pinata JWT
  if (process.env.NEXT_PUBLIC_PINATA_JWT) {
    checks.push({
      name: 'Pinata JWT',
      status: 'success',
      message: 'Configurada correctamente',
      details: `JWT: ${process.env.NEXT_PUBLIC_PINATA_JWT.substring(0, 8)}...`
    });
  } else {
    checks.push({
      name: 'Pinata JWT',
      status: 'error',
      message: 'No configurada',
      details: 'Agrega NEXT_PUBLIC_PINATA_JWT a tu archivo .env'
    });
  }

  // Verificar NODE_ENV
  checks.push({
    name: 'NODE_ENV',
    status: 'success',
    message: `Configurado como: ${process.env.NODE_ENV || 'development'}`,
    details: process.env.NODE_ENV === 'production' ? 'Modo producción' : 'Modo desarrollo'
  });

  // Verificar Story Protocol Network
  const storyNetwork = process.env.NEXT_PUBLIC_STORY_NETWORK;
  if (storyNetwork) {
    checks.push({
      name: 'Story Protocol Network',
      status: 'success',
      message: `Configurado como: ${storyNetwork}`,
      details: storyNetwork === 'aeneid' ? 'Red de prueba' : 'Red principal'
    });
  } else {
    checks.push({
      name: 'Story Protocol Network',
      status: 'success',
      message: 'Usando configuración por defecto: aeneid',
      details: 'Red de prueba configurada automáticamente'
    });
  }

  // Verificar RPC Provider URL
  if (process.env.NEXT_PUBLIC_RPC_PROVIDER_URL) {
    checks.push({
      name: 'RPC Provider URL',
      status: 'success',
      message: 'Configurada correctamente',
      details: 'URL personalizada configurada'
    });
  } else {
    checks.push({
      name: 'RPC Provider URL',
      status: 'success',
      message: 'Usando URL por defecto',
      details: 'URL automática según la red configurada'
    });
  }

  return checks;
};

// Función para verificar conexiones
const checkConnections = async (): Promise<StatusItem[]> => {
  const checks: StatusItem[] = [];

  // Verificar conexión con OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      // Hacer una llamada de prueba simple
      await openai.models.list();
      
      checks.push({
        name: 'Conexión OpenAI',
        status: 'success',
        message: 'Conexión exitosa',
        details: 'API de OpenAI responde correctamente'
      });
    } catch (error: any) {
      checks.push({
        name: 'Conexión OpenAI',
        status: 'error',
        message: 'Error de conexión',
        details: error.message || 'No se pudo conectar con OpenAI'
      });
    }
  } else {
    checks.push({
      name: 'Conexión OpenAI',
      status: 'error',
      message: 'No se puede verificar',
      details: 'OPENAI_API_KEY no está configurada'
    });
  }

  // Verificar conexión con Pinata
  if (process.env.NEXT_PUBLIC_PINATA_JWT) {
    try {
      const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        timeout: 10000, // 10 segundos de timeout
      });
      
      if (response.status === 200) {
        checks.push({
          name: 'Conexión Pinata',
          status: 'success',
          message: 'Conexión exitosa',
          details: 'API de Pinata responde correctamente'
        });
      } else {
        checks.push({
          name: 'Conexión Pinata',
          status: 'error',
          message: 'Error de autenticación',
          details: 'JWT inválido o expirado'
        });
      }
    } catch (error: any) {
      checks.push({
        name: 'Conexión Pinata',
        status: 'error',
        message: 'Error de conexión',
        details: error.message || 'No se pudo conectar con Pinata'
      });
    }
  } else {
    checks.push({
      name: 'Conexión Pinata',
      status: 'error',
      message: 'No se puede verificar',
      details: 'NEXT_PUBLIC_PINATA_JWT no está configurada'
    });
  }

  // Verificar conexión con Story Protocol RPC
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || 
      (process.env.NEXT_PUBLIC_STORY_NETWORK === 'mainnet' 
        ? 'https://mainnet.storyrpc.io' 
        : 'https://aeneid.storyrpc.io');
    
    const response = await axios.post(rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.result) {
      checks.push({
        name: 'Conexión Story Protocol RPC',
        status: 'success',
        message: 'Conexión exitosa',
        details: `Bloque actual: ${parseInt(response.data.result, 16)}`
      });
    } else {
      checks.push({
        name: 'Conexión Story Protocol RPC',
        status: 'error',
        message: 'Respuesta inválida',
        details: 'El RPC no devolvió un resultado válido'
      });
    }
  } catch (error: any) {
    checks.push({
      name: 'Conexión Story Protocol RPC',
      status: 'error',
      message: 'Error de conexión',
      details: error.message || 'No se pudo conectar con el RPC'
    });
  }

  return checks;
};

// Función para verificar servicios
const checkServices = (): StatusItem[] => {
  const checks: StatusItem[] = [];

  // Verificar que el servidor Next.js esté funcionando
  checks.push({
    name: 'Servidor Next.js',
    status: 'success',
    message: 'Funcionando correctamente',
    details: 'El servidor está respondiendo a las peticiones'
  });

  // Verificar configuración de Story Protocol
  const network = process.env.NEXT_PUBLIC_STORY_NETWORK || 'aeneid';
  const networkConfigs = {
    aeneid: {
      rpcProviderUrl: 'https://aeneid.storyrpc.io',
      blockExplorer: 'https://aeneid.storyscan.io',
      protocolExplorer: 'https://aeneid.explorer.story.foundation',
    },
    mainnet: {
      rpcProviderUrl: 'https://mainnet.storyrpc.io',
      blockExplorer: 'https://storyscan.io',
      protocolExplorer: 'https://explorer.story.foundation',
    }
  };

  const config = networkConfigs[network as keyof typeof networkConfigs];
  
  checks.push({
    name: 'Configuración Story Protocol',
    status: 'success',
    message: `Red configurada: ${network}`,
    details: `RPC: ${config.rpcProviderUrl}`
  });

  // Verificar que las dependencias estén disponibles
  try {
    require('@story-protocol/core-sdk');
    checks.push({
      name: 'Story Protocol SDK',
      status: 'success',
      message: 'Disponible',
      details: 'SDK de Story Protocol cargado correctamente'
    });
  } catch (error) {
    checks.push({
      name: 'Story Protocol SDK',
      status: 'error',
      message: 'No disponible',
      details: 'SDK de Story Protocol no está instalado'
    });
  }

  try {
    require('openai');
    checks.push({
      name: 'OpenAI SDK',
      status: 'success',
      message: 'Disponible',
      details: 'SDK de OpenAI cargado correctamente'
    });
  } catch (error) {
    checks.push({
      name: 'OpenAI SDK',
      status: 'error',
      message: 'No disponible',
      details: 'SDK de OpenAI no está instalado'
    });
  }

  return checks;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatusData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      environment: [],
      connections: [],
      services: []
    });
  }

  try {
    // Verificar variables de entorno (síncrono)
    const environment = checkEnvironmentVariables();
    
    // Verificar conexiones (asíncrono)
    const connections = await checkConnections();
    
    // Verificar servicios (síncrono)
    const services = checkServices();

    const statusData: StatusData = {
      environment,
      connections,
      services
    };

    res.status(200).json(statusData);
  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({
      environment: [{
        name: 'Error del Servidor',
        status: 'error',
        message: 'Error interno del servidor',
        details: 'No se pudo verificar el estado del sistema'
      }],
      connections: [],
      services: []
    });
  }
} 