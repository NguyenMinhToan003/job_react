import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccount } from '@/providers/UserProvider';
import { ChevronRight, FileText, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function Overview() {
  const { dataUser } = useAccount();
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
              <p className='text-sm text-muted-foreground'>{dataUser?.account?.email}</p>
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
          <CardTitle>Hãy xây dựng hồ sơ thật chuyên nghiệp</CardTitle>
        </CardHeader>
          <CardContent className='text-center text-sm text-muted-foreground py-8'>
            <FileText className='mx-auto mb-4 text-4xl text-muted' />
          <p className='mb-4'>
            Hồ sơ là nơi bạn thể hiện kỹ năng, kinh nghiệm và thành tựu của mình. Hãy đảm bảo rằng hồ sơ của bạn đầy đủ và chuyên nghiệp để thu hút nhà tuyển dụng.
          </p>
          </CardContent>
      </Card>
    </>
  );
}
