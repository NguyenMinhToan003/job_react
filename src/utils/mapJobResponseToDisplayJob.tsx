import { JobResponse } from "@/types/jobType";

interface DisplayJob {
  id: number;
  title: string;
  employer: string;
  location: string;
  tags: string[];
  description: string[];
}

export const mapJobResponseToDisplayJob = (job: JobResponse): DisplayJob => {
  return {
    id: job.id,
    title: job.name,
    employer: job.employer?.name || "N/A",
    location: job.locations?.[0]?.name || "Không xác định",
    tags: job.skills?.map((s) => s.name) || [],
    description: [
      `Mức lương: ${job.minSalary?.toLocaleString()} - ${job.maxSalary?.toLocaleString()} VNĐ`,
      `Số lượng tuyển: ${job.quantity}`,
      `Hạn nộp: ${new Date(job.expiredAt).toLocaleDateString("vi-VN")}`,
    ],
  };
};
