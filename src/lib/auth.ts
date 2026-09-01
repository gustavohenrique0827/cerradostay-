
export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem('admin_authenticated') === 'true';
};

export const adminLogout = (): void => {
  localStorage.setItem('admin_authenticated', 'false');
};
