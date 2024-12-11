export interface Admin {
  _id: string;
  email: string;
  password: string;
  name?: string;
  superAdmin?: boolean;
  status: "active" | "inactive";
  created_at?: Date;
  updated_at?: Date;
  __v: number;
}

export interface GetAdminsResponse {
  admins: Admin[];
}
