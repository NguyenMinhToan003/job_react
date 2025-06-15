import { EmployerSubResponse, PackageResponse, PaymentEmployerSubRequest, TransactionResponse, UseSubscriptionRequest } from "@/types/employerSubType"
import { axiosInstance } from "."

export const employerSubGetMe = async() => {
  const response = await axiosInstance.get<EmployerSubResponse[]>('/employer-sub/me')
  return response.data
}
export const employerSubGetStatusActive = async () => {
  const response = await axiosInstance.get<EmployerSubResponse[]>('/employer-sub/non-job-active')
  return response.data
}
export const getPackagesBisiness = async () => {
  const response = await axiosInstance.get<PackageResponse[]>('/packages')
  return response.data
}
export const paymentEmployerSub = async (data: PaymentEmployerSubRequest[]) => {
  const response = await axiosInstance.post<EmployerSubResponse[]>('/employer-sub/payment', {
    subscriptions: data,
    amount: 0,
  })
  return response.data
}
export const subscriptionJob = async (data: UseSubscriptionRequest) => {
  const response = await axiosInstance.post<EmployerSubResponse>('/employer-sub/use-subscription', data)
  return response.data
}
export const getMyTransactions = async () => {
  const response = await axiosInstance.get<TransactionResponse[]>('/transaction/me')
  return response.data
}