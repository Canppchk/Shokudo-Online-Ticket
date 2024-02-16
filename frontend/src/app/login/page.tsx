"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from 'next/image';
import { genSaltSync, hashSync } from "bcrypt-ts";
import { userValidate } from "../api";

// source https://github.com/Mister-Hope/bcrypt-ts, https://github.com/hiteshchoudhary/nextjs-fullstack-auth/tree/main


export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
       
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const onLogin = async () => {
        const salt = genSaltSync(10);
        const hash = hashSync(user.password, salt);
        setUser({...user, password: hash})
        console.log(user)
        const resultVal = userValidate(user)
        console.log(resultVal)
        
        // try {
        //     setLoading(true);
        //     const response = await axios.post("/api/users/login", user);
        //     console.log("Login success", response.data);
        //     toast.success("Login success");
        //     router.push("/profile");
        // } catch (error:any) {
        //     console.log("Login failed", error.message);
        //     toast.error(error.message);
        // } finally{
        // setLoading(false);
        // }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else{
            setButtonDisabled(true);
        }
    }, [user]);

    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        {/*"<h1>{loading ? "Processing" : "Login"}</h1>*/}
        {loading ? (
        <h1>Processing</h1>
        ) : (
        <Image src="/naist_logo_fix.png" alt="Login Logo" width={100} height={100} />
        )}
        <hr />
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="USERNAME"
            />
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="PASSWORD"
            />
            <button
            onClick={onLogin}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">Login here</button>
            <Link href="/signup">First time? sign up here</Link>
        </div>
    )

}
