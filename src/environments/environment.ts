// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { AppEnvironment } from '../custom-types';

export const environment: AppEnvironment = {
  API_ENDPOINT: '/api',
  API_VERSION: '0.0.0',
  OWA_VERSION: '0.0.0',
  OWA_URL: 'https://localhost:8443/v3',
  WEBAPP_URL: 'https://localhost:3001',
  production: false
};
