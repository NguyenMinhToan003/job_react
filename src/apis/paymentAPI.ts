import { EmployerSubResponse, TransactionDetailResponse, TransactionRequest, TransactionResponse, UseSubscriptionBannerRequest, UseSubscriptionRequest } from "@/types/employerSubType"
import { axiosInstance } from "."
import { CreatePackage, PackageResponse } from "@/types/packageType"

export const getPackageAvailable = async () => {
  const response = await axiosInstance.get<PackageResponse[]>('/packages/available')
  return response.data
}
// get all packages for business
export const getPackagesBisiness = async () => {
  const response = await axiosInstance.get<PackageResponse[]>('/packages')
  return response.data
}

export const getPackageAdmin = async () => {
  const response = await axiosInstance.get<PackageResponse[]>('/packages/all')
  return response.data
}
export const updatePackage = async (id: string, data: CreatePackage) => {
}
export const deletePackage = async (id: string) => {
  const response = await axiosInstance.delete<PackageResponse>(`/packages/${id}`)
  return response.data
}
export const createPackage = async (data: CreatePackage) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('features', data.features);
  formData.append('price', data.price.toString());
  formData.append('dayValue', data.dayValue.toString());
  if (data.image) {
    formData.append('image', data.image);
  }
  formData.append('type', data.type);
  const response = await axiosInstance.post<PackageResponse>('/packages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data
}
  

export const getMyTransactions = async () => {
  const response = await axiosInstance.get<TransactionResponse[]>('/transaction/me')
  return response.data
}

export const subscriptionUseJob = async (data: UseSubscriptionRequest) => {
  const response = await axiosInstance.post<EmployerSubResponse>('/employer-sub/use-subscription/job', data)
  return response.data
}

export const subscriptionUseBanner = async (data: UseSubscriptionBannerRequest) => {
  const response = await axiosInstance.post<EmployerSubResponse>('/employer-sub/use-subscription/banner', data)
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