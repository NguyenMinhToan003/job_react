import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddMap from './AddMap';
import ListLocation from './ListLocation';
export default function LocationCompany() {
  
  return (
    <div className='flex flex-col flex-1'>
      <Tabs defaultValue='thong-tin-dia-diem' className='w-full'>
        <TabsList className='border-b w-full justify-start rounded-sm h-auto p-0 mb-6 bg-white shadow-xl border-b-gray-300 sticky top-[60px]'>
          <TabsTrigger
            value='thong-tin-dia-diem'
            className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none'
          >
            Thông tin địa điểm
          </TabsTrigger>
          <TabsTrigger
            value='them-dia-diem'
            className='max-w-fit px-7 py-4 h-16 mr-1.5 text-lg font-semibold rounded-none border-b-2 shadow-none text-gray-800 data-[state=active]:text-[#ed1b2f] data-[state=active]:border-b-[#ed1b2f] data-[state=active]:shadow-none'
          >
            Bản đồ
          </TabsTrigger>
        </TabsList>

        <TabsContent value='thong-tin-dia-diem' className='mt-0'>
          <ListLocation/>
        </TabsContent>
          
        <TabsContent value='them-dia-diem' className='mt-0'>
          <AddMap />
        </TabsContent>
      </Tabs>
    </div>
  );
}
