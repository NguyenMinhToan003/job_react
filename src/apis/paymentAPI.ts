import { EmployerSubResponse, TransactionDetailResponse, TransactionRequest, TransactionResponse, UseSubscriptionRequest } from "@/types/employerSubType"
import { axiosInstance } from "."
import { PackageResponse } from "@/types/packageType"

export const getPackageAvailable = async () => {
  const response = await axiosInstance.get<PackageResponse[]>('/packages/available')
  return response.data
}
export const getPackagesBisiness = async () => {
  const response = await axiosInstance.get<PackageResponse[]>('/packages')
  return response.data
}

export const getMyTransactions = async () => {
  const response = await axiosInstance.get<TransactionResponse[]>('/transaction/me')
  return response.data
}

export const subscriptionUseJob = async (data: UseSubscriptionRequest) => {
  const response = await axiosInstance.post<EmployerSubResponse>('/employer-sub/use-subscription', data)
  return response.data
}

export const getTransactionDetail = async (transactionId: number) => {
  const response = await axiosInstance.get<TransactionDetailResponse>(`/transaction/${transactionId}`)
  return response.data
}

export const createPaymentUrl = async (data: TransactionRequest) => {
  const response = await axiosInstance.post<{
    transaction: TransactionResponse,
    paymentUrl: string
  }>('/payment/create', data)
  return response.data
}

export const checkoutPayment = async (transactionId: number) => {
  const response = await axiosInstance.get<TransactionResponse>(`/transaction/checkout/${transactionId}`)
  return response.data
}