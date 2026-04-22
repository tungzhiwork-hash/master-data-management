
import { Project, ProjectStatus, ProjectType, ProjectScope, AuditLog, ProjectGrade, ProjectSegment, MocCalcType, Unit, UnitSaleStatus, Building, BasePriceConfig, CertificateStatus } from '../types';
import { entityService } from './entityService';

const generateMockUnits = (count: number, projectId: string, subZoneName: string, projectType: ProjectType, projectName: string): Unit[] => {
  const towers = ['SA1', 'SA2', 'SA3', 'SA5', 'V1', 'V2', 'G1', 'G2'];
  const directions = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam'];
  const standards = ['Bàn giao thô', 'Hoàn thiện cơ bản', 'Hoàn thiện cao cấp'];
  
  const highRiseTypes = ['Studio', 'Căn hộ thường', 'Duplex', 'Penthouse', 'Shophouse', 'Officetel'];
  const lowRiseTypes = ['Biệt thư đơn lập', 'Biệt thự song lập', 'Villa', 'Townhouse', 'Shophouse'];

  const types = projectType === ProjectType.LOW_RISE ? lowRiseTypes : highRiseTypes;
  const mockUnits: Unit[] = [];

  for (let i = 1; i <= count; i++) {
    const tower = projectType === ProjectType.LOW_RISE ? undefined : (towers[Math.floor(Math.random() * towers.length)]);
    const floor = projectType === ProjectType.LOW_RISE ? undefined : (Math.floor(Math.random() * 15) + 1).toString().padStart(2, '0');
    const unitNo = (Math.floor(Math.random() * 20) + 1).toString().padStart(2, '0');
    
    const wallArea = parseFloat((50 + Math.random() * 100).toFixed(1));
    const netArea = parseFloat((wallArea * 0.92).toFixed(1));
    const landArea = projectType === ProjectType.LOW_RISE ? parseFloat((150 + Math.random() * 300).toFixed(1)) : 0;
    const totalFloorAreaVal = projectType === ProjectType.LOW_RISE ? parseFloat((landArea * 1.5).toFixed(1)) : 0;
    
    const status: 'Approved' | 'Unapproved' = Math.random() > 0.3 ? 'Approved' : 'Unapproved';
    const isIssued = Math.random() > 0.7;

    mockUnits.push({
      id: `u-${projectId}-${projectType === ProjectType.LOW_RISE ? 'L' : 'H'}-${i}`,
      projectId,
      projectName,
      lot: projectType === ProjectType.LOW_RISE ? `Lô ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}` : '',
      subZone: subZoneName,
      tower,
      block: tower ? `${tower}-B` : undefined,
      floor,
      systemUnitCode: `SYS-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
      unitName: `Căn ${i}`,
      unitNumber: floor ? `${floor}.${unitNo}` : `${unitNo}`,
      numFloors: projectType === ProjectType.LOW_RISE ? Math.floor(Math.random() * 3) + 2 : 1,
      group: 'Khu A1',
      unitType: types[Math.floor(Math.random() * types.length)],
      numBedrooms: Math.floor(Math.random() * 4) + 1,
      numBathrooms: Math.floor(Math.random() * 3) + 1,
      balconyDirection: directions[Math.floor(Math.random() * directions.length)],
      doorDirection: directions[Math.floor(Math.random() * directions.length)],
      view: projectType === ProjectType.LOW_RISE ? 'Sân vườn, Công viên' : 'Nội khu, Hồ bơi',
      handoverStandard: standards[Math.floor(Math.random() * standards.length)],

      // Diện tích
      landArea: projectType === ProjectType.LOW_RISE ? landArea : undefined,
      constructionArea: projectType === ProjectType.LOW_RISE ? parseFloat((landArea * 0.4).toFixed(1)) : undefined,
      totalFloorArea: projectType === ProjectType.LOW_RISE ? totalFloorAreaVal : undefined,
      netArea: projectType === ProjectType.HIGH_RISE ? netArea : undefined,
      wallArea: projectType === ProjectType.HIGH_RISE ? wallArea : undefined,
      taxArea: projectType === ProjectType.HIGH_RISE ? wallArea : totalFloorAreaVal,

      // Pháp lý
      landLotNo: `TH-${i}`,
      mapSheet: `BD-${tower || 'LR'}`,
      titleDeedNo: Math.random() > 0.5 ? `SỔ-${Math.random().toString(36).substr(2, 6).toUpperCase()}` : '',
      bookNo: 'QSDĐ-001',
      surveyArea: landArea || wallArea,
      issueDate: '2023-01-01',
      
      // Giấy chứng nhận (Mới)
      certificateStatus: isIssued ? CertificateStatus.ISSUED : CertificateStatus.NOT_ISSUED,
      certificateDate: isIssued ? '2023-10-15' : undefined,
      certificateImageUrl: isIssued ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400' : undefined,

      // Bàn giao
      handoverLandArea: landArea ? landArea - 1 : undefined,
      handoverConstructionArea: wallArea ? wallArea - 0.5 : undefined,
      handoverTotalFloorArea: wallArea ? wallArea * 2.5 : undefined,
      handoverNetArea: netArea ? netArea - 0.2 : undefined,
      handoverWallArea: wallArea ? wallArea - 0.2 : undefined,
      streetName: projectType === ProjectType.LOW_RISE ? 'Đường Hải Âu 1' : '',
      houseNumber: `SN-${i}`,

      // Tài chính
      managementFeeMonths: 12,
      maintenanceFeePercent: 2,
      managementUnitPrice: 15000,
      landUnitPrice: 120000000,
      constructionUnitPrice: 8000000,

      // Status
      status,
      saleStatus: Math.random() > 0.4 ? UnitSaleStatus.AVAILABLE : UnitSaleStatus.SOLD,
      approvedBy: status === 'Approved' ? 'Supervisor A' : undefined,
      approvedAt: status === 'Approved' ? '2023-12-01' : undefined,
      
      unitCode: tower ? `${tower}-${floor}.${unitNo}` : `L${i.toString().padStart(2, '0')}`,
      zone: 'Phân khu 1',
      position: 'Căn thường'
    });
  }

  return mockUnits;
};

const MOCK_BUILDINGS = (projectId: string): Building[] => [
    { id: `b-${projectId}-1`, name: 'Tháp A1', code: 'A1', status: 'Topping Out', progressPercent: 75, milestones: { expectedHandoverDate: '2025-12-01' } },
    { id: `b-${projectId}-2`, name: 'Tháp A2', code: 'A2', status: 'Constructing', progressPercent: 45, milestones: { expectedHandoverDate: '2026-03-01' } },
    { id: `b-${projectId}-3`, name: 'Tháp B1', code: 'B1', status: 'Finished', progressPercent: 100, milestones: { expectedHandoverDate: '2025-06-01' } },
];

const MOCK_PRICES: BasePriceConfig[] = [
    { unitType: 'Studio', minPrice: 2500000000, maxPrice: 2800000000, averagePrice: 2650000000, currency: 'VND' },
    { unitType: '1BR', minPrice: 3500000000, maxPrice: 4200000000, averagePrice: 3800000000, currency: 'VND' },
    { unitType: '2BR', minPrice: 5200000000, maxPrice: 6500000000, averagePrice: 5800000000, currency: 'VND' },
    { unitType: '3BR', minPrice: 7500000000, maxPrice: 9000000000, averagePrice: 8200000000, currency: 'VND' },
    { unitType: 'Villa', minPrice: 25000000000, maxPrice: 45000000000, averagePrice: 32000000000, currency: 'VND' },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p0',
    systemCode: 'PR001',
    commercialCode: 'TGC01',
    fullName: 'The Global City',
    vnName: 'The Global City',
    internalName: 'Saigon Bình An',
    abbreviation: 'TGC',
    legalEntityId: '1',
    landCode: 'PR001_SAIGON',
    mocCalcType: MocCalcType.FIX,
    projectGrade: ProjectGrade.COLLECTION,
    segment: ProjectSegment.TOWNSHIP,
    isActive: true,
    expectedHandoverDate: '2026-12-31',
    expectedSettlementDate: '2027-12-31',
    expectedSpaDate: '2025-12-31',
    code: 'TOWN-01',
    address: 'Đỗ Xuân Hợp, Quận 2, TP. Thủ Đức',
    district: 'Quận 2 (TP. Thủ Đức)',
    type: ProjectType.MIXED,
    status: ProjectStatus.SELLING,
    scope: ProjectScope.TOWNSHIP,
    investorId: '1',
    investorName: 'CÔNG TY CỔ PHẦN ĐẦU TƯ ABC LAND',
    developerId: '2',
    developerName: 'MASTERISE HOMES',
    taxAuthority: 'Cục Thuế TP. Thủ Đức',
    amenities: [],
    structure: { totalLandArea: 1170000, constructionArea: 0, gfa: 0, nsa: 0, totalUnits: 0, totalBuildings: 24, maintenanceFeeRate: 2 },
    buildings: [],
    units: [],
    auditTrail: []
  },
  {
    id: 'standalone-m1',
    systemCode: 'PR008',
    commercialCode: 'MGV01',
    fullName: 'Masteri Grand View',
    vnName: 'Masteri Grand View',
    internalName: 'Grand View Standalone',
    abbreviation: 'MGV',
    legalEntityId: '1',
    landCode: 'PR008_MGV',
    mocCalcType: MocCalcType.FIX,
    projectGrade: ProjectGrade.LUMIERE,
    segment: ProjectSegment.MASTERI_COLLECTION,
    isActive: true,
    expectedHandoverDate: '2027-01-01',
    expectedSettlementDate: '2028-01-01',
    code: 'MGV-MIXED',
    address: 'Vành Đai 3, Quận 9, TP. Thủ Đức',
    type: ProjectType.MIXED,
    status: ProjectStatus.SELLING,
    scope: ProjectScope.STANDALONE,
    investorId: '1',
    investorName: 'ABC LAND',
    developerId: '2',
    developerName: 'MASTERISE HOMES',
    taxAuthority: 'Cục Thuế TP. Thủ Đức',
    amenities: [],
    structure: { totalLandArea: 80000, constructionArea: 25000, gfa: 150000, nsa: 130000, totalUnits: 45, totalBuildings: 4, maintenanceFeeRate: 2 },
    buildings: MOCK_BUILDINGS('standalone-m1'),
    units: [
        ...generateMockUnits(30, 'standalone-m1', 'Khu Cao Tầng', ProjectType.HIGH_RISE, 'Masteri Grand View'),
        ...generateMockUnits(15, 'standalone-m1', 'Khu Biệt Thự', ProjectType.LOW_RISE, 'Masteri Grand View')
    ],
    basePriceConfigs: MOCK_PRICES,
    auditTrail: []
  },
  {
    id: 'sub-p1',
    parentId: 'p0',
    systemCode: 'TGC-S',
    commercialCode: 'TGCS1',
    fullName: 'The Global City - The Sakura',
    vnName: 'The Sakura',
    code: 'TGC-SAKURA',
    address: 'Đỗ Xuân Hợp, Quận 2, TP. Thủ Đức',
    type: ProjectType.HIGH_RISE,
    status: ProjectStatus.SELLING,
    scope: ProjectScope.SUB_PROJECT,
    investorId: '1',
    investorName: 'ABC LAND',
    developerId: '2',
    developerName: 'MASTERISE HOMES',
    taxAuthority: 'Cục Thuế TP. Thủ Đức',
    projectGrade: ProjectGrade.LUMIERE,
    segment: ProjectSegment.MASTERI_COLLECTION,
    mocCalcType: MocCalcType.FIX,
    expectedHandoverDate: '2026-06-01',
    expectedSettlementDate: '2027-06-01',
    isActive: true,
    legalEntityId: '1',
    landCode: 'PR001_S',
    amenities: [],
    structure: { totalLandArea: 35000, constructionArea: 12000, gfa: 45000, nsa: 40000, totalUnits: 25, totalBuildings: 3, maintenanceFeeRate: 2 },
    buildings: MOCK_BUILDINGS('sub-p1'),
    units: generateMockUnits(25, 'sub-p1', 'The Sakura', ProjectType.HIGH_RISE, 'The Global City'),
    basePriceConfigs: MOCK_PRICES.slice(0, 4),
    auditTrail: []
  },
  {
    id: 'sub-p2',
    parentId: 'p0',
    systemCode: 'TGC-V',
    commercialCode: 'TGCV1',
    fullName: 'The Global City - The Victoria',
    vnName: 'The Victoria',
    code: 'TGC-VICTORIA',
    address: 'Đỗ Xuân Hợp, Quận 2, TP. Thủ Đức',
    type: ProjectType.LOW_RISE,
    status: ProjectStatus.PRE_INVESTMENT,
    scope: ProjectScope.SUB_PROJECT,
    investorId: '1',
    investorName: 'ABC LAND',
    developerId: '2',
    developerName: 'MASTERISE HOMES',
    taxAuthority: 'Cục Thuế TP. Thủ Đức',
    projectGrade: ProjectGrade.MASTERI,
    segment: ProjectSegment.BRANDED_RESIDENCES,
    mocCalcType: MocCalcType.FIX,
    expectedHandoverDate: '2026-10-01',
    expectedSettlementDate: '2027-10-01',
    isActive: true,
    legalEntityId: '1',
    landCode: 'PR001_V',
    amenities: [],
    structure: { totalLandArea: 42000, constructionArea: 15000, gfa: 25000, nsa: 22000, totalUnits: 25, totalBuildings: 0, maintenanceFeeRate: 0.5 },
    buildings: [],
    units: generateMockUnits(25, 'sub-p2', 'The Victoria', ProjectType.LOW_RISE, 'The Global City'),
    basePriceConfigs: MOCK_PRICES.slice(4),
    auditTrail: []
  },
  {
    id: 'standalone-h1',
    systemCode: 'PR006',
    commercialCode: 'MWH01',
    fullName: 'Masteri West Heights',
    vnName: 'Masteri West Heights',
    internalName: 'West Heights',
    abbreviation: 'MWH',
    legalEntityId: '1',
    landCode: 'PR006_WH',
    mocCalcType: MocCalcType.PERCENT,
    projectGrade: ProjectGrade.LUMIERE,
    segment: ProjectSegment.MASTERI_COLLECTION,
    isActive: true,
    expectedHandoverDate: '2025-09-30',
    expectedSettlementDate: '2026-09-30',
    code: 'MWH-STANDALONE',
    address: 'Tây Mỗ, Nam Từ Liêm, Hà Nội',
    district: 'Nam Từ Liêm',
    type: ProjectType.HIGH_RISE,
    status: ProjectStatus.SELLING,
    scope: ProjectScope.STANDALONE,
    investorId: '1',
    investorName: 'CÔNG TY CỔ PHẦN ĐẦU TƯ ABC LAND',
    developerId: '2',
    developerName: 'MASTERISE HOMES',
    taxAuthority: 'Chi cục Thuế Nam Từ Liêm',
    amenities: [],
    structure: { totalLandArea: 21000, constructionArea: 8000, gfa: 90000, nsa: 82000, totalUnits: 30, totalBuildings: 4, maintenanceFeeRate: 2 },
    buildings: MOCK_BUILDINGS('standalone-h1'),
    units: generateMockUnits(30, 'standalone-h1', 'Khu Sakura', ProjectType.HIGH_RISE, 'Masteri West Heights'),
    basePriceConfigs: MOCK_PRICES.slice(0, 4),
    auditTrail: []
  },
  {
    id: 'standalone-l1',
    systemCode: 'PR007',
    commercialCode: 'ELV01',
    fullName: 'Masteri Elie Villa',
    vnName: 'Masteri Elie Villa',
    internalName: 'Elie Villa',
    abbreviation: 'ELV',
    legalEntityId: '2',
    landCode: 'PR007_EV',
    mocCalcType: MocCalcType.FIX,
    projectGrade: ProjectGrade.COLLECTION,
    segment: ProjectSegment.BRANDED_RESIDENCES,
    isActive: true,
    expectedHandoverDate: '2026-03-15',
    expectedSettlementDate: '2027-03-15',
    code: 'ELV-STANDALONE',
    address: 'Phường Thạnh Mỹ Lợi, Quận 2, TP. HCM',
    district: 'Quận 2',
    type: ProjectType.LOW_RISE,
    status: ProjectStatus.PRE_INVESTMENT,
    scope: ProjectScope.STANDALONE,
    investorId: '2',
    investorName: 'CÔNG TY TNHH MTV XÂY DỰNG XYZ',
    developerId: '2',
    developerName: 'MASTERISE HOMES',
    taxAuthority: 'Cục Thuế TP. Hồ Chí Minh',
    amenities: [],
    structure: { totalLandArea: 15000, constructionArea: 6000, gfa: 12000, nsa: 10000, totalUnits: 12, totalBuildings: 0, maintenanceFeeRate: 0.5 },
    buildings: [],
    units: generateMockUnits(12, 'standalone-l1', 'Phân khu Villa', ProjectType.LOW_RISE, 'Masteri Elie Villa'),
    basePriceConfigs: MOCK_PRICES.slice(4),
    auditTrail: []
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const aggregateTownshipData = (township: Project, allProjects: Project[]): Project => {
  if (township.scope !== ProjectScope.TOWNSHIP) return township;
  const subProjects = allProjects.filter(p => p.parentId === township.id);
  const aggregatedUnits = subProjects.flatMap(p => p.units || []);
  const aggregatedStructure = subProjects.reduce((acc, curr) => ({
    totalLandArea: acc.totalLandArea,
    constructionArea: acc.constructionArea + (curr.structure.constructionArea || 0),
    gfa: acc.gfa + (curr.structure.gfa || 0),
    nsa: acc.nsa + (curr.structure.nsa || 0),
    totalUnits: acc.totalUnits + (curr.structure.totalUnits || 0),
    totalBuildings: acc.totalBuildings + (curr.structure.totalBuildings || 0),
    maintenanceFeeRate: acc.maintenanceFeeRate
  }), { ...township.structure, constructionArea: 0, gfa: 0, nsa: 0, totalUnits: 0, totalBuildings: 0 });
  
  return { ...township, structure: aggregatedStructure, units: aggregatedUnits };
};

// Hàm hỗ trợ đồng bộ các vai trò pháp nhân vào dữ liệu pháp nhân master
const syncProjectToEntities = async (project: Project) => {
  if (project.investorId) {
    await entityService.linkProject(project.investorId, project.id, project.vnName, 'Investor');
  }
  if (project.developerId) {
    await entityService.linkProject(project.developerId, project.id, project.vnName, 'Developer');
  }
};

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    await delay(500);
    return MOCK_PROJECTS.map(p => p.scope === ProjectScope.TOWNSHIP ? aggregateTownshipData(p, MOCK_PROJECTS) : p);
  },

  getById: async (id: string): Promise<Project | undefined> => {
    await delay(300);
    const project = MOCK_PROJECTS.find(p => p.id === id);
    if (!project) return undefined;
    if (project.scope === ProjectScope.TOWNSHIP) return aggregateTownshipData(project, MOCK_PROJECTS);
    if (project.scope === ProjectScope.SUB_PROJECT && project.parentId) {
       const parent = MOCK_PROJECTS.find(p => p.id === project.parentId);
       if(parent) project.parentName = parent.fullName;
    }
    return project;
  },
  
  getSubProjects: async (townshipId: string): Promise<Project[]> => {
    await delay(200);
    return MOCK_PROJECTS.filter(p => p.parentId === townshipId);
  },
  
  getTownships: async (): Promise<Project[]> => {
      await delay(200);
      return MOCK_PROJECTS.filter(p => p.scope === ProjectScope.TOWNSHIP);
  },

  approveUnitsByImport: async (projectId: string, fileName: string, user: string): Promise<void> => {
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    if (project) {
        project.units = project.units.map(u => ({
            ...u,
            status: 'Approved',
            approvedBy: user,
            approvedAt: new Date().toISOString().split('T')[0]
        }));
    }
  },

  create: async (data: Partial<Project>): Promise<Project> => {
    await delay(800);
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      systemCode: data.systemCode || '',
      commercialCode: data.commercialCode || '',
      fullName: data.fullName || '',
      vnName: data.fullName || '',
      internalName: data.internalName || '',
      abbreviation: data.abbreviation || '',
      legalEntityId: data.legalEntityId || '',
      landCode: data.landCode || '',
      mocCalcType: data.mocCalcType || MocCalcType.FIX,
      projectGrade: data.projectGrade || ProjectGrade.MASTERI,
      segment: data.segment || ProjectSegment.MASTERI_COLLECTION,
      isActive: data.isActive !== undefined ? data.isActive : true,
      expectedHandoverDate: data.expectedHandoverDate || '2099-12-31',
      expectedSettlementDate: data.expectedSettlementDate || '2099-12-31',
      expectedSpaDate: data.expectedSpaDate,
      code: data.systemCode || '',
      address: data.address || '',
      district: data.district || '',
      type: data.type || ProjectType.HIGH_RISE,
      status: data.status || ProjectStatus.PRE_INVESTMENT,
      scope: data.scope || ProjectScope.STANDALONE,
      parentId: data.parentId,
      investorId: data.investorId || '',
      investorName: data.investorName || '',
      developerId: data.developerId || '',
      developerName: data.developerName || '',
      taxAuthority: data.taxAuthority || '',
      amenities: [],
      structure: { 
        totalLandArea: 0, 
        constructionArea: 0, 
        gfa: 0, 
        nsa: 0, 
        totalUnits: 0, 
        totalBuildings: 0,
        maintenanceFeeRate: data.type === ProjectType.LOW_RISE ? 0.5 : 2
      },
      buildings: [],
      units: [],
      auditTrail: [{
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        user: 'current_user',
        field: 'ALL',
        oldValue: '',
        newValue: 'Created',
        reason: 'Project Initialization'
      }]
    };
    MOCK_PROJECTS.push(newProject);
    
    // Đồng bộ vào Legal Entities
    await syncProjectToEntities(newProject);
    
    return newProject;
  },

  update: async (id: string, updates: Partial<Project>, user: string, reason: string): Promise<Project> => {
    await delay(600);
    const index = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const oldProject = MOCK_PROJECTS[index];
    const newProject = { ...oldProject, ...updates };
    const changes: AuditLog[] = [];
    Object.keys(updates).forEach(key => {
      const k = key as keyof Project;
      if (typeof oldProject[k] !== 'object' && oldProject[k] !== newProject[k] && k !== 'auditTrail') {
        changes.push({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          user,
          field: key,
          oldValue: String(oldProject[k]),
          newValue: String(newProject[k]),
          reason
        });
      }
    });
    newProject.auditTrail = [...changes, ...oldProject.auditTrail];
    MOCK_PROJECTS[index] = newProject;
    
    // Nếu có cập nhật vai trò pháp nhân, đồng bộ lại
    if (updates.investorId || updates.developerId || updates.vnName) {
      await syncProjectToEntities(newProject);
    }
    
    return newProject;
  },

  importUnits: async (projectId: string, units: Omit<Unit, 'id' | 'projectId'>[]): Promise<Unit[]> => {
      await delay(1500); 
      const newUnits: Unit[] = units.map(u => ({
          ...u,
          id: Math.random().toString(36).substr(2, 9),
          projectId,
          status: 'Unapproved' 
      }));
      
      const project = MOCK_PROJECTS.find(p => p.id === projectId);
      if (project) {
          project.units = [...(project.units || []), ...newUnits];
          project.structure.totalUnits = project.units.length;
      }
      return newUnits;
  }
};
