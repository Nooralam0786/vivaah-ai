export interface Transaction {
  id:                string;
  userId:            string;
  userName:          string;
  userEmail:         string;
  userPhone:         string;
  userPhoto:         string | null;
  userCity:          string | null;
  tier:              string;
  status:            string;
  amount:            number;
  razorpayOrderId:   string | null;
  razorpayPaymentId: string | null;
  startedAt:         string | null;
  expiresAt:         string | null;
  createdAt:         string;
}
