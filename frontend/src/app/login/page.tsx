"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from 'next/image';
import { genSaltSync, hashSync } from "bcrypt-ts";
import { userValidate } from "../api";

// source https://github.com/Mister-Hope/bcrypt-ts, https://github.com/hiteshchoudhary/nextjs-fullstack-auth/tree/main


export default function LoginPage() {
    const getCurrentDate = () => {
        const dateOptions: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        return new Date().toLocaleDateString('en-US', dateOptions);
      };
      
    
    // Function to determine the current meal based on the hour of the day
    const getCurrentMeal = () => {
    const hours = new Date().getHours();
    if (hours < 10) {
        return 'Breakfast';
    } else if (hours < 16) {
        return 'Lunch';
    } else {
        return 'Dinner';
    }
    };

    // Get the current meal and date
    const meal = getCurrentMeal();
    const date = getCurrentDate();


    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
       
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        // const salt = genSaltSync(10);
        // const hash = hashSync(user.password, salt);
        // setUser({...user, password: hash})
        console.log(user)
        const result = await userValidate(user)
        console.log('ここに結果を表示'+result.role+result.name)



        if (result.role == true) {
            router.push(`/food?role=${result.role}&email=${user.email}&name=${result.name}`);
        } else {
            alert('ユーザ名とパスワードが一致しません')
        }

    }
    

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else{
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Shokudo Online Ticket</title>
        </head>
        <body>
        <nav className="p-10">
        <div className="container mx-auto flex justify-between items-center">
            <a href="#" className="font-serif text-spgreen text-4xl">Shokudo Online Ticket</a>
            <div className="flex items-center">
                <a href="/designui" className="text-black text-sm py-2 px-10 rounded-lg mr-2">My profile</a>
                <button className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded hover:bg-green-600 focus:outline-none">
                    <Link href="/signup">Register</Link>
                </button>
            </div>  
        </div>
        </nav>
        <div className="container mx-auto flex justify-between items-end py-6">
            {/* edit here */}
            <h1 className="font-serif text-6xl text-black">Welcome</h1>
            {/* ------------- */}
            <span className="font-sans text-3xl text-black">
                <strong className="font-bold">{meal}</strong>  —  {date}
            </span>
        </div>
        <div className="container mx-auto">
        <hr className="border-t-2 border-gray-300 my-4 " />
        </div>

        <div className="flex justify-center items-center w-full my-20">
            <div className="block max-w-2xl p-20 min-h-64 bg-pearlwhite rounded-3xl shadow-lg p-6 m-4 px-20">
                {/* edit here */}
                        <div className="p-6 space-y-4 mx-auto">
                            <div className="flex justify-center items-center space-x-20 pb-5">
                                <Image src="/naist_logo_fix.png" alt="Login Logo" width={140} height={140} />
                                {/* <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Sign in to your account
                                </h1> */}
                            </div>

                            <form className="space-y-4 md:space-y-7 " action="#">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your Email</label>
                                    <input name="email"  className="bg-gray-50 border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen" 
                                    id="email"
                                    type="text"
                                    value={user.email}
                                    onChange={(e) => setUser({...user, email: e.target.value})}
                                    placeholder="EMAIL ADDRESS"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                                    <input name="password" className="bg-gray-50 border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 focus:outline-spgreen" 
                                    id="password"
                                    type="password"
                                    value={user.password}
                                    onChange={(e) => setUser({...user, password: e.target.value})}
                                    placeholder="PASSWORD"
                                    />
                                </div>
                                
                                    {/* <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                        </div>
                                    </div>
                                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                                 */}
                                <div className="flex items-center justify-between py-3">
                                <button onClick={onLogin} className="w-full text-white bg-spgreen hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-green-600 focus:outline-none">Sign in</button>
                                </div>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <a href="/signup" className="font-medium text-spgreen hover:underline dark:text-primary-500">Sign up</a>
                                </p>
                            </form>
                        </div>
                {/* ------------- */}
            </div>
        </div>
        </body>
        </html>

)

}


// (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2">
//         {/*"<h1>{loading ? "Processing" : "Login"}</h1>*/}
//         {loading ? (
//         <h1>Processing</h1>
//         ) : (
//         <Image src="/naist_logo_fix.png" alt="Login Logo" width={100} height={100} />
//         )}
//         <hr />
//         <input 
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//             id="email"
//             type="text"
//             value={user.email}
//             onChange={(e) => setUser({...user, email: e.target.value})}
//             placeholder="USERNAME"
//             />
//         <input 
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//             id="password"
//             type="password"
//             value={user.password}
//             onChange={(e) => setUser({...user, password: e.target.value})}
//             placeholder="PASSWORD"
//             />
//             <button
//             onClick={onLogin}
//             className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">Login here</button>
//             <Link href="/signup">First time? sign up here</Link>
//         </div>
// md:space-y-6 sm:p-8
//     )