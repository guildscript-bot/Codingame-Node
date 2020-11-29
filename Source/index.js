const Tough = require("tough-cookie");
const NodeFetch = require("node-fetch");
const Fetch = require("fetch-cookie")(NodeFetch, new Tough.CookieJar());
module.exports = class Client {
  async Login(Options) {
    let parsedRes = {};
    try {
      const res = await Fetch(
        "https://www.codingame.com/services/Codingamer/loginSiteV2",
        {
          method: "POST",
          body: JSON.stringify([Options.Email, Options.Password, true]),
        }
      );
      parsedRes = await res.json();
    } catch (err) {
      console.warn("There was an error when logging in Error:", err);
      return err;
    }
    if (!parsedRes.userId) {
      console.warn("No userId was found in the login result:", parsedRes);
    }
    this.User = parsedRes;
    this.UserId = parsedRes.userId;
  }
  async FindCodinGamer(id) {
    try {
    const Results = await Fetch(
      "https://www.codingame.com/services/CodinGamer/findCodingamerFollowCard",
      {
        method: "POST",
        body: JSON.stringify([id, this.UserId]),
      }
    );
    return await Results.json();
    } catch(err) {
      console.warn(
        "Something went wrong when getting info on Codingamer",
        id,
        "Error:",
        err
      );
    }
  }
  async CreateClash(Modes) {
    if (!this.UserId) {
      console.warn("You must be logged in to create clashes");
      return;
    }
    try {
      const Results = await Fetch(
        "https://www.codingame.com/services/ClashOfCode/createPrivateClash",
        {
          method: "POST",
          body: JSON.stringify([
            this.UserId,
            { SHORT: true },
            [],
            Modes || ["FASTEST", "SHORTEST", "REVERSE"],
          ]),
        }
      );
      return await Results.json();
    } catch(err) {
      console.warn(
        "Something went wrong when creating clash Error:",
        err
      );
    }
  }
  async GetClash(handle) {
    try {
      const Results = await Fetch(
        "https://www.codingame.com/services/ClashOfCode/findClashByHandle",
        {
          method: "POST",
          body: JSON.stringify([handle]),
        }
      );
      return await Results.json();
    } catch (err) {
      console.warn(
        "Something went wrong when getting info on clash",
        handle,
        "Error:",
        err
      );
    }
  }
  async GetNotifications() {
    if (!this.userId){
      console.log("You must be logged in to check notifications")
      return
    }
    try {
      const Results = await Fetch("https://www.codingame.com/services/Notification/findUnreadNotifications",{
        method: 'POST',
        body: [this.UserId]
      })
      return await Results.json()
    } catch(err){
      console.warn(
        "Something went wrong when retrieving client notifications Error:",
        err
      );
    }
  }
  async Search(Term){
    try {
      const Results = await Fetch("https://www.codingame.com/services/search/search",{
        method: 'POST',
        body: JSON.stringify([Term,"en",null])
      })
      return await Results.json()
    } catch(err){
      console.warn(
        "Something went wrong when trying to search Error:",
        err
      )
    }
  }
  constructor(Options) {
    if (Options && Options.Email && Options.Password) {
      this.Login({ Email: Options.Email, Password: Options.Password });
    }
  }
};
