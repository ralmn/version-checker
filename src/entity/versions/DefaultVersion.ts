import { ChildEntity } from "typeorm";
import { Version } from "./Version";
import { VersionType } from "./VersionType";

@ChildEntity(VersionType.Default)
export class DefaultVersion extends Version{

    constructor(version: string){
        super(version);
    }

}