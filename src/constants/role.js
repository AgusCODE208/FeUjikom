export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  KASIR: 'kasir',
  OWNER: 'owner'
};

export const ROLE_LABELS = {
  [ROLES.USER]: 'Customer',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.KASIR]: 'Kasir',
  [ROLES.OWNER]: 'Owner'
};

export const ROLE_ROUTES = {
  [ROLES.USER]: '/user/dashboard',
  [ROLES.ADMIN]: '/admin',
  [ROLES.KASIR]: '/kasir',
  [ROLES.OWNER]: '/owner'
};
