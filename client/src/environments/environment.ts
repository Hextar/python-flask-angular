// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {env} from '@env/.env';

const LABEL = '-dev';
export const FRONTEND_URL = 'http://localhost:4300';
export const BACKEND_URL = 'http://localhost:5000';

export const environment = {
  label: 'dev',
  dev: true,
  production: false,
  hmr: true,
  useHash: false,
  version: env.npm_package_version + LABEL,
  frontendUrl: FRONTEND_URL,
  backendUrl: BACKEND_URL,
  defaultLanguage: 'itIT',
  supportedLanguages: ['itIT', 'enUS'],
  realTime: true
};
