import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageResponse } from "@/types/packageType";
import { X } from "lucide-react";

export default function SelectServiceJobPopup(
  {
    selectPackage,
    setSelectPackage,
    packageAvailable,
    isEdit = false,
  }: {
    selectPackage: PackageResponse | null;
    setSelectPackage: (pkg: PackageResponse | null) => void;
      packageAvailable: PackageResponse[];
    isEdit?: boolean;
  }
) {
  const PackageSkeletonPlaceholder = () => (
    <div className="flex items-center gap-4  w-full">
      {/* Avatar skeleton */}
      <Skeleton className='h-20 w-32 rounded-lg' />
      {/* Content skeleton */}
      <div className='flex-1 space-y-3'>
        <Skeleton className='h-5 w-3/4 rounded-md' />
        <Skeleton className='h-4 w-full rounded-md' />
      </div>
      <div className='text-xs text-gray-500 text-wrap'>
        Chưa có gói dịch vụ nào được chọn
      </div>
    </div>
  );
  return (
    <Card className='mb-4 rounded-sm border-none shadow-md'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-start'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex-1'>CHỌN GÓI DỊCH VỤ SỬ DỤNG</div>
          </div>
          <div className='mt-4 h-[1px] w-full bg-gray-200' />
        </CardTitle>
      </CardHeader>
      <CardContent >
        <Select
          disabled={isEdit}
          onValueChange={(value) => {
            const selectedPackage = packageAvailable.find(pkg => pkg.id === value);
            setSelectPackage(selectedPackage || null);
          }}
          defaultValue={selectPackage?.id || ""}
        >
          <SelectTrigger className='w-full p-0 !h-fit'>
            <SelectValue placeholder={<PackageSkeletonPlaceholder />} className='flex items-start gap-2 w-full'>
              {selectPackage
                ? <>
                  <Avatar className='h-20 w-30 rounded-none'>
                  <AvatarImage
                    src={selectPackage.image}
                    alt={selectPackage.name}
                  />
                </Avatar>
                <div className='ml-2 flex-1 '>
                  <div className='text-start text-xl font-semibold'>{selectPackage.name}</div>
                  <div className='text-xs text-gray-500'>{selectPackage.features}</div>
                </div>
                  <Button
                    variant='ghost'
                    className='absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200'
                    onClick={() => setSelectPackage(null)}
                  >
                    <X className='h-4 w-4 text-gray-500' />
                  </Button>
                </>
                : 
                <div >
                  <Skeleton className='h-20 w-full rounded-none' />
                  <div className='mt-2 h-4 w-full rounded bg-gray-200
                  ' />
                  <div className='mt-1 h-3 w-3/4 rounded bg
                  gray-200' />
                  
                </div>
                }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {packageAvailable.map((pkg) => (
              <SelectItem key={pkg.id} value={pkg.id} className='flex w-full items-center gap-2'>
                <Avatar className='h-10 w-16 rounded-none'>
                  <AvatarImage
                    src={pkg.image}
                    alt={pkg.name}
                  />
                </Avatar>
                <div className='ml-2 flex-1'>
                  <div className='text-sm font-semibold'>{pkg.name}</div>
                  <div className='text-xs text-gray-500'>{pkg.features}</div>
                </div>
                <div className='text-sm font-semibold text-blue-600 w-fit'>
                  x {pkg.sub_total- pkg.sub_used}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}