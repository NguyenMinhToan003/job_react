import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ListJob from './ListJob'
import PendingJobsList from './PendingJobsList'
import CreateJob from './CreateJob'
import { InboxIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useNavigate, useParams } from 'react-router-dom'

export default function CompanyJob() {
  const { tab } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <Tabs defaultValue={tab ? tab : '1'} className='w-full p-0'
        onValueChange={(value) => {
          navigate(`/danh-cho-nha-tuyen-dung/tuyen-dung/${value}`);
        }}
      >
        <TabsList  className='border-b w-full justify-start rounded-sm h-auto p-0 mb-6 bg-white shadow-xl border-b-gray-300 '>
          <TabsTrigger className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none' value='1'>
            Danh sách
          </TabsTrigger>
          <TabsTrigger className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none' value='2'>
            Chờ xét duyệt
          </TabsTrigger>
          <TabsTrigger className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none' value='3'>
            Hết hạn
          </TabsTrigger>
          <TabsTrigger className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none' value='4'>
            Tạo mới
          </TabsTrigger>
        </TabsList>

        <TabsContent value='1' className='p-0'>
          <ListJob/>
        </TabsContent>

        <TabsContent value='2' className='p-0'>
          <PendingJobsList/>
        </TabsContent>

        <TabsContent value='3' className='p-0'>
          <Card className='w-full h-full flex flex-col items-center justify-center py-16 text-gray-500'>
            <InboxIcon className='w-16 h-16 mb-4 text-red-500' />
            <h2 className='text-xl font-semibold'>Chưa có việc làm nào hết hạn</h2>
            <p className='text-sm mt-2'>Các công việc đã đăng vẫn đang trong thời gian hoạt động.</p>
          </Card>
        </TabsContent>


        <TabsContent value='4' className='p-0'>
          <CreateJob/>
        </TabsContent>
        </Tabs>
    </>
  )
}
