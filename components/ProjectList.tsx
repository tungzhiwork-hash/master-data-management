
import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, ProjectScope } from '../types';
import { projectService } from '../services/projectService';
import { Search, Eye, Filter, Plus, ChevronRight, ChevronDown, Building, FileText, LayoutGrid, RotateCcw, ShieldCheck, Database, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectModal } from './ProjectModal';

export const ProjectList: React.FC = () => {
  const [projects, setEntities] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await projectService.getAll();
      setEntities(data);
      // Auto expand all townships initially for better visibility
      const townshipIds = data.filter(p => p.scope === ProjectScope.TOWNSHIP).map(p => p.id);
      setExpandedRows(new Set(townshipIds));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data: Partial<Project>) => {
    try {
      await projectService.create(data);
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create project', error);
      alert('Failed to create project');
    }
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
        newExpanded.delete(id);
    } else {
        newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status: ProjectStatus) => {
      switch (status) {
          case ProjectStatus.SELLING: return 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20';
          case ProjectStatus.PRE_INVESTMENT: return 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20';
          case ProjectStatus.HANDOVER: return 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/20';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const matchesSearch = (p: Project) => 
      p.vnName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase());

  const renderProjectRow = (project: Project, level: number = 0) => {
      const isTownship = project.scope === ProjectScope.TOWNSHIP;
      const isStandalone = project.scope === ProjectScope.STANDALONE;
      const isSubProject = project.scope === ProjectScope.SUB_PROJECT;
      
      const children = projects.filter(p => p.parentId === project.id);
      const isExpanded = expandedRows.has(project.id);
      
      const selfMatch = matchesSearch(project);
      const childrenMatch = children.some(c => matchesSearch(c));
      
      if (searchTerm && !selfMatch && !childrenMatch) return null;

      return (
          <React.Fragment key={project.id}>
              <tr className={`hover:bg-primary/5 transition-colors border-b border-gray-100 group whitespace-nowrap ${isSubProject ? 'bg-gray-50/40' : 'bg-white'}`}>
                  <td className="px-6 py-4 sticky left-0 z-10 bg-inherit shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                      <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
                          <div className="w-6 flex items-center justify-center">
                            {(isTownship && children.length > 0) && (
                                <button 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleRow(project.id); }} 
                                    className="text-gray-400 hover:text-primary transition-transform"
                                >
                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2.5 ml-1">
                              <div className={`p-1.5 rounded-md ${
                                  isTownship ? 'bg-purple-50 text-purple-600' : 
                                  isStandalone ? 'bg-amber-50 text-amber-600' : 
                                  'bg-blue-50 text-blue-600'
                              }`}>
                                  {isTownship ? <LayoutGrid size={16} /> : 
                                   isStandalone ? <Building size={16} /> : 
                                   <Home size={14} />}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                  <span className={`text-sm tracking-tight truncate max-w-[280px] ${isTownship ? 'text-text-main font-bold' : isStandalone ? 'text-text-main font-semibold' : 'text-gray-700 font-medium'}`}>
                                      {project.vnName}
                                  </span>
                                  <span className="text-[10px] font-mono text-gray-400 font-bold border border-gray-100 px-1.5 py-0.5 rounded bg-gray-50/50">{project.code}</span>
                              </div>
                          </div>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                       <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                           isTownship ? 'bg-purple-50 text-purple-700 border-purple-200' :
                           isSubProject ? 'bg-blue-50 text-blue-700 border-blue-200' :
                           'bg-amber-50 text-amber-700 border-amber-200'
                       }`}>
                           {project.scope}
                       </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs font-semibold whitespace-nowrap">
                      {project.type}
                      {project.structure.totalUnits > 0 && (
                          <span className="ml-2 text-[10px] text-gray-400 font-normal">({project.structure.totalUnits} căn)</span>
                      )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-[11px] max-w-[250px] truncate whitespace-nowrap" title={project.investorName}>
                      {project.investorName}
                  </td>
                  <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold border whitespace-nowrap ${getStatusColor(project.status)}`}>
                          {project.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-right sticky right-0 z-10 bg-inherit shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]">
                      <Link 
                          to={`/project/${project.id}`}
                          className="inline-flex items-center gap-1.5 text-primary hover:text-secondary font-bold text-xs"
                      >
                          <Eye size={14} /> <span>CHI TIẾT</span>
                      </Link>
                  </td>
              </tr>
              {isTownship && isExpanded && children.map(child => renderProjectRow(child, level + 1))}
          </React.Fragment>
      );
  };

  const rootProjects = projects.filter(p => p.scope !== ProjectScope.SUB_PROJECT);

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
             <Database className="text-primary" size={32} />
             Hệ thống Phân cấp Dự án
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl font-medium leading-relaxed">
            Danh mục Master Data: Quản lý cấu trúc từ Khu đô thị tổng thể đến các Dự án thành phần và Căn hộ chi tiết.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-secondary text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 transition-all flex items-center gap-2.5 active:scale-95"
        >
           <Plus size={20} strokeWidth={3} />
           TẠO DỰ ÁN MỚI
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap gap-4 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên dự án, mã nội bộ, dự án thành phần..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 text-xs font-bold hover:bg-gray-50 hover:border-primary transition-all">
               <Filter size={16} /> BỘ LỌC
            </button>
            <button 
                onClick={loadData}
                className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-primary hover:border-primary transition-all"
                title="Làm mới"
            >
                <RotateCcw size={18} />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="p-24 text-center text-gray-400 flex flex-col items-center gap-5">
                <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">Đang nạp dữ liệu...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse table-auto min-w-[1000px]">
              <thead className="bg-gray-50/80 backdrop-blur-md text-gray-400 font-bold uppercase text-[10px] tracking-[0.25em] border-b border-gray-100 sticky top-0 z-20">
                <tr className="whitespace-nowrap">
                  <th className="px-6 py-5 min-w-[350px] sticky left-0 z-30 bg-gray-50 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">Phân cấp & Tên dự án/Dự án thành phần</th>
                  <th className="px-6 py-5">Cấp độ</th>
                  <th className="px-6 py-5">Loại hình (Số căn)</th>
                  <th className="px-6 py-5">Chủ đầu tư</th>
                  <th className="px-6 py-5">Trạng thái</th>
                  <th className="px-6 py-5 text-right sticky right-0 z-30 bg-gray-50 shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rootProjects.map(p => renderProjectRow(p))}
                {rootProjects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-32 text-center bg-gray-50/30">
                        <div className="flex flex-col items-center gap-4 text-gray-300">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                                <LayoutGrid size={40} className="text-gray-200" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-500">Không có dữ liệu phù hợp</p>
                            </div>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 py-4 text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
          <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span>Khu đô thị: {projects.filter(p => p.scope === ProjectScope.TOWNSHIP).length}</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span>Dự án độc lập: {projects.filter(p => p.scope === ProjectScope.STANDALONE).length}</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span>Dự án thành phần: {projects.filter(p => p.scope === ProjectScope.SUB_PROJECT).length}</span>
              </div>
          </div>
          <div className="flex items-center gap-2.5 text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
              <ShieldCheck size={16} strokeWidth={2.5} />
              <span>Certified Master Data Management</span>
          </div>
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateProject}
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
