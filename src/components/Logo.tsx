import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 48,
  className = ''
}) => {
  return (
    <img
      src="/logo.png"
      alt="Attune logo"
      width={size}
      height={size}
      className={className}
      style={{ 
        borderRadius: '50%',
        objectFit: 'cover',
        objectPosition: 'center',
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)'
      }}
    />
  );
};

export default Logo;
