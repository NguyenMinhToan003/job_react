import { useAccount } from '@/providers/userProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginSuccess() {
  const { updateDataUser } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    updateDataUser();
  }, []);
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'CANDIDATE') {
      navigate('/');
    } else if (role === 'EMPLOYER') {
      navigate('/nha-tuyen-dung');
    } else {
      navigate('/');
    }
  }, [navigate]);
  return <></>
}