import { deleteResumeAPI, getAllResumeAPI } from '@/apis/resumeAPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Resume } from '@/types/resumeType';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ListResume() {
  const [listResume, setListResume] = useState<Resume[]>([]);
  const navigate = useNavigate();
  const fetchResume = async () => {
    try {
      const response = await getAllResumeAPI();
      setListResume(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách hồ sơ');
    }
  };
  useEffect(() => {
    fetchResume();
  }, [])

  const handleDeleteResume = async (resumeId: number) => {
    try {
      await deleteResumeAPI(resumeId);
      toast.success('Xóa hồ sơ thành công');
      fetchResume();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error : any) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa hồ sơ');
    }
  }
  return <>
    
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span className='text-2xl font-semibold'>Danh sách hồ sơ</span>
          <Button
            className='ml-4'
            onClick={() => navigate('create')}
          >
            Tạo hồ sơ mới
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {
          listResume.length > 0 ? (
            <ul className='space-y-4'>
              {listResume.map((resume) => (
                <li
                  key={resume.id}
                  className='border p-4 rounded-md flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer'
                >
                  <div
                    onClick={() => navigate(`${resume.id}`)}
                    className='text-lg font-semibold flex-1'>
                    {resume.id}-{resume.name}
                  </div>
                  <Button
                    variant='destructive'
                    className='mt-2'
                    onClick={() => {
                      handleDeleteResume(resume.id);
                    }}
                  >
                    Xoá
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>Bạn chưa có hồ sơ nào.</p>
          )
        }
      </CardContent>
    </Card>
  </>
}