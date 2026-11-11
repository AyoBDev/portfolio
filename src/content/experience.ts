import type { Education, Role } from './types';
import oneWithAiStagePhoto from '../assets/photo/one-with-ai-stage.jpg';

// Newest first. The NOC internship overlaps the Arthurite role, hence its label.
export const ROLES: Role[] = [
  {
    org: 'Arthurite Integrated',
    title: 'Solution Engineer',
    start: '2025-03',
    end: 'present',
    points: [
      'AWS Advanced Tier Partner',
      'AWS architecture design for customers, with running-cost estimates',
      'Business problem statements turned into technical specifications',
      "Organised the 'ONE WITH AI: Powering Mobility & EV Ecosystems with AWS' summit (June 2026)",
      'Built and demoed eSwap OS, battery and fleet intelligence on AWS IoT Core and SageMaker',
      'Built and demoed an EV cost comparator on Amazon Bedrock and Amplify',
      'Terraform and CloudFormation across 20+ production client deployments',
      'dev/staging/prod environments with GitOps',
      'Provisioning time cut 50–70%',
      '20+ production chatbots on Bedrock and Lex',
      'A SageMaker MLOps pipeline for telecom fraud detection',
      'CloudWatch observability',
      '20+ technical proposals',
    ],
    photo: {
      src: oneWithAiStagePhoto,
      alt: 'Ayomikun on stage presenting the eSwap OS AWS architecture diagram, titled "AWS Architecture: Multi-Tenant From Day One"',
      caption: 'Presenting the multi-tenant AWS architecture of eSwap OS at ONE WITH AI, Lagos, June 2026.',
    },
  },
  {
    org: 'University of Ilorin network operations centre',
    title: 'IT Network Engineer',
    label: 'Internship',
    start: '2026-03',
    end: '2026-08',
    points: [
      'Campus-wide network for about 50,000 students and staff',
      'Network monitoring with SolarWinds',
      'Troubleshooting user and department outages',
      'VLAN, OSPF and static routing configuration',
      'Switch and Wi-Fi access point configuration, mostly Ubiquiti with some Cisco',
      'Firewall rules and ACLs',
      'IP addressing, DHCP and DNS',
      'Cabling, patch panels and termination',
      'Network documentation and diagrams',
    ],
  },
  {
    org: 'Opsters',
    title: 'Business Automation Engineer',
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
  startYear: '2022',
  endYear: '2026',
  grade: '4.39 / 5.0',
  // From the resume's "Education and Leadership" section.
  activities: [
    {
      role: 'TIC 2.0 Technical Lead',
      group: 'NATECSS student association',
      result:
        'Led the Technology Innovation Challenge technical team from pre-event preparation through Expo Day to the Grand Finale for five finalist teams.',
    },
    {
      role: 'Team Lead and Huawei Ambassador',
      group: 'Huawei Student Club',
      result: 'Led the club, which was recognised as one of the best Huawei student clubs in 2026.',
    },
  ],
};
