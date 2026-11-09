import { SITE } from '../config/site';
import type { SectionId } from './types';

// Every user-facing string lives here so it can be edited without touching components.
// Name, title, email and links come from SITE and are not repeated.
export type FocusId = 'cloud' | 'systems' | 'platform' | 'backend';
export type ProofId = 'production' | 'certs' | 'incidents' | 'code';
export type DiagramNodeId =
  | 'camera'
  | 'edge'
  | 'kvs'
  | 'storage'
  | 'rekognition'
  | 'lambda'
  | 'ses'
  | 'dashboard';

export const COPY = {
  seo: {
    description: `${SITE.name} is a remote Systems and Cloud Engineer building reliable AWS and Linux infrastructure.`,
  },

  hero: {
    headline: 'I design and run the infrastructure behind real products.',
    credentialLine:
      'AWS Solutions Architect – Professional · Solution Engineer at an AWS Advanced Tier Partner',
    certBadgeLabel: 'Certified',
    intro: `${SITE.name} is a ${SITE.title}. Two products shipped solo, three AWS and Huawei certifications, and I work ${SITE.location.toLowerCase()}.`,
  },

  bands: {
    hero: 'HIRING? GOOD TIMING!',
    'olympus-vision': 'CAMERAS, MEET THE CLOUD!',
    careomni: 'PAPER TIMESHEETS… RETIRED!',
    projects: 'SIDE QUESTS, FULLY SHIPPED',
    experience: 'REAL JOBS, REAL UPTIME',
    certifications: 'THE PAPER TRAIL… VERIFIED!',
    skills: 'THE TOOLBOX, NO PERCENTAGE BARS',
    writing: 'I ALSO WRITE THINGS!',
    contact: 'YOUR MOVE. EMAIL ME!',
  } satisfies Record<SectionId, string>,

  buttons: {
    start: 'Show me why (30 sec)',
    skip: 'Skip, show me everything',
    email: 'Email me',
    copyEmail: 'Copy email',
    copied: 'Copied',
    copyFallbackMac: 'Press ⌘+C to copy',
    copyFallbackOther: 'Press Ctrl+C to copy',
    stickyEmail: 'Email Ayomikun',
    back: 'Back',
    startOver: 'Start over',
  },

  quiz: {
    focus: {
      question: 'What are you hiring for?',
      options: {
        cloud: 'Cloud infrastructure',
        systems: 'Systems & networking',
        platform: 'Platform / DevOps',
        backend: 'Backend',
      } satisfies Record<FocusId, string>,
    },
    proof: {
      question: 'What would convince you?',
      options: {
        production: "Production systems I've shipped",
        certs: 'Certifications',
        incidents: 'How I handle incidents',
        code: 'The code',
      } satisfies Record<ProofId, string>,
    },
    resultTitle: "Here's your match",
    matchTag: 'Matches what you asked',
  },

  // The result pitch is one focus line plus one proof line.
  pitch: {
    focus: {
      cloud:
        'I run AWS infrastructure as code: Terraform and CloudFormation across 20+ production client deployments, and a full camera-to-cloud platform on ECS Fargate, S3, Kinesis Video Streams and Rekognition.',
      systems:
        'I have a BSc in Telecommunication Science, I know TCP/IP, OSPF and DNS, and I worked in the University of Ilorin network operations centre as an IT Network Engineer intern.',
      platform:
        'I build the delivery side too: dev, staging and prod environments with GitOps, Terraform modules, GitHub Actions and CloudWatch observability.',
      backend:
        'I build backends in Node.js and TypeScript on PostgreSQL and Redis, including a multi-tenant Fastify API on ECS Fargate and a payroll platform I built solo.',
    } satisfies Record<FocusId, string>,
    proof: {
      production:
        'Both of my flagship products are sole-builder production systems: Olympus Vision on AWS, and CareOmni, which runs inside a live agency with 227 clients, 194 caregivers and 470 active shifts.',
      certs:
        'I hold AWS Certified Solutions Architect – Professional and Associate, plus Huawei HCIA-Datacom.',
      incidents:
        'When an AWS account move took down my API with a DNS failure, I fixed it and then codified the DNS, certificate and HTTPS listener in Terraform so it cannot happen the same way again.',
      code: 'The Olympus Vision repo is public, with 32 Terraform files split into modules and tests for the Lambda pipelines.',
    } satisfies Record<ProofId, string>,
  },

  mascot: {
    intro: "Hey! Hiring for cloud? Let me show you what I've built.",
    focus: 'Two quick questions and I will line up the right proof.',
    proof: 'Nearly there. What would make you pick up the phone?',
    result: 'That is your match. The rest of the page is right below.',
    contact: 'Want to talk? Email is the fastest way.',
  },

  diagram: {
    camera: 'An ordinary IP camera that streams video over RTSP. No on-site NVR or DVR needed.',
    edge: 'A Raspberry Pi or any Linux edge device pulls the RTSP stream and authenticates with a per-camera AWS IoT X.509 certificate. A process manager runs several cameras at once.',
    kvs: 'Kinesis Video Streams receives the video from the edge device and serves HLS live view through 15-minute signed URLs.',
    storage: 'Recordings land in S3 and move to Glacier after 30 days.',
    rekognition:
      'Rekognition runs face recognition, with a separate collection for each organization.',
    lambda:
      'Lambda pipelines (face-recognition and recording-archiver) process faces and archive recordings.',
    ses: 'SES emails an alert when an unknown face is seen.',
    dashboard:
      'The multi-tenant Fastify API on ECS Fargate serves the dashboard, with RS256 JWT roles for Super Admin, Org Admin and Viewer.',
  } satisfies Record<DiagramNodeId, string>,

  incident: {
    question:
      'api.olympusvisions.com returns NXDOMAIN after an AWS account move. What do you check first?',
    options: [
      { id: 'dns', label: "DNS records in the new account's Route 53", correct: true },
      { id: 'restart', label: 'Restart the ECS service', correct: false },
      { id: 'rollback', label: 'Roll back the last deploy', correct: false },
    ],
    fix: "The DNS record had been created by hand, outside Terraform, and the load balancer had no HTTPS listener either. I codified the ACM certificate, the 443 listener, the 80 to 443 redirect and the Route 53 alias in Terraform. The next account move can't repeat the outage.",
  },

  writing: {
    moreLink: 'More on Medium',
    readArticle: 'Read on Medium',
  },

  featured: {
    labels: {
      problem: 'The problem',
      built: 'What I built',
      proof: 'Engineering proof',
      stack: 'Stack',
      repo: 'Code on GitHub',
      stats: 'In production',
    },
  },

  // Illustrative dashboard cutouts. Every name and ID here is made up.
  cutouts: {
    olympus: {
      label: 'Illustration of the Olympus Vision dashboard with three live camera tiles',
      tabs: ['Cameras', 'Recordings', 'Alerts'],
      live: 'Live',
      cameras: ['Front door', 'Parking lot', 'Back entrance'],
    },
    careomni: {
      label: 'Illustration of the CareOmni dashboard with made-up sample visits',
      tabs: ['Dashboard', 'Clients', 'Shifts'],
      visitsTitle: "Today's visits",
      visits: [
        { name: 'Jane Doe', id: 'MED-000123', time: '9:00 to 13:00' },
        { name: 'John Smith', id: 'MED-000124', time: '14:00 to 18:00' },
      ],
    },
  },

  projects: {
    repoLink: 'View code',
  },

  experience: {
    present: 'Present',
    educationHeading: 'Education',
  },

  certifications: {
    issued: 'Issued',
    verify: 'Verify',
  },

  contact: {
    linksHeading: 'Elsewhere',
    links: {
      github: 'GitHub',
      linkedin: 'LinkedIn',
      upwork: 'Upwork',
      medium: 'Medium',
    },
  },
};
