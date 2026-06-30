export interface Report {
  id:          string;
  reporterId:  string;
  reportedId:  string;
  reason:      string;
  description: string | null;
  status:      string;
  adminNotes:  string | null;
  createdAt:   string;
  updatedAt:   string;
  reporter: { id: string; fullName: string; email: string; phone: string };
  reported: {
    id: string; fullName: string; email: string; phone: string;
    profile: { photo: string | null; city: string | null; isVerified: boolean } | null;
  };
}
