import { PropsWithChildren, useState } from 'react';
import { useShake } from '@/hooks/useShake';

export const MobileWrapper = ({ children }: PropsWithChildren) => {
  const [isMatrixFont, setIsMatrixFont] = useState(true);

  const handleShake = () => {
    setIsMatrixFont((prev) => !prev);
  };

  useShake(handleShake);

  return (
    <div
      className="mobile-container"
      style={{
        fontFamily: isMatrixFont
          ? 'MatrixCode, sans-serif'
          : 'Comic Neue, sans-serif',
      }}
    >
      {children}
    </div>
  );
};
