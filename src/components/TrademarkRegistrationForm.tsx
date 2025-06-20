import React, { useState } from 'react';
import { TrademarkRegistrationData, validateTrademarkData } from '../utils/storyProtocolTransactions';

interface TrademarkRegistrationFormProps {
  onRegister: (data: TrademarkRegistrationData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TrademarkRegistrationForm({
  onRegister,
  onCancel,
  isLoading = false
}: TrademarkRegistrationFormProps) {
  const [formData, setFormData] = useState<Partial<TrademarkRegistrationData>>({
    name: '',
    description: '',
    imageIpfsId: '',
    author: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleInputChange = (field: keyof TrademarkRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleNext = () => {
    // Validar solo los campos del paso actual
    const currentStepValidation = validateCurrentStep();
    if (!currentStepValidation.valid) {
      setErrors(currentStepValidation.errors);
      return;
    }
    // Limpiar errores al avanzar
    setErrors([]);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    // Limpiar errores al retroceder
    setErrors([]);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Función para validar solo el paso actual
  const validateCurrentStep = () => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1:
        if (!formData.name || formData.name.trim().length === 0) {
          errors.push('Trademark name is required');
        }
        if (!formData.description || formData.description.trim().length === 0) {
          errors.push('Description is required');
        }
        if (!formData.author || formData.author.trim().length === 0) {
          errors.push('Author is required');
        }
        break;
      case 2:
        if (!formData.imageIpfsId || formData.imageIpfsId.trim().length === 0) {
          errors.push('IPFS image ID is required');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = () => {
    console.log('📝 [FORM] Iniciando envío del formulario...');
    console.log('📋 [FORM] Datos del formulario:', formData);
    
    // Para el envío final, validar todos los campos requeridos
    const validation = validateTrademarkData(formData);
    console.log('✅ [FORM] Resultado de validación:', validation);
    
    if (!validation.valid) {
      console.error('❌ [FORM] Errores de validación:', validation.errors);
      setErrors(validation.errors);
      return;
    }

    // Aquí aseguramos que todos los campos requeridos estén presentes
    const completeData: TrademarkRegistrationData = {
      name: formData.name!,
      description: formData.description!,
      imageIpfsId: formData.imageIpfsId!,
      author: formData.author!,
      legalOwner: '0x0000000000000000000000000000000000000000' as any, // Se asignará automáticamente
    };

    console.log('🚀 [FORM] Datos completos para envío:', completeData);
    console.log('📤 [FORM] Llamando a onRegister...');
    
    onRegister(completeData);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-300">
          <strong>Step 1 of 2:</strong> Basic trademark information
        </p>
        <p className="text-xs text-blue-400 mt-1">
          Required fields: Name, Description and Author
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Trademark Name *
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your trademark name"
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">
          This is the name that will identify your trademark on the blockchain.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your trademark and its purpose"
          rows={3}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">
          Provide a detailed description of your trademark and what it represents.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Author *
        </label>
        <input
          type="text"
          value={formData.author || ''}
          onChange={(e) => handleInputChange('author', e.target.value)}
          placeholder="Enter the author of the trademark"
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">
          The person or entity who created this trademark.
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-300">
          <strong>Step 2 of 2:</strong> Image and confirmation
        </p>
        <p className="text-xs text-blue-400 mt-1">
          Required field: IPFS image ID
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          IPFS Image ID *
        </label>
        <input
          type="text"
          value={formData.imageIpfsId || ''}
          onChange={(e) => handleInputChange('imageIpfsId', e.target.value)}
          placeholder="Enter the IPFS hash of your trademark image"
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">
          The IPFS hash where your trademark image is stored. This should be a valid IPFS hash (Qm...).
        </p>
        <p className="text-xs text-yellow-400 mt-1">
          💡 If you don't have an IPFS hash, you can upload your image to services like Pinata, Infura IPFS, or similar
        </p>
      </div>

      <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">Registration Summary</h4>
        <div className="space-y-2 text-sm">
          <div><span className="text-gray-400">Name:</span> {formData.name || 'Not specified'}</div>
          <div><span className="text-gray-400">Description:</span> {formData.description || 'Not specified'}</div>
          <div><span className="text-gray-400">Author:</span> {formData.author || 'Not specified'}</div>
          <div><span className="text-gray-400">IPFS Image ID:</span> {formData.imageIpfsId || 'Not specified'}</div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-blue-400 mb-2">
          Trademark Registration Form
        </h3>
        <p className="text-gray-300">
          Step {currentStep} of {totalSteps} - Complete all required information to register your trademark on the blockchain.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="text-center text-sm text-gray-400">
        Step {currentStep} of {totalSteps}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-4">
          <h4 className="text-red-400 font-semibold mb-2">Validation Errors:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Content */}
      <div className="min-h-[200px]">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          disabled={isLoading}
          className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>

        <div className="flex space-x-3">
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : 'Register Trademark'}
            </button>
          )}
        </div>
      </div>

      {/* Required Fields Note */}
      <div className="text-xs text-gray-400 text-center">
        * Required fields
      </div>
    </div>
  );
} 