/* eslint-disable @typescript-eslint/no-explicit-any */
import { filterJobByMajor } from "@/apis/jobAPI";
import JobList from "@/components/elements/job/job-list/JobList";
import { JobFilterResponse } from "@/types/jobType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function SearchMajor() {
  const { majorId } = useParams<{ majorId: string }>();
  const [jobList, setJobList] = useState<JobFilterResponse[]>([]);
  const fetchJobs = async () => {
    try {
      const response = await filterJobByMajor(Number(majorId));
      setJobList(response);
    }
    catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi không xác định');
    }
  }
  useEffect(() => {
    fetchJobs();
  }, [majorId]);
  return <>
    
  </>
}