import { ChildEntity } from "typeorm";
import { Version } from "./Version";

@ChildEntity()
export class DefaultVersion extends Version{

    constructor(version: string){
        super(version);
    }

    compare( b: DefaultVersion): number {
        return this.versionRaw.localeCompare(b.versionRaw);
    }
}