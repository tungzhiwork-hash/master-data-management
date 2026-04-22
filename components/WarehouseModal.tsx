import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Warehouse } from '../types';

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (warehouse: Warehouse) => void;
  initialData?: Warehouse;
}

export const WarehouseModal: React.FC<WarehouseModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<Warehouse>>({
    code: '',
    name: '',
    address: '',
    managerName: '',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: `WH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: '',
        address: '',
        managerName: '',
        status: 'Active'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      code: formData.code || '',
      name: formData.name || '',
      address: formData.address || '',
      managerName: formData.managerName || '',
      status: formData.status as 'Active' | 'Inactive' || 'Active'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-text-main">{initialData ? 'Edit Warehouse' : 'Add New Warehouse'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Warehouse Code <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
             </div>
             <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Warehouse Name <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. My Dinh Logistics Center"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address <span className="text-red-500">*</span></label>
            <textarea 
              required
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm resize-none"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Manager Name <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              value={formData.managerName}
              onChange={e => setFormData({...formData, managerName: e.target.value})}
            />
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
              className="px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-secondary shadow-sm transition-colors"
            >
              {initialData ? 'Update Warehouse' : 'Add Warehouse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};