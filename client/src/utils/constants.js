export const PLANET_DATA = {
  sun: { name: "Sun", type: "Star", mass: "1.989 × 10^30 kg", diameter: "1,392,700 km", gravity: "274 m/s²", temperature: "5,500°C", composition: "73% Hydrogen, 25% Helium", orbitalPeriod: "N/A", rotationPeriod: "25-35 days", moons: "N/A", distanceFromSun: "0 km", description: "The Sun is the star at the center of our Solar System." },
  mercury: { name: "Mercury", type: "Terrestrial Planet", mass: "3.3011 × 10^23 kg", diameter: "4,879 km", gravity: "3.7 m/s²", temperature: "-173°C to 427°C", composition: "70% metallic, 30% silicate", orbitalPeriod: "88 Earth days", rotationPeriod: "58.6 Earth days", moons: "0", distanceFromSun: "57.9 million km", description: "Mercury is the smallest and innermost planet in the Solar System." },
  venus: { name: "Venus", type: "Terrestrial Planet", mass: "4.8675 × 10^24 kg", diameter: "12,104 km", gravity: "8.87 m/s²", temperature: "462°C", composition: "CO₂ (96.5%), Nitrogen (3.5%)", orbitalPeriod: "225 Earth days", rotationPeriod: "243 Earth days", moons: "0", distanceFromSun: "108.2 million km", description: "Venus is the second planet from the Sun, named after the Roman goddess of love." },
  earth: { name: "Earth", type: "Terrestrial Planet", mass: "5.972 × 10^24 kg", diameter: "12,742 km", gravity: "9.807 m/s²", temperature: "-88°C to 58°C", composition: "Nitrogen (78%), Oxygen (21%)", orbitalPeriod: "365.25 days", rotationPeriod: "23.93 hours", moons: "1 (The Moon)", distanceFromSun: "149.6 million km", description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life." },
  mars: { name: "Mars", type: "Terrestrial Planet", mass: "6.39 × 10^23 kg", diameter: "6,779 km", gravity: "3.71 m/s²", temperature: "-143°C to 35°C", composition: "CO₂ (95%), Nitrogen (2.7%)", orbitalPeriod: "687 Earth days", rotationPeriod: "24.6 hours", moons: "2 (Phobos, Deimos)", distanceFromSun: "227.9 million km", description: "Mars is the fourth planet from the Sun, often referred to as the Red Planet." },
  jupiter: { name: "Jupiter", type: "Gas Giant", mass: "1.8982 × 10^27 kg", diameter: "139,820 km", gravity: "24.79 m/s²", temperature: "-108°C", composition: "Hydrogen (90%), Helium (10%)", orbitalPeriod: "11.86 Earth years", rotationPeriod: "9.93 hours", moons: "95", distanceFromSun: "778.5 million km", description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System." },
  saturn: { name: "Saturn", type: "Gas Giant", mass: "5.6834 × 10^26 kg", diameter: "116,460 km", gravity: "10.44 m/s²", temperature: "-139°C", composition: "Hydrogen (96%), Helium (3%)", orbitalPeriod: "29.46 Earth years", rotationPeriod: "10.7 hours", moons: "146", distanceFromSun: "1.43 billion km", description: "Saturn is the sixth planet from the Sun, best known for its prominent ring system." },
  uranus: { name: "Uranus", type: "Ice Giant", mass: "8.6810 × 10^25 kg", diameter: "50,724 km", gravity: "8.69 m/s²", temperature: "-197°C", composition: "Hydrogen (83%), Helium (15%), Methane (2%)", orbitalPeriod: "84.01 Earth years", rotationPeriod: "17.2 hours", moons: "28", distanceFromSun: "2.87 billion km", description: "Uranus is the seventh planet from the Sun with a blue-green color." },
  neptune: { name: "Neptune", type: "Ice Giant", mass: "1.02413 × 10^26 kg", diameter: "49,244 km", gravity: "11.15 m/s²", temperature: "-201°C", composition: "Hydrogen (80%), Helium (19%), Methane (1%)", orbitalPeriod: "164.8 Earth years", rotationPeriod: "16.1 hours", moons: "16", distanceFromSun: "4.5 billion km", description: "Neptune is the eighth and farthest-known planet from the Sun." }
};

export const TEXTURE_URLS = {
  sun: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/sun/2k_sun.jpg', emissive: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/sun/2k_sun.jpg' },
  mercury: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/mercury/2k_mercury.jpg', normal: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/mercury/2k_mercury_normal.jpg', roughness: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/mercury/2k_mercury_roughness.jpg' },
  venus: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/venus/2k_venus.jpg', normal: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/venus/2k_venus_normal.jpg', roughness: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/venus/2k_venus_roughness.jpg' },
  earth: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/earth/2k_earth_daymap.jpg', normal: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/earth/2k_earth_normal_map.jpg', roughness: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/earth/2k_earth_specular_map.jpg', clouds: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/earth/2k_earth_clouds.jpg', night: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/earth/2k_earth_nightmap.jpg' },
  mars: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/mars/2k_mars.jpg', normal: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/mars/2k_mars_normal.jpg', roughness: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/mars/2k_mars_roughness.jpg' },
  jupiter: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/jupiter/2k_jupiter.jpg' },
  saturn: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/saturn/2k_saturn.jpg', rings: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/saturn/2k_saturn_ring.png' },
  uranus: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/uranus/2k_uranus.jpg' },
  neptune: { diffuse: 'https://raw.githubusercontent.com/emackey/threejs-planet-textures/main/neptune/2k_neptune.jpg' }
};

export const API_ENDPOINTS = {
  spaceflightNews: { articles: 'https://api.spaceflightnewsapi.net/v4/articles' },
  ai: { chat: '/api/chat', stream: '/api/chat/stream' }
};

export const COLORS = {
  primary: '#0a0e2a',
  secondary: '#1a1f3a',
  accent: '#4a90e2',
  text: '#ffffff',
  textSecondary: '#b8c5d6',
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glow: 'rgba(74, 144, 226, 0.3)'
};

export const PLANET_CONFIG = {
  sun: { size: 6, distance: 0, rotationSpeed: 0.002, hasRings: false, hasAtmosphere: true, atmosphereColor: 0xffaa00, atmosphereScale: 1.3 },
  mercury: { size: 0.8, distance: 12, rotationSpeed: 0.01, revolutionSpeed: 0.025, hasRings: false },
  venus: { size: 1.4, distance: 18, rotationSpeed: 0.008, revolutionSpeed: 0.02, hasRings: false, hasAtmosphere: true, atmosphereColor: 0xffcc80, atmosphereScale: 1.05 },
  earth: { size: 1.6, distance: 25, rotationSpeed: 0.01, revolutionSpeed: 0.015, hasRings: false, hasAtmosphere: true, atmosphereColor: 0x87ceeb, atmosphereScale: 1.1, hasClouds: true },
  mars: { size: 1.0, distance: 32, rotationSpeed: 0.012, revolutionSpeed: 0.012, hasRings: false, hasAtmosphere: true, atmosphereColor: 0xffccaa, atmosphereScale: 1.05 },
  jupiter: { size: 4.5, distance: 45, rotationSpeed: 0.02, revolutionSpeed: 0.008, hasRings: true, ringScale: 1.8 },
  saturn: { size: 3.8, distance: 60, rotationSpeed: 0.018, revolutionSpeed: 0.006, hasRings: true, ringScale: 2.5 },
  uranus: { size: 2.8, distance: 75, rotationSpeed: 0.015, revolutionSpeed: 0.004, hasRings: true, ringScale: 1.5, tilt: Math.PI / 4 },
  neptune: { size: 2.7, distance: 85, rotationSpeed: 0.016, revolutionSpeed: 0.003, hasRings: true, ringScale: 1.3 }
};