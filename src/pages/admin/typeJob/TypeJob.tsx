/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  getTypeJobList,
  createTypeJob,
  updateTypeJob,
  deleteTypeJob,
} from '@/apis/typeJobAPI';
import { TypeJob, UpdateTypeJobRequest } from '@/types/TypeJobType';

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

export default function TypeJobPage() {
  const [typeJobs, setTypeJobs] = useState<TypeJob[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TypeJob | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    status: 1,
  });

  const fetchTypeJobs = async () => {
    try {
      const data = await getTypeJobList();
      setTypeJobs(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải danh sách loại công việc');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: '',
      status: 1,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateTypeJob(editing.id, {
          name: formData.name,
          status: formData.status,
        } as UpdateTypeJobRequest);
      } else {
        await createTypeJob(formData);
      }
      setOpen(false);
      resetForm();
      fetchTypeJobs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi lưu loại công việc');
    }
  };

  const handleEdit = (typeJob: TypeJob) => {
    setEditing(typeJob);
    setFormData({
      name: typeJob.name,
      status: typeJob.status ?? 1,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    try {
      await deleteTypeJob(id);
      fetchTypeJobs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi xóa loại công việc');
    }
  };

  const handleToggleStatus = async (typeJob: TypeJob) => {
    try {
      await updateTypeJob(typeJob.id, {
        name: typeJob.name,
        status: typeJob.status === 1 ? 0 : 1, 
      } as UpdateTypeJobRequest);
      fetchTypeJobs();
      toast.success(`Đã ${typeJob.status !== 1 ? 'HIỆN' : 'ẨN'} loại công việc "${typeJob.name}"`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  useEffect(() => {
    fetchTypeJobs();
  }, []);

  return (
    <div className="p-6 flex gap-6 w-full">
      <Card className="flex-1">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Quản lý loại công việc</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
              >
                Thêm loại công việc
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Cập nhật loại công việc' : 'Thêm loại công việc'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Tên loại công việc</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label>Trạng thái</Label>
                  <Switch
                    checked={formData.status === 1}
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

        <CardContent className="p-6 space-y-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className='w-full'>Tên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typeJobs.map((item) => (
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
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEdit(item)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {typeJobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
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
