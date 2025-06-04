// GET 'api/auth/login'

import axios from "axios";
import { BASE_URL, TEST_UID } from "../lib/apiConfig";
import { User } from "../models/user";

export type AuthResponse = {
    token: string,
    user: User
}

// Returns a jwt token
export async function LoginWithEmailAndPassword(email: string, password: string): Promise<AuthResponse> {
    try {
        const res = await axios.post(
            `${BASE_URL}/auth/login`,
            {
                email,
                password
            });
        return res.data as AuthResponse;
    } catch (error: unknown) {
        throw error;
    }
}

export async function GetUser(token: string): Promise<User> {
    try {
        const res = await axios.get(
            `${BASE_URL}/user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        return res.data.user as User;
    } catch (error: unknown) {
        throw error;
    }
}
export async function SignUp(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
        const res = await axios.post(
            `${BASE_URL}/auth/signup`,
            {
                name,
                email,
                password
            });
        return res.data as AuthResponse;
    } catch (error: unknown) {
        throw error;
    }
}
