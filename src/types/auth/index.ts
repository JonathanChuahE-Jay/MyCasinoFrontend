export enum UserRoleEnumType {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export interface AuthUserType {
  id: string
  phone_number: string
  role: UserRoleEnumType
  credits: string
  referral_code: string
}
