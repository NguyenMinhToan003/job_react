/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperienceListAdmin,
} from '@/apis/experienceAPI';
import { Experience, CreateExperienceDto, UpdateExperienceDto } from '@/types/experienceType';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch'; // <-- giả sử bạn có component Switch

export default function ExperiencePage() {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<CreateExperienceDto | UpdateExperienceDto>({
    name: '',
    status: 1, // thêm trường trạng thái
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchExperienceList = async () => {
    try {
      const response = await getExperienceListAdmin();
      setExperienceList(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lấy danh sách kinh nghiệm');
    }
  };

  useEffect(() => {
    fetchExperienceList();
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEdit && editingId !== null) {
        await updateExperience(editingId, form as UpdateExperienceDto);
        toast.success('Cập nhật kinh nghiệm thành công!');
      } else {
        await createExperience(form as CreateExperienceDto);
        toast.success('Tạo kinh nghiệm mới thành công!');
      }
      fetchExperienceList();
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu kinh nghiệm');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kinh nghiệm này?')) return;
    try {
      await deleteExperience(id);
      toast.success('Xóa kinh nghiệm thành công!');
      fetchExperienceList();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa kinh nghiệm');
    }
  };

  const handleEdit = (item: Experience) => {
    setIsEdit(true);
    setEditingId(item.id);
    setForm({ name: item.name, status: item.status });
    setOpen(true);
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm({ name: '', status: 1 });
  };
  const toggleStatus = async (id: number, data: UpdateExperienceDto) => {
    try {
      await updateExperience(+id, data);
      fetchExperienceList();
      toast.success(`Đã ${data.status? 'HIỆN' : 'ẨN'} trạng thái "${data.name}" !`);
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái kinh nghiệm');
      console.error(error);
    }
  }

  return (
    <div className='p-6 flex gap-6 bg-[#f7f7f7] w-full'>
      <Card className='flex-1'>
        <CardHeader className='flex justify-between items-center'>
          <CardTitle>Quản lý kinh nghiệm</CardTitle>
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsEdit(false)}>+ Thêm kinh nghiệm</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEdit ? 'Sửa kinh nghiệm' : 'Thêm kinh nghiệm'}</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <Input
                  placeholder='Tên kinh nghiệm'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <div className='flex items-center space-x-2'>
                  <Switch
                    checked={form.status === 1}
                    onCheckedChange={(checked) => setForm({ ...form, status: checked ? 1 : 0 })} // 1 là hoạt động, 0 là không hoạt động
                  />
                  <span>Trạng thái hoạt động</span>
                </div>
              </div>
              <DialogFooter className='mt-4'>
                <Button variant='outline' onClick={() => setOpen(false)}>Hủy</Button>
                <Button onClick={handleSubmit}>{isEdit ? 'Cập nhật' : 'Tạo mới'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className='p-6 space-y-2'>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>ID</TableHead>
                <TableHead>Tên kinh nghiệm</TableHead>
                <TableHead>Trạng thái</TableHead> {/* Thêm cột trạng thái */}
                <TableHead className='w-[160px]'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experienceList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.status === 1}
                      onCheckedChange={(checked) => {
                        toggleStatus(item.id, {
                          ...item,
                          status: checked ? 1 : 0,
                        });
                      }
                    }
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant='outline' className='mr-2' onClick={() => handleEdit(item)}>Sửa</Button>
                    <Button variant='destructive' onClick={() => handleDelete(item.id)}>Xóa</Button>
                  </TableCell>
                </TableRow>
              ))}
              {experienceList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center text-gray-500'>
                    Không có kinh nghiệm nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
