import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Upload,
  User,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  DollarSign,
  MapPin,
  FileText,
} from 'lucide-react';

interface ResumeFormData {
  resumeName: string;
  userName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  career: string;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  skills: string[];
  experience: string;
  level: string;
  desiredLevel: string;
  typeJob: string;
  district: string;
  cvFile: File | null;
}

const ResumeForm: React.FC = () => {
  const [formData, setFormData] = useState<ResumeFormData>({
    resumeName: '',
    userName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    career: '',
    expectedSalaryMin: 0,
    expectedSalaryMax: 0,
    skills: [],
    experience: '',
    level: '',
    desiredLevel: '',
    typeJob: '',
    district: '',
    cvFile: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, cvFile: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add logic to submit form data to your backend
  };

  // Sample skills data (replace with data from your backend)
  const availableSkills = [
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'React' },
    { id: '3', name: 'Node.js' },
    { id: '4', name: 'TypeScript' },
    { id: '5', name: 'Python' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Your Resume</CardTitle>
          <CardDescription>Fill in the details to build a professional resume.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Resume Name */}
            <div className="space-y-2">
              <Label htmlFor="resumeName" className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Resume Name
              </Label>
              <Input
                id="resumeName"
                name="resumeName"
                value={formData.resumeName}
                onChange={handleInputChange}
                placeholder="E.g., Software Engineer Resume"
                required
              />
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Full Name
                </Label>
                <Input
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" /> Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="E.g., 0123456789"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-5 w-5" /> Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Career Objective */}
            <div className="space-y-2">
              <Label htmlFor="career" className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" /> Career Objective
              </Label>
              <Textarea
                id="career"
                name="career"
                value={formData.career}
                onChange={handleInputChange}
                placeholder="Describe your career goals"
                rows={4}
                required
              />
            </div>

            {/* Expected Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedSalaryMin" className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Minimum Salary
                </Label>
                <Input
                  id="expectedSalaryMin"
                  name="expectedSalaryMin"
                  type="number"
                  value={formData.expectedSalaryMin}
                  onChange={handleInputChange}
                  placeholder="E.g., 10000000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedSalaryMax" className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Maximum Salary
                </Label>
                <Input
                  id="expectedSalaryMax"
                  name="expectedSalaryMax"
                  type="number"
                  value={formData.expectedSalaryMax}
                  onChange={handleInputChange}
                  placeholder="E.g., 20000000"
                  required
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" /> Skills
              </Label>
              <div className="border rounded-md p-2">
                {availableSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill.id}`}
                      checked={formData.skills.includes(skill.id)}
                      onCheckedChange={() => handleSkillsChange(skill.id)}
                    />
                    <Label htmlFor={`skill-${skill.id}`}>{skill.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Experience
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange('experience', value)}
                  value={formData.experience}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">0-1 years</SelectItem>
                    <SelectItem value="2">1-3 years</SelectItem>
                    <SelectItem value="3">3-5 years</SelectItem>
                    <SelectItem value="4">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level" className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Current Level
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange('level', value)}
                  value={formData.level}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Junior</SelectItem>
                    <SelectItem value="2">Mid-level</SelectItem>
                    <SelectItem value="3">Senior</SelectItem>
                    <SelectItem value="4">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredLevel" className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Desired Level
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange('desiredLevel', value)}
                  value={formData.desiredLevel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select desired level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Junior</SelectItem>
                    <SelectItem value="2">Mid-level</SelectItem>
                    <SelectItem value="3">Senior</SelectItem>
                    <SelectItem value="4">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeJob" className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Job Type
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange('typeJob', value)}
                  value={formData.typeJob}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Full-time</SelectItem>
                    <SelectItem value="2">Part-time</SelectItem>
                    <SelectItem value="3">Freelance</SelectItem>
                    <SelectItem value="4">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district" className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> District
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange('district', value)}
                  value={formData.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">District 1</SelectItem>
                    <SelectItem value="2">District 7</SelectItem>
                    <SelectItem value="3">Binh Thanh</SelectItem>
                    <SelectItem value="4">Tan Binh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CV Upload */}
            <div className="space-y-2">
              <Label htmlFor="cvFile" className="flex items-center gap-2">
                <Upload className="h-5 w-5" /> Upload CV
              </Label>
              <Input
                id="cvFile"
                name="cvFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              {formData.cvFile && (
                <p className="text-sm text-gray-500">Selected: {formData.cvFile.name}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Submit Resume
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResumeForm;