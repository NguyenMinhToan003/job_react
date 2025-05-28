import { registerCandidate } from '@/apis/userAPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterCandidate() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleRegister = async () => {
    try {
      await registerCandidate({
        name,
        email,
        password,
      })
      toast.success('Tạo tài khoản thành công, vui lòng đăng nhập');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toast.error(error?.response?.data?.message || 'An error occurred while registering');
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
      type='email'
      placeholder='Enter your email'
          className='mb-4'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
      required
    />
    <Input
      type='password'
      placeholder='Enter your password'
          className='mb-4'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
      required
    />
        <Button
          onClick={handleRegister}
        >
      Register
    </Button>
      </CardContent>
    </Card>
  </>
}