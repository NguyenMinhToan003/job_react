import { getPaginatedFollowsAPI } from "@/apis/followEmployerAPI";
import PaginationModel1 from "@/components/elements/pagination/PaginationModel1";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FollowResponse } from "@/types/followType";
import { convertDateToString } from "@/utils/dateTime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Follows() {
  const [follows, setFollows] = useState<FollowResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const fetchFollows = async () => {
    try {
      const response = await getPaginatedFollowsAPI(page, 10);
      setFollows(response.items || []);
      setTotalPages(response.page || 1);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách theo dõi');
    }
  }
  useEffect(() => {
    fetchFollows();
  }, [])
  return <div className="gap-0">
    <Card className="rounded-none shadow-none hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Công ty theo dõi {follows.length > 0 ? `(${follows.length})` : ''}
        </CardTitle>
      </CardHeader>
    </Card>
    <div className="rounded-none shadow-none hover:shadow-2xl p-2"></div>
      {
        follows.length > 0 ? (
          follows.map((follow) => (
            <Card className="rounded-none shadow-none hover:shadow-2xl" key={follow.id}>
            <CardContent className="flex items-start justify-start gap-2">
            <div className='bg-white rounded-none w-18 h-18 flex items-center justify-center border border-gray-200'>
              <img src={follow.employer?.logo} alt='CBTW Logo' className='w-full h-full' />
              </div>
              <div className="flex-1 flex-col gap-1">
                  <div className='text-gray-600 font-bold hover:underline'>{follow.employer?.name}</div>
                  <div className='text-[12px] text-gray-500 font-semibold  hover:underline'>{follow.employer?.businessType?.name}</div>
                  <div className='text-[12px] text-gray-500 font-semibold  hover:underline'>
                    <img src={follow.employer?.country.flag} alt={follow.employer?.country.name} className='inline-block w-4 h-4 mr-1 rounded-full' />
                    {follow.employer?.country.name}</div>
              </div>
              <div className="flex flex-col items-end justify-start gap-2">
                  <span className="text-[12px] text-gray-400 font-semibold">
                    Đã theo dõi từ: {convertDateToString(follow.time)}
                  </span>
                  <Button variant={'destructive'}
                    onClick={()=> navigate(`/nha-tuyen-dung/${follow.employer.id}`)}
                  >
                  Xem nhà tuyển dụng
              </Button>
              </div>
            </CardContent>
          </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">Bạn chưa theo dõi nhà tuyển dụng nào.</p>
        )
    }
    <PaginationModel1
      page={page}
      totalPages={totalPages}
      setPage={setPage}
    />
  </div>
}