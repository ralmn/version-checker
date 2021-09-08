import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { Software } from "./Software";
import { User } from "./User";

@Entity()
export class UserVersion {

    @ManyToOne(() => User, {primary: true})
    user: User;

    @ManyToOne(() => Software, {primary: true})
    software: Software;

    @Column({nullable: false})
    version: string;

}
