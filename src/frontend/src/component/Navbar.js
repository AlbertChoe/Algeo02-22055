import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50); // Set to true if scrolled more than 50px
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const location = useLocation(); // Hook to get the current location
    const showLaunchButton = location.pathname !== '/technology';
    return (
        <nav className={`fixed w-full h-20 text-white pt-[20px] z-50 ${scrolled ? 'bg-black ' : 'bg-transparent text-white'}`}>
                <nav className="flex flex-row justify-between items-center w-[92%] mx-auto">
                    <div className="text-4xl font-reemkufi font-extrabold">
                        {/* Uncomment and replace src with your logo */}
                    {/* <img className="w-16 cursor-pointer" src="" alt="..."/> */}
                    <Link to="/"> SnapTwin </Link>

                    </div>
                    <div className="duration-500 min-h-[10vh]  w-auto  flex items-center  text-white   ">
                        <ul className="flex flex-row md:gap-[3vw] 2xl:gap-[6vw]   py-3 px-3   ">
                        <li>
                            <div className="py-3">
                                <Link to="/Home" class="group text-white transition-all duration-300 ease-in-out" >
                                <span class="bg-left-bottom bg-gradient-to-r from-green-500 to-green-500 bg-[length:0%_5px] bg-no-repeat group-hover:bg-[length:90%_3px] onset-10 pb-1 transition-all duration-500 ease-out   px-5 rounded-lg  font-medium text-l ">
                                Home
                                </span>
                                </Link>
                            </div>
                            {/* <div className="hover:bg-amber-200 duration-300 hover:text-blue-200 py-3 px-5 rounded-lg ">
                                <a className="   " href="#">Products</a>
                            </div> */}
                        </li>
                        <li>
                            <div className="py-3">
                                <Link to="/Technology" class="group text-white transition-all duration-300 ease-in-out" >
                                <span class="bg-left-bottom bg-gradient-to-r from-green-500 to-green-500 bg-[length:0%_5px] bg-no-repeat  group-hover:bg-[length:90%_3px] onset-10 pb-1 transition-all duration-500 ease-out   px-5 rounded-lg  font-medium text-l ">
                                Technology
                                </span>
                                </Link>
                            </div>
                            {/* <div className="hover:bg-amber-200 duration-300 hover:text-blue-200 py-3 px-5 rounded-lg ">
                                <a className="   " href="#">Products</a>
                            </div> */}
                        </li>
                        <li>
                            <div className="py-3">
                                <Link to="/Aboutus" class="group text-white transition-all duration-300 ease-in-out" href="">
                                <span class="bg-left-bottom bg-gradient-to-r from-green-500 to-green-500 bg-[length:0%_6px] bg-no-repeat  group-hover:bg-[length:90%_3px] onset-10 pb-1 transition-all duration-500 ease-out   px-5 rounded-lg  font-medium text-l ">
                                    About us
                                </span>
                                </Link>
                            </div>
                            {/* <div className="hover:bg-amber-200  duration-300 py-3  px-5 rounded-lg hover:text-blue-200">
                                <a className="  " href="#">Solution</a>
                            </div> */}
                                
                        </li>
                        {/* <li>
                            <a class="group text-pink-500 transition-all duration-300 ease-in-out" href="#">
                                <span class="bg-left-bottom bg-gradient-to-r from-pink-500 to-pink-500 bg-[length:0%_2px] bg-no-repeat  group-hover:bg-[length:90%_2px] onset-10 pb-1 transition-all duration-500 ease-out">
                                    This text g
                                </span>
                            </a>
                        </li> */}
                        <li>
                            <div className="py-3">
                                <Link to="/HowToUse" class="group text-white transition-all duration-300 ease-in-out" >
                                <span class="bg-left-bottom bg-gradient-to-r from-green-500 to-green-500 bg-[length:0%_6px] bg-no-repeat  group-hover:bg-[length:90%_3px] onset-10 pb-1 transition-all duration-500 ease-out   px-5 rounded-lg  font-medium text-l ">
                                    How to use
                                </span>
                                </Link>
                            </div>
                            {/* <div className="hover:bg-amber-200 duration-300 py-3 hover:text-blue-200 px-5 rounded-lg">
                                <a className="  " href="#">Resource</a>
                                </div>     */}
                            </li>
                            
                        </ul>
                </div>
                {/* Conditionally render Launch button or a placeholder */}
                <Link to="/Search"> 
                {showLaunchButton ? (
                    <button className="btn2 px-[15px] py-[20px] relative rounded-lg border border-white uppercase font-semibold tracking-wider leading-none overflow-hidden hover:text-teal-600 hover:text-black" type="button">
                        <span className="absolute inset-0 bg-white"></span>
                        <span className="absolute inset-0 flex justify-center items-center font-normal"> 
                        <Link to="/Search">Launch</Link>
                        </span>
                           
                         <Link to="/Search">Launch</Link>
                    </button>
                ) : (
                    <button 
                            className={`btn2 py-[15px] px-[20px] relative rounded-lg cursor-default border uppercase font-semibold tracking-wider leading-none overflow-hidden ${location.pathname === '/technology' ? 'opacity-0 cursor-not-allowed border-gray-500 text-gray-500 bg-gray-500' : 'hover:text-teal-600 border-white'}`} 
                            type="button"
                            disabled={location.pathname === '/technology'}
                        >
                            <span className="absolute inset-0 "></span>
                            <span className="absolute inset-0 flex justify-center items-center font-normal"> 
                                Launch
                            </span>
                            Launch
                        </button>
                )}</Link>

                    {/* <div className="flex items-center gap-6">
                        <button className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]">Launch Product</button>
                        
                    </div> */}
                </nav>
            
        </nav>
    );
};

export default Navbar;
