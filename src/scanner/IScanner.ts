import { Software } from "../entity/Software";

export interface IScanner<Software> {
    scanVersions(software: Software): Promise<boolean>;

}