import { stat as fsStat } from "fs/promises";

interface IConfig {
    auth: {
        jwt_secret: string
    }
    github?: {
        token: string
    },
    dockerhub?: {
        user: string,
        token: string
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

    let envs = Object.keys(process.env).filter(k => k.startsWith('VERSION_CHECKER_'));

    let objs = envs.map(k => createObject(k));
    for(let o of objs){
        config = mergeObject(config, o);
    }
    recurseLoad(config, 'version_checker');
}

function mergeObject(o1, o2){
    for(let key of Object.getOwnPropertyNames(o2)){
        if(typeof o2[key] === 'object' && o2[key] !== null){
            o1[key] = mergeObject(o1[key] || {}, o2[key]);
        }else{
            o1[key] = o1[key] || o2[key];
        }
    }
    return o1;
}

function createObject(envKey){
    let keys = envKey.replace('VERSION_CHECKER_', '').split('_').map(k => k.toLowerCase());
    let obj = null;
    for(let key of keys.reverse()){
        if (obj === null) {
            obj = {};
            obj[key] = null;
        }else{
            let old = obj;
            obj = {}
            obj[key] = old;
        }
    }
    return obj;
}

function recurseLoad(obj, path) {
    for (let key of Object.getOwnPropertyNames(obj)) {
        let envKey = `${path}_${key}`;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            recurseLoad(obj[key], envKey);
        } else {
            if (process.env[envKey.toUpperCase()]) {
                obj[key] = process.env[envKey.toUpperCase()];
            }
        }
    }
}
