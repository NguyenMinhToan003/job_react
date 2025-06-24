export enum APPLY_JOB_STATUS {
  PROCESSING = 'DANG_XU_LY',
  INTERVIEWING = 'DANG_PHONG_VAN',
  QUALIFIED = 'PHU_HOP',
  UNQUALIFIED = 'KHONG_PHU_HOP',
  HIRED = 'DA_TUYEN',
}

export enum ROLE_LIST {
  ADMIN = 'QUAN_TRI',
  EMPLOYER = 'NHA_TUYEN_DUNG',
  CANDIDATE = 'UNG_VIEN',
}
export enum JOB_STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  CREATE = 'CREATE',
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
export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
export enum PackageType {
  JOB = 'JOB',
  EMPLOYER = 'EMPLOYER',
  BANNER = 'BANNER',
}