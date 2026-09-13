
export const isAdminAuthenticated = (): boolean => {
  try {
    return typeof window !== 'undefined' && localStorage.getItem('admin_authenticated') === 'true';
  } catch {
    return false;
  }
};

export const adminLogout = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_authenticated', 'false');
    }
  } catch {}
};
