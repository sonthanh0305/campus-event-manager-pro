import React from 'react';

interface Permission {
  view: string[];
  create: string[];
  edit: string[];
  delete: string[];
  approve: string[];
}

interface RoleDisplay {
  id: UserRole;
  name: string;
  description: string;
  userType: UserType;
  permissions: Permission;
  userCount: number;
}

type UserRole = "ADMIN_HE_THONG" | "CB_TO_CHUC_SU_KIEN" | "QUAN_LY_CSVC" | "TRUONG_KHOA" | "TRUONG_CLB" | "BI_THU_DOAN" | "BGH_DUYET_SK_TRUONG";
type UserType = "SINH_VIEN" | "GIANG_VIEN" | "NHAN_VIEN";

const mockRoles: RoleDisplay[] = [
  {
    id: "ADMIN_HE_THONG",
    name: "Admin hệ thống",
    description: "Quyền quản trị cao nhất trong hệ thống",
    userType: "NHAN_VIEN",
    permissions: {
      view: ["ALL"],
      create: ["ALL"],
      edit: ["ALL"],
      delete: ["ALL"],
      approve: ["ALL"]
    },
    userCount: 2
  },
  {
    id: "CB_TO_CHUC_SU_KIEN",
    name: "Cán bộ tổ chức sự kiện",
    description: "Quyền tổ chức và quản lý sự kiện",
    userType: "NHAN_VIEN",
    permissions: {
      view: ["EVENT"],
      create: ["EVENT"],
      edit: ["EVENT"],
      delete: ["EVENT"],
      approve: ["EVENT"]
    },
    userCount: 5
  },
  {
    id: "QUAN_LY_CSVC",
    name: "Quản lý cơ sở vật chất",
    description: "Quyền quản lý và bảo trì cơ sở vật chất",
    userType: "NHAN_VIEN",
    permissions: {
      view: ["FACILITY"],
      create: ["FACILITY"],
      edit: ["FACILITY"],
      delete: ["FACILITY"],
      approve: ["FACILITY"]
    },
    userCount: 3
  },
  {
    id: "TRUONG_KHOA",
    name: "Trưởng khoa",
    description: "Quyền quản lý khoa",
    userType: "GIANG_VIEN",
    permissions: {
      view: ["STUDENT", "LECTURER"],
      create: [],
      edit: ["STUDENT", "LECTURER"],
      delete: ["STUDENT", "LECTURER"],
      approve: []
    },
    userCount: 10
  },
  {
    id: "TRUONG_CLB",
    name: "Chủ nhiệm câu lạc bộ",
    description: "Quyền quản lý câu lạc bộ",
    userType: "SINH_VIEN",
    permissions: {
      view: ["STUDENT"],
      create: [],
      edit: ["STUDENT"],
      delete: ["STUDENT"],
      approve: []
    },
    userCount: 7
  },
  {
    id: "BI_THU_DOAN",
    name: "Bí thư đoàn",
    description: "Quyền quản lý đoàn thanh niên",
    userType: "SINH_VIEN",
    permissions: {
      view: ["STUDENT"],
      create: [],
      edit: ["STUDENT"],
      delete: ["STUDENT"],
      approve: []
    },
    userCount: 4
  },
  {
    id: "BGH_DUYET_SK_TRUONG",
    name: "Ban giám hiệu duyệt sự kiện trường",
    description: "Quyền duyệt sự kiện cấp trường",
    userType: "NHAN_VIEN",
    permissions: {
      view: ["EVENT"],
      create: [],
      edit: [],
      delete: [],
      approve: ["EVENT"]
    },
    userCount: 1
  }
];

const Roles = () => {
  return (
    <div>
      <h1>Danh sách vai trò</h1>
      <ul>
        {mockRoles.map(role => (
          <li key={role.id}>
            {role.name} - {role.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roles;
