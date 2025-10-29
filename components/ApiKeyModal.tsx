import React, { useState, useEffect } from 'react';
import { validateApiKey } from '../services/geminiService';
import Spinner from './Spinner';
import CheckIcon from './icons/CheckIcon';
import CrossIcon from './icons/CrossIcon';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const USER_KEYS_STORAGE_KEY = 'user_gemini_api_keys';

type ValidationState = { status: 'idle' | 'validating' | 'valid' | 'invalid'; message: string };
const initialValidationState: ValidationState[] = Array(3).fill({ status: 'idle', message: '' });

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [keys, setKeys] = useState<string[]>(['', '', '']);
  const [isSaving, setIsSaving] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationState[]>(initialValidationState);

  useEffect(() => {
    if (isOpen) {
      try {
        const storedKeys = localStorage.getItem(USER_KEYS_STORAGE_KEY);
        if (storedKeys) {
          const parsedKeys = JSON.parse(storedKeys);
          setKeys([
              parsedKeys[0] || '',
              parsedKeys[1] || '',
              parsedKeys[2] || '',
          ]);
        } else {
            setKeys(['', '', '']);
        }
      } catch (error) {
        console.error("Failed to parse API keys from localStorage", error);
        setKeys(['', '', '']);
      }
      setValidationStatus(initialValidationState);
      setIsSaving(false);
    }
  }, [isOpen]);

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...keys];
    newKeys[index] = value;
    setKeys(newKeys);
    
    // Reset validation status for the field being edited
    const newValidationStatus = [...validationStatus];
    newValidationStatus[index] = { status: 'idle', message: '' };
    setValidationStatus(newValidationStatus);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const newValidationStatus = [...initialValidationState];
    let hasOneValidKey = false;

    const validationPromises = keys.map(async (key, index) => {
        if (!key.trim()) {
            newValidationStatus[index] = { status: 'idle', message: '' };
            return;
        }

        newValidationStatus[index] = { status: 'validating', message: '' };
        setValidationStatus([...newValidationStatus]); // Update UI to show spinners

        const result = await validateApiKey(key);
        if (result.valid) {
            newValidationStatus[index] = { status: 'valid', message: result.message };
            hasOneValidKey = true;
        } else {
            newValidationStatus[index] = { status: 'invalid', message: result.message };
        }
        setValidationStatus([...newValidationStatus]); // Update UI with result
    });

    await Promise.all(validationPromises);

    setIsSaving(false);

    if (hasOneValidKey) {
        const keysToSave = keys.map(k => k.trim()).filter(Boolean);
        localStorage.setItem(USER_KEYS_STORAGE_KEY, JSON.stringify(keysToSave));
        setTimeout(() => {
            onSave();
        }, 500); // Short delay to let user see the green checkmark
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">System Resource Manager</h2>
        <p className="text-gray-400 mb-2">
            The system requires a high-bandwidth data channel. Provide a valid Google AI API key with available quota to proceed.
        </p>
        <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline text-sm mb-6 inline-block"
        >
            Acquire a new channel (Get API Key) &rarr;
        </a>
        <div className="space-y-2">
          {keys.map((key, index) => (
            <div key={index}>
                <div className="relative">
                    <input
                        type="password"
                        placeholder={`Channel ${index + 1} (API Key)`}
                        value={key}
                        onChange={(e) => handleKeyChange(index, e.target.value)}
                        className={`w-full p-3 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                            validationStatus[index].status === 'invalid' ? 'border-red-500' : 'border-gray-600'
                        }`}
                        disabled={isSaving}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                        {validationStatus[index].status === 'validating' && <Spinner small={true} text="" />}
                        {validationStatus[index].status === 'valid' && <CheckIcon className="w-5 h-5 text-green-500" />}
                        {validationStatus[index].status === 'invalid' && <CrossIcon className="w-5 h-5 text-red-500" />}
                    </div>
                </div>
                {validationStatus[index].status === 'invalid' && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{validationStatus[index].message}</p>
                )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-lg font-bold transition-colors w-40 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-wait"
          >
            {isSaving ? <Spinner small={true} text="Validating..." /> : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
