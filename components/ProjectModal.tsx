
import React, { useState, useEffect } from 'react';
import { X, Info, LayoutGrid, Building, ShieldCheck, MapPin, Ruler, HardHat } from 'lucide-react';
import { Project, ProjectType, ProjectStatus, ProjectScope, ProjectGrade, ProjectSegment, MocCalcType, LegalEntity, EntityType } from '../types';
import { projectService } from '../services/projectService';
import { entityService } from '../services/entityService';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
  initialData?: Project;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [availableTownships, setAvailableTownships] = useState<Project[]>([]);
  const [availableEntities, setAvailableEntities] = useState<LegalEntity[]>([]);
  const [formData, setFormData] = useState<Partial<Project>>({
    systemCode: '',
    vnName: '',
    commercialNameEn: '',
    fullName: '',
    commercialCode: '',
    legalEntityId: '',
    projectGrade: ProjectGrade.MASTERI,
    segment: ProjectSegment.MASTERI_COLLECTION,
    isActive: true,
    expectedHandoverDate: '',
    expectedSettlementDate: '',
    expectedSpaDate: '',
    address: '',
    type: ProjectType.HIGH_RISE,
    status: ProjectStatus.PRE_INVESTMENT,
    scope: ProjectScope.STANDALONE,
    investorId: '',
    investorName: '',
    developerId: '',
    developerName: '',
    taxAuthority: '',
    structure: {
        totalLandArea: 0,
        constructionArea: 0,
        gfa: 0,
        nsa: 0,
        totalUnits: 0,
        totalBuildings: 0,
        maintenanceFeeRate: 2
    }
  });

  useEffect(() => {
    const loadMasterData = async () => {
        const [townships, entities] = await Promise.all([
          projectService.getTownships(),
          entityService.getAll()
        ]);
        setAvailableTownships(townships);
        setAvailableEntities(entities);
    };
    if (isOpen) loadMasterData();
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
        // Reset for create mode
      setFormData({
        systemCode: '',
        vnName: '',
        commercialNameEn: '',
        fullName: '',
        commercialCode: '',
        legalEntityId: '',
        projectGrade: ProjectGrade.MASTERI,
        segment: ProjectSegment.MASTERI_COLLECTION,
        isActive: true,
        expectedHandoverDate: '',
        expectedSettlementDate: '',
        expectedSpaDate: '',
        address: '',
        type: ProjectType.HIGH_RISE,
        status: ProjectStatus.PRE_INVESTMENT,
        scope: ProjectScope.STANDALONE,
        investorId: '',
        investorName: '',
        developerId: '',
        developerName: '',
        taxAuthority: '',
        structure: {
            totalLandArea: 0,
            constructionArea: 0,
            gfa: 0,
            nsa: 0,
            totalUnits: 0,
            totalBuildings: 0,
            maintenanceFeeRate: 2
        }
      });
    }
  }, [initialData, isOpen]);

  // Tự động cập nhật tỷ lệ phí bảo trì khi thay đổi loại hình
  useEffect(() => {
      if (!initialData) {
          const rate = formData.type === ProjectType.LOW_RISE ? 0.5 : 2;
          setFormData(prev => ({
              ...prev,
              structure: { ...prev.structure!, maintenanceFeeRate: rate }
          }));
      }
  }, [formData.type]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEntitySelect = (role: 'investor' | 'developer', entityId: string) => {
    const entity = availableEntities.find(e => e.id === entityId);
    if (role === 'investor') {
      setFormData(prev => ({
        ...prev,
        investorId: entityId,
        investorName: entity ? entity.legalName : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        developerId: entityId,
        developerName: entity ? entity.legalName : ''
      }));
    }
  };

  const handleStructureChange = (field: keyof Project['structure'], value: any) => {
    setFormData(prev => ({
        ...prev,
        structure: { ...prev.structure!, [field]: value }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-text-main flex items-center gap-2">
                <Building className="text-primary" />
                {initialData ? 'Cập nhật Hồ sơ Dự án' : 'Khởi tạo Dự án mới'}
            </h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Master Data Registry • Project Module</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-primary transition-all border border-transparent hover:border-gray-200">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
           
           {/* 1. Nhóm Thông tin Định danh */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                 <ShieldCheck className="text-primary" size={20} />
                 <h4 className="text-sm font-black text-text-main uppercase tracking-widest">1. Thông tin Định danh (Identification)</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Mã Dự án (Internal Code) <span className="text-red-500">*</span></label>
                     <input 
                        required
                        type="text" 
                        placeholder="PRJ-001"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm font-bold text-text-main transition-all"
                        value={formData.systemCode}
                        onChange={e => handleInputChange('systemCode', e.target.value)}
                      />
                  </div>
                  <div className="lg:col-span-3">
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tên Pháp lý chính thức (Official Legal Name) <span className="text-red-500">*</span></label>
                     <input 
                        required
                        type="text" 
                        placeholder="CÔNG TY CỔ PHẦN ĐẦU TƯ ABC - DỰ ÁN KHU NHÀ Ở CAO CẤP..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main transition-all uppercase"
                        value={formData.fullName}
                        onChange={e => handleInputChange('fullName', e.target.value)}
                      />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tên Thương mại tiếng Việt <span className="text-red-500">*</span></label>
                     <input 
                        required
                        type="text" 
                        placeholder="The Sakura"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-primary transition-all"
                        value={formData.vnName}
                        onChange={e => handleInputChange('vnName', e.target.value)}
                      />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tên Thương mại tiếng Anh</label>
                     <input 
                        type="text" 
                        placeholder="The Sakura Residence"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-primary transition-all"
                        value={formData.commercialNameEn}
                        onChange={e => handleInputChange('commercialNameEn', e.target.value)}
                      />
                  </div>
              </div>
           </div>

           {/* 2. Nhóm Phân cấp & Loại hình */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                 <LayoutGrid className="text-primary" size={20} />
                 <h4 className="text-sm font-black text-text-main uppercase tracking-widest">2. Phân cấp & Loại hình (Hierarchy & Type)</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phân cấp Dự án</label>
                     <select 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main cursor-pointer"
                        value={formData.scope}
                        onChange={e => handleInputChange('scope', e.target.value)}
                     >
                         {Object.values(ProjectScope).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Dự án Cha (Parent)</label>
                      <select 
                        disabled={formData.scope !== ProjectScope.SUB_PROJECT}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main disabled:opacity-50"
                        value={formData.parentId || ''}
                        onChange={e => handleInputChange('parentId', e.target.value)}
                      >
                          <option value="">-- Chọn Dự án tổng --</option>
                          {availableTownships.map(t => <option key={t.id} value={t.id}>{t.vnName}</option>)}
                      </select>
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Loại hình Dự án</label>
                     <select 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main cursor-pointer"
                        value={formData.type}
                        onChange={e => handleInputChange('type', e.target.value)}
                     >
                         {Object.values(ProjectType).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Trạng thái vận hành</label>
                     <select 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main cursor-pointer"
                        value={formData.status}
                        onChange={e => handleInputChange('status', e.target.value)}
                     >
                         {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>
              </div>
           </div>

           {/* 3. Nhóm Đối tác & Pháp lý */}
           <div className="space-y-6">
               <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                 <MapPin className="text-primary" size={20} />
                 <h4 className="text-sm font-black text-text-main uppercase tracking-widest">3. Đối tác & Pháp lý (Partners & Legal)</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Địa chỉ Dự án <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="text" 
                        placeholder="Vị trí thực tế của dự án..."
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main transition-all"
                        value={formData.address}
                        onChange={e => handleInputChange('address', e.target.value)}
                      />
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Chủ đầu tư (Investor)</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main cursor-pointer transition-all"
                        value={formData.investorId || ''}
                        onChange={e => handleEntitySelect('investor', e.target.value)}
                      >
                        <option value="">-- Chọn Chủ đầu tư --</option>
                        {availableEntities.filter(e => e.type === EntityType.INVESTOR).map(e => (
                          <option key={e.id} value={e.id}>{e.shortName} - {e.legalName}</option>
                        ))}
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Đơn vị Phát triển (Developer)</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main cursor-pointer transition-all"
                        value={formData.developerId || ''}
                        onChange={e => handleEntitySelect('developer', e.target.value)}
                      >
                        <option value="">-- Chọn Đơn vị phát triển --</option>
                        {availableEntities.filter(e => e.type === EntityType.DEVELOPER).map(e => (
                          <option key={e.id} value={e.id}>{e.shortName} - {e.legalName}</option>
                        ))}
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Cơ quan Thuế quản lý</label>
                      <input 
                        type="text" 
                        placeholder="Chi cục thuế..."
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main transition-all"
                        value={formData.taxAuthority}
                        onChange={e => handleInputChange('taxAuthority', e.target.value)}
                      />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Pháp nhân sở hữu (Master Data)</label>
                     <select 
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-text-main"
                        value={formData.legalEntityId}
                        onChange={e => handleInputChange('legalEntityId', e.target.value)}
                     >
                         <option value="">-- Liên kết Pháp nhân --</option>
                         {availableEntities.map(e => (
                             <option key={e.id} value={e.id}>{e.code} - {e.shortName}</option>
                         ))}
                     </select>
                  </div>
              </div>
           </div>

           {/* 4. Nhóm Quy mô Kỹ thuật */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                 <Ruler className="text-primary" size={20} />
                 <h4 className="text-sm font-black text-text-main uppercase tracking-widest">4. Quy mô Kỹ thuật (Structure/Technical Scale)</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tổng diện tích đất (m²)</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono font-bold text-text-main"
                        value={formData.structure?.totalLandArea}
                        onChange={e => handleStructureChange('totalLandArea', parseFloat(e.target.value))}
                      />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Diện tích xây dựng (m²)</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono font-bold text-text-main"
                        value={formData.structure?.constructionArea}
                        onChange={e => handleStructureChange('constructionArea', parseFloat(e.target.value))}
                      />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tổng diện tích sàn GFA (m²)</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono font-bold text-text-main"
                        value={formData.structure?.gfa}
                        onChange={e => handleStructureChange('gfa', parseFloat(e.target.value))}
                      />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Diện tích thông thủy NSA (m²)</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono font-bold text-text-main"
                        value={formData.structure?.nsa}
                        onChange={e => handleStructureChange('nsa', parseFloat(e.target.value))}
                      />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tổng số căn hộ/Sản phẩm</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono font-bold text-primary"
                        value={formData.structure?.totalUnits}
                        onChange={e => handleStructureChange('totalUnits', parseInt(e.target.value))}
                      />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tổng số tháp/Khối</label>
                     <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono font-bold text-text-main"
                        value={formData.structure?.totalBuildings}
                        onChange={e => handleStructureChange('totalBuildings', parseInt(e.target.value))}
                      />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tỷ lệ phí bảo trì (%)</label>
                     <div className="relative">
                        <input 
                            type="number" 
                            step="0.1"
                            className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none text-sm font-mono font-black text-amber-700"
                            value={formData.structure?.maintenanceFeeRate}
                            onChange={e => handleStructureChange('maintenanceFeeRate', parseFloat(e.target.value))}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold">%</span>
                     </div>
                  </div>
              </div>
           </div>

          <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl hover:bg-gray-100 transition-all font-black text-sm uppercase tracking-widest"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="px-12 py-4 bg-primary text-white rounded-2xl hover:bg-secondary transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95"
            >
              {initialData ? 'Cập nhật Dự án' : 'Khởi tạo Dự án'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
