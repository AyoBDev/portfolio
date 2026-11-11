import type { SkillGroup } from './types';

export const SKILLS: SkillGroup[] = [
  {
    name: 'Solutions',
    items: [
      'AWS solution architecture',
      'Cost estimation',
      'Technical proposals',
      'Requirements to specifications',
      'Client delivery',
    ],
  },
  {
    name: 'Cloud',
    items: [
      'AWS',
      'ECS',
      'Lambda',
      'S3',
      'KVS',
      'Rekognition',
      'IoT',
      'RDS',
      'Route 53',
      'CloudFront',
      'Bedrock',
      'Amplify',
      'SageMaker',
    ],
  },
  { name: 'IaC & delivery', items: ['Terraform', 'CloudFormation', 'Docker', 'Kubernetes', 'GitHub Actions'] },
  { name: 'Networking', items: ['TCP/IP', 'OSPF', 'VLANs', 'DNS', 'DHCP', 'SolarWinds', 'Ubiquiti', 'Cisco', 'HCIA-Datacom'] },
  { name: 'Backend', items: ['Node.js / TypeScript', 'Python', 'PostgreSQL', 'Redis'] },
];
