import { getAllResumeAPI } from '@/apis/resumeAPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Resume } from '@/types/resumeType';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListResume() {
  const [listResume, setListResume] = useState<Resume[]>([]);
  const navigate = useNavigate();
  const fetchResume = async () => {
    try {
      const response = await getAllResumeAPI();
      setListResume(response);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };
  useEffect(() => {
    fetchResume();
  }, [])
  return <>
    <Card>
      <CardHeader>
        <CardTitle>HỒ SƠ XIN VIỆC</CardTitle>
      </CardHeader>
      <CardContent>
        {
          listResume.length > 0 ? (
            <ul className='space-y-4'>
              {listResume.map((resume) => (
                <li
                  onClick={() => navigate(`${resume.id}`)}
                  key={resume.id}
                  className='border p-4 rounded-md'
                >
                  <h3 className='text-lg font-semibold'>{resume.name}</h3>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>Bạn chưa có hồ sơ nào.</p>
          )
        }
      </CardContent>
    </Card>
  </>
}