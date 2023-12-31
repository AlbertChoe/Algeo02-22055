import React, { useState, useEffect } from 'react';

import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';


function Aboutus() {
    const benImage = [
        "benardo1.jpg",
        "benardo2.jpg"
    ]
    const albertImage = [
        "albert1.jpg",
        "albert2.jpg"
    ]

    const derImage = [
        "derwin1.jpg" ,
        "derwin2.jpg"
    ]
    const [currentProfile, setcurrentProfile] = useState(0);

    // Effect to change the background image every 2 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setcurrentProfile((currentProfile + 1) % benImage.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [currentProfile]);
    return (
        <div className='relative w-full h-screen'>
            <div 
                className="absolute w-full h-full bg-cover bg-center"
                style={{backgroundImage: `url(${"imageaboutus.jpeg"})`}}
            ></div>
            <div 
                className="absolute w-full h-full bg-black z-10 opacity-80"></div>
            <div></div>
            <div className="absolute text-white z-20 w-full top-[100px] flex items-center flex-col">
                <div 
                    className="text-white w-full pl-[120px] "
                >
                    <p className='text-gray-500 font-reemkufi'>Our team</p>
                    <h1 className='text-7xl  font-light '><span className='font-extrabold'>ABOUT </span>US</h1> 
                    <a href='https://github.com/AlbertChoe/Algeo02-22055' target="_blank"><button className='bg-[#ff1100] rounded-lg px-[12px] py-[8px] mt-[30px] text-sm text-gray-200 hover:bg-opacity-80 font-reemkufi'>VISIT OUR REPOSITORY</button></a>
                </div>
                <div 
                    className='flex item-center z-20 mt-[30px] mb-[20px]'
                >
                    <h1 className='text-2xl font-bold drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)]'>Our Developers</h1>
                </div>
                <div className='flex items-center z-20 flex-row gap-16 '>
                    <div className='relative  w-[270px] h-[350px] rounded-3xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out'>
                        <div className='w-full h-[270px] bg-cover bg-center rounded-3xl'
                            style={{backgroundImage: `url(${benImage[currentProfile]})`}}
                        ></div>
                        <div className="absolute w-full h-[270px] inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-3xl transition duration-300 ease-in-out group">
                            <span className="text-white text-center px-4 font-reemkufi tracking-wide translate-y-20 group-hover:translate-y-0 transition duration-1000">Never let others control you, you are your own king.</span>
                        </div>
                        <h1 className='text-center mt-[6px] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] text-xl font-semibold'>Benardo</h1>
                        <div className='flex justify-center mt-2'>
                            <a href="https://www.instagram.com/benardosg" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                            <a href="https://www.linkedin.com/in/benardo-b-ab7b85223/" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                            <a href="https://github.com/Benardo07" target="_blank" rel="noopener noreferrer">
                                <FaGithub className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                        </div>
                    </div>
                    <div className='relative  w-[270px] h-[350px] rounded-3xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out'>
                        <div className='w-full h-[270px] bg-cover bg-center rounded-3xl'
                            style={{backgroundImage: `url(${derImage[currentProfile]})`}}
                        ></div>
                        <div className="absolute w-full h-[270px] inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-3xl transition duration-300 ease-in-out group">
                            <span className="text-white text-center px-4 font-reemkufi tracking-wide translate-y-20 group-hover:translate-y-0 transition duration-1000">Opportunities are usually disguised as hard work, so most people don't recognize them.</span>
                        </div>
                        <h1 className='text-center mt-[6px] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] text-xl font-semibold'>Derwin Rustanly</h1>
                        <div className='flex justify-center mt-2 '>
                            <a href="https://www.instagram.com/derwinrustanly/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                            <a href="" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                            <a href="https://github.com/DerwinRustanly" target="_blank" rel="noopener noreferrer">
                                <FaGithub className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                        </div>
                    </div>
                    <div className='relative  w-[270px] h-[350px] rounded-3xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out'>
                        <div className='w-full h-[270px] bg-cover bg-center rounded-3xl'
                            style={{backgroundImage:`url(${albertImage[currentProfile]})`}}
                        ></div>
                        <div className="absolute  w-full h-[270px] inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-3xl transition duration-300 ease-in-out group">
                            <span className="text-white text-center px-4 font-reemkufi tracking-wide translate-y-20 group-hover:translate-y-0 transition duration-1000">Success isn't always about greatness. It's about consistency. Consistent hard work leads to success. Greatness will come.</span>
                        </div>
                        <h1 className='text-center mt-[6px] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] text-xl font-semibold'>Albert</h1>
                        <div className='flex justify-center mt-3'>
                            <a href="https://www.instagram.com/albert__choe/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                            <a href="https://www.linkedin.com/in/albert-choe-4672b5253/" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                            <a href="https://github.com/AlbertChoe" target="_blank" rel="noopener noreferrer">
                                <FaGithub className="mx-4 text-white" style={{ fontSize: '30px' }}/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

  )
}

export default Aboutus


