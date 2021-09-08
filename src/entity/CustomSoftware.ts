import { Column, ChildEntity } from "typeorm";
import { Software } from "./Software";
import { stat as fsstat } from "fs/promises";
import path = require("path");
import { IScanner } from "../scanner/IScanner";
import { GithubScanner } from "../scanner/GithubScanner";

function getAllFuncs(toCheck) {
    const props = [];
    let obj = toCheck;
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter((e, i, arr) => {
        if (e != arr[i + 1] && typeof toCheck[e] == 'function') return true;
    });
}

async function getScanner(scanners: any): Promise<IScanner<Software> | null> {
    for (let key in scanners) {
        let elem = scanners[key];
        if (typeof elem == 'function') {
            if ('prototype' in elem) {
                let methods = Object.getOwnPropertyNames(elem.prototype);
                if (methods.includes('scanVersions')) {
                    return new elem() as IScanner<Software>
                }
            }
        }
        if ('scanVersions' in elem) {
            return elem as IScanner<Software>;
        }
    }

    return null;
}

@ChildEntity()
export class CustomSoftware extends Software {

    @Column()
    file: string;


    @Column("simple-json")
    data: any;

    async scanVersions() {
        if (this.file == null) {
            return false;
        }
        let scannerFound = false;

        console.log(`Searching ${this.file} scanner`);
        let extension = path.extname(this.file);
        let outPath = path.join(process.cwd(), 'customs_scanner', this.file);
        if (extension != 'js' && extension != '') {
            console.log('wrong extensions...');
            return false;
        } else if (extension == '') {
            outPath += '.js';
        }
        console.log(`Searching on ${outPath}`);
        try {
            let stat = await fsstat(outPath);
            if (stat != null && stat.isFile()) {
                console.log(`File found on ${outPath}`);
                let scanners = require(outPath);
                let scanner = await getScanner(scanners);
                if (scanner != null) {
                    scannerFound = true;
                    return await scanner.scanVersions(this);
                }
            }
        } catch (e) {
        }

        if (!scannerFound) {
            console.log('try internal custom scanner');
            try {
                let scanners = require(`../scanner/customs/${this.file}`);
                let scanner = await getScanner(scanners);
                if (scanner != null) {
                    scannerFound = true;
                    return await scanner.scanVersions(this);
                }
            } catch (e) {
                if (e.code == 'MODULE_NOT_FOUND') {
                    console.log(`Cannot find scanner for ${this.name} on ${this.file} (${e.code})`);
                } else {
                    throw e;
                }
            }
        }

        if (!scannerFound) {
            console.log(`Cannot find scanner for ${this.name} on ${this.file}`);
        }
        return false;
    }

}