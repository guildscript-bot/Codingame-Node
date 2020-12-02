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
      const user = await this.GetUserById(parsedRes.codinGamer.publicHandle);
      if (user.valid){
        this.user = user.user
      } else {
        console.log("Unknown Error!")
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
      console.log(ResJSON)
      if (ResJSON&&ResJSON.publicHandle){
        return await this.GetUserByHandle(ResJSON.publicHandle);
      } else {
        return {valid: false}
      }
    } catch (err) {
      console.warn(
        "Something went wrong when getting info on Codingamer",
        id,
        "Error:",
        err
      );
      return {valid: false}
    }
  }
  async CreateClash(Modes) {
    if (!this.UserId) {
      console.warn("You must be logged in to create clashes");
      return;
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
      return await Results.json();
    } catch (err) {
      console.warn("Something went wrong when creating clash Error:", err);
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
    if (!this.userId) {
      console.log("You must be logged in to check notifications");
      return;
    }
    try {
      const Results = await fetch(
        "https://www.codingame.com/services/Notification/findUnreadNotifications",
        {
          method: "POST",
          body: [this.userId],
        }
      );
      return await Results.json();
    } catch (err) {
      console.warn(
        "Something went wrong when retrieving client notifications Error:",
        err
      );
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
      return await Results.json();
    } catch (err) {
      console.warn("Something went wrong when trying to search Error:", err);
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
        return { valid: false };
      }
      return { user: User.codingamer, valid: true };
    } catch (e) {
      console.warn(
        "Something went wrong when retrieving Codingamer by handle",
        handle,
        "Error:",
        e
      );
    }
  }
  async GetUserByName(Name) {
    const Results = await this.Search(Name);
    if (Results != null) {
      for (const Res of Results) {
        if (Res.type === "USER" && Res.name === Name) {
          return await this.GetUserByHandle(Res.id);
        } else {
          return { valid: false };
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
      return await Res.json()
    } catch (err) {
      console.warn("Something went wrong when getting pending clashes", err);
    }
  }
  constructor(Options) {
    if (Options && Options.Email && Options.Password) {
      this.Login({ Email: Options.Email, Password: Options.Password, LoadUser: Options.LoadUser });
    }
  }
}
