import { Employer } from "./companyType";
import { JobResponse } from "./jobType";
import { PackageResponse } from "./packageType";
import { PAYMENT_STATUS } from "./type";

export interface EmployerSubResponse {
  id: number;
  note: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  employer: Employer;
  job: JobResponse | null;
  package: PackageResponse;
}
export interface EmployerSub {
  id: number;
  note: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export interface PaymentEmployerSubRequest {
  packageId: string;
  quantity: number;
}
export interface TransactionRequest {
  subscriptions: PaymentEmployerSubRequest[];
  transactionType: string;
} 
export interface UseSubscriptionRequest {
  jobId: number;
  packageId: string;
}
export interface UseSubscriptionBannerRequest {
  employerSubId: number;
}
export interface TransactionResponse {
  id: number;
  createdAt: string;
  vnp_TxnRef: string;
  amount: number;
  status: string;
  transactionType: string;
  recordedAt: string;
  package: PackageResponse[];
  note: string;
}

export interface TransactionDetailResponse {
  id: number;
  createdAt: string;
  vnp_TxnRef: string;
  amount: number;
  status: string;
  transactionType: string;
  recordedAt: string;
  employerSubscriptions: EmployerSubResponse[];
  note: string;
}
export interface AdminFilterTransaction {
  status?: PAYMENT_STATUS;
  vnp_TxnRef?: string;
  employerId?: number;
  sortBy?: 'createdAt' | 'amount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}