import type { FeaturedProject, ProjectCard } from './types';

const GITHUB_ROOT = 'https://github.com/AyoBDev';

export const FEATURED: FeaturedProject[] = [
  {
    id: 'olympus-vision',
    name: 'Olympus Vision',
    tagline: 'CCTV cloud storage: ordinary IP cameras, straight to the cloud',
    problem:
      'Ordinary IP cameras normally need an on-site NVR/DVR. Olympus Vision connects them straight to the cloud.',
    built: [
      'A Raspberry Pi or any Linux edge device pulls RTSP and authenticates with a per-camera AWS IoT X.509 certificate, then streams to Kinesis Video Streams',
      'A multi-camera process manager handles several cameras at once',
      'Multi-tenant Fastify (TypeScript) API on ECS Fargate behind an ALB, with PostgreSQL (RDS) and Redis',
      'HLS live view through 15-minute signed URLs',
      'Recordings in S3, moving to Glacier after 30 days',
      'Rekognition face recognition with per-org collections',
      'Lambda pipelines (face-recognition, recording-archiver) and SES alerts for unknown faces',
      'RS256 JWT with Super Admin, Org Admin and Viewer roles',
    ],
    proof: [
      'Sole builder, 150 commits, Mar–Aug 2026',
      'Terraform infrastructure as code: 32 files, split into modules',
      'Staging and production environments, with a CI/CD guide',
      'Fixed a DNS and HTTPS outage after an AWS account move, and codified the fix in Terraform',
    ],
    stackLabel: 'Built with',
    stack: [
      'AWS IoT',
      'Kinesis Video Streams',
      'S3 / Glacier',
      'Rekognition',
      'Lambda',
      'SES',
      'ECS Fargate',
      'RDS PostgreSQL',
      'Redis',
      'Fastify',
      'TypeScript',
      'Terraform',
    ],
    repo: { url: `${GITHUB_ROOT}/cctv-cloud-storage` },
    liveUrl: 'https://www.olympusvisions.com/',
    // Cut from the original recording to remove a section where people's faces are visible.
    demoVideo: {
      src: '/media/olympus-demo.mp4',
      poster: '/media/olympus-demo-poster.jpg',
      captions: '/media/olympus-demo.en.vtt',
      width: 464,
      height: 832,
      caption:
        'Recorded demo: an ordinary IP camera and a Raspberry Pi, with no NVR, streaming to the live dashboard.',
    },
  },
  {
    id: 'careomni',
    name: 'CareOmni',
    tagline: 'An operations platform for personal care agencies',
    problem:
      'Agencies run on paper timesheets, spreadsheets and phone calls, and payroll from electronic visit records is error-prone.',
    built: [
      'Client authorizations and certification tracking',
      'Weekly timesheets with digital signatures',
      'Payroll import from EVV files, with split-row merging, time rules, unit calculation, overlap detection, and daily and authorization caps',
      'A scheduling calendar with checks against double-booking',
      'A caregiver self-service app',
      'A file manager and fillable PDF editor',
      'Real-time messaging',
      'Client referral tracking',
      'Permission groups',
      'Multi-tenancy groundwork',
    ],
    proof: [
      'Sole builder, about 3,800 commits, Feb–Oct 2026',
      'Running inside a live PCA agency with 227 clients, 194 caregivers and 470 active shifts',
      'Payroll processing time cut by 70%',
      'Migrated SQLite to PostgreSQL',
      'An append-only audit log enforced by database permissions',
      'An encryption service',
      'About 180 test files',
      'Background jobs and workers',
      'An adopt-vs-build decision log',
    ],
    stackLabel: 'Architecture',
    stack: ['PostgreSQL', 'Background workers', 'Encryption service', 'Audit log', 'Automated tests'],
    repo: { private: true, note: 'Private repo · walkthrough on request' },
    demoLoginSubject: 'CareOmni demo login',
    // From the CareOmni pitch deck (clients, caregivers, shifts) and LinkedIn (payroll).
    stats: [
      { value: '227', label: 'clients' },
      { value: '194', label: 'caregivers' },
      { value: '470', label: 'active shifts' },
      { value: '70%', label: 'less payroll time' },
    ],
  },
];

export const MORE_PROJECTS: ProjectCard[] = [
  {
    name: 'UniIlorin Carpooling',
    summary: 'A serverless Node.js backend for carpooling, backed by DynamoDB and Redis.',
    tags: ['Node.js', 'Serverless', 'DynamoDB', 'Redis'],
    repoUrl: `${GITHUB_ROOT}/unilorin-carpooling`,
  },
  {
    name: 'ESL Inventory Sync',
    summary:
      'Middleware that syncs a legacy POS (.dbf) with electronic shelf labels, with incremental sync, atomic writes and retry with backoff.',
    tags: ['Middleware', 'Sync', 'Retry with backoff'],
    repoUrl: `${GITHUB_ROOT}/ESL-Inventory-Synchronization-Middleware`,
  },
  {
    name: 'SabiWork',
    summary:
      "Squad Hackathon 3.0 project, 196 commits in one week: AI job matching and payments for Nigeria's informal economy.",
    tags: ['Hackathon', 'AI', 'Payments'],
    repoUrl: `${GITHUB_ROOT}/SabiWork`,
  },
];
