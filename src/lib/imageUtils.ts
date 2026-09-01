export const getOptimizedImageUrl = (url: string, width: number = 400) => {
  if (!url || typeof url !== 'string' || !url.includes('supabase.co')) return url;
  // If already has query params, append, otherwise add
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}&format=webp`;
};
