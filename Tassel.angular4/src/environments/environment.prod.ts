import { IENV } from './env.contract';

export const environment: IENV = {
  production: true,
  logLevel: 1,
  serverConfig: {
    serverHost: 'http://localhost',
    serverPort: 8081,
  }
};
