interface UserOrganization {
  organization_id: string;
  email?: string;
  name?: string;
  role_id: string;
  role?: Role;
  user_id: string;
  user?: Userv2;
  status?: string;
}

interface Role {
  id: string;
  name: string;
  organization_id: string;
}

interface Userv2 {
  id: string;
  name?: string;
  email: string;
}

interface Organization {
  id?: string;
  name: string;
  description: string;
  parent_id?: string;
  created_date?: string;
  root_id?: string;
  type?: string; // TODO: Enum child|root|partner
  metadata?: object | null; // TODO: define
  is_active?: boolean;
  children?: Organization[];
  order_by?: number;
  partner_id?: string;
}

interface Policy1 {
  id?: string;
  description: string;
  realm: string;
  scope?: string;
  action?: string;
  organization_id?: string;
}

interface Permission {
  scope: string;
  action: string;
  role_id: string;
}

interface Scope {
  resource: string;
  action: string;
  description: string;
}

interface PartnerOrganization {
  partner_id: string;
  organization_id: string;
}

interface PartnerOrganizationList {
  id?: string;
  name: string;
}
