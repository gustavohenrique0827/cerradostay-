/**
 * Mobile-safe external URL opener (prevents Android Chrome popup blocker from suppressing WhatsApp links)
 */
export function openExternalUrl(url: string, newTab: boolean = true): void {
  if (typeof window === 'undefined' || !url) return;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // On mobile Android/iOS, creating a virtual link or direct navigation triggers app schemes seamlessly
  if (isMobile) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 100);
  } else {
    window.open(url, newTab ? '_blank' : '_self', 'noopener,noreferrer');
  }
}
