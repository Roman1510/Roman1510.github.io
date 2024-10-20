import { Box, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const Experience = () => {
  return (
    <div>
      <Canvas>
        <OrbitControls />
        <Box />
      </Canvas>
    </div>
  );
};

export default Experience;