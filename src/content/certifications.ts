import type { Certification } from './types';
import awsProfessionalBadge from '../assets/badges/aws-saa-pro.png';
import awsAssociateBadge from '../assets/badges/aws-saa-associate.png';

// Newest first. verifyUrl and badgeImage come from the public Credly profile; Huawei HCIA is not on Credly.
const CREDLY_BADGE_ROOT = 'https://www.credly.com/badges';

export const CERTS: Certification[] = [
  {
    name: 'AWS Certified Solutions Architect – Professional',
    issuer: 'AWS',
    issued: '2025-11',
    verifyUrl: `${CREDLY_BADGE_ROOT}/5cfc35fc-8383-4e4c-bf75-fef698cecfe6`,
    badgeImage: awsProfessionalBadge,
  },
  {
    name: 'AWS Certified Solutions Architect – Associate',
    issuer: 'AWS',
    issued: '2024-12',
    verifyUrl: `${CREDLY_BADGE_ROOT}/5521815b-36e5-4b7b-88df-68a5791b095d`,
    badgeImage: awsAssociateBadge,
  },
  { name: 'Huawei HCIA-Datacom', issuer: 'Huawei', issued: '2025-06' },
];
