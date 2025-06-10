import { Model } from "mongoose";
import { IUser, User, UserStringId } from "../models/userModel";
import { Service } from "./service";
import { sign, verify } from 'jsonwebtoken'
import { AppError } from "../middlewares/errorHandler";
import { compare, hash } from "bcrypt"


// UserService handles all users and their related logic
// It inherits base service to support crud database operations
export class UserService extends Service<IUser> {
    constructor(model: Model<IUser>) { super(model) }

    // Creates a user and a jwt
    // Verifies email is not already in use
    // Returns jwt and user
    async signup(user: IUser) {
        const users = await this.findAll();

        // If email is already in use throw error
        if (users.filter(usr => usr.email == user.email).length > 0) {
            throw new AppError("Email already in use!", 400);
        }

        // hash the password with bcrypt
        const passwordHash = await hash(user.password_hash, 10)

        user.password_hash = passwordHash;

        // Create user
        const newUser = await this.create(user);
        // Create payload without password hash
        const payload = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }

        // create jwt using user information
        const jwt = sign({
            data: payload
        }, String(process.env.JWT_SECRET), { expiresIn: '1m' })

        return { jwt, user: newUser };
    }

    // Verifies email and password 
    // Creates jwt for respective user
    // Returns jwt and user
    async loginWithEmailAndPassword(email: string, password: string) {
        // All users with matching email
        const users = await this.findAll({ email })

        // Check if password matchs on each users
        for (const user of users) {
            const match = await compare(password, user.password_hash)

            // if passwords match
            if (match) {
                // create jwt payload
                const payload = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                }

                // create jwt using user information
                const jwt = sign({
                    data: payload
                }, String(process.env.JWT_SECRET), { expiresIn: '1hr' })

                return { jwt, user: payload };
            }
        }
        // Throw error if no users matched
        throw new AppError("Email or password invalid", 401);
    }

    // Validates a JWT
    // Returns JWT payload data
    async validateToken(token: string): Promise<UserStringId> {
        try {
            // Verify JWT
            const user = verify(token, String(process.env.JWT_SECRET)) as { data: UserStringId }
            return user.data;
        } catch (err) {
            // Throw error if token provided is invalid
            throw new AppError("Invalid Token Provided", 401)
        }
    }
}
