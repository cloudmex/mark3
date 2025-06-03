import { StoryClient } from '@story-protocol/core-sdk';
import { storyConfig, storyClient as existingClient } from '../utils/storyConfig';

// Re-exportar el cliente existente para mantener consistencia
export const storyClient = existingClient;

// Función helper para obtener el cliente
export const getStoryClient = () => {
  return storyClient;
};

// Función para verificar la conexión con Story Protocol
export const checkStoryProtocolConnection = async () => {
  try {
    // Verificar que el cliente esté inicializado
    if (!storyClient) {
      throw new Error('Cliente de Story Protocol no inicializado');
    }
    return {
      connected: true,
      network: storyConfig.chainId,
    };
  } catch (error) {
    console.error('Error al conectar con Story Protocol:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}; 