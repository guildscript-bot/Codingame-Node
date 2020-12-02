import fetch from "node-fetch";
function parseCookies(response) {
  const raw = response.headers.raw()["set-cookie"];
  return raw
    .map((entry) => {
      const parts = entry.split(";");
      const cookiePart = parts[0];
      return cookiePart;
    })
    .join(";");
}
export default class Client {
  async Login(Options) {
    let parsedRes = {};
    try {
      const res = await fetch(
        "https://www.codingame.com/services/Codingamer/loginSiteV2",
        {
          method: "POST",
          body: JSON.stringify([Options.Email, Options.Password, true]),
        }
      );
      parsedRes = await res.json();
      this.cookies = parseCookies(res);
    } catch (err) {
      console.warn("There was an error when logging in Error:", err);
      return err;
    }
    if (!parsedRes.userId) {
      console.warn("No userId was found in the login result:", parsedRes);
    }
    this.userId = parsedRes.userId;
    if (Options.LoadUser) {
      const user = await this.GetUserByHandle(parsedRes.codinGamer.publicHandle);
      if (user.valid){
        this.user = user.result
      } else {
        return {valid: false, error: new Error("Unknown Error!")}
      }
    }
  }
  async GetUserById(id) {
    try {
      const Results = await fetch(
        "https://www.codingame.com/services/CodinGamer/findCodingamerFollowCard",
        {
          method: "POST",
          body: JSON.stringify([id, this.userId]),
          headers: {
            cookie: this.cookies
          }
        }
      );
      const ResJSON = await Results.json();
      if (ResJSON&&ResJSON.publicHandle){
        return await this.GetUserByHandle(ResJSON.publicHandle)
      } else {
        return {valid: false, error: new Error("Not found")}
      }
    } catch (err) {
      return {valid: false, error: err}
    }
  }
  async CreateClash(Modes) {
    if (!this.UserId) {
      return {valid: false, error: new Error("You must be logged in to create clashes")}
    }

    try {
      const Results = await fetch(
        "https://www.codingame.com/services/ClashOfCode/createPrivateClash",
        {
          method: "POST",
          body: JSON.stringify([
            this.UserId,
            { SHORT: true },
            [],
            Modes || ["FASTEST", "SHORTEST", "REVERSE"],
          ]),
          headers: {
            cookie: this.cookies
          },
        }
      );
      return {result: await Results.json(), valid: true}
    } catch (err) {
      return {valid: false, error: err}
    }
  }
  async GetClash(handle) {
    try {
      const Results = await fetch(
        "https://www.codingame.com/services/ClashOfCode/findClashByHandle",
        {
          method: "POST",
          body: JSON.stringify([handle]),
        }
      );
      return {result: await Results.json(), valid: true}
    } catch (err) {
      return {valid: false, error: err}
    }
  }
  async GetNotifications() {
    if (!this.userId) {
      return {valid: false, error: new Error("You must be logged in to check notifications")}
    }
    try {
      const Results = await fetch(
        "https://www.codingame.com/services/Notification/findUnreadNotifications",
        {
          method: "POST",
          body: [this.userId],
        }
      );
      return {result: await Results.json(), valid: true}
    } catch (err) {
      return {valid: false, error: err}
    }
  }
  async Search(Term) {
    try {
      const Results = await fetch(
        "https://www.codingame.com/services/search/search",
        {
          method: "POST",
          body: JSON.stringify([Term, "en", null]),
        }
      );
      return {result: await Results.json(), valid: true}
    } catch (err) {
      return {valid: false, error: err}
    }
  }
  async GetUserByHandle(handle) {
    try {
      const User = await (
        await fetch(
          "https://www.codingame.com/services/CodinGamer/findCodingamePointsStatsByHandle",
          {
            method: "POST",
            body: JSON.stringify([handle]),
          }
        )
      ).json();
      if (!User.codingamer) {
        return { valid: false, error: new Error("User not found") };
      }
      return { result: User.codingamer, valid: true };
    } catch (e) {
      return {valid: false, error: e}
    }
  }
  async GetUserByName(Name) {
    const Results = await this.Search(Name);
    if (Results != null) {
      for (const Res of Results) {
        if (Res.type === "USER" && Res.name === Name) {
          return {result: await this.GetUserByHandle(Res.id), valid: true}
        } else {
          return { valid: false, error: new Error("User not found") };
        }
      }
    }
  }
  async GetPendingClashes() {
    try {
      const Res = await fetch(
        "https://www.codingame.com/services/ClashOfCode/findPendingClashes",
        {
          method: "POST",
          body: JSON.stringify([]),
        }
      );
      return {result: await Res.json(), valid: true}
    } catch (err) {
      return {valid: false, error: err}
    }
  }
  constructor(Options) {
    if (Options && Options.Email && Options.Password) {
      this.Login({ Email: Options.Email, Password: Options.Password, LoadUser: Options.LoadUser });
    }
  }
}
