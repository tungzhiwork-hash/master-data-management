
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, Search, Building, ChevronDown, Filter, LayoutGrid, Info, Home, 
  Table as TableIcon, Layout as LayoutIcon, Check, Settings2, RotateCcw, 
  Maximize2, Plus, UploadCloud, X, MapPin, Ruler, ShieldCheck, ChevronRight,
  UserCheck, Clock, Hash, Tag, Map as MapIcon, Compass, Eye, LayoutTemplate, ExternalLink, Bed, Bath, ShoppingCart, Gavel, Wallet, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project, ProjectScope, Unit, ProjectType, UnitTemplate, UnitSaleStatus, UnitFieldMetadata, FieldDataType } from '../types';
import { projectService } from '../services/projectService';
import { metadataService } from '../services/metadataService';
import { UnitDetailDrawer } from './UnitDetailDrawer';
import { UnitImportModal } from './UnitImportModal';

// Reusable Unit Card for Layout View
const UnitCard: React.FC<{ unit: Unit; onClick: () => void }> = ({ unit, onClick }) => {
  const isApproved = unit.status === 'Approved';
  const isSold = unit.saleStatus === UnitSaleStatus.SOLD;
  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer p-3 rounded-xl border transition-all duration-200 h-full
        ${isSold ? 'bg-red-50/30 border-red-100 opacity-90' : isApproved ? 'bg-white border-gray-100 hover:border-primary hover:shadow-md' : 'bg-gray-50 border-gray-200 opacity-80'}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] font-black font-mono ${isSold ? 'text-red-400' : isApproved ? 'text-primary' : 'text-gray-400'}`}>
          {unit.unitCode}
        </span>
        {isSold ? (
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        ) : isApproved ? (
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        )}
      </div>
      <div className="text-[9px] font-bold text-gray-500 uppercase truncate mb-1">{unit.unitType}</div>
      <div className="text-[9px] text-gray-400 font-mono">{unit.netArea || unit.totalFloorArea || unit.landArea} m²</div>
    </div>
  );
};

export const StackingPlan: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [templates, setTemplates] = useState<UnitTemplate[]>([]);
    const [fields, setFields] = useState<UnitFieldMetadata[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'table' | 'layout'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTower, setSelectedTower] = useState<string>('all');
    const [selectedFloor, setSelectedFloor] = useState<string>('all');
    const [selectedUnitType, setSelectedUnitType] = useState<string>('all');
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    
    // Bulk Edit States
    const [selectedUnitIds, setSelectedUnitIds] = useState<Set<string>>(new Set());
    const [bulkField, setBulkField] = useState<string>('');
    const [bulkValue, setBulkValue] = useState<string>('');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    // Import state
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [pData, tData, fData] = await Promise.all([
                projectService.getAll(),
                metadataService.getTemplates(),
                metadataService.getFields()
            ]);
            const filteredProjects = pData.filter(p => p.scope === ProjectScope.SUB_PROJECT || p.scope === ProjectScope.STANDALONE);
            setProjects(filteredProjects);
            setTemplates(tData);
            setFields(fData);
            if (filteredProjects.length > 0) setSelectedProject(filteredProjects[0]);
            setLoading(false);
        };
        load();
    }, []);

    const handleUpdateUnit = async (updatedUnit: Unit) => {
        if (!selectedProject) return;
        
        const nextUnits = selectedProject.units.map(u => u.id === updatedUnit.id ? updatedUnit : u);
        const nextProject = { ...selectedProject, units: nextUnits };
        
        setSelectedProject(nextProject);
        setProjects(prev => prev.map(p => p.id === nextProject.id ? nextProject : p));
        setSelectedUnit(updatedUnit);
        
        try {
            await projectService.update(selectedProject.id, { units: nextUnits }, 'current_user', `Updated Metadata for Unit ${updatedUnit.unitCode}`);
        } catch (err) {
            console.error(err);
        }
    };

    const towers = useMemo(() => {
        if (!selectedProject) return [];
        const set = new Set(selectedProject.units?.map(u => u.tower).filter(Boolean) || []);
        return Array.from(set).sort();
    }, [selectedProject]);

    const floors = useMemo(() => {
        if (!selectedProject) return [];
        const set = new Set<string>(selectedProject.units?.map(u => u.floor).filter(Boolean) || []);
        return Array.from(set).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    }, [selectedProject]);

    const unitTypes = useMemo(() => {
        if (!selectedProject) return [];
        const set = new Set(selectedProject.units?.map(u => u.unitType) || []);
        return Array.from(set).sort();
    }, [selectedProject]);

    const filteredUnits = useMemo(() => {
        if (!selectedProject) return [];
        let list = selectedProject.units || [];
        if (selectedTower !== 'all') list = list.filter(u => u.tower === selectedTower);
        if (selectedFloor !== 'all') list = list.filter(u => u.floor === selectedFloor);
        if (selectedUnitType !== 'all') list = list.filter(u => u.unitType === selectedUnitType);
        
        return list.filter(u => 
            !searchTerm || 
            u.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.systemUnitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.tower && u.tower.toLowerCase().includes(searchTerm.toLowerCase())) ||
            u.unitType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.lot && u.lot.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [selectedProject, searchTerm, selectedTower, selectedFloor, selectedUnitType]);

    // Helper function to group units by a dynamic key
    const groupUnitsBy = (units: Unit[], groupBy: 'floor' | 'lot') => {
        const map: Record<string, Unit[]> = {};
        units.forEach(u => {
            const key = u[groupBy] || 'Khác';
            if (!map[key]) map[key] = [];
            map[key].push(u);
        });
        return Object.keys(map).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(key => ({
            groupLabel: key,
            units: map[key].sort((a, b) => a.unitCode.localeCompare(b.unitCode))
        }));
    };

    const groupedUnitsData = useMemo(() => {
        if (!selectedProject) return null;
        
        if (selectedProject.type === ProjectType.MIXED) {
            const highRise = filteredUnits.filter(u => u.tower || u.floor);
            const lowRise = filteredUnits.filter(u => !u.tower && !u.floor);
            
            return {
                isMixed: true,
                highRise: groupUnitsBy(highRise, 'floor'),
                lowRise: groupUnitsBy(lowRise, 'lot')
            };
        }
        
        const isLowRise = selectedProject.type === ProjectType.LOW_RISE;
        return {
            isMixed: false,
            isLowRise: isLowRise,
            all: groupUnitsBy(filteredUnits, isLowRise ? 'lot' : 'floor')
        };
    }, [filteredUnits, selectedProject]);

    const toggleSelectUnit = (id: string) => {
        const next = new Set(selectedUnitIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedUnitIds(next);
    };

    const toggleSelectAll = () => {
        if (selectedUnitIds.size === filteredUnits.length && filteredUnits.length > 0) {
            setSelectedUnitIds(new Set());
        } else {
            setSelectedUnitIds(new Set(filteredUnits.map(u => u.id)));
        }
    };

    const handleBulkUpdate = async () => {
        if (!bulkField || !bulkValue || selectedUnitIds.size === 0 || !selectedProject) return;
        
        setIsBulkUpdating(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const updatedUnits = selectedProject.units.map(u => {
            if (selectedUnitIds.has(u.id)) {
                return { ...u, [bulkField]: bulkValue };
            }
            return u;
        });
        
        const updatedProject = { ...selectedProject, units: updatedUnits };
        setSelectedProject(updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        
        setIsBulkUpdating(false);
        setSelectedUnitIds(new Set());
        setBulkField('');
        setBulkValue('');
    };

    const bulkFieldOptions = [
        { label: 'Trạng thái bán hàng', value: 'saleStatus', options: ['Chưa bán', 'Đã bán'] },
        { label: 'Trạng thái phê duyệt', value: 'status', options: ['Approved', 'Unapproved'] },
        { label: 'Gán Template Metadata', value: 'templateId', options: templates.map(t => t.name), actualValues: templates.map(t => t.id) },
    ];

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang nạp kho hàng...</p>
        </div>
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
                        <Home className="text-primary" size={32} />
                        Units Master Registry
                    </h1>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Quản lý Master Data 35+ trường dữ liệu cho dự án {selectedProject?.type} ({selectedProject?.scope}).</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-2xl hover:bg-secondary transition-all text-sm font-bold shadow-xl shadow-primary/20 active:scale-95"
                    >
                        <UploadCloud size={18} strokeWidth={2.5} /> IMPORT EXCEL
                    </button>
                    
                    <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        <button 
                            onClick={() => { setViewMode('table'); setSelectedUnitIds(new Set()); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === 'table' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-text-main'}`}
                        >
                            <TableIcon size={16} /> DẠNG BẢNG
                        </button>
                        <button 
                            onClick={() => { setViewMode('layout'); setSelectedUnitIds(new Set()); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === 'layout' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-text-main'}`}
                        >
                            <LayoutIcon size={16} /> DẠNG MẶT BẰNG
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Building size={12} /> Chọn Dự án
                    </label>
                    <div className="relative">
                        <select 
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl appearance-none text-sm font-bold text-text-main cursor-pointer outline-none focus:ring-2 focus:ring-primary/10"
                            value={selectedProject?.id || ''}
                            onChange={(e) => {
                                const p = projects.find(proj => proj.id === e.target.value);
                                if (p) setSelectedProject(p);
                                setSelectedTower('all');
                                setSelectedFloor('all');
                                setSelectedUnitType('all');
                                setSelectedUnitIds(new Set());
                            }}
                        >
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.vnName}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        {selectedProject?.type === ProjectType.HIGH_RISE ? <Layers size={12} /> : <MapIcon size={12} />} 
                        {selectedProject?.type === ProjectType.HIGH_RISE ? 'Tòa' : 'Dãy'}
                    </label>
                    <div className="relative">
                        <select 
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl appearance-none text-sm font-bold text-text-main cursor-pointer outline-none focus:ring-2 focus:ring-primary/10"
                            value={selectedTower}
                            onChange={(e) => { setSelectedTower(e.target.value); setSelectedUnitIds(new Set()); }}
                        >
                            <option value="all">Tất cả {selectedProject?.type === ProjectType.HIGH_RISE ? 'tòa' : 'dãy'}</option>
                            {towers.length > 0 ? towers.map(t => <option key={t} value={t}>{selectedProject?.type === ProjectType.HIGH_RISE ? 'Tòa' : ''} {t}</option>) : (
                                Array.from(new Set(selectedProject?.units?.map(u => u.subZone))).map(sz => <option key={sz} value={sz}>{sz}</option>)
                            )}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Hash size={12} /> {selectedProject?.type === ProjectType.LOW_RISE ? 'Số nhà' : 'Tầng'}
                    </label>
                    <div className="relative">
                        <select 
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl appearance-none text-sm font-bold text-text-main cursor-pointer outline-none focus:ring-2 focus:ring-primary/10"
                            value={selectedFloor}
                            onChange={(e) => { setSelectedFloor(e.target.value); setSelectedUnitIds(new Set()); }}
                        >
                            <option value="all">Tất cả</option>
                            {floors.map(f => <option key={f} value={f}>Tầng {f}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Tag size={12} /> Loại Căn Hộ
                    </label>
                    <div className="relative">
                        <select 
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl appearance-none text-sm font-bold text-text-main cursor-pointer outline-none focus:ring-2 focus:ring-primary/10"
                            value={selectedUnitType}
                            onChange={(e) => { setSelectedUnitType(e.target.value); setSelectedUnitIds(new Set()); }}
                        >
                            <option value="all">Tất cả loại hình</option>
                            {unitTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Tìm theo mã căn, tháp, lô, loại hình..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setSelectedUnitIds(new Set()); }}
                    />
                </div>

                {selectedUnitIds.size > 0 && viewMode === 'table' && (
                    <div className="sticky top-0 z-40 bg-dark text-white p-5 rounded-3xl shadow-2xl flex flex-wrap items-center justify-between gap-6 animate-in slide-in-from-top duration-300 border border-white/10 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-2.5 rounded-2xl text-primary border border-primary/20">
                                <Settings2 size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Thao tác hàng loạt</p>
                                <p className="text-lg font-black">{selectedUnitIds.size} căn hộ đã chọn</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-2">
                                <select 
                                    className="bg-transparent text-white text-xs font-bold outline-none px-4 py-2.5 cursor-pointer"
                                    value={bulkField}
                                    onChange={(e) => { setBulkField(e.target.value); setBulkValue(''); }}
                                >
                                    <option value="" className="bg-dark text-white">-- Chọn trường --</option>
                                    {bulkFieldOptions.map(opt => (
                                        <option key={opt.value} value={opt.value} className="bg-dark text-white">{opt.label}</option>
                                    ))}
                                </select>
                                
                                {bulkField && (
                                    <div className="flex items-center gap-2 border-l border-white/10 pl-3 pr-2">
                                        <ChevronRight size={14} className="text-gray-500" />
                                        <select 
                                            className="bg-transparent text-white text-xs font-bold outline-none px-4 py-2.5 cursor-pointer"
                                            value={bulkValue}
                                            onChange={(e) => setBulkValue(e.target.value)}
                                        >
                                            <option value="" className="bg-dark text-white">-- Chọn giá trị --</option>
                                            {bulkFieldOptions.find(o => o.value === bulkField)?.options.map((val, idx) => {
                                                const field = bulkFieldOptions.find(o => o.value === bulkField);
                                                const actualValue = field?.actualValues ? field.actualValues[idx] : val;
                                                return <option key={actualValue} value={actualValue} className="bg-dark text-white">{val}</option>
                                            })}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setSelectedUnitIds(new Set())}
                                    className="px-6 py-3 rounded-2xl text-xs font-bold hover:bg-white/10 transition-colors"
                                >
                                    Hủy chọn
                                </button>
                                <button 
                                    onClick={handleBulkUpdate}
                                    disabled={!bulkField || !bulkValue || isBulkUpdating}
                                    className="px-8 py-3 bg-primary hover:bg-secondary disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-2xl text-xs font-black shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    {isBulkUpdating ? <RotateCcw className="animate-spin" size={16} /> : <Check size={16} />} ÁP DỤNG
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'table' ? (
                    <div className="bg-white border border-gray-100 rounded-[32px] shadow-xl overflow-hidden relative">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left text-[11px] whitespace-nowrap border-collapse">
                                <thead className="bg-gray-50/80 backdrop-blur-sm text-gray-400 font-bold uppercase tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-5 w-10 sticky left-0 bg-gray-50 z-30">
                                            <div 
                                                onClick={toggleSelectAll}
                                                className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all border-2 ${
                                                    selectedUnitIds.size === filteredUnits.length && filteredUnits.length > 0
                                                    ? 'bg-primary border-primary text-white shadow-sm shadow-primary/30' 
                                                    : 'bg-white border-gray-200'
                                                }`}
                                            >
                                                {selectedUnitIds.size === filteredUnits.length && filteredUnits.length > 0 && <Check size={14} strokeWidth={4} />}
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 sticky left-[64px] bg-gray-50 z-30 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-left">Mã Căn thương mại</th>
                                        <th className="px-6 py-5 text-left">Tòa</th>
                                        <th className="px-6 py-5 text-left">Loại căn hộ</th>
                                        <th className="px-6 py-5 text-center">Diện tích tính thuế (m²)</th>
                                        <th className="px-6 py-5 text-center">Số PN</th>
                                        <th className="px-6 py-5 text-center sticky right-0 bg-gray-50 z-20 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredUnits.map((u) => (
                                        <tr 
                                            key={u.id} 
                                            className={`hover:bg-primary/5 transition-all group cursor-pointer ${selectedUnitIds.has(u.id) ? 'bg-primary/5' : ''}`}
                                        >
                                            <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-inherit z-10" onClick={(e) => { e.stopPropagation(); toggleSelectUnit(u.id); }}>
                                                <div 
                                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all border-2 ${
                                                        selectedUnitIds.has(u.id) 
                                                        ? 'bg-primary border-primary text-white' 
                                                        : 'bg-white border-gray-200 group-hover:border-primary'
                                                    }`}
                                                >
                                                    {selectedUnitIds.has(u.id) && <Check size={14} strokeWidth={4} />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-primary sticky left-[64px] bg-white group-hover:bg-inherit z-10" onClick={() => setSelectedUnit(u)}>
                                                {u.unitCode}
                                            </td>
                                            <td className="px-6 py-4 font-black text-text-main" onClick={() => setSelectedUnit(u)}>
                                                {u.tower || u.lot || '--'}
                                            </td>
                                            <td className="px-6 py-4" onClick={() => setSelectedUnit(u)}>
                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-[9px] font-bold border border-blue-100 uppercase tracking-tighter">{u.unitType}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono font-bold text-gray-700" onClick={() => setSelectedUnit(u)}>
                                                {u.taxArea}
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-600" onClick={() => setSelectedUnit(u)}>
                                                {u.numBedrooms}
                                            </td>
                                            <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover:bg-inherit z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]" onClick={() => setSelectedUnit(u)}>
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${u.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse'}`}>
                                                    {u.status === 'Approved' ? 'ĐÃ PHÊ DUYỆT' : 'CHỜ DUYỆT'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* High Rise Section */}
                        {((groupedUnitsData as any).isMixed ? (groupedUnitsData as any).highRise.length > 0 : !(groupedUnitsData as any).isLowRise) && (
                            <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl p-12 space-y-8 min-h-[400px]">
                                {(groupedUnitsData as any).isMixed && (
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <Building className="text-primary" size={24} />
                                        <h2 className="text-xl font-black text-text-main uppercase tracking-tighter">PHÂN KHU CAO TẦNG</h2>
                                    </div>
                                )}
                                <div className="space-y-12">
                                    {((groupedUnitsData as any).isMixed ? (groupedUnitsData as any).highRise : (groupedUnitsData as any).all).map(({ groupLabel, units }: any) => (
                                        <div key={groupLabel} className="flex gap-8 group/floor">
                                            <div className="w-24 shrink-0 py-4 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-100 group-hover/floor:bg-primary/10 group-hover/floor:border-primary/20 transition-all">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tầng</span>
                                                <span className="text-2xl font-black text-text-main">{groupLabel}</span>
                                            </div>
                                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                                                {units.map((unit: any) => (
                                                    <UnitCard key={unit.id} unit={unit} onClick={() => setSelectedUnit(unit)} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Low Rise Section */}
                        {((groupedUnitsData as any).isMixed ? (groupedUnitsData as any).lowRise.length > 0 : (groupedUnitsData as any).isLowRise) && (
                            <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl p-12 space-y-8 min-h-[300px]">
                                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <MapIcon className="text-primary" size={24} />
                                    <h2 className="text-xl font-black text-text-main uppercase tracking-tighter">PHÂN KHU THẤP TẦNG (VILLA/TOWNHOUSE)</h2>
                                </div>
                                <div className="space-y-12">
                                    {((groupedUnitsData as any).isMixed ? (groupedUnitsData as any).lowRise : (groupedUnitsData as any).all).map(({ groupLabel, units }: any) => (
                                        <div key={groupLabel} className="flex gap-8 group/floor">
                                            <div className="w-24 shrink-0 py-4 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-100 group-hover/floor:bg-primary/10 group-hover/floor:border-primary/20 transition-all">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dãy</span>
                                                <span className="text-2xl font-black text-text-main">{groupLabel}</span>
                                            </div>
                                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                                                {units.map((unit: any) => (
                                                    <UnitCard key={unit.id} unit={unit} onClick={() => setSelectedUnit(unit)} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <UnitDetailDrawer 
                unit={selectedUnit} 
                onClose={() => setSelectedUnit(null)} 
                project={selectedProject} 
                templates={templates}
                fields={fields}
                onUpdateUnit={handleUpdateUnit}
            />

            {selectedProject && (
                <UnitImportModal 
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    project={selectedProject}
                    onSuccess={() => {
                        alert('Yêu cầu import đã được gửi thành công!');
                    }}
                />
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};
