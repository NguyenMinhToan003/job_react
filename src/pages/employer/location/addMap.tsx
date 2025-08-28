import { getCityList } from '@/apis/cityAPI';
import {
  createLocationAPI,
  locationAutoCompleteAPI,
  locationGetMapAPI,
} from '@/apis/locationAPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  City,
  CreateLocationRequest,
  District,
  LocationAutoComplate,
  LocationMapResponse,
} from '@/types/location';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AddMap() {
  const [map, setMap] = useState<LocationMapResponse>();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<LocationAutoComplate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCityList();
        setCities(res);
      } catch (error) {
        console.error('Failed to fetch cities', error);
      }
    };
    fetchCities();
  }, []);

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = cities.find((c) => c.id === cityId);
    setDistricts(city ? city.districts : []);
    setSelectedDistrictId('');
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.trim().length < 4) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await locationAutoCompleteAPI(address);
        setSuggestions(res || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setIsLoading(false);
    };

    fetchSuggestions();
  }, [address]);

  const handleSelectSuggestion = async (suggestion: LocationAutoComplate) => {
    setAddress(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoading(true);
    try {
      const data = await locationGetMapAPI(suggestion);
      setMap(data);
    } catch (error) {
      console.error('Failed to fetch location detail', error);
    }
    setIsLoading(false);
  };

  const handleAddLocation = async () => {
    try {
      await createLocationAPI({
        name: map?.name || '',
        placeId: map?.placeId || '',
        city: { id: selectedCityId } as City,
        district: { id: selectedDistrictId } as District,
        lat: map?.location.lat || 0,
        lng: map?.location.lng || 0,
      } as CreateLocationRequest);
      toast.success('Thêm địa điểm thành công');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Thêm địa điểm thất bại');
    }
  };

  return (
    <Card className='w-full shadow-none border border-gray-200 rounded-xl mr-3'>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Thành phố</label>
              <Select onValueChange={handleCityChange} value={selectedCityId}>
                <SelectTrigger className='w-full p-6 border-2 border-gray-300 rounded-md'>
                  <SelectValue placeholder='Chọn thành phố' />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Quận / Huyện</label>
              <Select
                onValueChange={handleDistrictChange}
                value={selectedDistrictId}
                disabled={!selectedCityId}
              >
                <SelectTrigger className='w-full p-6 border-2 border-gray-300 rounded-md'>
                  <SelectValue placeholder='Chọn quận / huyện' />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='relative'>
              <label className='block text-sm font-medium mb-2'>Địa điểm chi tiết</label>
              <Input
                placeholder='Nhập địa chỉ chi tiết'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='p-6 border-2 border-gray-300 rounded-md w-full'
              />

              {isLoading ? (
                <div className='absolute right-3 top-10'>
                  <Loader2 className='animate-spin w-5 h-5 text-gray-500' />
                </div>
              ) : (
                address && (
                  <div className='absolute right-3 top-10 cursor-pointer'>
                    <X onClick={() => setAddress('')} />
                  </div>
                )
              )}

              {address && showSuggestions && suggestions.length > 0 && (
                <div className='absolute w-full mt-1 z-50 rounded-md border bg-white shadow-lg overflow-auto max-h-60'>
                  {suggestions.map((s) => (
                    <div
                      key={s.placeId}
                      className='cursor-pointer select-none px-4 py-2 text-sm hover:bg-gray-100'
                      onClick={() => handleSelectSuggestion(s)}
                    >
                      {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='text-right'>
              <Button
                className='text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none w-24'
                onClick={handleAddLocation}
              >
                LƯU
              </Button>
            </div>
          </div>

          <div className='w-full'>
            {map?.location ? (
              <iframe
                src={`https://maps.google.com/maps?q=${map.location.lat},${map.location.lng}&hl=vi&z=14&output=embed`}
                width='100%'
                height='400'
                style={{ border: 0 }}
                allowFullScreen
              ></iframe>
            ) : (
              <div className='flex items-center justify-center h-[400px]'>
                <Skeleton className='w-full h-full' />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
