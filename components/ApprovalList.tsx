
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileCheck, ShieldCheck, Clock, CheckCircle2, XCircle, Search, 
  Filter, ChevronRight, UploadCloud, Edit3, Building, Home, Database, 
  ArrowRight, Info, AlertCircle, Check, X, RotateCcw, Eye, Table, Download
} from 'lucide-react';
import { ApprovalRequest, ApprovalStatus, ApprovalType, ApprovalCategory } from '../types';
import { approvalService } from '../services/approvalService';

// Sub-component for Data Preview Modal
const DataPreviewModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    request: ApprovalRequest | null;
}> = ({ isOpen, onClose, request }) => {
    if (!isOpen || !request || !request.details?.previewData) return null;

    const data = request.details.previewData;
    const columns = Object.keys(data[0] || {});

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Table size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-text-main">Xem trước dữ liệu Import</h3>
                            <p className="text-xs text-gray-500 font-medium">Yêu cầu: {request.title} • {data.length} bản ghi</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-3 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl text-gray-400 hover:text-primary transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="border-b-2 border-gray-100">
                                {columns.map(col => (
                                    <th key={col} className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                    {columns.map(col => (
                                        <td key={`${idx}-${col}`} className="px-4 py-4 font-medium text-text-main">
                                            {typeof row[col] === 'number' ? row[col].toLocaleString() : String(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-all font-bold text-sm shadow-sm"
                    >
                        ĐÓNG XEM TRƯỚC
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ApprovalList: React.FC = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await approvalService.getAll();
    setRequests(data);
    setLoading(false);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesTab = activeTab === 'pending' ? r.status === ApprovalStatus.PENDING : r.status !== ApprovalStatus.PENDING;
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.requestor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchTerm]);

  const handleAction = async (id: string, status: ApprovalStatus) => {
    setIsProcessing(true);
    try {
      await approvalService.updateStatus(id, status);
      await loadData();
      setSelectedRequest(null);
    } catch (err) {
      console.error(err);
      alert('Thao tác thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadData = (request: ApprovalRequest) => {
    const data = request.details?.previewData;
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const val = row[header] ?? '';
            return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Approval_Data_${request.id}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (cat: ApprovalCategory) => {
    switch (cat) {
      case ApprovalCategory.UNIT: return <Home size={16} />;
      case ApprovalCategory.PROJECT: return <Building size={16} />;
      case ApprovalCategory.LEGAL_ENTITY: return <Database size={16} />;
      default: return <FileCheck size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-primary mb-1">
            <ShieldCheck size={28} />
            <span className="text-xs font-black uppercase tracking-widest">Workflow Engine</span>
          </div>
          <h1 className="text-3xl font-black text-text-main">Hệ thống Phê duyệt Master Data</h1>
          <p className="text-sm text-gray-500 font-medium">Kiểm soát tất cả các thay đổi dữ liệu từ Import hàng loạt đến Cập nhật lẻ.</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all ${activeTab === 'pending' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-text-main'}`}
          >
            <Clock size={16} /> CHỜ DUYỆT ({requests.filter(r => r.status === ApprovalStatus.PENDING).length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black transition-all ${activeTab === 'history' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-text-main'}`}
          >
            <CheckCircle2 size={16} /> LỊCH SỬ DUYỆT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm yêu cầu..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-20 text-center text-gray-300">Đang tải...</div>
            ) : filteredRequests.map(req => (
              <div 
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`group p-5 bg-white rounded-2xl border transition-all cursor-pointer ${selectedRequest?.id === req.id ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-gray-50 hover:border-gray-200 shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    req.type === ApprovalType.IMPORT ? 'bg-blue-50 text-blue-600' : 
                    req.type === ApprovalType.UPDATE ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {req.type === ApprovalType.IMPORT ? <UploadCloud size={10} /> : <Edit3 size={10} />} {req.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{new Date(req.requestDate).toLocaleDateString()}</span>
                </div>
                <h3 className={`font-black text-sm mb-1 ${selectedRequest?.id === req.id ? 'text-primary' : 'text-text-main'}`}>{req.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    {getCategoryIcon(req.category)}
                    {req.category}
                  </div>
                  <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    {req.requestor}
                  </div>
                </div>
              </div>
            ))}
            {!loading && filteredRequests.length === 0 && (
              <div className="p-20 text-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không có yêu cầu nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detail Panel */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden min-h-[600px] flex flex-col sticky top-8">
              <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md mb-2 inline-block">Chi tiết yêu cầu</span>
                    <h2 className="text-2xl font-black text-text-main leading-tight">{selectedRequest.title}</h2>
                  </div>
                  {selectedRequest.status !== ApprovalStatus.PENDING && (
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                      selectedRequest.status === ApprovalStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {selectedRequest.status === ApprovalStatus.APPROVED ? 'ĐÃ PHÊ DUYỆT' : 'TỪ CHỐI'}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Người yêu cầu</p>
                    <p className="text-sm font-bold text-text-main">{selectedRequest.requestor}</p>
                  </div>
                  <div className="space-y-1 border-l border-gray-200 pl-6">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Thời gian gửi</p>
                    <p className="text-sm font-mono text-text-main">{new Date(selectedRequest.requestDate).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 border-l border-gray-200 pl-6">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Mã yêu cầu</p>
                    <p className="text-sm font-mono text-primary font-bold">{selectedRequest.id}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 space-y-10 overflow-y-auto custom-scrollbar">
                {/* Changes Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Info size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Nội dung thay đổi</h3>
                    </div>
                    {selectedRequest.details?.previewData && (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleDownloadData(selectedRequest)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-[10px] font-black hover:bg-gray-100 transition-all uppercase tracking-widest"
                            >
                                <Download size={14} /> Download Data
                            </button>
                            <button 
                                onClick={() => setIsPreviewModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-xl text-[10px] font-black hover:bg-primary/10 transition-all uppercase tracking-widest"
                            >
                                <Eye size={14} /> Preview Data
                            </button>
                        </div>
                    )}
                  </div>
                  
                  {selectedRequest.type === ApprovalType.UPDATE ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                        <p className="text-[10px] text-red-400 font-black uppercase mb-3 flex items-center gap-2"><X size={12} /> DỮ LIỆU CŨ</p>
                        <p className="text-sm font-bold text-gray-600 mb-1">{selectedRequest.details?.field}</p>
                        <p className="text-lg font-black text-gray-400 line-through">{selectedRequest.details?.oldValue}</p>
                      </div>
                      <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                        <p className="text-[10px] text-green-500 font-black uppercase mb-3 flex items-center gap-2"><Check size={12} /> DỮ LIỆU MỚI</p>
                        <p className="text-sm font-bold text-gray-600 mb-1">{selectedRequest.details?.field}</p>
                        <p className="text-xl font-black text-primary">{selectedRequest.details?.newValue}</p>
                      </div>
                    </div>
                  ) : selectedRequest.type === ApprovalType.IMPORT ? (
                    <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 flex items-center gap-8">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                          <UploadCloud size={32} />
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] text-blue-400 font-black uppercase mb-1">Import Data Breakdown</p>
                          <h4 className="text-2xl font-black text-blue-700">{selectedRequest.details?.itemCount} {selectedRequest.category}</h4>
                          <div className="flex items-center gap-2 text-xs text-blue-500 mt-2 font-bold bg-white/50 w-fit px-3 py-1 rounded-lg border border-blue-100/50 shadow-sm">
                             <FileCheck size={14} /> {selectedRequest.details?.sourceFile}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed">{selectedRequest.description}</p>
                    </div>
                  )}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400 border-b border-gray-50 pb-2">
                    <AlertCircle size={18} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Ghi chú & Cảnh báo</h3>
                  </div>
                  <div className="flex gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
                     <AlertCircle size={20} className="shrink-0 mt-0.5" />
                     <p className="text-xs font-medium leading-relaxed">
                       {selectedRequest.type === ApprovalType.IMPORT 
                         ? 'Việc phê duyệt sẽ ghi đè các cấu trúc dữ liệu hiện tại trong hệ thống. Vui lòng kiểm tra "Preview Data" để đảm bảo các trường Header đã được ánh xạ chính xác.' 
                         : 'Cập nhật này sẽ có hiệu lực ngay lập tức đối với tất cả các phân hệ liên quan đến hồ sơ Master Data sau khi được duyệt.'}
                     </p>
                  </div>
                </section>
              </div>

              {selectedRequest.status === ApprovalStatus.PENDING && (
                <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex gap-4">
                  <button 
                    onClick={() => handleAction(selectedRequest.id, ApprovalStatus.REJECTED)}
                    disabled={isProcessing}
                    className="flex-1 py-4 px-6 bg-white border border-red-200 text-red-500 rounded-2xl hover:bg-red-50 transition-all font-black text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isProcessing ? <RotateCcw className="animate-spin" size={18} /> : <XCircle size={18} />} TỪ CHỐI
                  </button>
                  <button 
                    onClick={() => handleAction(selectedRequest.id, ApprovalStatus.APPROVED)}
                    disabled={isProcessing}
                    className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl hover:bg-secondary transition-all font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-[0.98]"
                  >
                    {isProcessing ? <RotateCcw className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} PHÊ DUYỆT NGAY
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl min-h-[600px] flex flex-col items-center justify-center text-center p-20">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6 shadow-inner">
                <FileCheck size={48} />
              </div>
              <h2 className="text-xl font-black text-text-main mb-2">Chọn một yêu cầu để kiểm tra</h2>
              <p className="text-sm text-gray-400 max-w-sm">Dữ liệu Master Data chỉ thay đổi sau khi được Supervisor phê duyệt tại đây.</p>
            </div>
          )}
        </div>
      </div>

      {/* Data Preview Modal */}
      <DataPreviewModal 
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        request={selectedRequest}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
