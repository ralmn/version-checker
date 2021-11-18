import { Column, ChildEntity } from "typeorm";
import {Software} from "./Software";
import { DockerHubScanner } from "../scanner/DockerHubScanner";

@ChildEntity()
export class DockerHubSoftware extends Software {

    @Column()
    repository: string;

    async scanVersions(){
        return await new DockerHubScanner().scanVersions(this);
    }

    get namespace(){
        if(this.repository.indexOf('/') === -1){
            return 'library'
        }
        let match = /(.*)\/.*/i.exec(this.repository);
        return match[1];
    }

    get repoName(){
        if(this.repository.indexOf('/') === -1){
            return this.repository
        }
        let match = /.*\/(.*)/i.exec(this.repository);
        return match[1];
    }

}