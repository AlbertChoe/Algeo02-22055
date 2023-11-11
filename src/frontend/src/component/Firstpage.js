import React, { useState, useEffect } from 'react';

function Firstpage() {

    // <div className="w-screen h-screen bg-[#ccc6c6] flex flex-row items-center justify-center">
    //   <img src=''></img>
    //   <div className='w-[70%] h-[70%] flex items-center'>
    //     <div className=' w-[60%] h-full flex flex-col justify-center'>
    //       <h1 className='text-7xl font-reemkufi font-extrabold pl-[30px] flex-wrap zoom-in'>Welcome To SnapTwin</h1>
    //       <h3 className='text-2xl pl-[30px] mt-[30px] typing font-medium'>Matching Your Image In Just One Click.</h3>
    //       <p className='font-reemkufi mt-[20px] pl-[30px] text-base text-justify text-[#4a4946]'>Imagine a web application designed with a sleek, user-friendly interface that allows users to easily upload an image through a drag-and-drop feature or by using a file selection dialog. Upon receiving the image, the application employs advanced image recognition algorithms to analyze the uploaded picture and compare its attributes—such as patterns, colors, and shapes—to a vast database of images.</p>
    //     </div>
    //     <div className='h-full w-[50%] relative'>
    //       <img src="phone3.png" className='absolute top-[-40px] right-[-50px]'></img>
    //       <img src="phone1.png" className='absolute bottom-[-30px]'></img>
    //       <img src='phone4.png' className='absolute right-[-120px] bottom-[-55px]'></img>
    //     </div>
    //   </div>
    // </div>
      // List of images (add the paths to your images here)
    const images = [
        'image1.jpeg',
        'image2.jpeg',
        'image3.jpeg',
        'image6.jpeg',
        'image7.jpeg',
        'image8.jpeg',
        'image9.jpeg',
        'image10.jpeg',
        'image11.jpeg',
        'image12.jpeg',
        'image13.jpeg',
        'image14.jpeg',
        'image15.jpeg',
        'image16.jpeg',
        'image17.jpeg',
        'image18.jpeg',
        'image19.jpeg',
        'image20.jpeg'
        // ... add all 20 image paths
    ];

    // State to keep track of the current background image
    const [currentBg, setCurrentBg] = useState(0);
    const [nextBg, setNextBg] = useState(1);

    // Effect to change the background image every 2 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setNextBg(currentBg);
            setCurrentBg((currentBg + 1) % images.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [currentBg]);

    return (
        <div className="relative w-full h-screen">
            <div
                className="absolute w-full h-full bg-cover bg-center transition-opacity duration-1000 z-0"
                style={{ backgroundImage: `url(${images[currentBg]})`, opacity: nextBg === currentBg ? 1 : 0 }}
            ></div>
            <div
                className="absolute w-full h-full bg-cover bg-center transition-opacity duration-1000 z-0"
                style={{ backgroundImage: `url(${images[nextBg]})`, opacity: nextBg === currentBg ? 0 : 1 }}
            ></div>
            <div className='absolute w-full h-full bg-black bg-center opacity-75 z-10'>
            </div>
            <div className='absolute z-20 w-[60%]  h-[50%] top-[180px] text-white pl-[200px] pt-[50px]'>
              <h1 className='text-7xl font-extrabold zoom-in'>Snap Twins</h1>
              <h2 className='text-4xl font-normal mt-[20px] mb-[50px] tracking-widest'>Content-Based Information Retrieval Project</h2>
              <p className='text-2xl typing font-light text-[#c7d4ca]'>Matching Your Image In Just One Click.</p>
              <button className='text-2xl font-bold border-[#00ff3b]  text-black rounded-lg mt-[30px] p-[12px] bg-[#00ff3b] hover:bg-green-500'>LAUNCH APP</button>
            </div>
        </div>
    );
};

export default Firstpage