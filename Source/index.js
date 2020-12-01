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
      this.Cookies = parseCookies(res);
    } catch (err) {
      console.warn("There was an error when logging in Error:", err);
      return err;
    }
    if (!parsedRes.userId) {
      console.warn("No userId was found in the login result:", parsedRes);
    }
    const user = {
      pseudo: parsedRes.codinGamer.pseudo,
      userId: parsedRes.codinGamer.userId,
      email: parsedRes.codinGamer.email,
      countryId: parsedRes.codingamer.countryId,
      publicHandle: parsedRes.codingamer.publicHandle,
      formValues: parsedRes.codingamer.formValues,
      enable: parsedRes.codingamer.enable,
      rank: parsedRes.codingamer.rank,
      tagline: parsedRes.codingamer.tagline,
      company: parsedRes.codingamer.company,
      level: parsedRes.codingamer.level,
      xp: parsedRes.codingamer.xp,
      category: parsedRes.codingamer.category
    }
    this.User = user;
    this.UserId = user;
    return user
  }
  async FindCodinGamer(id) {
    try {
      const Results = await fetch(
        "https://www.codingame.com/services/CodinGamer/findCodingamerFollowCard",
        {
          method: "POST",
          body: JSON.stringify([id, this.UserId]),
        }
      );
      return await Results.json();
    } catch (err) {
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
            credentials: "same-origin",
            cookie: this.Cookies,
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
    if (!this.UserId) {
      console.log("You must be logged in to check notifications");
      return;
    }
    try {
      const Results = await fetch(
        "https://www.codingame.com/services/Notification/findUnreadNotifications",
        {
          method: "POST",
          body: [this.UserId],
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
      return User.codinGamer;
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
          return (await this.GetUserByHandle(Res.id)).codinGamer;
        } else {
          return "No user found";
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
      return (await Res.json()).codinGamer;
    } catch (err) {
      console.warn("Something went wrong when getting pending clashes", err);
    }
  }
  constructor(Options) {
    if (Options && Options.Email && Options.Password) {
      this.Login({ Email: Options.Email, Password: Options.Password });
    }
  }
}
