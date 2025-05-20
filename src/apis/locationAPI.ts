import { CreateLocationRequest, LocationAutoComplate, LocationMapResponse, LocationResponse } from "@/types/location";
import { axiosInstance } from "./index"

export const locationGetMapAPI = async (suggestion: {
  name: string;
  plandId: string;
}) => {
  const response =await axiosInstance.get<LocationMapResponse>(`/location/map/detail/${suggestion.plandId}`);
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
  const response = await axiosInstance.get<LocationResponse[]>('/location/company');
  return response.data;
}