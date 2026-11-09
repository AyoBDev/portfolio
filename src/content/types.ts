// Content shapes. Task 2 adds the remaining types alongside Certification.
export type Certification = {
  name: string;
  issuer: 'AWS' | 'Huawei';
  /** Issue month, formatted YYYY-MM. */
  issued: string;
  verifyUrl?: string;
  badgeImage?: string;
};
