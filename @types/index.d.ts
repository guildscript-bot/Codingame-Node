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
interface userResult {
    valid: boolean;
    user: user;
}
export default class Client {
    cookies: string;
    userId: number;
    user: user;
    Login(Options: {
        Email: string;
        Password: string;
        LoadUser: boolean;
    });
    GetUserById(id: string): Promise<userResult>;
    CreateClash(Modes: Array<string>): Promise<any>;
    GetClash(handle: string): Promise<any>;
    GetNotifications(): Promise<any>;
    Search(Term: string): Promise<any>;
    GetUserByHandle(handle: string): Promise<userResult>;
    GetUserByName(Name: any): Promise<userResult>;
    GetPendingClashes(): Promise<any>;
    constructor(Options: {
        Email: string;
        Password: string;
        LoadUser: boolean;
    });
}
export {};
