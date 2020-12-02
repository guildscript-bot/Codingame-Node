interface user {
  pseudo: string;
  userId: number;
  email: string;
  countryId: string;
  publicHandle: string;
  formValues: object;
  enable: boolean;
  rank: number;
  tagline: string;
  company: string;
  level: number;
  xp: number;
  category: string;
}
interface Clash {
  nbPlayersMin: number;
  nbPlayersMax: number;
  publicHandle: string;
  clashDurationTypeId: string;
  creationTime: string;
  startTime: string;
  msBeforeStart: number;
  finished: boolean;
  started: boolean;
  publicClash: true;
  players: Array<any>;
}
interface PendingClashResult {
  result: Array<Clash>;
  valid: boolean;
  error: Error;
}
interface userResult {
  valid: boolean;
  result: user;
  error: Error;
}
export default class Client {
  cookies: string;
  userId: number;
  user: user;
  Login(Options: { Email: string; Password: string; LoadUser: boolean });
  GetUserById(id: string): Promise<userResult>;
  CreateClash(Modes: Array<string>): Promise<any>;
  GetClash(handle: string): Promise<any>;
  GetNotifications(): Promise<any>;
  Search(Term: string): Promise<any>;
  GetUserByHandle(handle: string): Promise<userResult>;
  GetUserByName(Name: any): Promise<userResult>;
  GetPendingClashes(): Promise<PendingClashResult>;
  constructor(Options: { Email: string; Password: string; LoadUser: boolean });
}
export {};
