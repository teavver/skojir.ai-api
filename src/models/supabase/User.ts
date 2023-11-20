export interface User {
  id: number;
  created_at: Date;
  email: string;
  password: string;
  membership: boolean;
  membership_end?: Date;
}