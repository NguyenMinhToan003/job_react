/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMajorByIdAPI } from '@/apis/majorAPI';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { MajorResponse } from '@/types/majorType';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function Major() {
  const { majorId } = useParams<{ majorId: string }>();
  const [major, setMajor] = useState<MajorResponse>({} as MajorResponse);
  const handleFetchMajor = async () => {
    try {
      const response = await getMajorByIdAPI(Number(majorId));
      setMajor(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }
  useEffect(() => {
    handleFetchMajor();
  }, [])
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold'>Thông tin chuyên ngành</h2>
        </div>
        <div className='mb-4'>
          <p className='text-sm text-muted-foreground'>ID: {major?.id}</p>
          <p className='text-sm text-muted-foreground'>Tên chuyên ngành: {major?.name}</p>
          <p className='text-sm text-muted-foreground hover:underline cursor-pointer'
            onClick={() => navigate(`/admin/linh-vuc/${major?.field?.id}`)}
          >Lĩnh vực: {major?.field?.name}</p>
          <p className='text-sm text-muted-foreground'>Số lượng kĩ năng: {major?.skills?.length || 0}</p>
        </div>
        </CardHeader>
      <CardContent>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>ID</TableCell>
              <TableCell className='font-medium'>Tên kĩ năng</TableCell>
            </TableRow>
            {
              major?.skills?.length > 0 && major?.skills?.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className='font-medium'>{skill.id}</TableCell>
                  <TableCell className='font-medium'>{skill.name}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}