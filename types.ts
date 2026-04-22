
export enum EntityStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
  DISSOLVING = 'Dissolving',
  CLOSED = 'Closed'
}

export enum EntityType {
  INVESTOR = 'Chủ đầu tư',
  DEVELOPER = 'Đơn vị phát triển',
  OPERATOR = 'Đơn vị vận hành',
  INTERNAL_EXCHANGE = 'Sàn giao dịch nội bộ'
}

export interface AuthorizedSignatory {
  id: string;
  fullName: string;
  position: string;
  idNumber: string; // CCCD/Passport
  scopeOfAuth: string[];
  validFrom: string;
  validTo: string;
  digitalSignatureProvider?: string;
  digitalSignatureSerial?: string;
  digitalSignatureExpiry?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountName: string;
  purposes: string[]; // e.g., "Deposit", "Tax", "Disbursement"
  status: 'Active' | 'Closed';
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  managerName: string;
  status: 'Active' | 'Inactive';
}

export interface ProjectLink {
  id: string;
  projectName: string;
  role: 'Investor' | 'Developer' | 'Distributor';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

export interface LegalEntity {
  id: string;
  code: string;
  legalName: string;
  englishName: string;
  shortName: string;
  taxCode: string;
  issueDate: string;
  issuePlace: string;
  charterCapital: number;
  headquartersAddress: string;
  tradingAddress: string;
  type: EntityType;
  taxAuthority: string;
  status: EntityStatus;
  
  // Details
  signatories: AuthorizedSignatory[];
  bankAccounts: BankAccount[];
  warehouses: Warehouse[];
  projects: ProjectLink[];
  auditTrail: AuditLog[];
}

// --- PROJECT MODULE TYPES ---

export enum ProjectStatus {
  PRE_INVESTMENT = 'Chuẩn bị đầu tư',
  SELLING = 'Đang mở bán',
  HANDOVER = 'Đang bàn giao',
  SETTLED = 'Đã quyết toán'
}

export enum ProjectType {
  HIGH_RISE = 'Cao tầng',
  LOW_RISE = 'Thấp tầng',
  MIXED = 'Hỗn hợp'
}

export enum ProjectGrade {
  MASTERI = 'Masteri',
  LUMIERE = 'Lumiere',
  COLLECTION = 'Collection'
}

export enum ProjectSegment {
  MASTERI_COLLECTION = 'Masteri Collection',
  BRANDED_RESIDENCES = 'Branded Residences',
  TOWNSHIP = 'Township'
}

export enum MocCalcType {
  FIX = 'Fix: Theo bảng giá',
  PERCENT = 'Percent: 2% * Thuần'
}

export enum ProjectScope {
  TOWNSHIP = 'Khu đô thị',
  SUB_PROJECT = 'Dự án thành phần',
  STANDALONE = 'Dự án độc lập'
}

export interface ProjectAmenity {
  id: string;
  name: string;
  type: 'Internal' | 'External';
  description?: string;
  distance?: string; // For external
}

export interface ProjectStructure {
  totalLandArea: number;
  constructionArea: number;
  gfa: number; 
  nsa: number; 
  totalUnits: number;
  totalBuildings: number;
  maintenanceFeeRate: number; // Tỷ lệ phí bảo trì (mặc định 2% hoặc 0.5%)
}

export interface ProjectMilestones {
  spaEligibilityDate?: string; 
  expectedHandoverDate?: string; 
  actualHandoverEligibleDate?: string; 
  expectedTitleDeedDate?: string; 
  titleDeedEligibleDate?: string; 
}

export interface Building {
  id: string;
  name: string;
  code: string;
  status: 'Constructing' | 'Topping Out' | 'Finished';
  progressPercent: number;
  milestones: ProjectMilestones;
}

export interface BasePriceConfig {
  unitType: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  currency: string;
}

export type UnitApprovalStatus = 'Approved' | 'Unapproved';

export enum UnitSaleStatus {
  AVAILABLE = 'Chưa bán',
  SOLD = 'Đã bán'
}

export enum CertificateStatus {
  ISSUED = 'Đã cấp',
  NOT_ISSUED = 'Chưa cấp'
}

export interface Unit {
  id: string;
  projectId: string;
  projectName?: string;        // 1. Dự án
  templateId?: string;
  
  // Thông tin chung
  lot: string;                 // 2. Lô
  subZone: string;             // 3. Phân khu
  tower?: string;              // 4. Tòa (Cao tầng)
  block?: string;              // 5. Block (Cao tầng)
  floor?: string;              // 6. Tầng (Cao tầng)
  systemUnitCode: string;      // 7. Mã căn hệ thống
  unitName: string;            // 8. Tên căn
  unitNumber: string;          // 9. Căn số
  numFloors: number;           // 10. Số tầng
  group: string;               // 11. Nhóm
  unitType: string;            // 12. Loại căn hộ
  numBedrooms: number;         // 13. Số phòng ngủ
  numBathrooms: number;        // 14. Số WC
  balconyDirection: string;    // 15. Hướng Balcony/ Cửa sổ
  doorDirection: string;       // 16. Hướng cửa chính
  view: string;                // 17. View
  handoverStandard: string;    // 18. Phân loại hoàn thiện

  // Thông tin diện tích
  landArea?: number;           // 16 Thấp tầng: Diện tích Đất
  constructionArea?: number;   // 17 Thấp tầng: Diện tích xây dựng (tầng 1)
  totalFloorArea?: number;     // 18 Thấp tầng: Diện tích sàn xây dựng
  netArea?: number;            // 19 Cao tầng: Diện tích thông thủy
  wallArea?: number;           // 20 Cao tầng: Diện tích tim tường
  taxArea: number;             // Diện tích tính thuế

  // Thông tin pháp lý
  landLotNo: string;           // Thửa đất
  mapSheet: string;            // Tờ bản đồ
  titleDeedNo: string;         // Số sổ
  bookNo: string;              // Số vào sổ
  surveyArea: number;          // Diện tích thửa
  issueDate: string;           // Ngày cấp
  
  // Cấp giấy chứng nhận (Mới)
  certificateStatus: CertificateStatus;
  certificateDate?: string;
  certificateImageUrl?: string;

  // Thông tin bàn giao
  handoverLandArea?: number;         // Diện tích đất bàn giao
  handoverConstructionArea?: number; // DT xây dựng bàn giao
  handoverTotalFloorArea?: number;   // DT sàn xây dựng bàn giao
  handoverNetArea?: number;          // DT thông thủy bàn giao
  handoverWallArea?: number;         // DT tim tường bàn giao
  streetName: string;                // Tên đường
  houseNumber: string;               // Số nhà

  // Tài chính kế toán
  managementFeeMonths: number;   // Số tháng thu PQL
  maintenanceFeePercent: number; // % KPBT
  managementUnitPrice: number;   // Đơn giá PQL
  landUnitPrice: number;         // Đơn giá đất
  constructionUnitPrice: number; // Đơn giá xây dựng
  basePricePerM2?: number;       // Đơn giá cơ bản kế hoạch cho kinh doanh

  // Trạng thái
  status: UnitApprovalStatus;
  saleStatus: UnitSaleStatus;
  approvedBy?: string;
  approvedAt?: string;

  // Fields dùng cho UI table chung
  unitCode: string; // Mã căn thương mại
  zone: string;
  position: string;
}

// --- APPROVAL SYSTEM TYPES ---

export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum ApprovalType {
  IMPORT = 'Import',
  UPDATE = 'Update',
  CREATE = 'Create'
}

export enum ApprovalCategory {
  UNIT = 'Căn hộ',
  PROJECT = 'Dự án',
  LEGAL_ENTITY = 'Pháp nhân'
}

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  category: ApprovalCategory;
  title: string;
  description: string;
  requestor: string;
  requestDate: string;
  status: ApprovalStatus;
  targetId?: string;
  details?: {
    field?: string;
    oldValue?: string;
    newValue?: string;
    itemCount?: number;
    sourceFile?: string;
    previewData?: any[]; // Mảng chứa dữ liệu xem trước (dành cho Import)
  };
}

// --- METADATA CONFIGURATION TYPES ---

export enum FieldDataType {
  TEXT = 'Text',
  NUMBER = 'Number',
  SELECT = 'Select',
  DATE = 'Date',
  BOOLEAN = 'Boolean'
}

export interface UnitFieldMetadata {
  key: string;               
  label: string;             
  dataType: FieldDataType;
  category: string;          // Nhóm phân loại (Thông tin chung, Diện tích, Pháp lý...)
  isSystem: boolean;         
  isRequired: boolean;
  isVisibleInTable: boolean;
  isVisibleInDrawer: boolean;
  isHighRiseOnly?: boolean;  // Chỉ hiện cho cao tầng
  isLowRiseOnly?: boolean;   // Chỉ hiện cho thấp tầng
  order: number;
}

export interface UnitValueOption {
  value: string;
  label: string;
  color?: string;
}

export interface UnitPicklistMetadata {
  fieldKey: string;          
  options: UnitValueOption[];
}

export interface UnitTemplate {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  fieldOverrides: {
    fieldKey: string;
    isVisible: boolean;
    isRequired: boolean;
  }[];
  createdAt: string;
}

export interface Project {
  id: string;
  systemCode: string;         // 1.1 Project Code
  commercialCode: string;
  vnName: string;             // 1.2 Commercial Name VN
  commercialNameEn?: string;  // 1.3 Commercial Name EN
  fullName: string;           // 1.4 Official Legal Name
  internalName?: string;
  abbreviation?: string;
  legalEntityId: string;      
  landCode: string;
  mocCalcType: MocCalcType;
  projectGrade: ProjectGrade;
  segment: ProjectSegment;    
  isActive: boolean;
  expectedSpaDate?: string;
  expectedHandoverDate: string;
  expectedSettlementDate: string;
  code: string; 
  address: string;
  district?: string;
  type: ProjectType;          // 2.3 Project Type
  status: ProjectStatus;      // 2.4 Status
  scope: ProjectScope;        // 2.1 Project Scope
  parentId?: string;          // 2.2 Parent Project
  parentName?: string;
  investorId: string;
  investorName: string;       // 3.1 Investor
  developerId: string;
  developerName: string;      // 3.2 Developer
  taxAuthority: string;       // 3.4 Tax Authority
  amenities: ProjectAmenity[];
  structure: ProjectStructure; // 4. Technical Scale
  buildings: Building[];
  units: Unit[];
  basePriceConfigs?: BasePriceConfig[];
  auditTrail: AuditLog[];
}
