import { useEffect, useState } from 'react';
import {
  createLevel,
  updateLevel,
  deleteLevel,
  toggleLevelStatus,
  getLevelListByAdmin,
} from '@/apis/levelAPI';
import { Level, UpdateLevelRequest } from '@/types/levelType';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function LevelPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Level | null>(null);
  const [formData, setFormData] = useState<UpdateLevelRequest>({
    id: '',
    name: '',
    status: 1,
  });

  const fetchLevels = async () => {
    try {
      const data = await getLevelListByAdmin();
      setLevels(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải danh sách cấp độ');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateLevel(editing.id, {
          name: formData.name,
          status: formData.status,
        } as UpdateLevelRequest);
      } else {
        await createLevel(formData);
      }
      setOpen(false);
      resetForm();
      fetchLevels();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi lưu cấp độ');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({ id: '', name: '', status: 1 });
  };

  const handleEdit = (level: Level) => {
    setEditing(level);
    setFormData({
      id: level.id,
      name: level.name,
      status: level.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    try {
      await deleteLevel(id);
      fetchLevels();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi xóa cấp độ');
    }
  };

  const handleToggleStatus = async (level: Level) => {
    try {
      await toggleLevelStatus(level.id);
      fetchLevels();
      toast.success(`Đã ${level.status !==1 ? 'HIỆN' : 'ẨN'} cấp độ ${level.name}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  return (
    <div className='p-6 flex gap-6 bg-[#f7f7f7] w-full'>
      <Card className='flex-1'>
        <CardHeader className='flex justify-between items-center'>
          <CardTitle>Quản lý cấp độ</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
              >
                Thêm cấp độ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Cập nhật cấp độ' : 'Thêm cấp độ'}</DialogTitle>
              </DialogHeader>
              <div className='space-y-4 mt-4'>
                <div>
                  <Label htmlFor='name'>Tên cấp độ</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <Label>Trạng thái</Label>
                  <Switch
                    checked={formData.status === +1}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, status: checked ? 1 : 0 })
                    }
                  />
                </div>
                <Button onClick={handleSubmit}>
                  {editing ? 'Lưu thay đổi' : 'Tạo mới'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className='p-6 space-y-2'>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>ID</TableHead>
                <TableHead className='w-full'>Tên cấp độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className='w-[150px] text-center'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.status === 1}
                      onCheckedChange={() => handleToggleStatus(item)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='mr-2'
                        onClick={() => handleEdit(item)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDelete(item.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {levels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center text-muted-foreground'>
                    Không có dữ liệu.
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
