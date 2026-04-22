
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LegalEntity, EntityType, EntityStatus } from '../types';

interface LegalEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entity: Partial<LegalEntity>) => void;
  initialData?: LegalEntity;
}

export const LegalEntityModal: React.FC<LegalEntityModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<LegalEntity>>({
    code: '',
    legalName: '',
    englishName: '',
    shortName: '',
    taxCode: '',
    issueDate: '',
    issuePlace: '',
    charterCapital: 0,
    headquartersAddress: '',
    tradingAddress: '',
    type: EntityType.INVESTOR,
    taxAuthority: '',
    status: EntityStatus.ACTIVE
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
        // Reset for create mode
      setFormData({
        code: `LE-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Auto-gen simple code
        legalName: '',
        englishName: '',
        shortName: '',
        taxCode: '',
        issueDate: '',
        issuePlace: '',
        charterCapital: 0,
        headquartersAddress: '',
        tradingAddress: '',
        type: EntityType.INVESTOR,
        taxAuthority: '',
        status: EntityStatus.ACTIVE
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: keyof LegalEntity, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-text-main">{initialData ? 'Edit Legal Entity' : 'New Legal Entity'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text-main uppercase tracking-wider border-b pb-1 mb-3 border-secondary/20">Basic Information</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Entity Code <span className="text-red-500">*</span></label>
                   <input 
                      required
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm bg-gray-50"
                      value={formData.code}
                      onChange={e => handleInputChange('code', e.target.value)}
                    />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                      value={formData.status}
                      onChange={e => handleInputChange('status', e.target.value)}
                   >
                       {Object.values(EntityStatus).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal Name (Vietnamese) <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm uppercase"
                  value={formData.legalName}
                  onChange={e => handleInputChange('legalName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  value={formData.englishName}
                  onChange={e => handleInputChange('englishName', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                      value={formData.shortName}
                      onChange={e => handleInputChange('shortName', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                      value={formData.type}
                      onChange={e => handleInputChange('type', e.target.value)}
                   >
                       {Object.values(EntityType).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Code <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm"
                      value={formData.taxCode}
                      onChange={e => handleInputChange('taxCode', e.target.value)}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Authority</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                      value={formData.taxAuthority}
                      onChange={e => handleInputChange('taxAuthority', e.target.value)}
                    />
                  </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text-main uppercase tracking-wider border-b pb-1 mb-3 border-secondary/20">License Details</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Charter Capital</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm"
                  value={formData.charterCapital}
                  onChange={e => handleInputChange('charterCapital', Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                      value={formData.issueDate}
                      onChange={e => handleInputChange('issueDate', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Place</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                      value={formData.issuePlace}
                      onChange={e => handleInputChange('issuePlace', e.target.value)}
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters Address <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm resize-none"
                  value={formData.headquartersAddress}
                  onChange={e => handleInputChange('headquartersAddress', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trading Address</label>
                 <textarea 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm resize-none"
                  value={formData.tradingAddress}
                  onChange={e => handleInputChange('tradingAddress', e.target.value)}
                />
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
              {initialData ? 'Update Entity' : 'Create Entity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
