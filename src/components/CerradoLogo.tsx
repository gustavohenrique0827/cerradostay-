import React from 'react';

interface CerradoLogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export const CerradoLogo: React.FC<CerradoLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showText = true,
  className = '',
  layout = 'vertical',
}) => {
  // Height sizing for the entire logo graphic - enlarged for high visibility & brand presence
  const sizeStyles = {
    sm: 'h-14 sm:h-16',
    md: 'h-20 sm:h-24',
    lg: 'h-28 sm:h-32',
    xl: 'h-36 sm:h-44',
  };

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`} id="cerrado-brand-logo-container">
      <img
        src="/logo.svg"
        alt="Cerrado Stay - Short Season Rental"
        className={`${sizeStyles[size]} w-auto max-w-none object-contain transition-transform duration-300 hover:scale-105 drop-shadow-md`}
        id="cerrado-brand-logo-img"
      />
    </div>
  );
};
