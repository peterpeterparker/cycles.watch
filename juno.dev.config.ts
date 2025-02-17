import {defineDevConfig} from '@junobuild/config';

export default defineDevConfig(() => ({
  satellite: {
    collections: {
      datastore: [],
      storage: []
    },
    controllers: []
  }
}));
