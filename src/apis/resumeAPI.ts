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
  formData.append('phone', dto.phone);
  formData.append('gender', dto.gender);
  formData.append('location', dto.location);
  formData.append('dateOfBirth', dto.dateOfBirth);
  formData.append('about', dto.about);
  formData.append('education', dto.education?.toString());
  formData.append('level', dto.level?.toString());
  formData.append('district', dto.district);
  formData.append('email', dto.email);
  formData.append('cv', dto.cv);

  formData.append('name', dto.name);
  formData.append('avatar', dto?.avatar as Blob);
  if (dto.languageResumes?.length > 0) {
    dto.languageResumes.forEach((lang, index) => {
      formData.append(`languageResumes[${index}][languageId]`, lang.languageId.toString());
      formData.append(`languageResumes[${index}][level]`, lang.level.toString());
    });
  }
  dto.skills.forEach((skill, idx) => {
    formData.append(`skills[${idx}]`, skill?.toString());
  });
  dto?.majors?.forEach((major, idx) => {
    formData.append(`majors[${idx}]`, major?.toString());
  });
  if (dto?.resumeversionExps?.length > 0) {
    dto?.resumeversionExps.forEach((exp, idx) => {
      formData.append(`resumeversionExps[${idx}][companyName]`, exp.companyName);
      formData.append(`resumeversionExps[${idx}][position]`, exp.position);
      formData.append(`resumeversionExps[${idx}][startTime]`, exp.startTime.toString());
      formData.append(`resumeversionExps[${idx}][endTime]`, exp.endTime.toString());
      formData.append(`resumeversionExps[${idx}][jobDescription]`, exp.jobDescription);
      formData.append(`resumeversionExps[${idx}][typeJobId]`, exp.typeJob.id.toString());
    });
  }
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
  formData.append('phone', dto.phone);
  formData.append('gender', dto.gender);
  formData.append('location', dto.location);
  formData.append('dateOfBirth', dto.dateOfBirth);
  formData.append('about', dto.about);
  formData.append('education', dto.education?.toString());
  formData.append('level', dto.level?.toString());
  formData.append('district', dto.district);
  formData.append('email', dto.email);
  formData.append('name', dto.name);
  formData.append('cv', dto.cv);
  formData.append('avatar', dto.avatar as Blob);
  if (dto.languageResumes?.length > 0) {
    dto.languageResumes.forEach((lang, index) => {
      formData.append(`languageResumes[${index}][languageId]`, lang.languageId.toString());
      formData.append(`languageResumes[${index}][level]`, lang.level.toString());
    });
  }
  dto.skills.forEach((skill, idx) => {
    formData.append(`skills[${idx}]`, skill?.toString());
  });
  dto?.majors?.forEach((major, idx) => {
    formData.append(`majors[${idx}]`, major?.toString());
  });
  if (dto?.resumeversionExps?.length > 0) {
    dto?.resumeversionExps.forEach((exp, idx) => {
      formData.append(`resumeversionExps[${idx}][companyName]`, exp.companyName);
      formData.append(`resumeversionExps[${idx}][position]`, exp.position);
      formData.append(`resumeversionExps[${idx}][startTime]`, exp.startTime);
      formData.append(`resumeversionExps[${idx}][endTime]`, exp.endTime);
      formData.append(`resumeversionExps[${idx}][jobDescription]`, exp.jobDescription);
      formData.append(`resumeversionExps[${idx}][typeJobId]`, exp.typeJob.id.toString());
    });
  }

  const response = await axiosInstance.post<ResumeVersion>('/resume-version/init', formData);
  return response.data;
}

export const getResumeVersionsByIdAPI = async (resumeVersionId: number) => {
  const response = await axiosInstance.get<ResumeVersion>(`/resume-version/${resumeVersionId}`);
  return response.data;
}