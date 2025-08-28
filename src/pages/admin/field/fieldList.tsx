/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFieldAPI, deleteFieldAPI, getFieldList } from '@/apis/fieldAPI';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Field } from '@/types/majorType';
import { MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function FieldList() {
  const [fields, setFields] = useState<Field[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const handleFetchFields = async () => {
    try {
      const response = await getFieldList();
      setFields(response);
    }
    catch (error) {
      console.error('Error fetching fields:', error);
    }
  }
  useEffect(() => {
    handleFetchFields();
  }, []);
  const navigate = useNavigate();


  const handleCreateField = async () => {
    try {
      await createFieldAPI({ name });
      toast.success('Thêm lĩnh vực thành công');
      await handleFetchFields(); // Refresh field list after adding
      setName(''); // Clear input field
      setIsOpen(false); // Close dialog

    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }

  const handleDeleteField = async (id: number) => {
    // Implement delete logic here
    try {
      await deleteFieldAPI(id);
      toast.success('Xóa lĩnh vực thành công');
      await handleFetchFields(); // Refresh field list after deletion
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent>
          <div className='flex flex-col gap-4'>
            <Label htmlFor='name'>Tên lĩnh vực</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              onClick={() => handleCreateField()}
            >
              Thêm lĩnh vực
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Card>
        <CardContent>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Danh sách lĩnh vực</h2>
            <div className='flex gap-2 items-center'>
              <Button variant='outline' onClick={handleFetchFields}>
                Tải lại
              </Button>
              <Button
                onClick={() => setIsOpen(true)}
              >
                + Thêm lĩnh vực
              </Button>
            </div>
              
          </div>
          <Table>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className='w-[50px]'>
                    {field.id}
                  </TableCell>
                  <TableCell className='w-full'>
                    <strong
                      className='hover:underline cursor-pointer'
                      onClick={() => navigate(`${field.id}`)}
                    >
                      {field.name}
                    </strong>
                    <Badge
                      variant='outline'
                      className='ml-2'
                    >
                      {field.majors?.length} chuyên ngành
                    </Badge>
                  </TableCell>
                  <TableCell>
                  <Popover>
                    <PopoverTrigger className='p-0'>
                      <Button variant='outline' className='ml-auto'>
                        <MoreVertical className='h-4 w-4' />  
                      </Button>
                    </PopoverTrigger>
                      <PopoverContent className='p-0 w-fit'>
                        <Button variant='ghost' className='w-full justify-start rounded-none hover:bg-blue-500 hover:text-white'
                          onClick={() => navigate(`${field.id}`)}
                        >
                          Sửa
                        </Button>
                        <Button variant='ghost' className='w-full justify-start rounded-none hover:bg-red-500 hover:text-white'
                          onClick={() => handleDeleteField(field.id)}
                          >
                        Xóa
                      </Button>
                    </PopoverContent>
                  </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}