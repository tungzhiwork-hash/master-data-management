import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BankAccount } from '../types';

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<BankAccount, 'id' | 'status'>) => void;
}

export const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    bankName: '',
    branchName: '',
    accountNumber: '',
    accountName: '',
    purposes: [] as string[]
  });

  const availablePurposes = ['Tax Payment', 'Operating Expenses', 'Revenue Collection', 'Escrow', 'Loan Disbursement', 'Project Investment'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.purposes.length === 0) return;
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
        bankName: '',
        branchName: '',
        accountNumber: '',
        accountName: '',
        purposes: []
    });
  };

  const togglePurpose = (purpose: string) => {
    setFormData(prev => ({
      ...prev,
      purposes: prev.purposes.includes(purpose)
        ? prev.purposes.filter(p => p !== purpose)
        : [...prev.purposes, purpose]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-text-main">Add New Bank Account</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name <span className="text-red-500">*</span></label>
              <input 
                required
                type="text" 
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                value={formData.bankName}
                onChange={e => setFormData({...formData, bankName: e.target.value})}
                placeholder="e.g. Vietcombank"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  value={formData.branchName}
                  onChange={e => setFormData({...formData, branchName: e.target.value})}
                  placeholder="e.g. HO Branch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Number <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm"
                  value={formData.accountNumber}
                  onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                  placeholder="0011..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Name <span className="text-red-500">*</span></label>
              <input 
                required
                type="text" 
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none uppercase text-sm"
                value={formData.accountName}
                onChange={e => setFormData({...formData, accountName: e.target.value})}
                placeholder="LEGAL ENTITY NAME"
              />
              <p className="text-xs text-gray-500 mt-1">Must match the registered legal entity name exactly.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Purposes <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {availablePurposes.map(purpose => (
                  <button
                    key={purpose}
                    type="button"
                    onClick={() => togglePurpose(purpose)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      formData.purposes.includes(purpose)
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {purpose}
                  </button>
                ))}
              </div>
              {formData.purposes.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one purpose.</p>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={formData.purposes.length === 0}
              className="px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};