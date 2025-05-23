
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
  Eye,
  FilePlus,
  FileEdit,
  FileX,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { UserRole, rolePermissions, UserType, roleToUserType } from "@/lib/roles";

type RoleDisplay = {
  id: UserRole;
  name: string;
  description: string;
  userType: UserType;
  userCount: number;
  permissions: {
    view: string[];
    create: string[];
    edit: string[];
    delete: string[];
    approve: string[];
  };
};

// Map roles to display names and descriptions
const roleDisplayMap: Record<UserRole, Omit<RoleDisplay, 'id' | 'userCount' | 'permissions'>> = {
  ADMIN_HE_THONG: {
    name: "Admin Hệ Thống",
    description: "Quyền quản trị cao nhất, có thể truy cập và quản lý mọi tính năng của hệ thống.",
    userType: "NHAN_VIEN"
  },
  CB_TO_CHUC_SU_KIEN: {
    name: "Cán Bộ Tổ Chức Sự Kiện",
    description: "Quản lý các sự kiện, tạo và tổ chức sự kiện trong trường.",
    userType: "NHAN_VIEN"
  },
  BGH_DUYET_SK_TRUONG: {
    name: "Ban Giám Hiệu",
    description: "Duyệt các sự kiện cấp trường và quản lý các hoạt động toàn trường.",
    userType: "GIANG_VIEN"
  },
  QUAN_LY_CSVC: {
    name: "Quản Lý Cơ Sở Vật Chất",
    description: "Quản lý phòng học, thiết bị và cơ sở vật chất của trường.",
    userType: "NHAN_VIEN"
  },
  TRUONG_KHOA: {
    name: "Trưởng Khoa",
    description: "Quản lý các hoạt động của khoa, giảng viên và sinh viên thuộc khoa.",
    userType: "GIANG_VIEN"
  },
  TRUONG_CLB: {
    name: "Trưởng Câu Lạc Bộ",
    description: "Quản lý hoạt động và thành viên của câu lạc bộ.",
    userType: "SINH_VIEN"
  },
  BI_THU_DOAN: {
    name: "Bí Thư Đoàn",
    description: "Quản lý hoạt động đoàn và đoàn viên thanh niên.",
    userType: "SINH_VIEN"
  },
  SINH_VIEN: {
    name: "Sinh Viên",
    description: "Người học tại trường, có thể xem và đăng ký tham gia các sự kiện.",
    userType: "SINH_VIEN"
  },
  GIANG_VIEN: {
    name: "Giảng Viên",
    description: "Giảng dạy tại trường, có thể xem và đăng ký tham gia các sự kiện.",
    userType: "GIANG_VIEN"
  },
};

// Mock user counts for each role
const mockUserCounts: Record<UserRole, number> = {
  ADMIN_HE_THONG: 2,
  CB_TO_CHUC_SU_KIEN: 5,
  BGH_DUYET_SK_TRUONG: 3,
  QUAN_LY_CSVC: 4,
  TRUONG_KHOA: 8,
  TRUONG_CLB: 12,
  BI_THU_DOAN: 1,
  SINH_VIEN: 5420,
  GIANG_VIEN: 265,
};

// Generate role displays
const generateRoleDisplays = (): RoleDisplay[] => {
  return Object.keys(roleDisplayMap).map(key => {
    const role = key as UserRole;
    return {
      id: role,
      ...roleDisplayMap[role],
      userCount: mockUserCounts[role],
      permissions: rolePermissions[role],
    };
  });
};

// Display resources in friendly format
const resourceDisplayNames: Record<string, string> = {
  SuKien: "Sự kiện",
  YeuCauHuySK: "Yêu cầu hủy sự kiện",
  YeuCauMuonPhong: "Yêu cầu mượn phòng",
  YcMuonPhongChiTiet: "Chi tiết mượn phòng",
  YeuCauDoiPhong: "Yêu cầu đổi phòng",
  TaiLieuSK: "Tài liệu sự kiện",
  SK_MoiThamGia: "Lời mời tham gia sự kiện",
  ThongKeSuKien: "Thống kê sự kiện",
  SuKien_DaDuyet: "Sự kiện đã duyệt",
  ChiTietDatPhong: "Chi tiết đặt phòng",
  Phong: "Phòng",
  LoaiPhong: "Loại phòng",
  TrangThietBi: "Trang thiết bị",
  Phong_ThietBi: "Thiết bị trong phòng",
  TrangThaiPhong: "Trạng thái phòng",
  ThongKePhong: "Thống kê phòng",
  ThongTinGiangVien: "Thông tin giảng viên",
  ThongTinSinhVien: "Thông tin sinh viên",
  ThongKeKhoa: "Thống kê khoa",
  ThanhVienCLB: "Thành viên CLB",
  ThongKeCLB: "Thống kê CLB",
  ThanhVienDoan: "Thành viên đoàn",
  ThongKeDoan: "Thống kê đoàn",
  DanhGiaSK: "Đánh giá sự kiện",
  "*": "Tất cả tài nguyên",
};

// Format resource name for display
const formatResourceName = (resource: string) => {
  if (resource.includes('.')) {
    const [base, qualifier] = resource.split('.');
    return `${resourceDisplayNames[base] || base} (${qualifier})`;
  }
  return resourceDisplayNames[resource] || resource;
};

// Icon components for different permission types
const PermissionIcons = {
  view: Eye,
  create: FilePlus,
  edit: FileEdit,
  delete: FileX,
  approve: CheckCircle
};

export default function Roles() {
  const [roles, setRoles] = useState<RoleDisplay[]>(generateRoleDisplays());
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleDisplay | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<Record<string, string[]>>({});

  // Handle role edit
  const handleEditRole = (role: RoleDisplay) => {
    setSelectedRole(role);
    setEditedPermissions({
      view: [...role.permissions.view],
      create: [...role.permissions.create],
      edit: [...role.permissions.edit],
      delete: [...role.permissions.delete],
      approve: [...role.permissions.approve],
    });
    setIsEditDialogOpen(true);
  };

  // Handle permission change
  const handlePermissionChange = (
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve',
    resource: string,
    isChecked: boolean
  ) => {
    setEditedPermissions(prev => {
      const updated = { ...prev };
      
      if (isChecked) {
        updated[action] = [...updated[action], resource];
      } else {
        updated[action] = updated[action].filter(r => r !== resource);
      }
      
      return updated;
    });
  };

  // Save role permissions
  const handleSavePermissions = () => {
    if (!selectedRole) return;
    
    setRoles(prevRoles => {
      return prevRoles.map(role => {
        if (role.id === selectedRole.id) {
          return {
            ...role,
            permissions: {
              view: editedPermissions.view,
              create: editedPermissions.create,
              edit: editedPermissions.edit,
              delete: editedPermissions.delete,
              approve: editedPermissions.approve,
            }
          };
        }
        return role;
      });
    });
    
    setIsEditDialogOpen(false);
    toast.success(`Đã cập nhật quyền cho vai trò ${selectedRole.name}`);
  };

  // Get all unique resources across all permissions
  const getAllResources = () => {
    const resourceSet = new Set<string>();
    
    roles.forEach(role => {
      Object.values(role.permissions).forEach(permissionList => {
        permissionList.forEach(resource => {
          if (resource !== '*') {
            resourceSet.add(resource);
          }
        });
      });
    });
    
    return Array.from(resourceSet).sort();
  };

  // Filter roles by search term
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(search.toLowerCase()) || 
    role.description.toLowerCase().includes(search.toLowerCase())
  );

  // Resources for permission editing
  const allResources = getAllResources();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý vai trò</h1>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Danh sách vai trò</CardTitle>
            <CardDescription>
              Quản lý các vai trò và phân quyền trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm vai trò..."
                    className="pl-10"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vai trò</TableHead>
                      <TableHead className="hidden md:table-cell">Mô tả</TableHead>
                      <TableHead className="hidden lg:table-cell">Loại người dùng</TableHead>
                      <TableHead className="hidden xl:table-cell">Số người dùng</TableHead>
                      <TableHead>Quyền hạn</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Không tìm thấy vai trò nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRoles.map(role => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Shield className={
                                role.id === 'ADMIN_HE_THONG' ? 'text-red-500' :
                                role.userType === 'NHAN_VIEN' ? 'text-blue-500' :
                                role.userType === 'GIANG_VIEN' ? 'text-green-500' :
                                'text-yellow-500'
                              } />
                              <div>
                                <p className="font-medium">{role.name}</p>
                                <p className="text-sm text-muted-foreground md:hidden">
                                  {role.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {role.description}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className={
                              role.userType === 'NHAN_VIEN' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                              role.userType === 'GIANG_VIEN' ? 'bg-green-50 text-green-600 border-green-200' :
                              'bg-yellow-50 text-yellow-600 border-yellow-200'
                            }>
                              {role.userType === 'NHAN_VIEN' ? 'Nhân viên' :
                              role.userType === 'GIANG_VIEN' ? 'Giảng viên' :
                              'Sinh viên'}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {role.userCount}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {role.permissions.view.includes('*') && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                  <Eye className="mr-1 h-3 w-3" />
                                  Xem: Tất cả
                                </Badge>
                              )}
                              {role.permissions.create.includes('*') && (
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  <FilePlus className="mr-1 h-3 w-3" />
                                  Tạo: Tất cả
                                </Badge>
                              )}
                              {role.permissions.edit.includes('*') && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                  <FileEdit className="mr-1 h-3 w-3" />
                                  Sửa: Tất cả
                                </Badge>
                              )}
                              {role.permissions.delete.includes('*') && (
                                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                  <FileX className="mr-1 h-3 w-3" />
                                  Xóa: Tất cả
                                </Badge>
                              )}
                              {role.permissions.approve.includes('*') && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Duyệt: Tất cả
                                </Badge>
                              )}
                              {!role.permissions.view.includes('*') && 
                               !role.permissions.create.includes('*') &&
                               !role.permissions.edit.includes('*') &&
                               !role.permissions.delete.includes('*') &&
                               !role.permissions.approve.includes('*') && (
                                <Badge variant="outline">Quyền hạn chế</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Permissions Dialog */}
      {selectedRole && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa quyền cho vai trò: {selectedRole.name}</DialogTitle>
              <DialogDescription>
                Phân quyền chi tiết cho các tài nguyên trong hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className={
                    selectedRole.userType === 'NHAN_VIEN' ? 'text-blue-500' :
                    selectedRole.userType === 'GIANG_VIEN' ? 'text-green-500' :
                    'text-yellow-500'
                  } />
                  <span className="font-medium">
                    {selectedRole.userType === 'NHAN_VIEN' ? 'Nhân viên' :
                    selectedRole.userType === 'GIANG_VIEN' ? 'Giảng viên' :
                    'Sinh viên'}
                  </span>
                </div>
                <Badge variant="outline">
                  {selectedRole.userCount} người dùng
                </Badge>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tài nguyên</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>Xem</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FilePlus className="h-4 w-4" />
                          <span>Tạo</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FileEdit className="h-4 w-4" />
                          <span>Sửa</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FileX className="h-4 w-4" />
                          <span>Xóa</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Duyệt</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Tất cả tài nguyên (*)</TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={editedPermissions.view.includes('*')}
                          onCheckedChange={(checked) => 
                            handlePermissionChange('view', '*', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={editedPermissions.create.includes('*')}
                          onCheckedChange={(checked) => 
                            handlePermissionChange('create', '*', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={editedPermissions.edit.includes('*')}
                          onCheckedChange={(checked) => 
                            handlePermissionChange('edit', '*', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={editedPermissions.delete.includes('*')}
                          onCheckedChange={(checked) => 
                            handlePermissionChange('delete', '*', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={editedPermissions.approve.includes('*')}
                          onCheckedChange={(checked) => 
                            handlePermissionChange('approve', '*', checked as boolean)
                          }
                        />
                      </TableCell>
                    </TableRow>
                    {allResources.map(resource => (
                      <TableRow key={resource}>
                        <TableCell>{formatResourceName(resource)}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            disabled={editedPermissions.view.includes('*')}
                            checked={editedPermissions.view.includes('*') || editedPermissions.view.includes(resource)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange('view', resource, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            disabled={editedPermissions.create.includes('*')}
                            checked={editedPermissions.create.includes('*') || editedPermissions.create.includes(resource)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange('create', resource, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            disabled={editedPermissions.edit.includes('*')}
                            checked={editedPermissions.edit.includes('*') || editedPermissions.edit.includes(resource)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange('edit', resource, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            disabled={editedPermissions.delete.includes('*')}
                            checked={editedPermissions.delete.includes('*') || editedPermissions.delete.includes(resource)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange('delete', resource, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            disabled={editedPermissions.approve.includes('*')}
                            checked={editedPermissions.approve.includes('*') || editedPermissions.approve.includes(resource)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange('approve', resource, checked as boolean)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSavePermissions}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
