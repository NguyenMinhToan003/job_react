/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { getCompanyDetailAPI } from '@/apis/companyAPI';
import { EmployerDetailResponse } from '@/types/companyType';
import { LocationResponse } from '@/types/location';
import { toast } from 'sonner';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function ViewCompany() {
  const { id = '-1' } = useParams();
  const [employer, setCompany] = useState<EmployerDetailResponse | null>(null);
  const [selectLocation, setSelectLocation] = useState<LocationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getCompanyDetailAPI(+id);
        setCompany(data);
        if (data.locations.length > 0) {
          setSelectLocation(data.locations[0]);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi khi tải dữ liệu công ty');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Đang tải dữ liệu công ty...</div>;
  }

  if (!employer) {
    return <div className="text-center py-16 text-red-500">Không tìm thấy công ty.</div>;
  }

  return (
    <>
      <Card className="mb-8 shadow-xl">
        <CardContent className="px-6 py-1">
          <span className="font-bold text-2xl">Thông tin chung</span>
          <div className="w-full h-[1px] bg-gray-200 my-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-md text-gray-400 mb-1 font-semibold">Mô hình công ty</h3>
              <p className="font-medium">{employer?.businessType?.name || 'Chưa có dữ liệu'}</p>
            </div>
            <div>
              <h3 className="text-md text-gray-400 mb-1 font-semibold">Số điện thoại</h3>
              <p className="font-medium">{employer?.phone}</p>
            </div>
            <div>
              <h3 className="text-md text-gray-400 mb-1 font-semibold">Quy mô công ty</h3>
              <p className="font-medium">{employer?.employeeScale?.name || 'Chưa có dữ liệu'}</p>
            </div>
            <div>
              <h3 className="text-md text-gray-400 mb-1 font-semibold">Quốc gia</h3>
              <p className="font-medium flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={employer.country.flag} alt={employer.country.name} className='object-cover' />
                </Avatar>
                {employer.country.name || 'Chưa có dữ liệu'}
              </p>
            </div>
            <div>
              <h3 className="text-md text-gray-400 mb-1 font-semibold">Mã số thuế</h3>
              <p className="font-medium">
                {employer.taxCode}
              </p>
            </div>
            <div>
              <h3 className="text-md text-gray-400 mb-1 font-semibold">Website</h3>
              <p className="font-medium">{employer.website}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <span className="font-bold text-2xl">Giới thiệu công ty</span>
          <div className="w-full h-[1px] bg-gray-200 my-4"></div>
          <div
            className='text-gray-700 mb-4 font-semibold space-x-1'
            dangerouslySetInnerHTML={{ __html: employer.introduction || 'Chưa có dữ liệu' }}
          />
        </CardContent>
      </Card>

      <Card className="mt-8 shadow-xl rounded-md">
        <CardHeader>
          <span className="font-bold text-2xl">Địa điểm</span>
          <div className="w-full h-[1px] bg-gray-200 my-4"></div>
          <div className="flex items-start gap-6 text-gray-500">
            <div className="w-[300px]">
              {employer.locations.length > 0 &&
                employer.locations.map((location) => (
                  <Card
                    key={location.id}
                    className={`mb-4 p-0 border rounded-sm cursor-pointer hover:bg-gray-100 font-semibold ${
                      selectLocation?.id === location.id ? 'border-red-600' : ''
                    }`}
                    onClick={() => setSelectLocation(location)}
                  >
                    <CardContent className="flex items-start gap-4 p-2">
                      <MapPin
                        className={`w-8 h-8 ${
                          selectLocation?.id === location.id ? 'text-red-500' : 'text-gray-300'
                        }`}
                      />
                      <div className="text-gray-700">{location.name}</div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <div className="w-full">
              <iframe
                src={`https://maps.google.com/maps?q=${selectLocation?.lat},${selectLocation?.lng}&hl=vi&z=14&output=embed`}
                width="100%"
                height={400}
                loading="lazy"
                title="Bản đồ địa điểm"
                className="rounded-md"
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
}
