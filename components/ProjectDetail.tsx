
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Project, ProjectStatus, ProjectScope, Unit, ProjectType, AuditLog, UnitTemplate, LegalEntity, UnitSaleStatus, UnitFieldMetadata, FieldDataType, Building, BasePriceConfig } from '../types';
import { projectService } from '../services/projectService';
import { metadataService } from '../services/metadataService';
import { entityService } from '../services/entityService';
import { ProjectModal } from './ProjectModal';
import { UnitDetailDrawer } from './UnitDetailDrawer';
import { UnitImportModal } from './UnitImportModal';
import { 
  ArrowLeft, Building as BuildingIcon, MapPin, Home, X, Ruler, ShieldCheck, 
  Clock, ChevronRight, Layers, LayoutTemplate, FileText, Calendar, History, Search, Table as TableIcon, Layout as LayoutIcon, Maximize2, UploadCloud, 
  Settings2, RotateCcw, LayoutGrid, Info, Tag, ExternalLink, Bed, Bath, Landmark, ShoppingCart, Gavel, Wallet, Database, BarChart3, Activity, Coins, Percent, Plus, Save, HardHat, Check, Filter, Trash2
} from 'lucide-react';

const StructureTab: React.FC<{ structure: Project['structure'] }> = ({ structure }) => {
    const stats = [
        { label: 'Tổng diện tích đất', value: structure.totalLandArea, unit: 'm²', icon: MapPin },
        { label: 'Diện tích xây dựng', value: structure.constructionArea, unit: 'm²', icon: BuildingIcon },
        { label: 'Tổng diện tích sàn (GFA)', value: structure.gfa, unit: 'm²', icon: Layers },
        { label: 'Diện tích kinh doanh (NSA)', value: structure.nsa, unit: 'm²', icon: ShoppingCart },
        { label: 'Tổng số sản phẩm', value: structure.totalUnits, unit: 'Căn', icon: Home },
        { label: 'Tổng số tháp/khối', value: structure.totalBuildings, unit: 'Khối', icon: LayoutGrid },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-primary transition-all">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-text-main">
                                {new Intl.NumberFormat('vi-VN').format(stat.value)}
                                <span className="text-sm font-bold text-gray-400 ml-1.5">{stat.unit}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl">
                     <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-2 mb-6">
                        <BarChart3 size={18} className="text-primary" />
                        Chỉ số Hiệu quả quy hoạch
                     </h4>
                     <div className="space-y-8">
                         <div className="space-y-4">
                             <div className="flex justify-between items-end">
                                 <p className="text-sm font-bold text-gray-600">Hệ số sử dụng đất (FAR)</p>
                                 <p className="text-lg font-black text-primary">{(structure.gfa / (structure.totalLandArea || 1)).toFixed(2)}</p>
                             </div>
                             <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                 <div className="bg-primary h-full" style={{ width: '65%' }}></div>
                             </div>
                         </div>
                         <div className="space-y-4">
                             <div className="flex justify-between items-end">
                                 <p className="text-sm font-bold text-gray-600">Mật độ xây dựng</p>
                                 <p className="text-lg font-black text-primary">{(structure.constructionArea / (structure.totalLandArea || 1) * 100).toFixed(1)}%</p>
                             </div>
                             <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                 <div className="bg-primary h-full" style={{ width: '40%' }}></div>
                             </div>
                         </div>
                     </div>
                </div>

                <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 shadow-sm flex flex-col justify-center text-center">
                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-2">Tỷ lệ phí bảo trì quy định</p>
                    <div className="text-6xl font-black text-primary mb-2">{structure.maintenanceFeeRate}%</div>
                    <p className="text-sm font-bold text-primary/80">Áp dụng cho đơn giá bán {structure.maintenanceFeeRate > 1 ? 'Căn hộ Cao tầng' : 'Sản phẩm Thấp tầng'}</p>
                </div>
            </div>
        </div>
    );
};

const GeneralInfoTab: React.FC<{ project: Project, ownerEntity: LegalEntity | null }> = ({ project, ownerEntity }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
        <div className="lg:col-span-2 space-y-12">
            {/* Nhóm 1 & 2: Định danh & Phân cấp */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-2">
                    <ShieldCheck size={18} className="text-primary" />
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">1 & 2. Định danh & Phân cấp (Identification & Hierarchy)</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Mã Dự án (Project Code)</p>
                        <p className="text-base font-mono font-bold text-primary">{project.systemCode}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Trạng thái vận hành</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            project.status === ProjectStatus.SELLING ? 'bg-green-100 text-green-700 border-green-200' :
                            project.status === ProjectStatus.PRE_INVESTMENT ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                            {project.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="col-span-2 space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Tên Pháp lý chính thức</p>
                        <p className="text-base font-bold text-text-main">{project.fullName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Tên Thương mại (VN)</p>
                        <p className="text-base font-bold text-primary">{project.vnName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Commercial Name (EN)</p>
                        <p className="text-base font-bold text-primary">{project.commercialNameEn || '--'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Phân cấp Dự án</p>
                        <p className="text-base font-bold text-text-main">{project.scope}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Dự án Cha (Township)</p>
                        <p className="text-base font-bold text-text-main">{project.parentName || '--'}</p>
                    </div>
                </div>
            </section>

            {/* Nhóm 3: Đối tác & Pháp lý */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-2">
                    <MapPin size={18} className="text-primary" />
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">3. Đối tác & Pháp lý (Partners & Legal)</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                    <div className="col-span-2 space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Địa chỉ thực tế</p>
                        <p className="text-base font-bold text-text-main">{project.address}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Chủ đầu tư (Investor)</p>
                        <p className="text-base font-bold text-text-main">{project.investorName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Đơn vị Phát triển (Developer)</p>
                        <p className="text-base font-bold text-text-main">{project.developerName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Cơ quan Thuế quản lý</p>
                        <p className="text-base font-bold text-text-main">{project.taxAuthority}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Pháp nhân hồ sơ Master</p>
                        <p className="text-base font-mono font-bold text-primary">{ownerEntity ? `${ownerEntity.code} - ${ownerEntity.shortName}` : project.legalEntityId}</p>
                    </div>
                </div>
            </section>
        </div>

        <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-2">
                    <Calendar size={18} className="text-primary" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời hạn quan trọng</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Dự kiến Ký HĐMB</p>
                        <p className="text-base font-bold text-text-main">{project.expectedSpaDate || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] text-primary/60 font-black uppercase mb-1">Dự kiến Bàn giao nhà</p>
                        <p className="text-xl font-black text-primary">{project.expectedHandoverDate}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Dự kiến Quyết toán</p>
                        <p className="text-base font-bold text-text-main">{project.expectedSettlementDate}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-dark text-white rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                    <Tag size={18} className="text-primary" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phân loại danh mục</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Phân khúc sản phẩm</p>
                        <p className="text-sm font-bold text-white uppercase">{project.segment}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Dòng thương hiệu</p>
                        <p className="text-sm font-bold text-primary uppercase">{project.projectGrade}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ConstructionTab: React.FC<{ project: Project }> = ({ project }) => {
    const isHighRise = project.type === ProjectType.HIGH_RISE;
    const items = isHighRise ? project.buildings : Array.from(new Set(project.units.map(u => u.lot))).map(lot => ({
        id: lot, name: `Lô ${lot}`, status: 'In Progress', progressPercent: 60
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-text-main flex items-center gap-3">
                    <Activity className="text-primary" size={24} />
                    Theo dõi Tiến độ {isHighRise ? 'Thi công Tòa' : 'Hạ tầng Phân khu'}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item: any) => (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm hover:shadow-xl transition-all border-l-4 border-l-primary/10 hover:border-l-primary">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-2xl font-black text-text-main mb-1">{item.name}</h4>
                                <p className="text-xs font-mono font-bold text-gray-400 uppercase">{isHighRise ? `Mã tòa: ${item.code}` : `Mã lô: ${item.id}`}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                item.status === 'Finished' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                                {item.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <p className="text-xs font-bold text-gray-500">Tiến độ tổng thể</p>
                                <p className="text-sm font-black text-primary">{item.progressPercent}%</p>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div 
                                    className="bg-primary h-full transition-all duration-1000" 
                                    style={{ width: `${item.progressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        {isHighRise && (
                            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Dự kiến Bàn giao</p>
                                    <p className="text-sm font-bold text-text-main">{item.milestones?.expectedHandoverDate || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Pháp lý (Sổ đỏ)</p>
                                    <p className="text-sm font-bold text-gray-400 italic">Đang cập nhật</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const PriceSetupTab: React.FC<{ project: Project, onUpdate: (p: Project) => void }> = ({ project, onUpdate }) => {
    const isLowRise = project.type === ProjectType.LOW_RISE;
    const [localUnits, setLocalUnits] = useState<Unit[]>(project.units || []);
    const [isSaving, setIsSaving] = useState(false);

    const handlePriceChange = (id: string, value: string) => {
        const numValue = value === '' ? 0 : parseFloat(value.replace(/[^0-9]/g, ''));
        setLocalUnits(prev => prev.map(u => u.id === id ? { ...u, basePricePerM2: numValue } : u));
    };

    const handleSavePrices = async () => {
        setIsSaving(true);
        try {
            await projectService.update(project.id, { units: localUnits }, 'current_user', 'Bulk update Base Prices');
            onUpdate({ ...project, units: localUnits });
            alert('Cập nhật đơn giá thành công!');
        } catch (err) {
            console.error(err);
            alert('Lỗi khi cập nhật giá');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-text-main flex items-center gap-3">
                        <Coins className="text-primary" size={24} />
                        Thiết lập Khung giá bán kế hoạch (Setup Base Price)
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Quản lý đơn giá kinh doanh cho từng căn hộ dựa trên diện tích sử dụng.</p>
                </div>
                <button 
                    onClick={handleSavePrices}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl hover:bg-secondary shadow-xl shadow-primary/20 transition-all font-bold text-sm disabled:opacity-50"
                >
                    {isSaving ? <RotateCcw className="animate-spin" size={18} /> : <Save size={18} />} LƯU BẢNG GIÁ
                </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã Căn</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {isLowRise ? 'Phân khu' : 'Block'}
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Diện tích sử dụng (m²)</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Price / m² (VND)</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Tổng Base Price (VND)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {localUnits.map((unit) => {
                                const area = isLowRise ? (unit.totalFloorArea || 0) : (unit.netArea || 0);
                                const pricePerM2 = unit.basePricePerM2 || 0;
                                const totalPrice = area * pricePerM2;

                                return (
                                    <tr key={unit.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-5 font-black text-primary">{unit.unitCode}</td>
                                        <td className="px-8 py-5 font-bold text-gray-600">
                                            {isLowRise ? unit.subZone : unit.tower}
                                        </td>
                                        <td className="px-8 py-5 text-center font-mono font-bold text-gray-500">{area}</td>
                                        <td className="px-8 py-5">
                                            <div className="relative group/input max-w-[200px]">
                                                <input 
                                                    type="text"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-mono font-bold text-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                    value={pricePerM2.toLocaleString('vi-VN')}
                                                    onChange={(e) => handlePriceChange(unit.id, e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-mono font-black text-text-main text-base">
                                            {totalPrice.toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {localUnits.length === 0 && (
                    <div className="p-20 text-center text-gray-400 italic text-sm">
                        Chưa có dữ liệu căn hộ để thiết lập giá.
                    </div>
                )}
            </div>
        </div>
    );
};

const UnitsTab: React.FC<{ project: Project, onUpdate: (p: Project) => void }> = ({ project, onUpdate }) => {
    const navigate = useNavigate();
    const [units, setUnits] = useState<Unit[]>(project.units || []);
    const [templates, setTemplates] = useState<UnitTemplate[]>([]);
    const [fields, setFields] = useState<UnitFieldMetadata[]>([]);
    const [subProjects, setSubProjects] = useState<Project[]>([]);
    const [selectedSubProjectId, setSelectedSubProjectId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    
    // Bulk Edit states
    const [selectedUnitIds, setSelectedUnitIds] = useState<Set<string>>(new Set());
    const [bulkField, setBulkField] = useState<string>('');
    const [bulkValue, setBulkValue] = useState<string>('');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    // Advanced Filter states
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [activeFilters, setActiveFilters] = useState<{ field: string, value: string }[]>([]);
    const [tempFilterField, setTempFilterField] = useState('');
    const [tempFilterValue, setTempFilterValue] = useState('');
    
    // Import state
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    useEffect(() => {
        setUnits(project.units || []);
        metadataService.getTemplates().then(setTemplates);
        metadataService.getFields().then(setFields);
        if (project.scope === ProjectScope.TOWNSHIP) {
            projectService.getSubProjects(project.id).then(setSubProjects);
        }
    }, [project]);

    const handleUpdateUnit = async (updatedUnit: Unit) => {
        const nextUnits = units.map(u => u.id === updatedUnit.id ? updatedUnit : u);
        setUnits(nextUnits);
        setSelectedUnit(updatedUnit);
        
        try {
            await projectService.update(project.id, { units: nextUnits }, 'current_user', `Updated Metadata for Unit ${updatedUnit.unitCode}`);
            onUpdate({ ...project, units: nextUnits });
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUnits = useMemo(() => {
        let list = units;
        if (selectedSubProjectId) {
            list = list.filter(u => u.projectId === selectedSubProjectId);
        }
        
        // Apply text search
        list = list.filter(u => {
            const searchMatch = !searchTerm || 
                u.unitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.systemUnitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.tower && u.tower.toLowerCase().includes(searchTerm.toLowerCase())) ||
                u.subZone.toLowerCase().includes(searchTerm.toLowerCase());
            return searchMatch;
        });

        // Apply advanced field filters
        activeFilters.forEach(filter => {
            list = list.filter(u => {
                const unitVal = String((u as any)[filter.field] || '').toLowerCase();
                return unitVal.includes(filter.value.toLowerCase());
            });
        });
        
        return list;
    }, [units, selectedSubProjectId, searchTerm, activeFilters]);

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
        if (!bulkField || !bulkValue || selectedUnitIds.size === 0) return;
        
        setIsBulkUpdating(true);
        try {
            const updatedUnitsList = units.map(u => {
                if (selectedUnitIds.has(u.id)) {
                    return { ...u, [bulkField]: bulkValue };
                }
                return u;
            });

            await projectService.update(project.id, { units: updatedUnitsList }, 'current_user', `Bulk Updated ${bulkField} for ${selectedUnitIds.size} units`);
            
            setUnits(updatedUnitsList);
            onUpdate({ ...project, units: updatedUnitsList });
            setSelectedUnitIds(new Set());
            setBulkField('');
            setBulkValue('');
        } catch (err) {
            console.error(err);
            alert('Cập nhật hàng loạt thất bại');
        } finally {
            setIsBulkUpdating(false);
        }
    };

    const addFilter = () => {
        if (!tempFilterField || !tempFilterValue) return;
        setActiveFilters(prev => [...prev, { field: tempFilterField, value: tempFilterValue }]);
        setTempFilterField('');
        setTempFilterValue('');
    };

    const removeFilter = (index: number) => {
        setActiveFilters(prev => prev.filter((_, i) => i !== index));
    };

    const clearAllFilters = () => {
        setActiveFilters([]);
        setSearchTerm('');
    };

    const bulkFieldOptions = [
        { label: 'Trạng thái bán hàng', value: 'saleStatus', options: ['Chưa bán', 'Đã bán'] },
        { label: 'Trạng thái phê duyệt', value: 'status', options: ['Approved', 'Unapproved'] },
        { label: 'Gán Template Metadata', value: 'templateId', options: templates.map(t => t.name), actualValues: templates.map(t => t.id) },
    ];

    const filterableFields = [
        { label: 'Tòa', value: 'tower' },
        { label: 'Tầng', value: 'floor' },
        { label: 'Phân khu', value: 'subZone' },
        { label: 'Loại căn', value: 'unitType' },
        { label: 'Hướng Balcony', value: 'balconyDirection' },
        { label: 'TT Bán hàng', value: 'saleStatus' },
        { label: 'TT Phê duyệt', value: 'status' },
    ];

    if (project.scope === ProjectScope.TOWNSHIP && !selectedSubProjectId) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-text-main flex items-center gap-3">
                            <Layers className="text-primary" size={24} />
                            Quản lý Dự án thành phần
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">Khu đô thị {project.vnName} hiện có {subProjects.length} dự án thành phần nội khu.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subProjects.map((sp) => (
                        <div 
                            key={sp.id}
                            className="group bg-white border border-gray-100 rounded-[28px] p-8 text-left hover:border-primary hover:shadow-2xl transition-all duration-300 border-l-4 border-l-primary/10 hover:border-l-primary"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <BuildingIcon size={28} />
                                </div>
                                <span className={`text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10`}>{sp.status}</span>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-2xl font-black text-text-main group-hover:text-primary transition-colors mb-2">{sp.vnName}</h4>
                                <div className="flex gap-4 items-center">
                                    <span className="text-xs text-gray-400 font-mono font-bold uppercase">{sp.code}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-xs text-gray-500 font-medium">{sp.type}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 border-t border-gray-50 pt-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tổng số căn</p>
                                    <p className="text-2xl font-black text-text-main">{sp.structure.totalUnits}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Đã bán</p>
                                    <p className="text-2xl font-black text-red-600">{sp.units?.filter(u => u.saleStatus === UnitSaleStatus.SOLD).length || 0}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button 
                                    onClick={() => setSelectedSubProjectId(sp.id)}
                                    className="flex-1 py-3.5 bg-gray-50 text-text-main rounded-xl hover:bg-primary hover:text-white transition-all font-bold text-sm flex items-center justify-center gap-2 group/btn"
                                >
                                    DỮ LIỆU CĂN HỘ <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => navigate(`/project/${sp.id}`)}
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary rounded-xl transition-all"
                                >
                                    <Maximize2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    {(project.scope === ProjectScope.TOWNSHIP || selectedSubProjectId) && (
                        <button onClick={() => setSelectedSubProjectId(null)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">
                            <span>MASTER DATA / UNITS</span>
                            {selectedSubProjectId && (
                                <>
                                    <ChevronRight size={10} />
                                    <span className="text-primary">{subProjects.find(p => p.id === selectedSubProjectId)?.vnName}</span>
                                </>
                            )}
                        </div>
                        <h3 className="text-xl font-black text-text-main">Danh sách Căn hộ chi tiết</h3>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-2xl hover:bg-secondary transition-all text-sm font-bold shadow-xl shadow-primary/20 active:scale-95"
                    >
                        <UploadCloud size={18} strokeWidth={2.5} /> IMPORT EXCEL
                    </button>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Tìm theo mã căn, phân khu, loại..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setSelectedUnitIds(new Set()); }}
                    />
                </div>
                <button 
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border ${showFilterPanel ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`}
                >
                    <Filter size={18} /> BỘ LỌC {activeFilters.length > 0 && `(${activeFilters.length})`}
                </button>
            </div>

            {showFilterPanel && (
                <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-200 space-y-4 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-1.5 flex-1 min-w-[200px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trường cần lọc</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-text-main"
                                value={tempFilterField}
                                onChange={(e) => setTempFilterField(e.target.value)}
                            >
                                <option value="">-- Chọn field --</option>
                                {filterableFields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-[200px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá trị lọc</label>
                            <input 
                                type="text"
                                placeholder="Nhập giá trị..."
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                value={tempFilterValue}
                                onChange={(e) => setTempFilterValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addFilter()}
                            />
                        </div>
                        <button 
                            onClick={addFilter}
                            disabled={!tempFilterField || !tempFilterValue}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-secondary disabled:opacity-50 transition-all"
                        >
                            THÊM ĐIỀU KIỆN
                        </button>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                            {activeFilters.map((filter, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-white border border-primary/20 px-3 py-1.5 rounded-full shadow-sm">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                        {filterableFields.find(f => f.value === filter.field)?.label}:
                                    </span>
                                    <span className="text-xs font-bold text-primary">{filter.value}</span>
                                    <button 
                                        onClick={() => removeFilter(idx)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={clearAllFilters}
                                className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline px-2"
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    )}
                </div>
            )}

            {selectedUnitIds.size > 0 && (
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

            <div className="bg-white border border-gray-100 rounded-[24px] shadow-xl overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] whitespace-nowrap border-collapse">
                        <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5 w-10 sticky left-0 bg-gray-50 z-20">
                                    <div 
                                        onClick={toggleSelectAll}
                                        className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all border-2 ${
                                            selectedUnitIds.size === filteredUnits.length && filteredUnits.length > 0
                                            ? 'bg-primary border-primary text-white' 
                                            : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        {selectedUnitIds.size === filteredUnits.length && filteredUnits.length > 0 && <Check size={14} strokeWidth={4} />}
                                    </div>
                                </th>
                                <th className="px-6 py-5 sticky left-[64px] bg-gray-50 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-left">Mã Căn thương mại</th>
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
                                    <td className="px-6 py-4 font-bold text-primary sticky left-[64px] bg-white group-hover:bg-inherit z-10" onClick={() => setSelectedUnit(u)}>{u.unitCode}</td>
                                    <td className="px-6 py-4 font-bold text-gray-700" onClick={() => setSelectedUnit(u)}>{u.tower || u.lot || '--'}</td>
                                    <td className="px-6 py-4" onClick={() => setSelectedUnit(u)}>
                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[9px] font-bold border border-blue-100 uppercase">{u.unitType}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-700" onClick={() => setSelectedUnit(u)}>
                                        {u.taxArea}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-600" onClick={() => setSelectedUnit(u)}>
                                        {u.numBedrooms}
                                    </td>
                                    <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover:bg-inherit shadow-[-2px_0_5px_rgba(0,0,0,0.05)]" onClick={() => setSelectedUnit(u)}>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${u.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse'}`}>
                                            {u.status === 'Approved' ? 'ĐÃ PHÊ DUYỆT' : 'CHỜ DUYỆT'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredUnits.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-gray-400 italic">
                                        Không tìm thấy căn hộ nào khớp với điều kiện lọc.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UnitDetailDrawer 
                unit={selectedUnit} 
                onClose={() => setSelectedUnit(null)} 
                project={project} 
                templates={templates}
                fields={fields}
                onUpdateUnit={handleUpdateUnit}
            />

            <UnitImportModal 
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                project={project}
                onSuccess={() => {
                  alert('Yêu cầu import đã được gửi!');
                }}
            />
        </div>
    );
};

const AuditTab: React.FC<{ auditTrail: AuditLog[] }> = ({ auditTrail }) => (
  <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 py-4">
    {auditTrail.map((log) => (
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
        </div>
      </div>
    ))}
  </div>
);

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'structure' | 'construction' | 'prices' | 'units' | 'audit'>('info');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerEntity, setOwnerEntity] = useState<LegalEntity | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        const data = await projectService.getById(id);
        if (data) {
            setProject(data);
            const entities = await entityService.getAll();
            const found = entities.find(e => e.id === data.legalEntityId);
            if (found) setOwnerEntity(found);
        }
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  const handleProjectUpdate = (updated: Project) => {
    setProject(updated);
  };

  const handleProjectSave = async (data: Partial<Project>) => {
    if (!project) return;
    try {
        const updated = await projectService.update(project.id, data, 'current_user', 'User Update via Form');
        setProject(updated);
        const entities = await entityService.getAll();
        const found = entities.find(e => e.id === updated.legalEntityId);
        if (found) setOwnerEntity(found);
        setIsModalOpen(false);
    } catch (e) {
        console.error(e);
        alert('Failed to update project');
    }
  };

  if (loading) return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang nạp thông tin dự án...</p>
      </div>
  );
  
  if (!project) return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <X size={32} />
          </div>
          <h2 className="text-xl font-black text-text-main">Không tìm thấy dự án</h2>
          <Link to="/projects" className="text-primary font-bold hover:underline">Quay lại danh sách</Link>
      </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-10 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-5">
                <Link to="/projects" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary hover:shadow-lg transition-all">
                    <ArrowLeft size={24} />
                </Link>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                            project.scope === ProjectScope.TOWNSHIP ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            project.scope === ProjectScope.SUB_PROJECT ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                            {project.scope}
                        </span>
                        <h1 className="text-3xl font-black text-text-main tracking-tight leading-none">{project.vnName}</h1>
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold border whitespace-nowrap ${
                            project.status === ProjectStatus.SELLING ? 'bg-green-100 text-green-700 border-green-200' :
                            project.status === ProjectStatus.PRE_INVESTMENT ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                            {project.status}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                            <Tag size={14} className="text-primary" />
                            <span className="font-mono text-[11px] font-black uppercase tracking-wider">{project.systemCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Landmark size={14} className="text-primary" />
                            <span className="font-bold">{project.projectGrade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BuildingIcon size={14} className="text-primary" />
                            <span>{project.type}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTab('audit')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all text-sm font-bold shadow-sm"
                >
                    <History size={18} /> Audit Trail
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-secondary shadow-xl shadow-primary/20 transition-all text-sm font-bold"
                >
                    <Settings2 size={18} /> Edit Project
                </button>
            </div>
        </div>

        <div className="flex gap-4 border-b border-gray-100 overflow-x-auto custom-scrollbar no-scrollbar">
            {[
                { id: 'info', label: 'Thông tin chung', icon: Info },
                { id: 'structure', label: 'Cấu trúc & Thống kê', icon: Database },
                { id: 'construction', label: 'Tiến độ xây dựng', icon: Activity },
                { id: 'prices', label: 'Cài đặt giá cơ bản', icon: Coins },
                { id: 'units', label: 'Danh mục Căn hộ', icon: Home },
                { id: 'audit', label: 'Audit Trail', icon: History }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-3 text-[11px] font-black tracking-widest uppercase transition-all relative flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-text-main'}`}
                >
                    <tab.icon size={14} />
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
                </button>
            ))}
        </div>

        <div className="min-h-[500px]">
            {activeTab === 'info' && <GeneralInfoTab project={project} ownerEntity={ownerEntity} />}
            {activeTab === 'structure' && <StructureTab structure={project.structure} />}
            {activeTab === 'construction' && <ConstructionTab project={project} />}
            {activeTab === 'prices' && <PriceSetupTab project={project} onUpdate={handleProjectUpdate} />}
            {activeTab === 'units' && <UnitsTab project={project} onUpdate={handleProjectUpdate} />}
            {activeTab === 'audit' && <AuditTab auditTrail={project.auditTrail || []} />}
        </div>

        <ProjectModal 
           isOpen={isModalOpen}
           onClose={() => setIsModalOpen(false)}
           onSave={handleProjectSave}
           initialData={project}
        />
    </div>
  );
};
