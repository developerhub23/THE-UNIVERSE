import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { TEXTURE_URLS } from '../utils/constants';

export const usePlanetTextures = (planetName) => {
  const [textures, setTextures] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const loaded = {};
      const config = TEXTURE_URLS[planetName];
      if (!config) { setLoading(false); return; }
      try {
        for (const [type, url] of Object.entries(config)) {
          if (url) {
            const texture = await new THREE.TextureLoader().loadAsync(url);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearFilter;
            loaded[type] = texture;
          }
        }
      } catch (e) {
        console.warn(`Failed to load textures for ${planetName}:`, e);
      } finally {
        setTextures(loaded);
        setLoading(false);
      }
    };
    load();
  }, [planetName]);

  return { textures, loading };
};