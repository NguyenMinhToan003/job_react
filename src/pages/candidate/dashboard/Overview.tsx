import { getCvMe, uploadCv } from '@/apis/cvAPI';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAccount } from '@/providers/UserProvider';
import { Cv } from '@/types/cvType';
import { ChevronRight, FileText, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function FileInput({ onFileSelect, label }: { onFileSelect: (file: File) => void; label: string }) {
  return (
    <>
      <Button variant='link' className='text-red-600' asChild>
        <Label htmlFor='cv-upload'>{label}</Label>
      </Button>
      <input
        id='cv-upload'
        type='file'
        className='hidden'
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </>
  );
}

export default function Overview() {
  const { dataUser, updateDataUser } = useAccount();
  const [cvs, setCvs] = useState<Cv[] | null>(null);
  const [cvChosen, setCvChosen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCvs = async () => {
    setLoading(true);
    try {
      const response = await getCvMe();
      setCvs(response);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCv = async (file: File) => {
    setLoading(true);
    try {
      await uploadCv(file);
      await fetchCvs();
      updateDataUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading CV');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, []);

  useEffect(() => {
    if (cvChosen) {
      handleUploadCv(cvChosen);
      setCvChosen(null);
    }
  }, [cvChosen]);

  const navigate = useNavigate()

  return (
    <>
      <Card>
        <CardContent className='flex items-center gap-4 p-4'>
          <Avatar className='w-20 h-20 border-2 border-[#3d1419]'>
            <AvatarImage src={dataUser?.avatar} />
          </Avatar>
          <div>
            <h2 className='font-bold text-lg uppercase'>{dataUser?.name}</h2>
            <Button variant='outline' className='flex items-center gap-2 mt-1' disabled>
              <Mail />
              <p className='text-sm text-muted-foreground'>{dataUser?.account.email}</p>
            </Button>
            <Button variant='ghost' className='mt-2 flex items-center gap-2'
              onClick={() => navigate('/tong-quat-ho-so/cap-nhat-thong-tin')}>
              <ChevronRight className='text-blue-600' />
              <p className='text-sm text-blue-600'>Cập nhật hồ sơ</p>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Hồ sơ đính kèm của bạn</CardTitle>
        </CardHeader>

        {!cvs?.length>0 ? (
          <CardContent className='text-center text-sm text-muted-foreground py-8'>
            <FileText className='mx-auto mb-4 text-4xl text-muted' />
            <p className='mb-4'>Bạn chưa đính kèm CV. Tải lên CV của bạn để tối ưu quá trình tìm việc.</p>
            <FileInput onFileSelect={setCvChosen} label='Quản lý hồ sơ đính kèm →' />
          </CardContent>
        ) : (
          <CardContent className='flex items-center gap-4'>
            <Card className=' border-red-500 shadow bg-red-50'>
              <CardContent className='flex items-center gap-4'>
                <FileText className='text-red-600' size={24} />
                <div className='flex flex-col gap-2 '>
                    <p className='font-bold text-red-500 underline cursor-pointer' onClick={() => window.open(cvs[0]?.url, '_blank')}>{cvs[0].id} - {cvs[0].name}</p>
                    <p className='text-sm font-semibold text-gray-500 '
                    >
                      Thời gian cập nhật: {new Date(cvs[0].updatedAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>
                <FileInput onFileSelect={setCvChosen} label='Cập nhật →' />
              </CardContent>
            </Card>
          </CardContent>
        )}
      </Card>
    </>
  );
}
