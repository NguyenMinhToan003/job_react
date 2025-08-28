import { useEffect, useState } from 'react';
import { City, District } from '@/types/location';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getCityList } from '@/apis/cityAPI';
import { EllipsisVertical } from 'lucide-react';

export default function CityDistrictPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCityList();
        setCities(res);
        setSelectedCity(res[0]);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh/thành:', error);
      }
    };
    fetchCities();
  }, []);

  return (
    <div className='px-6 grid grid-cols-1 md:grid-cols-2 gap-6  w-full'>
      {/* Danh sách Tỉnh/Thành */}
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-between items-center'>
            <div>Danh sách Tỉnh / Thành phố</div>
            <div className='text-sm text-muted-foreground'>
              <Button variant='outline'>
                <EllipsisVertical className='w-4 h-4' />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-4 h-[600px] overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'>ID</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead className='w-[100px]'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell>{city.id}</TableCell>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>
                    <Button 
                      className='cursor-pointer'
                      variant={
                        selectedCity?.id === city.id ? 'default' : 'outline'
                      }
                      onClick={() => setSelectedCity(city)}
                    >
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Danh sách Quận/Huyện */}
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-between items-center'>
            <div>
              Danh sách Quận / Huyện của{' '}
              <span className='font-bold'>
                {selectedCity ? selectedCity.name : 'Chưa chọn tỉnh/thành phố'}
              </span>
            </div>
            <div className='text-sm text-muted-foreground'>
              <Button variant='outline'>
                <EllipsisVertical className='w-4 h-4' />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-4 h-[600px] overflow-y-auto'>
          {selectedCity ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>ID</TableHead>
                  <TableHead>Tên Quận / Huyện</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCity.districts.map((district: District) => (
                  <TableRow key={district.id}>
                    <TableCell>{district.id}</TableCell>
                    <TableCell>{district.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Hãy chọn một tỉnh/thành phố để xem quận/huyện.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
