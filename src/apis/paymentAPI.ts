import { AdminFilterTransaction, EmployerSubResponse, TransactionDetailResponse, TransactionRequest, TransactionResponse, UseSubscriptionBannerRequest } from "@/types/employerSubType"
import { axiosInstance } from "."
import { CreatePackage, FilterPackage, PackageResponse } from "@/types/packageType"

export const getPackageAvailable = async (data: FilterPackage) => {
  const response = await axiosInstance.get<PackageResponse[]>('/packages/available', {
    params: data
  })
  return response.data
}
export const updatePackageAPI = async (id: string, data: CreatePackage) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('features', data.features);
  formData.append('price', data.price.toString());
  formData.append('dayValue', data.dayValue.toString());
  if (data.image) {
    formData.append('image', data.image);
  }
  formData.append('type', data.type);
  const response = await axiosInstance.patch<PackageResponse>(`/packages/${id}`, formData);
  return response.data
}
export const changeStatusPackage = async (id: string) => {
  const response = await axiosInstance.post<PackageResponse>(`/packages/change-status/${id}`)
  return response.data
}
// get all packages for business
export const getPackagesBisiness = async (filter?: FilterPackage) => {
  const response = await axiosInstance.get<PackageResponse[]>('/packages', {
    params: filter
  })
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

export const subscriptionUseBanner = async (data: UseSubscriptionBannerRequest) => {
  const response = await axiosInstance.post<EmployerSubResponse>('/employer-sub/use-subscription/banner-employer', data)
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

export const getEmployerSubInPackage = async (packageId: string) => {
  const response = await axiosInstance.get<EmployerSubResponse[]>(`/employer-sub/get-all-in-package/${packageId}`)
  return response.data
}
export const getAllTransactionsAdmin = async (filter: AdminFilterTransaction) => {
  const response = await axiosInstance.get<{
    items: TransactionDetailResponse[],
    total: number,
    totalPages: number
  }>('/transaction/admin/get-all', {
    params: filter
  })
  return response.data
}