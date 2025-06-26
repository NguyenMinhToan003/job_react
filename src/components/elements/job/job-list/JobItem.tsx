import { AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { JobFilterResponse } from '@/types/jobType';
import { convertPrice } from '@/utils/convertPrice';
import { convertDateToDiffTime } from '@/utils/dateTime';
import { Avatar } from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { Book, Building2, Clock, DollarSignIcon, Flame, FlameIcon, HandCoins, Heart, MapPin } from 'lucide-react';

export default function JobItem({
  job,
  selectedJob,
  setSelectedJob,
  isPrev = false,
}: {
  job: JobFilterResponse;
  selectedJob: JobFilterResponse;
  setSelectedJob: (job: JobFilterResponse) => void;
  isPrev?: boolean;
  }) {
  if (!job) return null;
  return (
    <Card
                          onClick={() => setSelectedJob(job)}
                          key={job.id}
                          className={clsx('flex flex-col rounded-[8px] bg-white border border-[#E7E7E8] hover:border-[#2C95FF] p-2 gap-1 shadow-none cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-101 relative'
                          )}
                        >
                          <CardHeader className='p-1 flex items-center justify-between'>
                            <CardTitle className={clsx('font-semibold line-clamp-1',
                              job.isActiveSubscription ? 'text-red-500' : 'text-gray-800'
                            )}>
                              {job.name}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              className=" hover:bg-[#eeeaff]"

                            >
                              <Heart className="w-5 h-5 text-[#2c95ff] shadow-xl" />
                            </Button>
                          </CardHeader>
                          <CardContent className="flex-1 p-1 space-y-2">
                            {/* Logo + thông tin */}
                            <div className="flex items-start gap-3 mb-2">
                              {/* Logo */}
                              <Avatar className='bg-white box-border rounded-md w-[64px] min-w-[64px] h-[64px] min-h-[64px]'>
                                <AvatarImage
                                  src={job.employer.logo}
                                  alt={job.employer.name}
                                />
                              </Avatar>
                              {/* Thông tin công ty + lương + địa điểm */}
                              <div className="flex flex-col gap-2">
                                <div className="text-xs font-semibold text-[#a2a1a3] line-clamp-1">
                                  {job.employer.name}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-[#2c95ff] font-semibold">
                                  <DollarSignIcon className="w-4 h-4 text-gray-400" />
                                  <Label>{convertPrice(job.minSalary, job.maxSalary)}</Label>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <Label className='text-[#060607] text-xs'>
                                    {job.locations?.[0]?.district?.city?.name || 'Không rõ địa điểm'}
                                  </Label>
                                </div>
                              </div>
                            </div>
                            <hr className="my-2 border-gray-200" />
                            <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold justify-between item-center">
                              <div>
                                {
                                  job.isActiveSubscription && (
                                    <div className=" bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                                      <span className="flex items-center gap-1">
                                        <FlameIcon className="w-4 h-4" />
                                        HOT
                                      </span>
                                    </div>
                                  )
                                }
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{convertDateToDiffTime(job.createdAt)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
  );
}
