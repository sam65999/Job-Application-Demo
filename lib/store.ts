import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FormData {
  // Personal info
  fullName: string;
  email: string;
  phone: string;
  
  // Contact
  location: string;
  linkedIn: string;
  portfolio: string;
  
  // Experience
  currentRole: string;
  yearsOfExperience: string;
  hasExperience: boolean;
  company: string;
  
  // Resume
  resumeFile: File | null;
  resumeFileName: string;
  
  // Additional
  coverLetter: string;
  availability: string;
  salary: string;
  remote: string;
}

export interface Application {
  id: string;
  formData: Omit<FormData, 'resumeFile'>;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface FormStore {
  formData: FormData;
  currentStep: number;
  completedSteps: number[];
  savedProgress: boolean;
  autoFillCompleted: boolean;
  theme: 'light' | 'dark';
  applications: Application[];
  
  updateFormData: (data: Partial<FormData>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
  exportAsJSON: () => void;
  loadFromURL: (encodedData: string) => void;
  markStepComplete: (step: number) => void;
  saveProgress: () => void;
  setAutoFillCompleted: (completed: boolean) => void;
  autoFillFormData: (data: Partial<FormData>) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  submitApplication: () => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedIn: '',
  portfolio: '',
  currentRole: '',
  yearsOfExperience: '',
  hasExperience: false,
  company: '',
  resumeFile: null,
  resumeFileName: '',
  coverLetter: '',
  availability: 'immediately',
  salary: '',
  remote: 'hybrid',
};

// Example applications for Hiring Manager View
const exampleApplications: Application[] = [
  {
    id: 'example-1',
    formData: {
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedIn: 'linkedin.com/in/sarahjohnson',
      portfolio: 'sarahjohnson.dev',
      currentRole: 'Senior Frontend Developer',
      yearsOfExperience: '5',
      hasExperience: true,
      company: 'Tech Solutions Inc.',
      resumeFileName: 'Sarah_Johnson_Resume.pdf',
      coverLetter: 'I am excited to apply for this position. With 5 years of experience in frontend development, I have built scalable React applications and led teams of developers. I am passionate about creating intuitive user experiences and writing clean, maintainable code.',
      availability: 'in 2 weeks',
      salary: '$120,000 - $150,000',
      remote: 'remote',
    },
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'example-2',
    formData: {
      fullName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      linkedIn: 'linkedin.com/in/michaelchen',
      portfolio: '',
      currentRole: 'Full Stack Developer',
      yearsOfExperience: '3',
      hasExperience: true,
      company: 'StartupX',
      resumeFileName: 'Michael_Chen_Resume.pdf',
      coverLetter: 'As a full-stack developer with 3 years of experience, I have worked on both frontend and backend systems. I am proficient in React, Node.js, and PostgreSQL. I am eager to contribute to innovative projects and continue growing my skills.',
      availability: 'immediately',
      salary: '$90,000 - $110,000',
      remote: 'hybrid',
    },
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'reviewed',
  },
  {
    id: 'example-3',
    formData: {
      fullName: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      linkedIn: 'linkedin.com/in/emilyrodriguez',
      portfolio: 'emilyrodriguez.com',
      currentRole: 'UX Engineer',
      yearsOfExperience: '4',
      hasExperience: true,
      company: 'Design Co.',
      resumeFileName: 'Emily_Rodriguez_Resume.pdf',
      coverLetter: 'I am a UX Engineer with 4 years of experience bridging design and development. I specialize in creating accessible, performant web applications with a focus on user experience. I am passionate about building products that delight users while maintaining technical excellence.',
      availability: 'in 1 month',
      salary: '$100,000 - $130,000',
      remote: 'remote',
    },
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
];

export const useFormStore = create<FormStore>()(  
  persist(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 0,
      completedSteps: [],
      savedProgress: false,
      autoFillCompleted: false,
      theme: 'dark',
      applications: exampleApplications,
      
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: Array.from(new Set([...state.completedSteps, step])),
        })),
      
      saveProgress: () => {
        set({ savedProgress: true });
        setTimeout(() => set({ savedProgress: false }), 2000);
      },
      
      setAutoFillCompleted: (completed) => set({ autoFillCompleted: completed }),
      
      autoFillFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
          autoFillCompleted: true,
        }));
      },
      
      resetForm: () => {
        set({
          formData: initialFormData,
          currentStep: 0,
          completedSteps: [],
          autoFillCompleted: false,
        });
      },
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        }));
      },
      
      setTheme: (theme) => set({ theme }),
      
      submitApplication: () => {
        const { formData } = get();
        const newApplication: Application = {
          id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          formData: {
            ...formData,
            resumeFileName: formData.resumeFileName || 'No resume uploaded',
          },
          submittedAt: new Date().toISOString(),
          status: 'pending',
        };
        
        set((state) => ({
          applications: [newApplication, ...state.applications],
        }));
      },
      
      updateApplicationStatus: (id, status) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, status } : app
          ),
        }));
      },
      
      exportAsJSON: () => {
        const { formData } = get();
        const dataToExport = {
          ...formData,
          resumeFile: formData.resumeFile ? formData.resumeFileName : null,
          timestamp: new Date().toISOString(),
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hireflow-application-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
      },
      
      loadFromURL: (encodedData) => {
        try {
          const decodedData = JSON.parse(atob(encodedData));
          set((state) => ({
            formData: { ...state.formData, ...decodedData },
          }));
        } catch (error) {
          console.error('Failed to load data from URL:', error);
        }
      },
    }),
    {
      name: 'hireflow-storage',
      partialize: (state) => ({ 
        formData: state.formData, 
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        theme: state.theme,
        applications: state.applications,
      }),
    }
  )
);
