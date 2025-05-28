import { useState } from "react";
import Header from "../../components/header";

// Placeholder login page
export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //signInWithEmailAndPass(email, password)

    }
    return (
        <div className="min-h-full bg-bg-dark text-white flex flex-col">
            <Header />
            <div className="flex justify-center">
                <form onSubmit={login} className="py-6 px-10 rounded-lg flex flex-col bg-background-variant w-[90%] lg:w-[40%]">
                    <h1 className="text-lg font-bold">Login</h1>

                    <div className="mt-10 mb-5 flex flex-col">
                        <label className="pb-1 font-light text-white">Email:</label>
                        <input
                            className="mb-3 border-background border-[1px] box-border border-transparent outline-none focus:border-white w-full bg-bg-darker text-white p-2 rounded-md text-sm"
                            autoComplete="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="pb-1 font-light text-white">Password:<br /></label>
                        <input
                            className="mb-3 border-background border-[1px] box-border border-transparent outline-none focus:border-white w-full bg-bg-darker text-white p-2 rounded-md text-sm"
                            autoComplete="current-password"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <section className="w-fit">
                            <input
                                id="remember-me"
                                className="my-auto transition-[border] duration-75 ease-in-out checked:border-4 checked:border-green-400 bg-transparent text-accent appearance-none border-2 border-white rounded-full w-[0.75rem] h-[0.75rem]"
                                type="checkbox"
                            />
                            <label htmlFor="remember-me" className="mb-3 select-none font-light text-white inline my-auto">
                                &nbsp;Remember Me
                            </label>
                        </section>
                    </div>
                    <button
                        className="w-full p-1 py-2 rounded-md bg-white text-bg-dark"
                    >Login</button>
                </form>
            </div>
        </div>
    )
}
