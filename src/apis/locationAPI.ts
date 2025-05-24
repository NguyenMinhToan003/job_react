import { CreateLocationRequest, LocationAutoComplate, LocationMapResponse, LocationResponse } from "@/types/location";
import { axiosInstance } from "./index"

export const locationGetMapAPI = async (suggestion: {
  name: string;
  placeId: string;
}) => {
  const response =await axiosInstance.get<LocationMapResponse>(`/location/map/detail/${suggestion.placeId}`);
  return response.data;
}
export const locationAutoCompleteAPI = async (address: string) => {
  const response = await axiosInstance.get(`/location/map/${encodeURIComponent(address)}`);
  const data = response.data.predictions as LocationAutoComplate[];
  return data;
}
export const createLocationAPI = async (body: CreateLocationRequest) => {
  const response = await axiosInstance.post('/location', body);
  return response.data;
}
export const getLocationByCompanyAPI = async () => {
  const response = await axiosInstance.get<LocationResponse[]>('/location/employer');
  return response.data;
}
export const updateLocationAPI = async (locationId: number, body: CreateLocationRequest) => {
  const response = await axiosInstance.patch(`/location/${locationId}`, body);
  return response.data;
}
export const toggleEnableLocationAPI = async (locationId: number) => {
  const response = await axiosInstance.patch(`/location/toggle-enable/${locationId}`);
  return response.data;
}

export const deleteLocationAPI = async (locationId: number) => {
  const response = await axiosInstance.delete(`/location/${locationId}`);
  return response.data;
}