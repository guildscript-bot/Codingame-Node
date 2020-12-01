interface codingamer {
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
export default class Client {
    Cookies: string;
    UserId: number;
    User: codingamer;
    Login(Options: {
        Email: string;
        Password: string;
    }): Promise<codingamer>;
    FindCodinGamer(id: string): Promise<codingamer>;
    CreateClash(Modes: Array<string>): Promise<any>;
    GetClash(handle: string): Promise<any>;
    GetNotifications(): Promise<any>;
    Search(Term: string): Promise<any>;
    GetUserByHandle(handle: string): Promise<codingamer>;
    GetUserByName(Name: any): Promise<codingamer>;
    GetPendingClashes(): Promise<any>;
    constructor(Options: {
        Email: string;
        Password: string;
    });
}
export {};
