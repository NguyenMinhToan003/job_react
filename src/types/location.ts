export interface LocationAutoComplate {
  name: string;
  placeId: string;
}
export interface LocationMapResponse {
  id: number;
  placeId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  },
  city: string;
  district: string;
}
export interface City {
  id: string;
  name: string;
  districts: District[];
}
export interface District {
  id: string;
  name: string;
}

export interface CreateLocationRequest {
  name: string;
  placeId: string;
  city: City;
  district: District;
  lat: number;
  lng: number;
  enabled: number;
}

export interface LocationResponse {
  id: number;
  name: string;
  placeId: string;
  district: DistrictResponse;
  lat: number;
  lng: number;
  enabled: number;
}
export interface DistrictResponse {
  id: string;
  name: string;
  city: City;
}