/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateInfoCandidate } from "@/apis/userAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAccount } from "@/providers/UserProvider";
import { useState } from "react";
import { toast } from "sonner";

export default function UpdateInfoCandidate() {
  const { dataUser } = useAccount();
  const [name, setName] = useState(dataUser?.name || '');
  const [phone, setPhone] = useState(dataUser?.phone || '');
  const [avatar, setAvatar] = useState<File | undefined>(undefined);

  const handleUpdateInfo = async () => {
    try {
      await updateInfoCandidate({
        name,
        phone,
        avatar: avatar
      })
      toast.success('Cập nhật thông tin thành công');
      window.location.reload();
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'An error occurred while updating information');
    }
  }
  return <>
    <Card>
      <CardContent>
        <Input
          type='text'
          placeholder='Enter your name'
          className='mb-4'
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type='text'
          placeholder='Enter your phone number'
          className='mb-4'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          type='file'
          placeholder='Upload your avatar'
          className='mb-4'
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) setAvatar(file);
          }}
          accept='image/*'
          required
        />
        <Button
          onClick={handleUpdateInfo}
        >
          Cập nhật thông tin
        </Button>
      </CardContent>
    </Card>
  </>
}