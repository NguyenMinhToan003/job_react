/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCityList } from '@/apis/cityAPI';
import {
  locationAutoCompleteAPI,
  locationGetMapAPI,
  updateLocationAPI,
} from '@/apis/locationAPI';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  District,
  LocationAutoComplate,
  LocationMapResponse,
  LocationResponse,
} from '@/types/location';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function FormUpdateLocation({
  location, setIsChanged
}: {
    location: LocationResponse;
    setIsChanged: (changed: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState<LocationMapResponse>();
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<LocationAutoComplate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setMap(undefined);
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCityList();
        setCities(res);
        const cityId = location.district.city.id;
        const districtId = location.district.id;
        const city = res.find((c) => c.id === cityId);
        setDistricts(city?.districts || []);
        setSelectedCityId(cityId);
        setSelectedDistrictId(districtId);
        setAddress(location.name);
        setMap({
          placeId: location.placeId,
          name: location.name,
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        } as LocationMapResponse);
      } catch (error) {
        console.error('Failed to fetch cities', error);
      }
    };
    if (open) fetchCities();
  }, [open, location]);

  // Fetch auto-complete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.trim().length < 4) {
        setSuggestions([]);
        setShowSuggestions(false);
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

  const handleUpdateLocation = async () => {
    try {
      await updateLocationAPI(location.id, {
        name: map?.name || address,
        placeId: map?.placeId || location.placeId || '',
        city: { id: selectedCityId } as City,
        district: { id: selectedDistrictId } as District,
        lat: map?.location?.lat || location.lat,
        lng: map?.location?.lng || location.lng,
        enabled: 0
      });
      toast.success('Cập nhật địa điểm thành công');
      setIsChanged(true);
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Cập nhật địa điểm thất bại');
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = cities.find((c) => c.id === cityId);
    setDistricts(city ? city.districts : []);
    setSelectedDistrictId('');
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };

  const finalLat = map?.location?.lat ?? location.lat;
  const finalLng = map?.location?.lng ?? location.lng;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button className='text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none w-24'>
          Sửa
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className='min-w-4xl'>
        <AlertDialogDescription className='space-y-4'>
          <Card className='min-w-full shadow-none border border-gray-200 rounded-xl mr-3'>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Form bên trái */}
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Thành phố</Label>
                    <Select value={selectedCityId} onValueChange={handleCityChange}>
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

                  <div className='space-y-2'>
                    <Label>Quận / Huyện</Label>
                    <Select
                      value={selectedDistrictId}
                      onValueChange={handleDistrictChange}
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

                  <div className='relative space-y-2'>
                    <Label>Địa điểm chi tiết</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder='Nhập địa chỉ chi tiết'
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
                </div>

                {/* Map bên phải */}
                <div className='w-full'>
                  {finalLat && finalLng ? (
                    <iframe
                      src={`https://maps.google.com/maps?q=${finalLat},${finalLng}&hl=vi&z=14&output=embed`}
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
        </AlertDialogDescription>

        <AlertDialogFooter>
          <Button
            variant='outline'
            className='text-gray-500 hover:text-gray-500 bg-white hover:bg-white rounded-none w-24'
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button
            className='text-[#451DA0] hover:text-[#451DA0] bg-[#EDECFF] hover:bg-[#EDECFF] rounded-none w-24'
            onClick={handleUpdateLocation}
          >
            Lưu
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
