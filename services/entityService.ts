
import { LegalEntity, EntityStatus, EntityType, AuditLog, ProjectLink } from '../types';

// Mock Data Initialization
const MOCK_ENTITIES: LegalEntity[] = [
  {
    id: '1',
    code: 'LE-001',
    legalName: 'CÔNG TY CỔ PHẦN ĐẦU TƯ ABC LAND',
    englishName: 'ABC LAND INVESTMENT JOINT STOCK COMPANY',
    shortName: 'ABC LAND',
    taxCode: '0101234567',
    issueDate: '2020-01-15',
    issuePlace: 'Sở KH&ĐT TP. Hà Nội',
    charterCapital: 50000000000,
    headquartersAddress: 'Tầng 12, Tòa nhà ABC, Phố Duy Tân, Cầu Giấy, Hà Nội',
    tradingAddress: 'Tầng 12, Tòa nhà ABC, Phố Duy Tân, Cầu Giấy, Hà Nội',
    type: EntityType.INVESTOR,
    taxAuthority: 'Cục Thuế TP. Hà Nội',
    status: EntityStatus.ACTIVE,
    signatories: [
      {
        id: 's1',
        fullName: 'Nguyễn Văn A',
        position: 'Tổng Giám Đốc',
        idNumber: '001088000xxx',
        scopeOfAuth: ['Ký HĐMB', 'Ký Chứng từ ngân hàng'],
        validFrom: '2023-01-01',
        validTo: '2025-12-31',
        digitalSignatureProvider: 'VNPT-CA',
        digitalSignatureExpiry: '2024-12-31'
      }
    ],
    bankAccounts: [
      {
        id: 'b1',
        bankName: 'Vietcombank',
        branchName: 'Sở Giao Dịch',
        accountNumber: '001100456789',
        accountName: 'CTCP DAU TU ABC LAND',
        purposes: ['Thanh toán thuế', 'Chi phí hoạt động'],
        status: 'Active'
      }
    ],
    warehouses: [
      {
        id: 'w1',
        code: 'WH-HN-01',
        name: 'Kho Mỹ Đình',
        address: 'Đường Phạm Hùng, Nam Từ Liêm, Hà Nội',
        managerName: 'Trần Văn B',
        status: 'Active'
      }
    ],
    projects: [
      { id: 'p0', projectName: 'The Global City', role: 'Investor' },
      { id: 'standalone-m1', projectName: 'Masteri Grand View', role: 'Investor' },
      { id: 'sub-p1', projectName: 'The Sakura', role: 'Investor' },
      { id: 'sub-p2', projectName: 'The Victoria', role: 'Investor' },
      { id: 'standalone-h1', projectName: 'Masteri West Heights', role: 'Investor' }
    ],
    auditTrail: [
      {
        id: 'a1',
        timestamp: '2023-10-05T09:00:00Z',
        user: 'system_admin',
        field: 'Status',
        oldValue: 'Pending',
        newValue: 'Active',
        reason: 'Initial Approval'
      }
    ]
  },
  {
    id: '2',
    code: 'LE-002',
    legalName: 'CÔNG TY TNHH MTV XÂY DỰNG XYZ',
    englishName: 'XYZ CONSTRUCTION COMPANY LIMITED',
    shortName: 'XYZ CONS',
    taxCode: '0309876543',
    issueDate: '2019-05-20',
    issuePlace: 'Sở KH&ĐT TP. Hồ Chí Minh',
    charterCapital: 20000000000,
    headquartersAddress: '123 Đường Nguyễn Huệ, Quận 1, TP. HCM',
    tradingAddress: '123 Đường Nguyễn Huệ, Quận 1, TP. HCM',
    type: EntityType.DEVELOPER,
    taxAuthority: 'Cục Thuế TP. HCM',
    status: EntityStatus.ACTIVE,
    signatories: [],
    bankAccounts: [],
    warehouses: [],
    projects: [
      { id: 'standalone-l1', projectName: 'Masteri Elie Villa', role: 'Developer' }
    ],
    auditTrail: []
  },
  {
    id: '3',
    code: 'LE-003',
    legalName: 'CÔNG TY CỔ PHẦN ĐẦU TƯ BẤT ĐỘNG SẢN SUNRISE',
    englishName: 'SUNRISE REAL ESTATE INVESTMENT JSC',
    shortName: 'SUNRISE CORP',
    taxCode: '0312345678',
    issueDate: '2021-03-10',
    issuePlace: 'Sở KH&ĐT TP. Hồ Chí Minh',
    charterCapital: 100000000000,
    headquartersAddress: '456 Võ Văn Kiệt, Quận 1, TP. HCM',
    tradingAddress: '456 Võ Văn Kiệt, Quận 1, TP. HCM',
    type: EntityType.INVESTOR,
    taxAuthority: 'Cục Thuế Quận 1',
    status: EntityStatus.ACTIVE,
    signatories: [],
    bankAccounts: [],
    warehouses: [],
    projects: [],
    auditTrail: []
  },
  {
    id: '4',
    code: 'LE-004',
    legalName: 'CÔNG TY TNHH QUẢN LÝ DỰ ÁN GLOBAL SOLUTIONS',
    englishName: 'GLOBAL SOLUTIONS PROJECT MANAGEMENT CO., LTD',
    shortName: 'GLOBAL PM',
    taxCode: '0405678901',
    issueDate: '2018-11-25',
    issuePlace: 'Sở KH&ĐT TP. Đà Nẵng',
    charterCapital: 15000000000,
    headquartersAddress: '88 Bạch Đằng, Quận Hải Châu, Đà Nẵng',
    tradingAddress: '88 Bạch Đằng, Quận Hải Châu, Đà Nẵng',
    type: EntityType.DEVELOPER,
    taxAuthority: 'Cục Thuế Đà Nẵng',
    status: EntityStatus.SUSPENDED,
    signatories: [],
    bankAccounts: [],
    warehouses: [],
    projects: [],
    auditTrail: []
  },
  {
    id: '5',
    code: 'LE-005',
    legalName: 'CÔNG TY CỔ PHẦN DỊCH VỤ BẤT ĐỘNG SẢN PRIME AGENT',
    englishName: 'PRIME AGENT REAL ESTATE SERVICES JSC',
    shortName: 'PRIME AGENT',
    taxCode: '0107778889',
    issueDate: '2022-06-01',
    issuePlace: 'Sở KH&ĐT TP. Hà Nội',
    charterCapital: 10000000000,
    headquartersAddress: 'Tầng 5, Tòa nhà Charmvit, 117 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    tradingAddress: 'Tầng 5, Tòa nhà Charmvit, 117 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    type: EntityType.INTERNAL_EXCHANGE,
    taxAuthority: 'Chi cục thuế Cầu Giấy',
    status: EntityStatus.PENDING,
    signatories: [],
    bankAccounts: [],
    warehouses: [],
    projects: [],
    auditTrail: []
  },
  {
    id: '6',
    code: 'LE-006',
    legalName: 'CÔNG TY TNHH QUẢN LÝ KHÁCH SẠN VÀ VẬN HÀNH SMART HOME',
    englishName: 'SMART HOME HOTEL & OPERATION MANAGEMENT CO., LTD',
    shortName: 'SMART OP',
    taxCode: '0311223344',
    issueDate: '2017-02-14',
    issuePlace: 'Sở KH&ĐT TP. Hồ Chí Minh',
    charterCapital: 30000000000,
    headquartersAddress: '22 Lê Thánh Tôn, Quận 1, TP. HCM',
    tradingAddress: '22 Lê Thánh Tôn, Quận 1, TP. HCM',
    type: EntityType.OPERATOR,
    taxAuthority: 'Cục Thuế TP. Hồ Chí Minh',
    status: EntityStatus.ACTIVE,
    signatories: [],
    bankAccounts: [],
    warehouses: [],
    projects: [],
    auditTrail: []
  },
  {
    id: '7',
    code: 'LE-007',
    legalName: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN NHÀ Ở THỦ ĐÔ METRO',
    englishName: 'METRO CAPITAL HOUSING DEVELOPMENT JSC',
    shortName: 'METRO CAPITAL',
    taxCode: '0109990001',
    issueDate: '2023-01-01',
    issuePlace: 'Sở KH&ĐT TP. Hà Nội',
    charterCapital: 200000000000,
    headquartersAddress: 'Tòa nhà Diamond Flower, Lê Văn Lương, Thanh Xuân, Hà Nội',
    tradingAddress: 'Tòa nhà Diamond Flower, Lê Văn Lương, Thanh Xuân, Hà Nội',
    type: EntityType.DEVELOPER,
    taxAuthority: 'Chi cục thuế Thanh Xuân',
    status: EntityStatus.PENDING,
    signatories: [],
    bankAccounts: [],
    warehouses: [],
    projects: [],
    auditTrail: []
  }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const entityService = {
  getAll: async (): Promise<LegalEntity[]> => {
    await delay(500);
    return [...MOCK_ENTITIES];
  },

  getById: async (id: string): Promise<LegalEntity | undefined> => {
    await delay(300);
    return MOCK_ENTITIES.find(e => e.id === id);
  },

  create: async (entityData: Omit<LegalEntity, 'id' | 'auditTrail' | 'signatories' | 'bankAccounts' | 'warehouses' | 'projects'>): Promise<LegalEntity> => {
    await delay(800);
    const newEntity: LegalEntity = {
      ...entityData,
      id: Math.random().toString(36).substr(2, 9),
      status: EntityStatus.PENDING, // Mặc định là chờ duyệt
      signatories: [],
      bankAccounts: [],
      warehouses: [],
      projects: [],
      auditTrail: [{
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        user: 'current_user',
        field: 'ALL',
        oldValue: '',
        newValue: 'Created (Pending Approval)',
        reason: 'Initial Creation'
      }]
    };
    MOCK_ENTITIES.push(newEntity);
    return newEntity;
  },

  updateStatus: async (id: string, status: EntityStatus, user: string): Promise<void> => {
    const index = MOCK_ENTITIES.findIndex(e => e.id === id);
    if (index !== -1) {
      const oldStatus = MOCK_ENTITIES[index].status;
      MOCK_ENTITIES[index].status = status;
      MOCK_ENTITIES[index].auditTrail.unshift({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        user,
        field: 'status',
        oldValue: oldStatus,
        newValue: status,
        reason: 'Workflow Approval'
      });
    }
  },

  update: async (id: string, updates: Partial<LegalEntity>, user: string, reason: string): Promise<LegalEntity> => {
    await delay(600);
    const index = MOCK_ENTITIES.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Entity not found');

    const oldEntity = MOCK_ENTITIES[index];
    const newEntity = { ...oldEntity, ...updates };

    // Simple Audit Logic
    const changes: AuditLog[] = [];
    Object.keys(updates).forEach(key => {
      const k = key as keyof LegalEntity;
      if (JSON.stringify(oldEntity[k]) !== JSON.stringify(newEntity[k]) && k !== 'auditTrail') {
        changes.push({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          user,
          field: key,
          oldValue: typeof oldEntity[k] === 'object' ? 'Complex Object' : String(oldEntity[k]),
          newValue: typeof newEntity[k] === 'object' ? 'Complex Object' : String(newEntity[k]),
          reason
        });
      }
    });

    newEntity.auditTrail = [...changes, ...oldEntity.auditTrail];
    MOCK_ENTITIES[index] = newEntity;
    return newEntity;
  },

  // Phương thức đồng bộ dự án mới vào danh sách dự án của pháp nhân
  linkProject: async (entityId: string, projectId: string, projectName: string, role: 'Investor' | 'Developer' | 'Distributor'): Promise<void> => {
    const entity = MOCK_ENTITIES.find(e => e.id === entityId);
    if (entity) {
      const alreadyLinked = entity.projects.some(p => p.id === projectId && p.role === role);
      if (!alreadyLinked) {
        entity.projects.push({ id: projectId, projectName, role });
      }
    }
  },
  
  // Validation Rules
  checkTaxCodeUnique: async (taxCode: string, excludeId?: string): Promise<boolean> => {
     await delay(200);
     return !MOCK_ENTITIES.some(e => e.taxCode === taxCode && e.id !== excludeId);
  }
};
