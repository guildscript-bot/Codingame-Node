const Tough = require('tough-cookie')
const NodeFetch = require('node-fetch')
const Fetch = require('fetch-cookie')(NodeFetch,new Tough.CookieJar())
module.exports = class Client{
    constructor(Options){
        Fetch("https://www.codingame.com/services/Codingamer/loginSiteV2",{
            method: 'POST',
            body: JSON.stringify([Options.Email,Options.Password, true])
        }).then(async(res)=>{
            const parsedRes = await res.json()
            if (parsedRes.userId){
                console.log("Login Successful!")
            } else {
                console.log("\n".repeat(5))
            }
            this.UserId = parsedRes.userId
        })
    }
    async FindCodinGamer(id){
        const Results = await Fetch("https://www.codingame.com/services/CodinGamer/findCodingamerFollowCard",{
            method: 'POST',
            body: JSON.stringify([id,this.UserId])
        })
        return await Results.json()
    }
    async CreateClash(){
        const Results = await Fetch("https://www.codingame.com/services/ClashOfCode/createPrivateClash",{
            method: 'POST',
            body: JSON.stringify([this.UserId,{SHORT: true},[],["FASTEST","SHORTEST","REVERSE"]])
        })
        return await Results.json()
    }
    async GetClash(handle){
        const Results = await Fetch("https://www.codingame.com/services/ClashOfCode/findClashReportInfoByHandle",{
            method: 'POST',
            body: handle
        })
        return await Results.json()
    }
}