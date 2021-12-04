export interface IUser {
    user_id: string
}

export class User {
    private static instance: User
    private constructor(user: IUser) {
        this.user_id = user.user_id
    }
    private user_id: string

    public getUserID(): string {
        return this.user_id
    }

    public static CreateInstance(user: IUser): User {
        if (!User.instance) {
            User.instance = new User(user);
        }
        return User.instance;
    }

    public static getInstance(): User | null {
        if (!User.instance) {
            return null
        }
        return User.instance;
    }
}