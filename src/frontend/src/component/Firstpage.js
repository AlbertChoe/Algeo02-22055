import React from 'react'

function Firstpage() {
  return (
    <div className="w-screen h-screen bg-[#ccc6c6] flex flex-row items-center justify-center">
      <div className='w-[70%] h-[70%] flex items-center'>
        <div className=' w-[60%] h-full flex flex-col justify-center'>
          <h1 className='text-7xl font-reemkufi font-extrabold pl-[30px] flex-wrap zoom-in'>Welcome To SnapTwin</h1>
          <h3 className='text-2xl pl-[30px] mt-[20px] typing font-medium'>Matching Your Image In Just One Click.</h3>
          <p className='font-reemkufi mt-[20px] pl-[30px] text-base text-justify text-[#4a4946]'>Imagine a web application designed with a sleek, user-friendly interface that allows users to easily upload an image through a drag-and-drop feature or by using a file selection dialog. Upon receiving the image, the application employs advanced image recognition algorithms to analyze the uploaded picture and compare its attributes—such as patterns, colors, and shapes—to a vast database of images.</p>
        </div>
        <div className='h-full w-[50%] relative'>
          <img src="phone3.png" className='absolute top-[-40px] right-[-50px]'></img>
          <img src="phone1.png" className='absolute bottom-[-30px]'></img>
          <img src='phone4.png' className='absolute right-[-120px] bottom-[-55px]'></img>
        </div>
      </div>
    </div>
  )
}

export default Firstpage