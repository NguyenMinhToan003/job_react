import { CreateResumeVersionDto, Resume, ResumeVersion } from "@/types/resumeType";
import { axiosInstance } from "./index"

export const getAllResumeAPI = async () => {
  const response = await axiosInstance.get<Resume[]>('/resume/me');
  return response.data;
}
export const viewResumeAPI = async (resumeId: number) => {
  const response = await axiosInstance.get<ResumeVersion>(`/resume-version/view/${resumeId}`);
  return response.data;
}

export const initResumeAPI = async (dto: CreateResumeVersionDto) => {
  const response = await axiosInstance.post<ResumeVersion>('/resume-version/init', dto);
  return response.data;
}
export const updateResumeAPI = async (resumeId: number, dto: CreateResumeVersionDto) => {
  const formData = new FormData();
  formData.append('username', dto.username);

  formData.append('gender', dto.gender);
  formData.append('location', dto.location);
  formData.append('dateOfBirth', dto.dateOfBirth);
  formData.append('about', dto.about);
  formData.append('experience', dto.experienceId?.toString() || '');
  formData.append('education', dto.education?.toString());
  formData.append('level', dto.level?.toString());
  formData.append('district', dto.district);

  formData.append('cv', dto.cv ? dto.cv : '');

  formData.append('name', dto.name);
  formData.append('avatar', dto?.avatar as Blob);
  if (dto.languageResumes?.length > 0) {
    dto.languageResumes.forEach((lang, index) => {
      formData.append(`languageResumes[${index}][languageId]`, lang.languageId.toString());
    });
  }
  formData.append('expectedSalary', dto?.expectedSalary?.toString());
  formData.append('typeJobId', dto.typeJobId?.toString());
  dto.skills.forEach((skill, idx) => {
    formData.append(`skills[${idx}]`, skill?.toString());
  });
  dto?.majors?.forEach((major, idx) => {
    formData.append(`majors[${idx}]`, major?.toString());
  });
  const response = await axiosInstance.patch<ResumeVersion>(`/resume-version/${resumeId}`, formData);
  return response.data;
}
export const deleteResumeAPI = async (resumeId: number) => {
  const response = await axiosInstance.delete(`/resume/${resumeId}`);
  return response.data;
}
export const createResumeAPI = async (dto: CreateResumeVersionDto) => {
  const formData = new FormData();

  formData.append('username', dto.username);

  formData.append('gender', dto.gender);
  formData.append('location', dto.location);
  formData.append('dateOfBirth', dto.dateOfBirth);
  formData.append('education', dto.education?.toString());
  formData.append('level', dto.level?.toString());
  formData.append('about', dto.about);
  formData.append('district', dto.district);
  formData.append('name', dto.name);
  formData.append('cv', dto.cv ? dto.cv : '');
  formData.append('avatar', dto.avatar as Blob);
  formData.append('experience', dto.experienceId.toString());
  formData.append('expectedSalary', dto.expectedSalary.toString());
  formData.append('typeJobId', dto.typeJobId?.toString());
  if (dto.languageResumes?.length > 0) {
    dto.languageResumes.forEach((lang, index) => {
      formData.append(`languageResumes[${index}][languageId]`, lang.languageId.toString());
    });
  }
  dto.skills.forEach((skill, idx) => {
    formData.append(`skills[${idx}]`, skill?.toString());
  });
  dto?.majors?.forEach((major, idx) => {
    formData.append(`majors[${idx}]`, major?.toString());
  });

  const response = await axiosInstance.post<ResumeVersion>('/resume-version/init', formData);
  return response.data;
}

export const getResumeVersionsByIdAPI = async (resumeVersionId: number) => {
  const response = await axiosInstance.get<ResumeVersion>(`/resume-version/${resumeVersionId}`);
  return response.data;
}

export const toggleDefaultResumeAPI = async (resumeId: number) => {
  const response = await axiosInstance.post(`/resume/toggle-default/${resumeId}`);
  return response.data;
}

export const searchResumeCandidateAPI = async (query: {
  search?: string;
  skills?: number[];
  levels?: number[];
  page?: number;
  limit?: number;
}| null ) => {
  const response = await axiosInstance.post<{ items: ResumeVersion[]; total: number; totalPages: number }>(
    '/resume-version/search',
    query
  );
  return response.data;
}

export const uploadNewCVAPI = async (resumeId: number, file: File) => {
  const formData = new FormData();
  formData.append('cv', file);
  const response = await axiosInstance.patch<ResumeVersion>(`/resume-version/upload-new-cv/${resumeId}`, formData);
  return response.data;
}