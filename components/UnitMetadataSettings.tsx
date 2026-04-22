
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings2, Search, ChevronRight, LayoutTemplate, 
  ListFilter, Layers, ChevronDown, 
  Tag as TagIcon, Hash, Type, CheckCircle2, MinusCircle, AlertCircle, HelpCircle
} from 'lucide-react';
import { metadataService } from '../services/metadataService';
import { UnitFieldMetadata, FieldDataType, UnitTemplate, UnitValueOption, UnitPicklistMetadata } from '../types';

export const UnitMetadataSettings: React.FC = () => {
  const [fields, setFields] = useState<UnitFieldMetadata[]>([]);
  const [templates, setTemplates] = useState<UnitTemplate[]>([]);
  const [picklists, setPicklists] = useState<UnitPicklistMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<UnitTemplate | null>(null);
  const [expandedPicklists, setExpandedPicklists] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const [f, t, p] = await Promise.all([
        metadataService.getFields(),
        metadataService.getTemplates(),
        metadataService.getPicklists()
      ]);
      setFields(f);
      setTemplates(t);
      setPicklists(p);
      if (t.length > 0) setSelectedTemplate(t[0]);
      setLoading(false);
    };
    load();
  }, []);

  const togglePicklistExpand = (fieldKey: string) => {
    const next = new Set(expandedPicklists);
    if (next.has(fieldKey)) next.delete(fieldKey);
    else next.add(fieldKey);
    setExpandedPicklists(next);
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fieldCategories = useMemo(() => {
    const cats: Record<string, UnitFieldMetadata[]> = {};
    fields.forEach(f => {
      if (!cats[f.category]) cats[f.category] = [];
      cats[f.category].push(f);
    });
    return cats;
  }, [fields]);

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải cấu hình Templates...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-500 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-primary mb-1">
             <LayoutTemplate size={24} />
             <span className="text-xs font-black uppercase tracking-widest">Master Data Configuration</span>
          </div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">Cấu hình Template Căn hộ</h1>
          <p className="text-sm text-gray-500 font-medium">Quy tắc hiển thị và danh mục giá trị chuẩn cho 35+ trường dữ liệu dự án.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Template List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[750px]">
            <div className="p-6 border-b border-gray-50 space-y-4 bg-gray-50/30">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text"
                        placeholder="Tìm kiếm template..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {filteredTemplates.map(tmpl => (
                  <div 
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl)}
                      className={`group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border ${selectedTemplate?.id === tmpl.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'}`}
                  >
                      <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl transition-colors ${selectedTemplate?.id === tmpl.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                              <Layers size={18} />
                          </div>
                          <div>
                              <div className={`text-sm font-black ${selectedTemplate?.id === tmpl.id ? 'text-primary' : 'text-text-main'}`}>
                                  {tmpl.name}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 font-bold tracking-wider">
                                  {tmpl.isActive ? 'ĐANG KÍCH HOẠT' : 'KHÔNG HOẠT ĐỘNG'}
                              </div>
                          </div>
                      </div>
                      <ChevronRight size={16} className={`transition-transform ${selectedTemplate?.id === tmpl.id ? 'translate-x-1 text-primary' : 'text-gray-300'}`} />
                  </div>
                ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Dữ liệu cấu hình đã được khóa.<br/>Vui lòng liên hệ Admin để thay đổi Template.</p>
            </div>
          </div>
        </div>

        {/* Main Content: Template Detail Configuration */}
        <div className="lg:col-span-8">
            {selectedTemplate ? (
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden min-h-[750px] flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                <LayoutTemplate size={28} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md mb-1 inline-block">Viewing Template Profile</span>
                                <h2 className="text-2xl font-black text-text-main tracking-tight">{selectedTemplate.name}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-10 overflow-y-auto space-y-12 custom-scrollbar pb-32">
                        {/* Header Info (Static) */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tên Template</label>
                                <p className="text-lg font-black text-text-main">{selectedTemplate.name}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Mô tả hệ thống</label>
                                <p className="text-sm font-bold text-gray-500">{selectedTemplate.description}</p>
                            </div>
                        </section>

                        {/* Fields Configuration by Categories */}
                        <div className="space-y-14">
                            {(Object.entries(fieldCategories) as [string, UnitFieldMetadata[]][]).map(([category, catFields]) => (
                                <section key={category} className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <ListFilter size={16} />
                                        </div>
                                        <h3 className="text-sm font-black text-text-main uppercase tracking-widest">{category}</h3>
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{catFields.length} trường</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 border border-gray-100 rounded-[24px] divide-y divide-gray-50 overflow-hidden shadow-sm">
                                        <div className="grid grid-cols-12 bg-gray-50/80 px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                            <div className="col-span-6">Tên trường & Danh mục giá trị</div>
                                            <div className="col-span-3 text-center">Trạng thái Hiển thị</div>
                                            <div className="col-span-3 text-center">Bắt buộc nhập</div>
                                        </div>
                                        {catFields.map(field => {
                                            const override = selectedTemplate.fieldOverrides.find(o => o.fieldKey === field.key);
                                            const isVisible = override ? override.isVisible : field.isVisibleInDrawer;
                                            const isRequired = override ? override.isRequired : field.isRequired;
                                            const isSelect = field.dataType === FieldDataType.SELECT;
                                            const isExpanded = expandedPicklists.has(field.key);
                                            const picklist = isSelect ? picklists.find(p => p.fieldKey === field.key) : null;

                                            return (
                                                <div key={field.key} className="flex flex-col">
                                                    <div className="grid grid-cols-12 px-6 py-4 items-center hover:bg-primary/5 transition-colors group">
                                                        <div className="col-span-6">
                                                            <div className="flex items-center gap-3">
                                                                {isSelect && (
                                                                    <button 
                                                                        onClick={() => togglePicklistExpand(field.key)}
                                                                        className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-primary text-white rotate-180 shadow-md shadow-primary/20' : 'bg-gray-100 text-gray-400 hover:text-primary hover:bg-primary/10'}`}
                                                                    >
                                                                        <ChevronDown size={14} />
                                                                    </button>
                                                                )}
                                                                <div className={!isSelect ? 'pl-8' : ''}>
                                                                    <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors flex items-center gap-2">
                                                                        {field.label}
                                                                        {isSelect && <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-widest">Picklist</span>}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <p className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter">{field.key}</p>
                                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                                        <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                                            {field.dataType === FieldDataType.NUMBER ? <Hash size={10}/> : field.dataType === FieldDataType.SELECT ? <TagIcon size={10}/> : <Type size={10}/>}
                                                                            {field.dataType}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3 flex justify-center">
                                                            {isVisible ? (
                                                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 animate-in zoom-in duration-300">
                                                                    <CheckCircle2 size={14} />
                                                                    <span className="text-[10px] font-black uppercase tracking-wider">Đang hiện</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                                    <MinusCircle size={14} />
                                                                    <span className="text-[10px] font-black uppercase tracking-wider">Đang ẩn</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-span-3 flex justify-center">
                                                            {isRequired ? (
                                                                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 animate-in zoom-in duration-300">
                                                                    <AlertCircle size={14} />
                                                                    <span className="text-[10px] font-black uppercase tracking-wider">Bắt buộc</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                                    <HelpCircle size={14} />
                                                                    <span className="text-[10px] font-black uppercase tracking-wider">Tùy chọn</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Picklist Expansion */}
                                                    {isSelect && isExpanded && (
                                                        <div className="bg-gray-50/80 px-14 py-6 border-t border-gray-100 animate-in slide-in-from-top duration-300">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <div className="w-1 h-3 bg-primary rounded-full"></div>
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Danh mục giá trị Master Data</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {picklist?.options.map((opt, oIdx) => (
                                                                    <div 
                                                                        key={oIdx}
                                                                        className="flex items-center gap-3 px-3.5 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all group/opt"
                                                                    >
                                                                        <div className={`w-2 h-2 rounded-full ${opt.color === 'blue' ? 'bg-blue-400' : opt.color === 'purple' ? 'bg-purple-400' : opt.color === 'orange' ? 'bg-orange-400' : 'bg-primary'}`}></div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-xs font-black text-text-main leading-none">{opt.label}</span>
                                                                            <span className="text-[8px] font-mono text-gray-400 font-bold uppercase mt-1 tracking-tighter">{opt.value}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {(!picklist || picklist.options.length === 0) && (
                                                                    <p className="text-[10px] text-gray-400 italic">Dữ liệu danh mục chưa được khởi tạo.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl min-h-[750px] flex flex-col items-center justify-center text-center p-20">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6 shadow-inner">
                        <LayoutTemplate size={48} />
                    </div>
                    <h2 className="text-xl font-black text-text-main mb-2">Chọn một Template để bắt đầu</h2>
                    <p className="text-sm text-gray-400 max-w-sm">Vui lòng chọn cấu hình dự án Cao tầng hoặc Thấp tầng từ danh sách bên trái để thiết lập bộ quy tắc dữ liệu.</p>
                </div>
            )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
