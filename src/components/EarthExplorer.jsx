import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Globe from 'react-globe.gl';
import CountryInfoCard from './CountryInfoCard';

const COUNTRY_DATA = {
  'United States': { capital: 'Washington, D.C.', population: '334.8M', area: '9.83M km²' },
  'China': { capital: 'Beijing', population: '1.41B', area: '9.60M km²' },
  'India': { capital: 'New Delhi', population: '1.43B', area: '3.29M km²' },
  'United Kingdom': { capital: 'London', population: '68M', area: '243K km²' },
  'Germany': { capital: 'Berlin', population: '83M', area: '357K km²' },
  'France': { capital: 'Paris', population: '68M', area: '551K km²' },
  'Japan': { capital: 'Tokyo', population: '126M', area: '377K km²' },
  'Brazil': { capital: 'Brasília', population: '216M', area: '8.51M km²' }
};

const EarthExplorer = () => {
  const globeRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryClick = (feature) => {
    const countryName = feature?.properties?.name;
    setSelectedCountry({
      name: countryName,
      ...(COUNTRY_DATA[countryName] || {})
    });
    if (feature?.geometry?.coordinates) {
      const [lng, lat] = feature.geometry.coordinates[0][0][0];
      globeRef.current?.pointOfView({ lat, lng, altitude: 1.5 });
    }
  };

  return (
    <div className="w-full h-screen relative">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe@2.24.7/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe@2.24.7/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe@2.24.7/example/img/night-sky.png"
        polygonsData="https://raw.githubusercontent.com/topojson/world-atlas/master/countries/10m.json"
        polygonAltitude={0.01}
        polygonCapColor={() => 'rgba(200, 200, 200, 0.1)'}
        polygonSideColor={() => 'rgba(100, 100, 100, 0.1)'}
        onPolygonClick={handleCountryClick}
        height={1000}
        width={1000}
        atmosphereAltitude={0.25}
        atmosphereColor="rgba(135, 206, 235, 0.3)"
      />
      {selectedCountry && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <CountryInfoCard country={selectedCountry} onClose={() => setSelectedCountry(null)} />
        </div>
      )}
      <motion.div className="absolute bottom-8 left-8 text-white/60 text-sm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}>
        <p>Click on any country to explore</p>
      </motion.div>
      {selectedCountry && (
        <motion.button className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10" onClick={() => setSelectedCountry(null)} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
          <span className="text-xl">×</span>
        </motion.button>
      )}
    </div>
  );
};

export default EarthExplorer;