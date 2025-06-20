import React from 'react';
import { Hex } from 'viem';
import { formatTransactionHash, getExplorerUrl } from '../utils/storyProtocolTransactions';

interface TransactionNotificationProps {
  type: 'loading' | 'success' | 'error';
  hash?: Hex;
  error?: string;
  onClose?: () => void;
}

export default function TransactionNotification({
  type,
  hash,
  error,
  onClose
}: TransactionNotificationProps) {
  const getNotificationContent = () => {
    switch (type) {
      case 'loading':
        return {
          icon: '⏳',
          title: 'Procesando transacción...',
          message: 'Tu transacción está siendo procesada en la blockchain',
          bgColor: 'bg-blue-600/20',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-400'
        };
      case 'success':
        return {
          icon: '✅',
          title: '¡Transacción exitosa!',
          message: 'Tu marca ha sido registrada en la blockchain',
          bgColor: 'bg-green-600/20',
          borderColor: 'border-green-500',
          textColor: 'text-green-400'
        };
      case 'error':
        return {
          icon: '❌',
          title: 'Error en la transacción',
          message: error || 'Hubo un problema al procesar la transacción',
          bgColor: 'bg-red-600/20',
          borderColor: 'border-red-500',
          textColor: 'text-red-400'
        };
    }
  };

  const content = getNotificationContent();

  return (
    <div className={`${content.bgColor} border ${content.borderColor} rounded-lg p-4 mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`text-2xl ${content.textColor}`}>
            {content.icon}
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${content.textColor}`}>
              {content.title}
            </h4>
            <p className="text-sm text-gray-300 mt-1">
              {content.message}
            </p>
            {hash && (
              <div className="mt-2">
                <p className="text-xs text-gray-400">
                  Hash: {formatTransactionHash(hash)}
                </p>
                <a
                  href={getExplorerUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs inline-block mt-1"
                >
                  Ver en explorador →
                </a>
              </div>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-lg"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
} 