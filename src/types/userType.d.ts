export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  password_hash: string;
  db_active: Boolean;
}
