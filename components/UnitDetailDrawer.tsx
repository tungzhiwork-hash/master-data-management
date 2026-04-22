
import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Home, Layers, Ruler, Gavel, ShoppingCart, Wallet, Info, FileText, 
  ShieldCheck, LayoutTemplate, ExternalLink, Sparkles, Edit3, Save, RotateCcw,
  Image as ImageIcon, ZoomIn, Eye
} from 'lucide-react';
import { Unit, Project, UnitTemplate, UnitFieldMetadata, ProjectType, FieldDataType, UnitSaleStatus, UnitPicklistMetadata, CertificateStatus } from '../types';
import { metadataService } from '../services/metadataService';

interface UnitDetailDrawerProps {
  unit: Unit | null;
  onClose: () => void;
  project: Project | null;
  templates: UnitTemplate[];
  fields: UnitFieldMetadata[];
  onUpdateUnit: (updatedUnit: Unit) => void;
}

export const UnitDetailDrawer: React.FC<UnitDetailDrawerProps> = ({ 
  unit, onClose, project, templates, fields, onUpdateUnit 
}) => {
    const isOpen = !!unit && !!project;
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState<any>({});
    const [picklists, setPicklists] = useState<UnitPicklistMetadata[]>([]);
    const [showFullImage, setShowFullImage] = useState(false);

    useEffect(() => {
        if (unit) {
            setEditedValues({ ...unit });
            setIsEditing(false);
            setShowFullImage(false);
        }
    }, [unit]);

    useEffect(() => {
        metadataService.getPicklists().then(setPicklists);
    }, []);

    // Xác định Template mặc định dựa trên loại hình căn hộ
    const autoDetectedTemplateId = useMemo(() => {
        if (!unit || !project) return '';
        if (project.type === ProjectType.HIGH_RISE || unit.tower || unit.floor) return 'tmpl-high-rise';
        if (project.type === ProjectType.LOW_RISE || unit.lot) return 'tmpl-low-rise';
        return '';
    }, [unit, project]);

    const effectiveTemplateId = editedValues.templateId || autoDetectedTemplateId;
    const currentTemplate = templates.find(t => t.id === effectiveTemplateId);

    const handleTemplateChange = (templateId: string) => {
        setEditedValues(prev => ({ ...prev, templateId }));
    };

    const handleInputChange = (key: string, value: any) => {
        setEditedValues(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (editedValues) {
            onUpdateUnit(editedValues as Unit);
            setIsEditing(false);
        }
    };

    const categories = useMemo(() => {
        if (!project) return [];
        return Array.from(new Set(fields.map(f => f.category))).map(cat => {
            const catFields = fields.filter(f => {
                if (f.category !== cat) return false;
                if (currentTemplate) {
                    const override = currentTemplate.fieldOverrides.find(o => o.fieldKey === f.key);
                    if (override) return override.isVisible;
                }
                if (project.type === ProjectType.HIGH_RISE && f.isLowRiseOnly) return false;
                if (project.type === ProjectType.LOW_RISE && f.isHighRiseOnly) return false;
                return f.isVisibleInDrawer;
            });
            return { name: cat, fields: catFields };
        }).filter(c => c.fields.length > 0);
    }, [fields, project, currentTemplate]);

    const getCategoryIcon = (cat: string) => {
        switch(cat) {
            case 'Thông tin chung': return <Info size={18} className="text-primary" />;
            case 'Thông tin căn hộ': return <Layers size={18} className="text-primary" />;
            case 'Thông tin diện tích': return <Ruler size={18} className="text-primary" />;
            case 'Thông tin pháp lý': return <Gavel size={18} className="text-primary" />;
            case 'Thông tin bàn giao': return <ShoppingCart size={18} className="text-primary" />;
            case 'Tài chính kế toán': return <Wallet size={18} className="text-primary" />;
            default: return <FileText size={18} className="text-primary" />;
        }
    };

    const renderFieldInput = (field: UnitFieldMetadata) => {
        const val = editedValues[field.key];
        const commonClasses = "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-text-main focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all";

        if (field.dataType === FieldDataType.SELECT) {
            const picklist = picklists.find(p => p.fieldKey === field.key);
            return (
                <select 
                    className={commonClasses}
                    value={val || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                >
                    <option value="">-- Chọn --</option>
                    {picklist?.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            );
        }

        if (field.dataType === FieldDataType.DATE) {
            return (
                <input 
                    type="date"
                    className={commonClasses}
                    value={val || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                />
            );
        }

        if (field.dataType === FieldDataType.NUMBER) {
            return (
                <div className="relative">
                    <input 
                        type="number"
                        className={commonClasses}
                        value={val || ''}
                        onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
                    />
                    {field.category === 'Thông tin diện tích' && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">m²</span>}
                </div>
            );
        }

        return (
            <input 
                type="text"
                className={commonClasses}
                placeholder={field.key === 'certificateImageUrl' ? 'URL hình ảnh...' : ''}
                value={val || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
            />
        );
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-out border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {unit && project && (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                                    <Home className="text-primary" size={24} />
                                    {isEditing ? 'Chỉnh sửa Căn hộ' : 'Chi tiết Căn hộ'}
                                </h2>
                                <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">{project.fullName} • {unit.unitCode}</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-primary transition-all border border-transparent hover:border-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32 custom-scrollbar">
                            <section className="space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                    <div className="flex items-center gap-3">
                                        <LayoutTemplate size={18} className="text-primary" />
                                        <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Thiết lập Metadata</h3>
                                    </div>
                                    <Link to="/settings" className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">
                                        QUẢN LÝ TEMPLATES <ExternalLink size={10} />
                                    </Link>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Template áp dụng</label>
                                        {!editedValues.templateId && autoDetectedTemplateId && (
                                            <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase animate-pulse">
                                                <Sparkles size={10} /> Tự động nhận diện
                                            </span>
                                        )}
                                    </div>
                                    <select 
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 border rounded-xl text-sm font-bold text-text-main outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer ${!editedValues.templateId ? 'bg-emerald-50/30 border-emerald-200' : 'bg-primary/5 border-primary/20'} disabled:opacity-80 disabled:cursor-not-allowed`}
                                        value={editedValues.templateId || ''}
                                        onChange={(e) => handleTemplateChange(e.target.value)}
                                    >
                                        <option value="">
                                            -- Mặc định hệ thống {autoDetectedTemplateId ? `(${templates.find(t => t.id === autoDetectedTemplateId)?.name})` : ''} --
                                        </option>
                                        {templates.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </section>

                            {categories.map((cat, idx) => (
                                <section key={idx} className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                        {getCategoryIcon(cat.name)}
                                        <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">{cat.name}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                        {cat.fields.map(field => {
                                            const override = currentTemplate?.fieldOverrides.find(o => o.fieldKey === field.key);
                                            const isRequired = override ? override.isRequired : field.isRequired;
                                            const val = editedValues[field.key];
                                            
                                            // Xử lý hiển thị đặc biệt cho hình ảnh Certificate
                                            if (field.key === 'certificateImageUrl' && !isEditing) {
                                                return (
                                                    <div key={field.key} className="col-span-2 space-y-2">
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{field.label}</p>
                                                        {val ? (
                                                            <div className="relative group w-48 aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in" onClick={() => setShowFullImage(true)}>
                                                                <img src={val} alt="Certificate" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                                    <ZoomIn className="text-white" size={24} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-48 aspect-[3/4] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 gap-2">
                                                                <ImageIcon size={32} />
                                                                <span className="text-[10px] font-bold uppercase">Chưa tải ảnh</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={field.key} className={field.key === 'certificateImageUrl' && isEditing ? "col-span-2 space-y-1" : "space-y-1"}>
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{field.label}</p>
                                                        {isRequired && <span className="text-red-500 text-xs">*</span>}
                                                    </div>
                                                    
                                                    {isEditing ? (
                                                        <>
                                                            {renderFieldInput(field)}
                                                            {field.key === 'certificateImageUrl' && val && (
                                                                <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border">
                                                                    <img src={val} className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <p className={`text-sm font-bold ${field.key === 'certificateStatus' ? (val === 'Đã cấp' ? 'text-emerald-600' : 'text-gray-400') : 'text-text-main'}`}>
                                                                {val !== undefined && val !== '' 
                                                                    ? (field.dataType === FieldDataType.NUMBER 
                                                                        ? new Intl.NumberFormat('vi-VN').format(val) 
                                                                        : String(val))
                                                                    : <span className="text-gray-300 italic font-normal">Chưa cập nhật</span>}
                                                                {!isEditing && field.dataType === FieldDataType.NUMBER && field.category === 'Thông tin diện tích' && val !== undefined && ' m²'}
                                                            </p>
                                                            {field.key === 'certificateStatus' && val === 'Đã cấp' && (
                                                                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}

                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                    <ShieldCheck size={18} className="text-primary" />
                                    <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Trạng thái phê duyệt</h3>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Trạng thái Master Data</p>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${unit.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse'}`}>
                                                {unit.status === 'Approved' ? 'ĐÃ PHÊ DUYỆT' : 'CHỜ DUYỆT'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Trạng thái Bán hàng</p>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${unit.saleStatus === UnitSaleStatus.SOLD ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                                                {unit.saleStatus.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3 sticky bottom-0 z-10">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-all font-black text-sm flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={16} /> Hủy bỏ
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="flex-[2] py-3 px-4 bg-primary text-white rounded-xl hover:bg-secondary transition-all font-black text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Lưu thay đổi
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 py-3 px-4 bg-primary text-white rounded-xl hover:bg-secondary transition-all font-black text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    <Edit3 size={16} /> Chỉnh sửa thông tin
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Full Image Viewer Overlay */}
            {showFullImage && editedValues.certificateImageUrl && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-10 animate-in fade-in duration-300">
                    <button onClick={() => setShowFullImage(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <X size={40} />
                    </button>
                    <img src={editedValues.certificateImageUrl} className="max-w-full max-h-full object-contain shadow-2xl" />
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </>
    );
};
