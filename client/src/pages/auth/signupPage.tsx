import { useState } from "react";
import Header from "../../components/header";

// Placeholder signup page
export default function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [reEnterPassword, setReEnterPassword] = useState<string>("")
    const [error, setError] = useState("")

    const signup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password === reEnterPassword) { }
    }

    return (
        <div className="min-h-full bg-bg-dark text-white flex flex-col">
            <Header />
            <div className="flex justify-center">
                <form onSubmit={signup} className="py-6 px-10 rounded-lg flex flex-col bg-background-variant w-[90%] lg:w-[40%]">
                    {error !== "" ? <p className="text-red-500">{error}</p> : <></>}
                    <h1 className="text-lg font-bold">Signup</h1>

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
                        <label className="pb-1 font-light text-white">Re-Enter Password:<br /></label>
                        <input
                            className="mb-3 border-background border-[1px] box-border border-transparent outline-none focus:border-white w-full bg-bg-darker text-white p-2 rounded-md text-sm"
                            placeholder="Re-enter Password"
                            type="password"
                            value={reEnterPassword}
                            onChange={(e) => {
                                setReEnterPassword(e.target.value)
                                if (e.target.value !== password && e.target.value !== "") {
                                    setError("Passwords do not match!")
                                }
                                else if (e.target.value === password && error == "Passwords do not match!") {
                                    setError("")
                                }
                            }}
                        />
                    </div>



                    <button
                        className="w-full p-1 py-2 rounded-md bg-white text-bg-dark"
                    >Login</button>
                </form>
            </div>
        </div>
    )
}
