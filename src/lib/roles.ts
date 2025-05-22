
// Define all available system roles
export type UserRole = 
  | 'ADMIN_HE_THONG' 
  | 'CB_TO_CHUC_SU_KIEN'
  | 'BGH_DUYET_SK_TRUONG'
  | 'QUAN_LY_CSVC'
  | 'TRUONG_KHOA'
  | 'TRUONG_CLB'
  | 'SINH_VIEN'
  | 'GIANG_VIEN';

// User type information
export type UserType = 'NHAN_VIEN' | 'GIANG_VIEN' | 'SINH_VIEN';

// Map roles to user types for validation
export const roleToUserType: Record<UserRole, UserType> = {
  ADMIN_HE_THONG: 'NHAN_VIEN',
  CB_TO_CHUC_SU_KIEN: 'NHAN_VIEN',
  QUAN_LY_CSVC: 'NHAN_VIEN',
  BGH_DUYET_SK_TRUONG: 'GIANG_VIEN',
  TRUONG_KHOA: 'GIANG_VIEN',
  TRUONG_CLB: 'SINH_VIEN',
  SINH_VIEN: 'SINH_VIEN',
  GIANG_VIEN: 'GIANG_VIEN',
};

// Define permissions for each role
export interface Permission {
  canView: string[];
  canCreate: string[];
  canEdit: string[];
  canDelete: string[];
  canApprove: string[];
}

export const rolePermissions: Record<UserRole, Permission> = {
  ADMIN_HE_THONG: {
    canView: ['*'], // * means all resources
    canCreate: ['*'],
    canEdit: ['*'],
    canDelete: ['*'],
    canApprove: ['*'],
  },
  CB_TO_CHUC_SU_KIEN: {
    canView: ['SuKien', 'YeuCauHuySK', 'YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'YeuCauDoiPhong', 'TaiLieuSK', 'SK_MoiThamGia'],
    canCreate: ['SuKien', 'YeuCauHuySK', 'YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'YeuCauDoiPhong', 'TaiLieuSK', 'SK_MoiThamGia'],
    canEdit: ['SuKien', 'YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'TaiLieuSK', 'SK_MoiThamGia'],
    canDelete: ['SuKien', 'YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'TaiLieuSK'],
    canApprove: [],
  },
  BGH_DUYET_SK_TRUONG: {
    canView: ['SuKien', 'YeuCauHuySK', 'YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'ChiTietDatPhong'],
    canCreate: [],
    canEdit: ['SuKien.TrangThaiSkID', 'YeuCauHuySK.TrangThaiYcHuySkID'],
    canDelete: [],
    canApprove: ['SuKien', 'YeuCauHuySK'],
  },
  QUAN_LY_CSVC: {
    canView: ['SuKien', 'YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'ChiTietDatPhong', 'YeuCauDoiPhong', 'Phong', 'LoaiPhong', 'TrangThietBi', 'Phong_ThietBi', 'TrangThaiPhong'],
    canCreate: ['ChiTietDatPhong', 'Phong', 'LoaiPhong', 'TrangThietBi', 'Phong_ThietBi'],
    canEdit: ['YeuCauMuonPhong.TrangThaiChungID', 'YcMuonPhongChiTiet.TrangThaiCtID', 'YeuCauDoiPhong.TrangThaiYcDoiPID', 'ChiTietDatPhong', 'Phong', 'LoaiPhong', 'TrangThietBi', 'Phong_ThietBi', 'TrangThaiPhong'],
    canDelete: ['Phong', 'LoaiPhong', 'TrangThietBi', 'Phong_ThietBi'],
    canApprove: ['YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'YeuCauDoiPhong'],
  },
  TRUONG_KHOA: {
    canView: ['SuKien', 'YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'ChiTietDatPhong', 'YeuCauDoiPhong', 'ThongTinGiangVien', 'ThongTinSinhVien'],
    canCreate: [],
    canEdit: [],
    canDelete: [],
    canApprove: [],
  },
  TRUONG_CLB: {
    canView: ['SuKien', 'YeuCauMuonPhong', 'YcMuonPhongChiTiet', 'ChiTietDatPhong', 'YeuCauDoiPhong', 'ThanhVienCLB'],
    canCreate: [],
    canEdit: [],
    canDelete: [],
    canApprove: [],
  },
  SINH_VIEN: {
    canView: ['SuKien', 'TaiLieuSK'],
    canCreate: ['DanhGiaSK'],
    canEdit: ['SK_MoiThamGia'],
    canDelete: [],
    canApprove: [],
  },
  GIANG_VIEN: {
    canView: ['SuKien', 'TaiLieuSK'],
    canCreate: ['DanhGiaSK'],
    canEdit: ['SK_MoiThamGia'],
    canDelete: [],
    canApprove: [],
  },
};

// Authorization helper functions
export const canView = (role: UserRole, resource: string): boolean => {
  const permissions = rolePermissions[role];
  return permissions.canView.includes('*') || permissions.canView.includes(resource);
};

export const canCreate = (role: UserRole, resource: string): boolean => {
  const permissions = rolePermissions[role];
  return permissions.canCreate.includes('*') || permissions.canCreate.includes(resource);
};

export const canEdit = (role: UserRole, resource: string): boolean => {
  const permissions = rolePermissions[role];
  return permissions.canEdit.includes('*') || permissions.canEdit.includes(resource);
};

export const canDelete = (role: UserRole, resource: string): boolean => {
  const permissions = rolePermissions[role];
  return permissions.canDelete.includes('*') || permissions.canDelete.includes(resource);
};

export const canApprove = (role: UserRole, resource: string): boolean => {
  const permissions = rolePermissions[role];
  return permissions.canApprove.includes('*') || permissions.canApprove.includes(resource);
};

// Check if a user has a specific permission on a resource
export const hasPermission = (
  role: UserRole,
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve',
  resource: string
): boolean => {
  switch (action) {
    case 'view':
      return canView(role, resource);
    case 'create':
      return canCreate(role, resource);
    case 'edit':
      return canEdit(role, resource);
    case 'delete':
      return canDelete(role, resource);
    case 'approve':
      return canApprove(role, resource);
    default:
      return false;
  }
};
