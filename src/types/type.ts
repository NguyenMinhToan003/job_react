export enum APPLY_JOB_STATUS {
  PENDING = 'DANG_XU_LY',
  INTERVIEW = 'PHONG_VAN',
  ACCEPTED = 'NHAN',
  REJECTED = 'HUY',
}

export enum ROLE_LIST {
  ADMIN = 'QUAN_TRI',
  EMPLOYER = 'NHA_TUYEN_DUNG',
  CANDIDATE = 'UNG_VIEN',
}
export enum JOB_STATUS {
  PENDING = 0, // Chờ duyệt
  ACTIVE = 1, // Đã duyệt
  BLOCK = -1, // Bị khóa
}
export enum NOTI_TYPE {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DEFAULT = 'DEFAULT',
}
export interface Element {
  id: number;
  name: string;
  status: number;
}