export type Role = 'candidate' | 'company' | 'university' | 'admin';
export type Status = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  entityId: string;
  name: string;
}
export interface Skill {
  name: string;
  score?: number;
  date?: string;
  summary?: string;
  simulated?: boolean;
}
export interface Candidate {
  id: string;
  name: string;
  location: string;
  universityId: string;
  track: string;
  bio: string;
  education: string;
  experience: string;
  projects: string;
  skills: Skill[];
}
export interface Company {
  id: string;
  name: string;
  location: string;
  description: string;
  website: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
}
export interface Institution {
  id: string;
  name: string;
  location: string;
}
export interface JobSkill {
  name: string;
  must: boolean;
  weight: number;
  minimum: number;
}
export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  mode: string;
  type: string;
  experience: string;
  salary: string;
  skills: JobSkill[];
  published: boolean;
}
export interface Interview {
  date: string;
  response: 'Pending' | 'Accepted' | 'Declined' | 'Reschedule requested';
  note: string;
}
export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: Status;
  letter: string;
  date: string;
  fairId?: string;
  interview?: Interview;
}
export interface Fair {
  id: string;
  universityId: string;
  name: string;
  date: string;
  location: string;
  description: string;
  companies: { companyId: string; jobIds: string[] }[];
}
export interface FairRegistration {
  id: string;
  candidateId: string;
  fairId: string;
  studentId: string;
}
export interface Notification {
  id: string;
  userId: string;
  text: string;
  date: string;
  read: boolean;
}
export interface AssessmentQuestion {
  id: string;
  skill: string;
  type: 'mcq' | 'open';
  prompt: string;
  options?: string[];
}
export interface QuestionResponse {
  questionId: string;
  answer: string;
  status: 'answered' | 'timed-out';
}
export interface AssessmentResult {
  responses?: QuestionResponse[];
  id: string;
  candidateId: string;
  skill: string;
  score: number;
  date: string;
  simulated: true;
  strengths: string;
  weaknesses: string;
  explanations: string[];
}
export interface AssessmentAttempt {
  responses?: QuestionResponse[];
  candidateId: string;
  difficulty: string;
  questions: AssessmentQuestion[];
  answers: string[];
  index: number;
  deadline: number;
}
export interface DemoState {
  version: number;
  users: User[];
  candidates: Candidate[];
  companies: Company[];
  universities: Institution[];
  jobs: Job[];
  applications: Application[];
  fairs: Fair[];
  registrations: FairRegistration[];
  notifications: Notification[];
  results: AssessmentResult[];
  trackWeights: Record<string, Record<string, number>>;
}

export type CandidateSkill = Skill;
export type CareerTrackWeights = Record<string, Record<string, number>>;
