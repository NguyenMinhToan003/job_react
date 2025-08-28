/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFieldById, updateFieldAPI } from '@/apis/fieldAPI';
import { createMajorAPI, deleteMajorAPI, updateMajorAPI } from '@/apis/majorAPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Field } from '@/types/majorType';
import { MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function FieldDetail() {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [field, setField] = useState<Field>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const handleFetchField = async () => {
    try {
      const response = await getFieldById(Number(fieldId));
      setField(response);
    } catch (error) {
      console.error('Error fetching field:', error);
    }
  }
  useEffect(() => {
    if (!fieldId) return;
    handleFetchField();
  }, [fieldId]);

  const handleUpdateField = async () => {
    try {
      await updateFieldAPI(Number(fieldId), {
        name: field?.name || '',  
      });
      toast.success('Cập nhật lĩnh vực thành công');
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }

  const handleSaveMajor =async () => {
    try {
      if (selectedMajorId) {
        await updateMajorAPI(selectedMajorId, {
          name,
          fieldId: Number(fieldId),
        })
        toast.success('Cập nhật chuyên ngành thành công');
      }
      else {
        await createMajorAPI({
          name,
          fieldId: Number(fieldId),
        });
        toast.success('Thêm chuyên ngành thành công');
      }
      setName('');
      setIsDialogOpen(false);
      await handleFetchField(); // Refresh field data after adding major
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }

  const handleDeleteMajor = async (id: number) => {
    try {
      await deleteMajorAPI(id);
      toast.success('Xóa chuyên ngành thành công');
      await handleFetchField(); // Refresh field data after deleting major
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
            <div className='flex-1 flex gap-2 items-center'>
              <Input
                value={field?.name || ''}
                onChange={(e) => {
                  setField({
                    id: field?.id || 0,
                    name: e.target.value,
                    majors: field?.majors || [],
                  });
                }}
                placeholder='Nhập tên lĩnh vực'
                className='w-fit'
              />
              <Button onClick={handleUpdateField} className='ml-2'>
                  Lưu
              </Button>
            </div>

          <Button onClick={()=> setIsDialogOpen(true)} className='mt-2' variant='outline'>
            + Thêm chuyên ngành
          </Button>
        </CardTitle>
       
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell className='w-full'>Tên chuyên ngành</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
            {
              field?.majors?.map((major) => (
                <TableRow key={major.id}>
                  <TableCell>{major.id}</TableCell>
                  <TableCell>{major.name}</TableCell>
                  <TableCell>
                  <Popover>
                    <PopoverTrigger className='p-0'>
                      <Button variant='outline' className='ml-auto'>
                        <MoreVertical className='h-4 w-4' />  
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='p-0 w-fit'>
                        
                        <Button variant='ghost' className='w-full justify-start hover:bg-blue-500 hover:text-white rounded-none'
                          onClick={() => {
                            setSelectedMajorId(major.id);
                            setName(major.name);
                            setIsDialogOpen(true);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button variant='ghost' className='w-full justify-start hover:bg-red-500 hover:text-white rounded-none'
                          onClick={() => handleDeleteMajor(major.id)}
                          >
                        Xóa
                        </Button>
                    </PopoverContent>
                  </Popover>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
      </Card>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
        modal
      >
        <DialogContent>
          <Label htmlFor='name'>Tên chuyên ngành</Label>
          <Input
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Nhập tên chuyên ngành'
          />
          <Button onClick={handleSaveMajor} className='mt-4'>
            Thêm chuyên ngành
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}