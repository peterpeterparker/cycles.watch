import { initJuno as initJunoLib } from '@junobuild/core';

export const initJuno = async () => {
	const SATELLITE_ID = import.meta.env.VITE_JUNO_SATELLITE_ID;

	await initJunoLib({
		satelliteId: SATELLITE_ID
	});
};
