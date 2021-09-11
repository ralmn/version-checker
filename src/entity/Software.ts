import { json } from "stream/consumers";
import { Entity, Column, PrimaryColumn, TableInheritance, ValueTransformer, CreateDateColumn, UpdateDateColumn } from "typeorm";

class VersionValueTransformer implements ValueTransformer {
    to(value: any): string{
        return JSON.stringify(value);
    };
    /**
     * Used to unmarshal data when reading from the database.
     */
    from(value: string): any {
        return JSON.parse(value);
    }
}

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Software {

    @PrimaryColumn()
    name: string;

    @Column("simple-array", {default: "" } )
    versions: string[];

    @Column({nullable: true})
    latestVersion?: string;

    @CreateDateColumn({nullable: false})
    createdAt: Date;

    @UpdateDateColumn({ nullable: true})
    updatedAt: Date;

    @Column()
    type: string;

    // constructor(name: string){
    //     this.name = name;
    // }

    public getName(){
        return this.name;
    }
    public getVersions(){
        return this.versions;
    }
    public addVersions(version: string){
        this.versions.push(version);
    }

    public abstract scanVersions(): Promise<boolean>;

}