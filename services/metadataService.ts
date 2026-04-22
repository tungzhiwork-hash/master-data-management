
import { UnitFieldMetadata, FieldDataType, UnitPicklistMetadata, UnitTemplate } from '../types';

const INITIAL_FIELDS: UnitFieldMetadata[] = [
  // Thông tin chung
  { key: 'projectName', label: 'Dự án', dataType: FieldDataType.TEXT, category: 'Thông tin chung', isSystem: true, isRequired: true, isVisibleInTable: false, isVisibleInDrawer: true, order: 1 },
  { key: 'lot', label: 'Lô', dataType: FieldDataType.TEXT, category: 'Thông tin chung', isSystem: true, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, order: 2 },
  { key: 'subZone', label: 'Phân khu', dataType: FieldDataType.TEXT, category: 'Thông tin chung', isSystem: true, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, order: 3 },
  
  // Thông tin căn hộ
  { key: 'tower', label: 'Tòa', dataType: FieldDataType.TEXT, category: 'Thông tin căn hộ', isSystem: false, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, isHighRiseOnly: true, order: 4 },
  { key: 'block', label: 'Block', dataType: FieldDataType.TEXT, category: 'Thông tin căn hộ', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, isHighRiseOnly: true, order: 5 },
  { key: 'floor', label: 'Tầng', dataType: FieldDataType.TEXT, category: 'Thông tin căn hộ', isSystem: false, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, isHighRiseOnly: true, order: 6 },
  
  { key: 'systemUnitCode', label: 'Mã căn hệ thống', dataType: FieldDataType.TEXT, category: 'Thông tin chung', isSystem: true, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, order: 7 },
  { key: 'unitName', label: 'Tên căn', dataType: FieldDataType.TEXT, category: 'Thông tin chung', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 8 },
  { key: 'unitNumber', label: 'Căn số', dataType: FieldDataType.TEXT, category: 'Thông tin chung', isSystem: true, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, order: 9 },
  { key: 'numFloors', label: 'Số tầng', dataType: FieldDataType.NUMBER, category: 'Thông tin chung', isSystem: false, isRequired: true, isVisibleInTable: false, isVisibleInDrawer: true, order: 10 },
  { key: 'group', label: 'Nhóm', dataType: FieldDataType.TEXT, category: 'Thông tin chung', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 11 },
  { key: 'unitType', label: 'Loại căn hộ', dataType: FieldDataType.SELECT, category: 'Thông tin chung', isSystem: true, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, order: 12 },
  { key: 'numBedrooms', label: 'Số phòng ngủ', dataType: FieldDataType.NUMBER, category: 'Thông tin chung', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 13 },
  { key: 'numBathrooms', label: 'Số WC', dataType: FieldDataType.NUMBER, category: 'Thông tin chung', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 14 },
  { key: 'balconyDirection', label: 'Hướng Balcony/ cửa sổ', dataType: FieldDataType.SELECT, category: 'Thông tin chung', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 15 },
  { key: 'doorDirection', label: 'Hướng cửa chính', dataType: FieldDataType.SELECT, category: 'Thông tin chung', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 16 },
  { key: 'view', label: 'View', dataType: FieldDataType.TEXT, category: 'Thông tin chung', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 17 },
  { key: 'handoverStandard', label: 'Phân loại hoàn thiện', dataType: FieldDataType.SELECT, category: 'Thông tin chung', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 18 },

  // Thông tin diện tích
  { key: 'landArea', label: 'Diện tích Đất', dataType: FieldDataType.NUMBER, category: 'Thông tin diện tích', isSystem: false, isRequired: true, isVisibleInTable: false, isVisibleInDrawer: true, isLowRiseOnly: true, order: 19 },
  { key: 'constructionArea', label: 'Diện tích xây dựng (tầng 1)', dataType: FieldDataType.NUMBER, category: 'Thông tin diện tích', isSystem: false, isRequired: true, isVisibleInTable: false, isVisibleInDrawer: true, isLowRiseOnly: true, order: 20 },
  { key: 'totalFloorArea', label: 'Diện tích sàn xây dựng', dataType: FieldDataType.NUMBER, category: 'Thông tin diện tích', isSystem: false, isRequired: true, isVisibleInTable: false, isVisibleInDrawer: true, isLowRiseOnly: true, order: 21 },
  { key: 'netArea', label: 'Diện tích thông thủy', dataType: FieldDataType.NUMBER, category: 'Thông tin diện tích', isSystem: false, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, isHighRiseOnly: true, order: 22 },
  { key: 'wallArea', label: 'Diện tích tim tường', dataType: FieldDataType.NUMBER, category: 'Thông tin diện tích', isSystem: false, isRequired: true, isVisibleInTable: true, isVisibleInDrawer: true, isHighRiseOnly: true, order: 23 },
  { key: 'taxArea', label: 'Diện tích tính thuế', dataType: FieldDataType.NUMBER, category: 'Thông tin diện tích', isSystem: true, isRequired: true, isVisibleInTable: false, isVisibleInDrawer: true, order: 24 },

  // Thông tin pháp lý & Giấy chứng nhận
  { key: 'landLotNo', label: 'Thửa đất', dataType: FieldDataType.TEXT, category: 'Thông tin pháp lý', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 25 },
  { key: 'mapSheet', label: 'Tờ bản đồ', dataType: FieldDataType.TEXT, category: 'Thông tin pháp lý', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 26 },
  { key: 'titleDeedNo', label: 'Số sổ', dataType: FieldDataType.TEXT, category: 'Thông tin pháp lý', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 27 },
  { key: 'bookNo', label: 'Số vào sổ', dataType: FieldDataType.TEXT, category: 'Thông tin pháp lý', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 28 },
  { key: 'surveyArea', label: 'Diện tích thửa', dataType: FieldDataType.NUMBER, category: 'Thông tin pháp lý', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 29 },
  { key: 'issueDate', label: 'Ngày cấp', dataType: FieldDataType.DATE, category: 'Thông tin pháp lý', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 30 },
  { key: 'certificateStatus', label: 'Trạng thái Sổ đỏ', dataType: FieldDataType.SELECT, category: 'Thông tin pháp lý', isSystem: false, isRequired: true, isVisibleInTable: false, isVisibleInDrawer: true, order: 31 },
  { key: 'certificateDate', label: 'Ngày cấp sổ đỏ', dataType: FieldDataType.DATE, category: 'Thông tin pháp lý', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 32 },
  { key: 'certificateImageUrl', label: 'Hình ảnh GCN (URL)', dataType: FieldDataType.TEXT, category: 'Thông tin pháp lý', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 33 },

  // Thông tin bàn giao
  { key: 'handoverLandArea', label: 'Diện tích đất bàn giao', dataType: FieldDataType.NUMBER, category: 'Thông tin bàn giao', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, isLowRiseOnly: true, order: 34 },
  { key: 'handoverConstructionArea', label: 'DT xây dựng bàn giao', dataType: FieldDataType.NUMBER, category: 'Thông tin bàn giao', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, isLowRiseOnly: true, order: 35 },
  { key: 'handoverTotalFloorArea', label: 'DT sàn xây dựng bàn giao', dataType: FieldDataType.NUMBER, category: 'Thông tin bàn giao', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, isLowRiseOnly: true, order: 36 },
  { key: 'handoverNetArea', label: 'DT thông thủy bàn giao', dataType: FieldDataType.NUMBER, category: 'Thông tin bàn giao', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, isHighRiseOnly: true, order: 37 },
  { key: 'handoverWallArea', label: 'DT tim tường bàn giao', dataType: FieldDataType.NUMBER, category: 'Thông tin bàn giao', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, isHighRiseOnly: true, order: 38 },
  { key: 'streetName', label: 'Tên đường', dataType: FieldDataType.TEXT, category: 'Thông tin bàn giao', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, isLowRiseOnly: true, order: 39 },
  { key: 'houseNumber', label: 'Số nhà', dataType: FieldDataType.TEXT, category: 'Thông tin bàn giao', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 40 },

  // Tài chính kế toán
  { key: 'managementFeeMonths', label: 'Số tháng thu PQL', dataType: FieldDataType.NUMBER, category: 'Tài chính kế toán', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 41 },
  { key: 'maintenanceFeePercent', label: '% KPBT', dataType: FieldDataType.NUMBER, category: 'Tài chính kế toán', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 42 },
  { key: 'managementUnitPrice', label: 'Đơn giá PQL', dataType: FieldDataType.NUMBER, category: 'Tài chính kế toán', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 43 },
  { key: 'landUnitPrice', label: 'Đơn giá đất', dataType: FieldDataType.NUMBER, category: 'Tài chính kế toán', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 44 },
  { key: 'constructionUnitPrice', label: 'Đơn giá xây dựng', dataType: FieldDataType.NUMBER, category: 'Tài chính kế toán', isSystem: false, isRequired: false, isVisibleInTable: false, isVisibleInDrawer: true, order: 45 },
];

const INITIAL_TEMPLATES: UnitTemplate[] = [
  {
    id: 'tmpl-high-rise',
    name: 'Cấu hình Căn hộ Cao tầng',
    description: 'Dành cho các tháp cao tầng, đầy đủ thông số tháp, tầng, thông thủy.',
    isActive: true,
    createdAt: '2024-01-01',
    fieldOverrides: [
      { fieldKey: 'tower', isVisible: true, isRequired: true },
      { fieldKey: 'floor', isVisible: true, isRequired: true },
      { fieldKey: 'netArea', isVisible: true, isRequired: true },
      { fieldKey: 'certificateStatus', isVisible: true, isRequired: true },
    ]
  },
  {
    id: 'tmpl-low-rise',
    name: 'Cấu hình Biệt thự / Thấp tầng',
    description: 'Dành cho Villa, Townhouse. Quản lý diện tích đất và xây dựng sàn.',
    isActive: true,
    createdAt: '2024-01-02',
    fieldOverrides: [
      { fieldKey: 'landArea', isVisible: true, isRequired: true },
      { fieldKey: 'constructionArea', isVisible: true, isRequired: true },
      { fieldKey: 'streetName', isVisible: true, isRequired: false },
      { fieldKey: 'certificateStatus', isVisible: true, isRequired: true },
    ]
  }
];

const INITIAL_PICKLISTS: UnitPicklistMetadata[] = [
  {
    fieldKey: 'certificateStatus',
    options: [
      { value: 'Đã cấp', label: 'Đã cấp', color: 'emerald' },
      { value: 'Chưa cấp', label: 'Chưa cấp', color: 'gray' },
    ]
  },
  {
    fieldKey: 'unitType',
    options: [
      // Cao tầng
      { value: 'Studio', label: 'Studio', color: 'blue' },
      { value: 'Căn hộ thường', label: 'Căn hộ thường', color: 'blue' },
      { value: 'Duplex', label: 'Duplex', color: 'blue' },
      { value: 'Penthouse', label: 'Penthouse', color: 'blue' },
      { value: 'Shophouse', label: 'Shophouse', color: 'orange' },
      { value: 'Officetel', label: 'Officetel', color: 'blue' },
      // Thấp tầng
      { value: 'Biệt thư đơn lập', label: 'Biệt thư đơn lập', color: 'purple' },
      { value: 'Biệt thự song lập', label: 'Biệt thự song lập', color: 'purple' },
      { value: 'Villa', label: 'Villa', color: 'purple' },
      { value: 'Townhouse', label: 'Townhouse', color: 'purple' },
    ]
  },
  {
    fieldKey: 'handoverStandard',
    options: [
      { value: 'Raw', label: 'Bàn giao thô' },
      { value: 'Basic', label: 'Hoàn thiện cơ bản' },
      { value: 'Full', label: 'Hoàn thiện cao cấp' },
    ]
  },
  {
    fieldKey: 'doorDirection',
    options: [
      { value: 'N', label: 'Bắc' }, { value: 'S', label: 'Nam' }, { value: 'E', label: 'Đông' }, { value: 'W', label: 'Tây' },
      { value: 'NE', label: 'Đông Bắc' }, { value: 'SE', label: 'Đông Nam' }, { value: 'NW', label: 'Tây Bắc' }, { value: 'SW', label: 'Tây Nam' },
    ]
  },
  {
    fieldKey: 'balconyDirection',
    options: [
      { value: 'N', label: 'Bắc' }, { value: 'S', label: 'Nam' }, { value: 'E', label: 'Đông' }, { value: 'W', label: 'Tây' },
      { value: 'NE', label: 'Đông Bắc' }, { value: 'SE', label: 'Đông Nam' }, { value: 'NW', label: 'Tây Bắc' }, { value: 'SW', label: 'Tây Nam' },
    ]
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const metadataService = {
  getFields: async (): Promise<UnitFieldMetadata[]> => {
    await delay(300);
    return [...INITIAL_FIELDS].sort((a, b) => a.order - b.order);
  },

  getTemplates: async (): Promise<UnitTemplate[]> => {
    await delay(300);
    return [...INITIAL_TEMPLATES];
  },

  getPicklists: async (): Promise<UnitPicklistMetadata[]> => {
    await delay(300);
    return [...INITIAL_PICKLISTS];
  },

  updateField: async (key: string, updates: Partial<UnitFieldMetadata>): Promise<UnitFieldMetadata> => {
    await delay(500);
    const idx = INITIAL_FIELDS.findIndex(f => f.key === key);
    if (idx === -1) throw new Error('Field not found');
    INITIAL_FIELDS[idx] = { ...INITIAL_FIELDS[idx], ...updates };
    return INITIAL_FIELDS[idx];
  },

  updateTemplate: async (id: string, updates: Partial<UnitTemplate>): Promise<UnitTemplate> => {
    await delay(500);
    const idx = INITIAL_TEMPLATES.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Template not found');
    INITIAL_TEMPLATES[idx] = { ...INITIAL_TEMPLATES[idx], ...updates };
    return INITIAL_TEMPLATES[idx];
  },

  createTemplate: async (data: Omit<UnitTemplate, 'id' | 'createdAt'>): Promise<UnitTemplate> => {
    await delay(500);
    const newTemplate: UnitTemplate = {
      ...data,
      id: `tmpl-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    INITIAL_TEMPLATES.push(newTemplate);
    return newTemplate;
  },

  updatePicklist: async (fieldKey: string, options: any[]): Promise<UnitPicklistMetadata> => {
    await delay(500);
    const idx = INITIAL_PICKLISTS.findIndex(p => p.fieldKey === fieldKey);
    if (idx !== -1) {
      INITIAL_PICKLISTS[idx].options = options;
      return INITIAL_PICKLISTS[idx];
    } else {
      const newPicklist = { fieldKey, options };
      INITIAL_PICKLISTS.push(newPicklist);
      return newPicklist;
    }
  }
};
