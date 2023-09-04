import {initOrbiter} from '@junobuild/analytics';
import {initJuno as initJunoLib} from '@junobuild/core';

export const initJuno = async () => {
  const SATELLITE_ID = import.meta.env.VITE_JUNO_SATELLITE_ID;

  await initJunoLib({
    satelliteId: SATELLITE_ID
  });
};

export const initAnalytics = async () => {
  const DEV = import.meta.env.DEV;

  if (DEV) {
    return;
  }

  const SATELLITE_ID = import.meta.env.VITE_JUNO_SATELLITE_ID;
  const ORBITER_ID = import.meta.env.VITE_JUNO_ORBITER_ID;

  await initOrbiter({
    satelliteId: SATELLITE_ID,
    orbiterId: ORBITER_ID
  });
};
