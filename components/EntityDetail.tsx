
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LegalEntity, EntityStatus, EntityType, BankAccount, AuthorizedSignatory, Warehouse } from '../types';
import { entityService } from '../services/entityService';
import { StatusBadge } from './StatusBadge';
import { AddBankAccountModal } from './AddBankAccountModal';
import { SignatoryModal } from './SignatoryModal';
import { LegalEntityModal } from './LegalEntityModal';
import { WarehouseModal } from './WarehouseModal';
import { 
  ArrowLeft, Save, Building, Users, CreditCard, FolderOpen, History, 
  MapPin, Landmark, FileText, AlertTriangle, Search, Plus, Edit2, Warehouse as WarehouseIcon
} from 'lucide-react';

// Sub-components for tabs
const GeneralInfoTab: React.FC<{ entity: LegalEntity }> = ({ entity }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider border-b pb-2 border-secondary/20">Identification</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 text-gray-500 text-sm">Legal Name</div>
        <div className="col-span-2 font-medium text-text-main">{entity.legalName}</div>
        
        <div className="col-span-1 text-gray-500 text-sm">English Name</div>
        <div className="col-span-2 text-text-main">{entity.englishName}</div>
        
        <div className="col-span-1 text-gray-500 text-sm">Short Name</div>
        <div className="col-span-2 text-text-main">{entity.shortName}</div>
        
        <div className="col-span-1 text-gray-500 text-sm">Tax Code</div>
        <div className="col-span-2 font-mono text-text-main">{entity.taxCode}</div>

        <div className="col-span-1 text-gray-500 text-sm">Charter Capital</div>
        <div className="col-span-2 text-text-main">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.charterCapital)}</div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-main uppercase tracking-wider border-b pb-2 border-secondary/20">Administrative</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 text-gray-500 text-sm">Headquarters</div>
        <div className="col-span-2 text-text-main flex items-start gap-1">
          <MapPin size={14} className="mt-1 text-gray-400" />
          {entity.headquartersAddress}
        </div>
        
        <div className="col-span-1 text-gray-500 text-sm">Trading Addr.</div>
        <div className="col-span-2 text-text-main flex items-start gap-1">
           <MapPin size={14} className="mt-1 text-gray-400" />
           {entity.tradingAddress}
        </div>

        <div className="col-span-1 text-gray-500 text-sm">Tax Authority</div>
        <div className="col-span-2 text-text-main flex items-start gap-1">
          <Landmark size={14} className="mt-1 text-gray-400" />
          {entity.taxAuthority}
        </div>

        <div className="col-span-1 text-gray-500 text-sm">Issued Date</div>
        <div className="col-span-2 text-text-main">{entity.issueDate}</div>

         <div className="col-span-1 text-gray-500 text-sm">Issued Place</div>
        <div className="col-span-2 text-text-main">{entity.issuePlace}</div>
      </div>
    </div>
  </div>
);

const SignatoriesTab: React.FC<{ entity: LegalEntity, onUpdate: (entity: LegalEntity) => void }> = ({ entity, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSig, setEditingSig] = useState<AuthorizedSignatory | undefined>(undefined);

  const handleSaveSignatory = async (sigData: AuthorizedSignatory) => {
     try {
       let updatedSignatories = [...entity.signatories];
       const index = updatedSignatories.findIndex(s => s.id === sigData.id);
       
       let action = '';
       if (index !== -1) {
         updatedSignatories[index] = sigData;
         action = 'Updated Signatory';
       } else {
         updatedSignatories = [sigData, ...updatedSignatories];
         action = 'Added Signatory';
       }

       const updatedEntity = await entityService.update(
         entity.id,
         { signatories: updatedSignatories },
         'current_user',
         action
       );
       onUpdate(updatedEntity);
       setIsModalOpen(false);
       setEditingSig(undefined);
     } catch (err) {
       console.error(err);
       alert("Failed to save signatory");
     }
  };

  const openEdit = (sig: AuthorizedSignatory) => {
    setEditingSig(sig);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingSig(undefined);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
            onClick={openAdd}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-secondary shadow-sm transition-colors text-xs font-medium"
        >
             <Plus size={14} /> Add Signatory
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">ID (CCCD)</th>
              <th className="px-4 py-3">Auth Scope</th>
              <th className="px-4 py-3">Validity</th>
              <th className="px-4 py-3">Digital Sig.</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entity.signatories.map(sig => (
              <tr key={sig.id} className="group hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-text-main">{sig.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{sig.position}</td>
                <td className="px-4 py-3 font-mono text-gray-500">{sig.idNumber}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {sig.scopeOfAuth.map((scope, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs border border-primary/20">{scope}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  <div>{sig.validFrom}</div>
                  <div className="text-gray-400">to</div>
                  <div>{sig.validTo}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                    {sig.digitalSignatureProvider ? (
                        <div>
                            <span className="font-semibold text-green-700">{sig.digitalSignatureProvider}</span>
                            <div className="text-gray-500">Exp: {sig.digitalSignatureExpiry}</div>
                        </div>
                    ) : <span className="text-gray-400">N/A</span>}
                </td>
                <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => openEdit(sig)}
                      className="text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 size={16} />
                    </button>
                </td>
              </tr>
            ))}
             {entity.signatories.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No authorized signatories recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SignatoryModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSave={handleSaveSignatory}
         initialData={editingSig}
      />
    </div>
  );
};

const BankAccountsTab: React.FC<{ entity: LegalEntity, onUpdate: (entity: LegalEntity) => void }> = ({ entity, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredAccounts = entity.bankAccounts.filter(bank => 
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.accountNumber.includes(searchTerm) ||
    bank.accountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAccount = async (accountData: Omit<BankAccount, 'id' | 'status'>) => {
    try {
      setIsSaving(true);
      const newAccount: BankAccount = {
        ...accountData,
        id: `bank-${Math.random().toString(36).substr(2, 9)}`,
        status: 'Active'
      };
      
      const updatedEntity = await entityService.update(
        entity.id,
        { bankAccounts: [newAccount, ...entity.bankAccounts] },
        'current_user',
        'Added new bank account'
      );
      
      onUpdate(updatedEntity);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add bank account', error);
      alert('Failed to save bank account');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search accounts..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary shadow-sm transition-colors text-sm font-medium shrink-0"
          >
             <Plus size={16} /> Add Bank Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAccounts.map(bank => (
            <div key={bank.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-text-main text-lg">{bank.bankName}</div>
                <StatusBadge status={bank.status} />
              </div>
              <div className="text-sm text-gray-600 mb-1">{bank.branchName}</div>
              <div className="text-lg font-mono font-medium text-primary mb-2">{bank.accountNumber}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">{bank.accountName}</div>
              <div className="flex flex-wrap gap-2">
                  {bank.purposes.map((p, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{p}</span>
                  ))}
              </div>
            </div>
          ))}
          {filteredAccounts.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  {searchTerm ? 'No matching bank accounts found.' : 'No bank accounts linked.'}
              </div>
          )}
        </div>
      </div>
      
      <AddBankAccountModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAccount}
      />
    </>
  );
};

const WarehousesTab: React.FC<{ entity: LegalEntity, onUpdate: (entity: LegalEntity) => void }> = ({ entity, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | undefined>(undefined);

  const handleSaveWarehouse = async (data: Warehouse) => {
    try {
      let updatedWarehouses = [...(entity.warehouses || [])];
      const index = updatedWarehouses.findIndex(w => w.id === data.id);
      
      let action = '';
      if (index !== -1) {
        updatedWarehouses[index] = data;
        action = 'Updated Warehouse';
      } else {
        updatedWarehouses = [data, ...updatedWarehouses];
        action = 'Added Warehouse';
      }

      const updatedEntity = await entityService.update(
        entity.id,
        { warehouses: updatedWarehouses },
        'current_user',
        action
      );
      onUpdate(updatedEntity);
      setIsModalOpen(false);
      setEditingWarehouse(undefined);
    } catch (err) {
      console.error(err);
      alert("Failed to save warehouse");
    }
  };

  const openEdit = (wh: Warehouse) => {
    setEditingWarehouse(wh);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingWarehouse(undefined);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
         <button 
            onClick={openAdd}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-secondary shadow-sm transition-colors text-xs font-medium"
        >
             <Plus size={14} /> Add Warehouse
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Warehouse Name</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(entity.warehouses || []).map(wh => (
              <tr key={wh.id} className="group hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-600">{wh.code}</td>
                <td className="px-4 py-3 font-medium text-text-main">{wh.name}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={wh.address}>{wh.address}</td>
                <td className="px-4 py-3 text-gray-600">{wh.managerName}</td>
                <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${wh.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {wh.status}
                    </span>
                </td>
                <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => openEdit(wh)}
                      className="text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 size={16} />
                    </button>
                </td>
              </tr>
            ))}
            {(entity.warehouses || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No warehouses recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <WarehouseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWarehouse}
        initialData={editingWarehouse}
      />
    </div>
  );
};

const ProjectsTab: React.FC<{ entity: LegalEntity }> = ({ entity }) => (
  <div className="space-y-2">
      {entity.projects.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                      <Building size={20} />
                  </div>
                  <div>
                      <div className="font-medium text-text-main">{p.projectName}</div>
                      <div className="text-xs text-gray-500">Project ID: {p.id}</div>
                  </div>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                  {p.role}
              </span>
          </div>
      ))}
      {entity.projects.length === 0 && (
        <div className="text-center py-8 text-gray-400">
            No linked projects found in Master Data.
        </div>
    )}
  </div>
);

const AuditTab: React.FC<{ entity: LegalEntity }> = ({ entity }) => (
  <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
    {entity.auditTrail.map((log) => (
      <div key={log.id} className="mb-8 ml-6 relative">
        <span className="flex absolute -left-9 justify-center items-center w-6 h-6 bg-primary/20 rounded-full ring-4 ring-white">
          <History size={12} className="text-primary" />
        </span>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-text-main">Field: {log.field}</span>
                <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Changed by <span className="font-medium text-text-main">{log.user}</span></div>
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded border border-gray-100">
                <div>
                    <div className="text-xs text-red-500 uppercase font-bold mb-1">Old Value</div>
                    <div className="break-words">{log.oldValue}</div>
                </div>
                <div>
                     <div className="text-xs text-green-500 uppercase font-bold mb-1">New Value</div>
                     <div className="break-words">{log.newValue}</div>
                </div>
            </div>
            {log.reason && (
                <div className="mt-2 text-xs text-gray-500 italic">
                    Reason: {log.reason}
                </div>
            )}
        </div>
      </div>
    ))}
  </div>
);

export const EntityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [entity, setEntity] = useState<LegalEntity | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'signatories' | 'banks' | 'warehouses' | 'projects' | 'audit'>('info');
  const [loading, setLoading] = useState(true);
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);

  useEffect(() => {
    const fetchEntity = async () => {
      if (id) {
        const data = await entityService.getById(id);
        if (data) setEntity(data);
      }
      setLoading(false);
    };
    fetchEntity();
  }, [id]);

  const handleEntityUpdate = (updatedEntity: LegalEntity) => {
    setEntity(updatedEntity);
  };

  const handleEntitySave = async (data: Partial<LegalEntity>) => {
    if (!entity) return;
    try {
        const updated = await entityService.update(entity.id, data, 'current_user', 'User Update via Form');
        setEntity(updated);
        setIsEntityModalOpen(false);
    } catch (e) {
        console.error(e);
        alert('Failed to update entity');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  if (!entity) return <div className="p-8 text-center text-red-500">Entity not found</div>;

  const tabs = [
    { id: 'info', label: 'General Info', icon: FileText },
    { id: 'signatories', label: 'Signatories', icon: Users },
    { id: 'banks', label: 'Bank Accounts', icon: CreditCard },
    { id: 'warehouses', label: 'Warehouses', icon: WarehouseIcon },
    { id: 'projects', label: 'Projects', icon: Building },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
                <Link to="/" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-text-main">{entity.legalName}</h1>
                        <StatusBadge status={entity.status} />
                    </div>
                    <p className="text-gray-500 text-sm">{entity.englishName}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">Code: {entity.code}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">Tax: {entity.taxCode}</span>
                        <span className="text-primary font-medium">{entity.type}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-colors text-sm font-medium">
                    <AlertTriangle size={16} className="text-yellow-500" /> Report Issue
                </button>
                <button 
                  onClick={() => setIsEntityModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary shadow-sm transition-colors text-sm font-medium"
                >
                    <Edit2 size={16} /> Edit Record
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                            ${activeTab === tab.id 
                                ? 'border-primary text-primary' 
                                : 'border-transparent text-gray-500 hover:text-text-main hover:border-gray-300'}
                        `}
                     >
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.id === 'signatories' && (
                             <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs ml-1">{entity.signatories.length}</span>
                        )}
                        {tab.id === 'warehouses' && (
                             <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs ml-1">{(entity.warehouses || []).length}</span>
                        )}
                     </button>
                ))}
            </nav>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
            {activeTab === 'info' && <GeneralInfoTab entity={entity} />}
            {activeTab === 'signatories' && <SignatoriesTab entity={entity} onUpdate={handleEntityUpdate} />}
            {activeTab === 'banks' && <BankAccountsTab entity={entity} onUpdate={handleEntityUpdate} />}
            {activeTab === 'warehouses' && <WarehousesTab entity={entity} onUpdate={handleEntityUpdate} />}
            {activeTab === 'projects' && <ProjectsTab entity={entity} />}
            {activeTab === 'audit' && <AuditTab entity={entity} />}
        </div>

        <LegalEntityModal 
           isOpen={isEntityModalOpen}
           onClose={() => setIsEntityModalOpen(false)}
           onSave={handleEntitySave}
           initialData={entity}
        />
    </div>
  );
};
