"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import { userResister } from "../api";




export default function SignupPage() {
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
        name: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        const result = await userResister(user)
        console.log(result+'good')
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.name.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const onToLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    router.push(`/`); 
    }


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
                <button onClick={onToLogin} className="font-sans bg-spgreen text-white text-sm md:text-base py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none">
                    <Link href="/">Login</Link>
                </button>
            </div>  
        </div>
        </nav>
        <div className="container mx-auto flex justify-between items-end py-6">
            {/* edit here */}
            <h1 className="font-serif text-6xl text-black">Register</h1>
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
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                    Create your account
                                </h1>
                            </div>

                            <form className="space-y-4 md:space-y-7 " action="#">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Username</label>
                                    <input name="name"  className="bg-gray-50 border border-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-spgreen" 
                                    id="name"
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({...user, name: e.target.value})}
                                    placeholder="USERNAME"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email Address</label>
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
                                <div className="flex items-center justify-between py-3">
                                <button onClick={onSignup} className="w-full text-white bg-spgreen hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-green-600 focus:outline-none">Create an account</button>
                                </div>
                                <p className="text-sm font-light text-gray-500 ">
                                Already have an account? <a href="/login" className="font-medium text-spgreen hover:underline ">Login here</a>
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