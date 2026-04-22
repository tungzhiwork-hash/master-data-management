import React, { useState, useEffect } from 'react';
import { LegalEntity } from '../types';
import { entityService } from '../services/entityService';
import { StatusBadge } from './StatusBadge';
import { Search, Building2, Eye, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LegalEntityModal } from './LegalEntityModal';

export const EntityList: React.FC = () => {
  const [entities, setEntities] = useState<LegalEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await entityService.getAll();
      setEntities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntity = async (entityData: Partial<LegalEntity>) => {
    try {
      // Cast partial to necessary omit type, assuming validation ensures required fields
      await entityService.create(entityData as any);
      await loadData();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create entity', error);
      alert('Failed to create entity');
    }
  };

  const filteredEntities = entities.filter(e => 
    e.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.taxCode.includes(searchTerm) ||
    e.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Legal Entities Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage master data for all group entities</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
        >
           <Building2 size={16} />
           New Legal Entity
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by Name, Tax Code, or ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading entities...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Legal Name</th>
                  <th className="px-6 py-3">Tax Code</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntities.map((entity) => (
                  <tr key={entity.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{entity.code}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-main">{entity.legalName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{entity.englishName}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">{entity.taxCode}</td>
                    <td className="px-6 py-4 text-gray-600">{entity.type}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={entity.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/entity/${entity.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:text-secondary font-medium text-xs"
                      >
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredEntities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No entities found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LegalEntityModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={handleCreateEntity}
      />
    </div>
  );
};