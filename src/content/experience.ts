import type { Education, Role } from './types';

// Newest first. The NOC internship overlaps the Arthurite role, hence its label.
export const ROLES: Role[] = [
  {
    org: 'Arthurite Integrated',
    title: 'Solution Engineer',
    start: '2025-03',
    end: 'present',
    points: [
      'AWS Advanced Tier Partner',
      'Terraform and CloudFormation across 20+ production client deployments',
      'dev/staging/prod environments with GitOps',
      'Provisioning time cut 50–70%',
      '20+ production chatbots on Bedrock and Lex',
      'A SageMaker MLOps pipeline for telecom fraud detection',
      'CloudWatch observability',
      '20+ technical proposals',
    ],
  },
  {
    org: 'University of Ilorin network operations centre',
    title: 'IT Network Engineer',
    label: 'Internship',
    start: '2026-03',
    end: '2026-08',
    points: [],
  },
  {
    org: 'Opsters',
    title: 'Automation Engineer',
    start: '2023-08',
    end: '2024-07',
    points: ['Remote'],
  },
  {
    org: 'Upwork',
    title: 'Top Rated automation developer',
    start: '2019-04',
    end: 'present',
    points: ['Top 3%', '30 projects', '100% Job Success'],
  },
];

export const EDUCATION: Education = {
  school: 'University of Ilorin',
  degree: 'BSc Telecommunication Science',
  grade: '4.39 / 5.0',
};
