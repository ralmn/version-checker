interface IConfig {
    auth: {
        jwt_secret: string
    }
}

export let config : IConfig = {
    auth : {
        jwt_secret: "secret"
    }
}