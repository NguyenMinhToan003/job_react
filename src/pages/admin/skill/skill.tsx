/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillByAdmin,
} from '@/apis/skillAPI';
import { Skill, SkillCreateRequest, SkillUpdateRequest } from '@/types/SkillType';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function SkillPage() {
  const [skillList, setSkillList] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<SkillCreateRequest | SkillUpdateRequest>({
    name: '',
    status: 1,
  });
  const [editingId, setEditingId] = useState<number>(-1);

  const fetchSkillList = async () => {
    try {
      const response = await getSkillByAdmin();
      setSkillList(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lấy danh sách kỹ năng thất bại');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSkillList();
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEdit && editingId) {
        await updateSkill(+editingId, form as SkillUpdateRequest);
        toast.success('Cập nhật kỹ năng thành công!');
      } else {
        await createSkill(form as SkillCreateRequest);
        toast.success('Tạo kỹ năng mới thành công!');
      }
      fetchSkillList();
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể lưu kỹ năng');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSkill(+id);
      toast.success('Xóa kỹ năng thành công!');
      fetchSkillList();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa kỹ năng');
      console.error(error);
    }
  };

  const handleEdit = (skill: Skill) => {
    setIsEdit(true);
    setForm({
      name: skill.name,
      status: skill.status,
    });
    setEditingId(skill.id);
    setOpen(true);
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditingId(-1);
    setForm({ name: '', status: 1 }); // reset trạng thái về 1
  };

  // Hàm cập nhật trạng thái nhanh khi bật/tắt Switch trong bảng
  const toggleStatus = async (skill: Skill) => {
    try {
      await updateSkill(skill.id, { ...skill, status: skill.status === 1 ? 0 : 1 });
      toast.success('Cập nhật trạng thái thành công!');
      fetchSkillList();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
      console.error(error);
    }
  };

  return (
    <div className='p-6 flex gap-6 bg-[#f7f7f7] w-full'>
      <Card className='flex-1'>
        <CardHeader className='flex justify-between items-center'>
          <CardTitle>Quản lý Kĩ năng</CardTitle>
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsEdit(false)}>+ Thêm kỹ năng</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEdit ? 'Sửa kỹ năng' : 'Thêm kỹ năng'}</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <Input
                  placeholder='Tên kỹ năng'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <div className="flex items-center gap-2">
                  <span>Trạng thái:</span>
                  <Switch
                    checked={form?.status === 1}
                    onCheckedChange={(checked) => setForm({ ...form, status: checked ? 1 : 0 })}
                  />
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
                <TableHead>Tên kỹ năng</TableHead>
                <TableHead className='w-[100px] text-center'>Trạng thái</TableHead>
                <TableHead className='w-[160px]'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className='text-center'>
                    <Switch
                      checked={item.status === 1}
                      onCheckedChange={() => toggleStatus(item)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant='outline' className='mr-2' onClick={() => handleEdit(item)}>Sửa</Button>
                    <Button variant='destructive' onClick={() => handleDelete(item.id)}>Xóa</Button>
                  </TableCell>
                </TableRow>
              ))}
              {skillList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center text-gray-500'>Không có kỹ năng nào.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
