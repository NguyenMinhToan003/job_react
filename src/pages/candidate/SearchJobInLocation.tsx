import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobByLocation } from '@/apis/jobAPI';
import { JobFilterResponse } from '@/types/jobType';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPinnedIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { convertPrice } from '@/utils/convertPrice';
import { convertDateToString } from '@/utils/dateTime';

export default function SearchJobInLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [jobs, setJobs] = useState<JobFilterResponse[]>([]);

  const [radius, setRadius] = useState(10);
  const [tempRadius, setTempRadius] = useState(radius);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      () => {
        setError('Không thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchJobsNearby = async (lat: number, lng: number, radiusKm: number) => {
    try {
      setLoading(true);
      const data = await getJobByLocation({
        latitude: lat,
        longitude: lng,
        radius: radiusKm * 1000,
      });
      setJobs(data);
    } catch {
      setError('Không thể tải danh sách việc làm gần bạn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchJobsNearby(location.latitude, location.longitude, radius);
    }
  }, [location, radius]);

  return (
    <div className="p-4  w-7xl mx-auto">
      <Card className="rounded-none shadow-none mb-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Việc làm gần vị trí của bạn
          </CardTitle>
          <p className="text-sm text-gray-500">Dựa trên vị trí hiện tại của bạn</p>
        </CardHeader>
      </Card>

      <div className="mb-6">
        <p className="text-sm text-gray-700 font-medium mb-1">Chọn bán kính tìm kiếm: {radius} km</p>
        <Slider
          value={[tempRadius]}
          min={1}
          max={50}
          step={0.5}
          onValueChange={(val) => setTempRadius(val[0])}
          onValueCommit={(val) => setRadius(val[0])}
        />
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-7xl mx-auto gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-md p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-6 w-16 rounded" />
              </div>
            </Card>
          ))}
        </div>
      )}


      {error && <p className="text-red-600 text-center mt-4">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-3 gap-5">
          {jobs.map((job) => (
            
            <Card key={job.id} className="shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <img
                    src={job.employer.logo}
                    alt={job.employer.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div>
                    <CardTitle
                      className="hover:underline cursor-pointer text-lg font-semibold text-gray-800"
                      onClick={() => navigate(`/nha-tuyen-dung/${job.employer.id}`)}
                    >
                      {job.employer.name}
                    </CardTitle>
                    <p className="text-sm font-semibold">{job.employer.businessType}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div
                  onClick={() => navigate(`/cong-viec/${job.id}`)}
                  className="p-2 border rounded hover:bg-muted transition cursor-pointer space-y-1 "
                >
                  <div className="font-medium ">{job.name}</div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    {convertPrice(job.minSalary, job.maxSalary)}
                  </div>

                  <div className="text-xs text-gray-500 font-semibold">
                    {job.locations.map((loc) => loc.name).join(', ')}
                  </div>
                  <div className="text-xs text-gray-500">
                  <div className="text-xs text-gray-500 font-semibold">
                    Hạn: {convertDateToString(job.expiredAt)}
                  </div>
                  <div>
                    <MapPinnedIcon className="h-4 w-4 text-gray-500 inline-block mr-1" />
                    <span className="text-xs text-blue-500">Xem đường đi</span>
                  </div>
                  </div>
                  </div>

                  <div className="mt-4 text-end bg-[#fbfaff] p-2 rounded">
                  <Button variant="secondary" size="sm" className='text-[#2c95ff]'>
                    {job.distanceKm} km
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
