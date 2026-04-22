import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AuthorizedSignatory } from '../types';

interface SignatoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatory: AuthorizedSignatory) => void;
  initialData?: AuthorizedSignatory;
}

export const SignatoryModal: React.FC<SignatoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<AuthorizedSignatory>>({
    fullName: '',
    position: '',
    idNumber: '',
    scopeOfAuth: [],
    validFrom: '',
    validTo: '',
    digitalSignatureProvider: '',
    digitalSignatureSerial: '',
    digitalSignatureExpiry: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        fullName: '',
        position: '',
        idNumber: '',
        scopeOfAuth: [],
        validFrom: '',
        validTo: '',
        digitalSignatureProvider: '',
        digitalSignatureSerial: '',
        digitalSignatureExpiry: ''
      });
    }
  }, [initialData, isOpen]);

  const availableScopes = ['Ký HĐMB', 'Ký HĐ Lao động', 'Ký Chứng từ ngân hàng', 'Ký Hồ sơ thuế', 'Ký HĐ Thuê', 'Đại diện trước tòa'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName || '',
      position: formData.position || '',
      idNumber: formData.idNumber || '',
      scopeOfAuth: formData.scopeOfAuth || [],
      validFrom: formData.validFrom || '',
      validTo: formData.validTo || '',
      digitalSignatureProvider: formData.digitalSignatureProvider,
      digitalSignatureSerial: formData.digitalSignatureSerial,
      digitalSignatureExpiry: formData.digitalSignatureExpiry
    });
    onClose();
  };

  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scopeOfAuth: prev.scopeOfAuth?.includes(scope)
        ? prev.scopeOfAuth.filter(s => s !== scope)
        : [...(prev.scopeOfAuth || []), scope]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-text-main">{initialData ? 'Edit Signatory' : 'Add New Signatory'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number (CCCD/Passport) <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm"
                  value={formData.idNumber}
                  onChange={e => setFormData({...formData, idNumber: e.target.value})}
                />
              </div>
            </div>

            {/* Authorization Scope */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scope of Authorization</label>
              <div className="flex flex-wrap gap-2">
                {availableScopes.map(scope => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => toggleScope(scope)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      formData.scopeOfAuth?.includes(scope)
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>

            {/* Validity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid From <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  value={formData.validFrom}
                  onChange={e => setFormData({...formData, validFrom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid To <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  value={formData.validTo}
                  onChange={e => setFormData({...formData, validTo: e.target.value})}
                />
              </div>
            </div>

            {/* Digital Signature */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-text-main mb-3">Digital Signature Details (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Provider (CA)</label>
                   <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                      value={formData.digitalSignatureProvider}
                      onChange={e => setFormData({...formData, digitalSignatureProvider: e.target.value})}
                      placeholder="e.g. VNPT-CA"
                    />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                   <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                      value={formData.digitalSignatureExpiry}
                      onChange={e => setFormData({...formData, digitalSignatureExpiry: e.target.value})}
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-secondary shadow-sm transition-colors"
            >
              {initialData ? 'Update Signatory' : 'Add Signatory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};