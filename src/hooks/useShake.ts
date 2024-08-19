import { useEffect } from 'react';

export const useShake = (
  onShake: () => void,
  threshold = 15,
  timeout = 1000
) => {
  useEffect(() => {
    let lastShakeTime = 0;

    const handleShake = (event: DeviceMotionEvent) => {
      const currentTime = new Date().getTime();

      if (currentTime - lastShakeTime > timeout) {
        const { acceleration } = event;

        if (acceleration) {
          const shakeIntensity = Math.sqrt(
            acceleration.x! * acceleration.x! +
              acceleration.y! * acceleration.y! +
              acceleration.z! * acceleration.z!
          );

          if (shakeIntensity > threshold) {
            onShake();
            lastShakeTime = currentTime;
          }
        }
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleShake);
    } else {
      console.log('Oops, DeviceMotionEvent is not supported on this device.');
    }

    return () => {
      window.removeEventListener('devicemotion', handleShake);
    };
  }, [onShake, threshold, timeout]);
};
