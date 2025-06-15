export interface EmployerSubResponse {
  id: number;
  note: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  package: PackageResponse;
}
export interface PackageResponse {
  id: string;
  name: string;
  features: string;
  price: number;
  dayValue: number;
  image: string;
}

export interface PaymentEmployerSubRequest {
  packageId: string;
  count: number;
}
export interface UseSubscriptionRequest {
  jobId: number;
  subscriptionId: number;
}
export interface TransactionResponse {
  id: number;
  createdAt: string;
  amount: number;
  transactionType: string;
  recordedAt: string;
  employerSubscriptions: EmployerSubResponse[];
  useCount: number;
}