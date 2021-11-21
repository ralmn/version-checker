import { createConnection } from "typeorm";
import { loadConfig, config } from "./config";
import { WeeklyTemplate } from "./emails/weekly";
import { Software } from "./entity/Software";
import { User } from "./entity/User";


import * as nodemailer from "nodemailer";
import { Group } from "./entity/Group";
import { GroupVersion } from "./entity/GroupVersion";
import { Version } from "./entity/versions/Version";
import Mail = require("nodemailer/lib/mailer");


async function main() {
    await loadConfig();

    if(config.email == null) {
        console.error("No email configuration found");
        return;
    }

    let connection = await createConnection();

    let uRepo = connection.getRepository(User);
    let users = await uRepo.createQueryBuilder('u')
        .where("u.email != ''")
        .where("u.email_weekly = true")
        .leftJoinAndSelect('u.groupMembers', 'gm')
        .innerJoinAndMapOne('gm.group', Group, 'group' , 'gm.groupId = group.id')
        .innerJoinAndMapMany('group.versions', GroupVersion ,'gv', 'group.id = gv.groupId')
        .innerJoinAndMapOne('gv.software', Software, 'software', 'gv.software = software.name')
        .leftJoinAndMapOne('gv.version', Version, 'version', 'gv.software = version.software and gv.version = version.versionRaw')
        .leftJoinAndMapOne('software.latestVersion', Version, 's_latestVersion', 'software.name = s_latestVersion.software and software.latestVersion = s_latestVersion.versionRaw')
        .getMany();


    let transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    })


    for (let user of users) {
        let groups = user.groupMembers.map(gm => gm.group);
        let weekly = new WeeklyTemplate(groups);
        let render = weekly.render();

        const message : Mail.Options = {
            from: "Version Checker <versionchecker@rlm.pw>",
            to: user.email,
            subject: 'VersionChecker: Weekly report',
            html: render.html,
            text: render.text
        }

        if(user.alternativeEmail){
            message.cc = user.alternativeEmail;
        }

        const info = await transporter.sendMail(message);
        console.log(info);

    }

    await connection.close();
}

main().then(() => {

}).catch((e) => {
    console.log('Uncatched error', e);
});

function listSofts(softs: Software[]) {
    throw new Error("Function not implemented.");
}

