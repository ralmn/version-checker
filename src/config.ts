import { stat as fsStat } from "fs/promises";

interface IConfig {
    auth: {
        jwt_secret: string
    }
    github?: {
        auth_token: string
    }
}

export let config: IConfig = {
    auth: {
        jwt_secret: 'secret'
    }
};

export async function loadConfig() {
    const configPath = process.cwd() + '/config.json';

    try {
        const stats = await fsStat(configPath);
        if (stats && stats.isFile()) {
            config = require(configPath);
        }
    } catch (e) { }

    recurseLoad(config, 'version_checker');
}

function recurseLoad(obj, path) {
    for (let key in obj) {
        let envKey = `${path}_${key}`;
        if (typeof obj[key] === 'object') {
            recurseLoad(obj[key], envKey);
        } else {
            if (process.env[envKey.toUpperCase()]) {
                obj[key] = process.env[envKey.toUpperCase()];
            }
        }
    }
}
