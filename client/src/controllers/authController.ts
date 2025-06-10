// GET 'api/auth/login'
import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL } from "../lib/apiConfig";
import { User } from "../models/user";

export type AuthResponse = {
    token: string,
    user: User,
    message?: string,
    status: number
}

// Returns a jwt token
export async function LoginWithEmailAndPassword(email: string, password: string): Promise<AuthResponse> {
    const res = await axios.post<AuthResponse>(
        `${BASE_URL}/auth/login`,
        {
            email,
            password
        })
        .then(res => {
            return { ...res.data, status: res.status } as AuthResponse;
        })
        .catch((err: AxiosError<AuthResponse>) => {
            return { message: err.response.data.message, status: err.status } as AuthResponse
        });
    return res;
}

export async function SignUp(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await axios.post<AuthResponse>(
        `${BASE_URL}/auth/signup`,
        {
            name,
            email,
            password
        })
        .then(res => {
            return { ...res.data, status: res.status } as AuthResponse;
        })
        .catch((err: AxiosError<AuthResponse>) => {
            return { message: err.response.data.message, status: err.status } as AuthResponse
        });
    return res
}

export async function GetUser(token: string): Promise<User> {
    try {
        const res = await axios.get(
            `${BASE_URL}/user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        return res.data.user as User;
    } catch (error: unknown) {
        throw error;
    }
}
