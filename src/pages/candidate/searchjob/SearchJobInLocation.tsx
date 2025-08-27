import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobByLocation } from '@/apis/jobAPI';
import { JobFilterResponse } from '@/types/jobType';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPinnedIcon, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import JobItem from '@/components/elements/job/job-list/jobItem';
import { Field, MajorResponse } from '@/types/majorType';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { getFieldAndAllMajors } from '@/apis/fieldAPI';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SearchJobInLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [jobs, setJobs] = useState<JobFilterResponse[]>([]);
  const [radius, setRadius] = useState(10);
  const [tempRadius, setTempRadius] = useState(radius);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [majorIds, setMajorIds] = useState<number[]>([]);
  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [majorIdsTemp, setMajorIdsTemp] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

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

  const fetchJobsNearby = async (lat: number, lng: number, radiusKm: number, majorIds: number[]) => {
    try {
      setLoading(true);
      const data = await getJobByLocation({
        latitude: lat,
        longitude: lng,
        radius: radiusKm * 1000,
        majorIds: majorIds.length > 0 ? majorIds : undefined,
      });
      setJobs(data);
    } catch {
      setError('Không thể tải danh sách việc làm gần bạn.');
    } finally {
      setLoading(false);
    }
  };

  const fetchElements = async () => {
    try {
      const response = await getFieldAndAllMajors();
      setFieldList(response);
    } catch (err) {
      console.error('Error fetching majors:', err);
      setError('Không thể tải danh sách chuyên ngành.');
    }
  };

  useEffect(() => {
    fetchElements();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchJobsNearby(location.latitude, location.longitude, radius, majorIds);
    }
  }, [location, radius, majorIds]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Card className="rounded-md shadow-sm mb-4">
        <CardHeader>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline"
                className="w-full mb-4 bg-[#2c95ff] text-white hover:bg-[#2c95ff] hover:text-white rounded-none"
                
              >
                {majorIds.length > 0
                  ? `Chọn chuyên ngành (${majorIds.length})`
                  : 'Chọn chuyên ngành'}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="min-w-[800px] p-6">
              

              <ScrollArea className="max-h-[60vh] pr-2">
                <div className="space-y-6">
                  {fieldList.map((field) => (
                    <div key={field.id}>
                      <h4 className="flex gap-2 font-semibold items-center text-[#451DA1] mb-2 border-b pb-1">
                        <Star className='w-4 h-4'/> {field.name}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {field.majors?.map((major: MajorResponse) => (
                          <div key={major.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`major-${major.id}`}
                              checked={majorIdsTemp.includes(major.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setMajorIdsTemp((prev) => [...prev, major.id]);
                                } else {
                                  setMajorIdsTemp((prev) =>
                                    prev.filter((id) => id !== major.id)
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={`major-${major.id}`}
                              className="text-sm text-gray-700"
                            >
                              {major.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  className="mr-2  rounded-none"
                  onClick={() => setMajorIdsTemp([])}
                >
                  Bỏ chọn tất cả
                </Button>
                <Button
                  variant={'outline'}
                  className='bg-[#2c95ff] text-white rounded-none hover:text-[#2c95ff]'
                  onClick={() => {
                    setMajorIds(majorIdsTemp);
                    setOpen(false);
                  }}
                >
                  Lưu lựa chọn{
                    majorIdsTemp.length > 0
                      ? ` (${majorIdsTemp.length})`
                      : ''
                  }
                </Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
      </Card>

      <div className="mb-6">
        <p className="text-sm text-gray-700 font-medium mb-1">
          Chọn bán kính tìm kiếm: {radius} km
        </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-none p-4 space-y-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-6 w-16 rounded" />
            </Card>
          ))}
        </div>
      )}

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-5">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="shadow-none border-gray-200 border rounded-2xl p-2"
            >
              <CardContent  className='p-2'>
                <div onClick={() => navigate(`/cong-viec/${job.id}`)}>
                  <JobItem
                    job={job}
                    selectedJob={job}
                    setSelectedJob={() => {}}
                  />
                </div>
                <Label className="text-sm text-gray-600 mt-2">
                  {
                    job.locations[0].name
                  }
                </Label>
                <div className="mt-4 flex justify-between items-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-[#2c95ff] mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (location) {
                        const origin = `${location.latitude},${location.longitude}`;
                        const destination = `${job.locations[0].lat},${job.locations[0].lng}`;
                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
                        window.open(mapsUrl, '_blank');
                      }
                    }}
                  >
                    <MapPinnedIcon className="w-4 h-4 mr-1" />
                    Xem đường đi
                  </Button>

                  <Button variant="secondary" size="sm" className="text-[#2c95ff]">
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
