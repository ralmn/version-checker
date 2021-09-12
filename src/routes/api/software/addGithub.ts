import axios from "axios";
import { getConnection } from "typeorm";
import { GithubSoftware } from "../../../entity/Githubsoftware";

export async function addGithub(req, res){

    let repoName = req.body.repo;

    const url = `https://api.github.com/repos/${repoName}`;
    let headers = {};

    console.log(url);
    try{
        let {data} = await axios.get(url, {headers})
        
        let gsRepo = await getConnection().getRepository(GithubSoftware);
        let gs = new GithubSoftware();
        gs.repository = repoName;
        gs.name = repoName;
        gs = await gsRepo.save(gs);

        res.json({ok: true, software: gs});

    }catch(e){
        console.log(e.toString());
        res.json({ok: false, error: `This repository doesn't exists on github `})
    }
    

}