import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANET_DATA, PLANET_CONFIG, TEXTURE_URLS } from '../utils/constants';
import PlanetInfoPanel from './PlanetInfoPanel';

const Planet = ({ name, position, onClick, isSelected, textures = {} }) => {
  const meshRef = useRef();
  const config = PLANET_CONFIG[name] || {};

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += config.rotationSpeed * delta * 100 || 0;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(name);
  };

  const getColor = () => {
    const colors = { sun: 0xffaa00, mercury: 0xaaaaaa, venus: 0xffd700, earth: 0x1da1f2, mars: 0xc1440e, jupiter: 0xe67e22, saturn: 0xf7d358, uranus: 0xaed6f1, neptune: 0x546de5 };
    return colors[name] || 0xffffff;
  };

  return (
    <group position={position} onClick={handleClick}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[config.size || 1, 64, 64]} />
        <meshStandardMaterial
          color={getColor()}
          map={textures.diffuse}
          normalMap={textures.normal}
          roughnessMap={textures.roughness}
          emissive={name === 'sun' ? 0xffaa00 : 0x000000}
          emissiveIntensity={name === 'sun' ? 0.8 : 0}
          metalness={name === 'sun' ? 0.2 : 0.1}
          roughness={name === 'sun' ? 0.8 : 0.7}
        />
      </mesh>
      {config.hasAtmosphere && name !== 'sun' && (
        <mesh>
          <sphereGeometry args={[(config.size || 1) * (config.atmosphereScale || 1.1), 64, 64]} />
          <meshBasicMaterial color={config.atmosphereColor || 0x87ceeb} transparent opacity={0.2} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {name === 'sun' && (
        <mesh>
          <sphereGeometry args={[(config.size || 1) * (config.atmosphereScale || 1.3), 64, 64]} />
          <meshBasicMaterial color={0xffaa00} transparent opacity={0.3} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {config.hasRings && textures.rings && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[(config.size || 1) * 1.4, (config.size || 1) * (config.ringScale || 2), 128]} />
          <meshBasicMaterial map={textures.rings} transparent side={THREE.DoubleSide} />
        </mesh>
      )}
      {name === 'earth' && textures.clouds && (
        <mesh>
          <sphereGeometry args={[(config.size || 1) * 1.05, 64, 64]} />
          <meshBasicMaterial map={textures.clouds} transparent opacity={0.3} />
        </mesh>
      )}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[(config.size || 1) * 1.2, 32, 32]} />
          <meshBasicMaterial color={0x4a90e2} transparent opacity={0.3} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
};

const OrbitalRing = ({ radius, color = 0x333366 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[radius - 0.2, radius + 0.2, 128]} />
    <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
  </mesh>
);

const SolarSystemScene = ({ selectedPlanet, onPlanetSelect }) => {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef();
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const [planetTextures, setPlanetTextures] = useState({});

  useEffect(() => {
    const loadAllTextures = async () => {
      const loaded = {};
      for (const [name, urls] of Object.entries(TEXTURE_URLS)) {
        loaded[name] = {};
        try {
          for (const [type, url] of Object.entries(urls)) {
            if (url) {
              const texture = await new THREE.TextureLoader().loadAsync(url);
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
              texture.minFilter = THREE.LinearFilter;
              loaded[name][type] = texture;
            }
          }
        } catch (e) {
          console.warn(`Failed to load textures for ${name}:`, e);
        }
      }
      setPlanetTextures(loaded);
      setTexturesLoaded(true);
    };
    loadAllTextures();
  }, [gl]);

  useFrame((state, delta) => {
    if (controlsRef.current) controlsRef.current.update();
  });

  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(100, 50, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x000000, 0.3);
    scene.add(hemiLight);
    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      scene.remove(hemiLight);
    };
  }, [scene]);

  if (!texturesLoaded) return <Html center><div className="text-white text-xl">Loading Planet Textures...</div></Html>;

  return (
    <>
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} enablePan={false} minDistance={5} maxDistance={200} maxPolarAngle={Math.PI / 2 - 0.1} />
      <Stars radius={500} count={5000} />
      <Planet name="sun" position={[0, 0, 0]} onClick={onPlanetSelect} isSelected={selectedPlanet === 'sun'} textures={planetTextures.sun} />
      {Object.entries(PLANET_CONFIG).map(([name, config]) => {
        if (name === 'sun') return null;
        const angle = Math.random() * Math.PI * 2;
        const x = config.distance * Math.cos(angle);
        const z = config.distance * Math.sin(angle);
        return (
          <group key={name}>
            <Planet name={name} position={[x, 0, z]} onClick={onPlanetSelect} isSelected={selectedPlanet === name} textures={planetTextures[name]} />
            <OrbitalRing radius={config.distance} />
          </group>
        );
      })}
      <AnimatePresence>
        {selectedPlanet && (
          <Html center>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 w-96">
              <PlanetInfoPanel planet={PLANET_DATA[selectedPlanet]} onClose={() => onPlanetSelect(null)} />
            </motion.div>
          </Html>
        )}
      </AnimatePresence>
    </>
  );
};

const SolarSystem = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 20, 80], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <SolarSystemScene selectedPlanet={selectedPlanet} onPlanetSelect={setSelectedPlanet} />
      </Canvas>
      {selectedPlanet && (
        <motion.button className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10" onClick={() => setSelectedPlanet(null)} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
          <span className="text-xl">×</span>
        </motion.button>
      )}
    </div>
  );
};

export default SolarSystem;