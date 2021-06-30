import * as data from '../../package.json';
import * as app from '../../src/assets/app.json';

export const environment = {
    "identity": "Koinonos Wallet",
    "production": false,
    "version": data.version,
    "name": data.name,
    "title": app.title
};
