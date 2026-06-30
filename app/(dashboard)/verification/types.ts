export interface VerificationStatus {
  phoneVerified:  boolean;
  idVerified:     boolean;
  idType:         string | null;
  livenessStatus: 'not_started' | 'pending' | 'approved' | 'rejected';
  overallStatus:  'unverified' | 'pending' | 'verified' | 'rejected';
  verifiedAt:     string | null;
}
