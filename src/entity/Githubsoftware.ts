import { Column, ChildEntity } from "typeorm";
import {Software} from "./Software";
import {GithubScanner} from '../scanner/GithubScanner';

@ChildEntity()
export class GithubSoftware extends Software {

    @Column()
    repository: string;

    @Column({default: true, nullable: false})
    useReleaseTag: boolean = true;


    @Column({default: false, nullable: false})
    scanTags: boolean = false;


    async scanVersions(){
        return await new GithubScanner().scanVersions(this);
    }

}