
import { ApprovalRequest, ApprovalStatus, ApprovalType, ApprovalCategory, EntityStatus } from '../types';
import { entityService } from './entityService';
import { projectService } from './projectService';

const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: 'req-001',
    type: ApprovalType.IMPORT,
    category: ApprovalCategory.UNIT,
    title: 'Import 450 Căn hộ - The Sakura',
    description: 'Dữ liệu từ file: TGC_Sakura_Units_Final.xlsx',
    requestor: 'Nguyễn Văn Import',
    requestDate: '2023-11-20T10:30:00Z',
    status: ApprovalStatus.PENDING,
    details: {
      itemCount: 450,
      sourceFile: 'TGC_Sakura_Units_Final.xlsx',
      previewData: [
        { unitCode: 'SK1-02.01', tower: 'SK1', floor: '02', unitType: '2BR', netArea: 68.5, status: 'Unapproved' },
        { unitCode: 'SK1-02.02', tower: 'SK1', floor: '02', unitType: '1BR', netArea: 45.2, status: 'Unapproved' },
        { unitCode: 'SK1-02.03', tower: 'SK1', floor: '02', unitType: '3BR', netArea: 92.1, status: 'Unapproved' },
        { unitCode: 'SK1-02.04', tower: 'SK1', floor: '02', unitType: 'Studio', netArea: 32.0, status: 'Unapproved' },
        { unitCode: 'SK1-02.05', tower: 'SK1', floor: '02', unitType: '2BR', netArea: 70.0, status: 'Unapproved' },
      ]
    }
  },
  {
    id: 'req-002',
    type: ApprovalType.UPDATE,
    category: ApprovalCategory.LEGAL_ENTITY,
    title: 'Cập nhật Vốn điều lệ - ABC LAND',
    description: 'Thay đổi vốn điều lệ theo đăng ký kinh doanh mới nhất.',
    requestor: 'Trần Thị Admin',
    requestDate: '2023-11-21T14:15:00Z',
    status: ApprovalStatus.PENDING,
    targetId: '1',
    details: {
      field: 'Charter Capital',
      oldValue: '50,000,000,000 VND',
      newValue: '80,000,000,000 VND'
    }
  },
  {
    id: 'req-003',
    type: ApprovalType.CREATE,
    category: ApprovalCategory.PROJECT,
    title: 'Tạo Dự án: Masteri Grand View',
    description: 'Dự án thành phần mới trong khu đô thị TGC.',
    requestor: 'Lê Hoàng Project',
    requestDate: '2023-11-19T09:00:00Z',
    status: ApprovalStatus.APPROVED,
    details: {
      newValue: 'Masteri Grand View'
    }
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const approvalService = {
  getAll: async (): Promise<ApprovalRequest[]> => {
    await delay(600);
    return [...MOCK_APPROVALS].sort((a, b) => b.requestDate.localeCompare(a.requestDate));
  },

  updateStatus: async (id: string, status: ApprovalStatus): Promise<ApprovalRequest> => {
    await delay(800);
    const index = MOCK_APPROVALS.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    const request = MOCK_APPROVALS[index];
    request.status = status;

    // BUSINESS LOGIC: Nếu phê duyệt thành công, cập nhật dữ liệu Master
    if (status === ApprovalStatus.APPROVED) {
        const user = 'supervisor_current';
        
        if (request.type === ApprovalType.IMPORT && request.category === ApprovalCategory.UNIT) {
            // Duyệt toàn bộ căn hộ trong mẻ import
            await projectService.approveUnitsByImport('sub-p1', request.details?.sourceFile || '', user);
        } else if (request.category === ApprovalCategory.LEGAL_ENTITY && request.targetId) {
            // Chuyển trạng thái Pháp nhân sang Active
            await entityService.updateStatus(request.targetId, EntityStatus.ACTIVE, user);
        }
    }

    return request;
  },

  createRequest: async (request: Omit<ApprovalRequest, 'id' | 'status' | 'requestDate'>): Promise<ApprovalRequest> => {
    const newReq: ApprovalRequest = {
      ...request,
      id: `req-${Math.random().toString(36).substr(2, 5)}`,
      status: ApprovalStatus.PENDING,
      requestDate: new Date().toISOString()
    };
    MOCK_APPROVALS.push(newReq);
    return newReq;
  }
};
