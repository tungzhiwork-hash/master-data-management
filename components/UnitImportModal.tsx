
import React, { useState, useEffect } from 'react';
import { 
  X, UploadCloud, FileText, Download, CheckCircle2, 
  ArrowRight, AlertCircle, Loader2, Table, Trash2, ChevronRight
} from 'lucide-react';
import { Project, Unit, ApprovalType, ApprovalCategory } from '../types';
import { approvalService } from '../services/approvalService';

interface UnitImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSuccess: () => void;
}

type ImportStep = 'UPLOAD' | 'PROCESSING' | 'PREVIEW' | 'SUCCESS';

export const UnitImportModal: React.FC<UnitImportModalProps> = ({ isOpen, onClose, project, onSuccess }) => {
  const [step, setStep] = useState<ImportStep>('UPLOAD');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closing
      setStep('UPLOAD');
      setProgress(0);
      setFileName('');
      setPreviewData([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    // Logic giả lập tải file mẫu
    alert('Đang tạo file mẫu Excel cho dự án: ' + project.vnName);
  };

  const simulateUpload = (name: string) => {
    setFileName(name);
    setStep('PROCESSING');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 30;
      if (p >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          // Tạo dữ liệu giả lập dựa trên loại hình dự án
          const mockData = Array.from({ length: 12 }).map((_, i) => ({
            unitCode: `${project.systemCode}-U${100 + i}`,
            subZone: project.type === 'Cao tầng' ? 'The Sakura' : 'Villa Zone A',
            unitType: project.type === 'Cao tầng' ? '2BR' : 'Villa Unit',
            area: 75.5 + i,
            price: 55000000 + (i * 1000000)
          }));
          setPreviewData(mockData);
          setStep('PREVIEW');
        }, 500);
      } else {
        setProgress(p);
      }
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0].name);
    }
  };

  const handleSubmitApproval = async () => {
    setStep('PROCESSING');
    setProgress(0);
    
    try {
      await approvalService.createRequest({
        type: ApprovalType.IMPORT,
        category: ApprovalCategory.UNIT,
        title: `Import ${previewData.length} Căn hộ - ${project.vnName}`,
        description: `Import dữ liệu từ file ${fileName} cho dự án ${project.systemCode}`,
        requestor: 'Admin User',
        targetId: project.id,
        details: {
          itemCount: previewData.length,
          sourceFile: fileName,
          previewData: previewData
        }
      });
      
      setStep('SUCCESS');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      alert('Gửi phê duyệt thất bại');
      setStep('PREVIEW');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <UploadCloud size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-text-main uppercase tracking-tight">Import Căn hộ chi tiết</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Dự án: {project.vnName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-primary transition-all border border-transparent hover:border-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {step === 'UPLOAD' && (
            <div className="p-12 space-y-10">
              <div className="flex justify-center">
                <div className="w-full max-w-lg border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                  />
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 mx-auto group-hover:scale-110 group-hover:text-primary transition-all">
                      <FileText size={40} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-text-main">Kéo thả file Excel vào đây</p>
                      <p className="text-sm text-gray-400 font-medium mt-1">Hỗ trợ các định dạng .xlsx, .xls, .csv (Tối đa 10MB)</p>
                    </div>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20">CHỌN FILE TỪ MÁY TÍNH</button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-[24px] p-6 border border-amber-100 flex items-start gap-4 max-w-2xl mx-auto">
                <Download className="text-amber-500 shrink-0" size={24} />
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-amber-800 uppercase tracking-wide">Yêu cầu định dạng dữ liệu</h4>
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">Để tránh lỗi trong quá trình import, vui lòng sử dụng file mẫu chuẩn của hệ thống. File mẫu bao gồm tất cả các trường Master Data bắt buộc.</p>
                  <button 
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-secondary uppercase tracking-widest bg-white px-4 py-2 rounded-lg shadow-sm border border-amber-200/50"
                  >
                    TẢI FILE MẪU EXCEL (.XLSX) <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="p-20 text-center space-y-8">
              <div className="relative w-24 h-24 mx-auto">
                <Loader2 size={96} className="text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-primary">
                  {Math.round(progress)}%
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-text-main uppercase">Đang xử lý dữ liệu...</h4>
                <p className="text-sm text-gray-400 font-medium">Vui lòng không đóng cửa sổ này khi hệ thống đang kiểm tra tính hợp lệ của các dòng dữ liệu.</p>
              </div>
              <div className="w-full max-w-md mx-auto bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 shadow-[0_0_10px_rgba(181,126,61,0.5)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {step === 'PREVIEW' && (
            <div className="flex flex-col h-full">
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black uppercase">{previewData.length} DÒNG HỢP LỆ</span>
                  <span className="text-xs font-bold text-gray-400">File: {fileName}</span>
                </div>
                <button 
                  onClick={() => setStep('UPLOAD')}
                  className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1"
                >
                  <Trash2 size={14} /> Hủy kết quả & Tải lại
                </button>
              </div>
              <div className="overflow-auto max-h-[450px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">Mã Căn</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">Phân khu</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">Loại căn</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">Diện tích (m²)</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b text-right">Đơn giá tham chiếu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-primary">{row.unitCode}</td>
                        <td className="px-6 py-4 font-medium text-gray-600">{row.subZone}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase text-[9px]">{row.unitType}</span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-500">{row.area}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-text-main">{row.price.toLocaleString()} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="p-20 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200/50">
                <CheckCircle2 size={56} />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-text-main uppercase">Tải lên thành công</h4>
                <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                  Yêu cầu phê duyệt import {previewData.length} căn hộ đã được gửi tới Supervisor. Bạn có thể theo dõi trạng thái tại menu <b>Approvals</b>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        {step === 'PREVIEW' && (
          <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all font-bold text-sm"
            >
              HỦY BỎ
            </button>
            <button 
              onClick={handleSubmitApproval}
              className="px-10 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-all font-black text-sm shadow-xl shadow-primary/20 flex items-center gap-2"
            >
              GỬI PHÊ DUYỆT NGAY <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
