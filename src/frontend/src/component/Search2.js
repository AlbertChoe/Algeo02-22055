import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
function Search2() {
    const [imageURL, setImageURL] = useState(localStorage.getItem('imageURL') || null);
    const [zipFile, setZipFile] = useState(null);
    const [isTextureMode, setIsTextureMode] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // Track total pages
    const [imageFile, setImageFile] = useState(null);
    const [totalImages, setTotalImages] = useState(0);
    const [searchDuration, setSearchDuration] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [imageUploadSuccess, setImageUploadSuccess] = useState(false);



    
    
    useEffect(() => {
        setImageURL(null);
        setImageFile(null);
        localStorage.removeItem('imageURL'); // Remove from localStorage if you're using it
    }, []);

   
    const fetchImages = (page) => {
        const searchType = isTextureMode ? 'texture' : 'color';
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('file', imageFile);

        fetch(`http://localhost:5000/search?page=${page}&type=${searchType}`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            setSearchResults(data.images || []);
            setTotalPages(Math.max(0, data.total_pages)); // Ensure non-negative
            setCurrentPage(data.current_page || 1);
            setTotalImages(data.total_images || 0);
            setSearchDuration(data.search_duration || 0);
            setIsSearching(false);
        })
        .catch(error => {
            console.error(error);
            setSearchResults([]);
            setTotalPages(0);
            setIsSearching(false);
        });
    };
    
    const handleSearch = () => {
        if (!imageFile) {
            alert("Please upload an image first.");
            return;
        }
        setIsSearching(true);
        setCurrentPage(1);
        fetchImages(1); 
    };
    
    
    useEffect(() => {
        if (imageFile) {
            fetchImages(currentPage);
        }
    }, [currentPage]);
    
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            processFile(file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            processFile(file);
        }
    };

    // Common function to process the file
    const processFile = (file) => {
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            setImageFile(file);
            setImageUploadSuccess(true); // Set success state
            setTimeout(() => setImageUploadSuccess(false), 2000); // Reset after 2 seconds
            
        } else {
            alert("Please upload a valid image file.");
        }
    };

    // Function to prevent default behavior on drag over
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const url = URL.createObjectURL(file);
    //         setImageURL(url);
    //         setImageFile(file); 
    //     }
    // };

    const handleZipFileChange = (event) => {
        setZipFile(event.target.files[0]);
    };

    // const handleUploadZip = () => {
    //     if (!zipFile) {
    //         alert("Please select a ZIP file first.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('file', zipFile);

    //     fetch('http://localhost:5000/upload', {
    //         method: 'POST',
    //         body: formData,
    //     })
    //     .then(response => response.text())
    //     .then(data => console.log(data))
    //     .catch(error => console.error(error));
    // };

    const handleUploadZip = () => {
        if (!zipFile) {
            alert("Please select a ZIP file first.");
            return;
        }
    
        setIsUploading(true); // Start loading
    
        const formData = new FormData();
        formData.append('file', zipFile);
    
        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            setUploadSuccess(true); // Show success message
            setTimeout(() => {
                setIsUploading(false); // Hide loading and success message after a delay
                setUploadSuccess(false);
            }, 2000); // 2 seconds delay
        })
        .catch(error => {
            console.error(error);
            setIsUploading(false); // Stop loading on error
        });
    };

    const handleToggleChange = () => {
        setIsTextureMode(!isTextureMode);
    };
    

    const handleImageError = () => {
        setImageURL(null);
    };


    const handleDownloadPdf = () => {
        // Send a GET request to the backend to download the PDF
        fetch('http://localhost:5000/download_pdf', {
            method: 'GET',
        })
        .then(response => {
            // Handle the response from the server
            if (response.ok) {
                return response.blob();
            }
            throw new Error('Network response was not ok.');
        })
        .then(blob => {
            // Create a new URL for the blob
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'downloaded.pdf'; // Specify the file name
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };


    

    // Update handleFileChange to also set imageFile
    const maxPageNumbers = 5;

    const handlePrev = () => {
        setCurrentPage(Math.max(1, currentPage - 1));
    };

    const handleNext = () => {
        setCurrentPage(Math.min(totalPages, currentPage + 1));
    };

    const getPageNumbers = () => {
        const startPage = Math.max(currentPage - 2, 1);
        const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

        return [...Array((endPage + 1) - startPage).keys()].map(n => startPage + n);
    };

    const CheckmarkIcon = () => (
        <div class="svg-container">    
            <svg class="ft-green-tick" xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 48 48" aria-hidden="true">
                <circle class="circle" fill="#5bb543" cx="24" cy="24" r="22"/>
                <path class="tick" fill="none" stroke="#FFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M14 27l5.917 4.917L34 17"/>
            </svg>
        </div>
    );

    return (
        <div  className='w-full h-screen relative'>
            <div 
                className="fixed w-full h-full bg-cover bg-center"
                style={{backgroundImage: `url(${"searchbg.jpeg"})`}}
            ></div>
            <div 
                className="fixed w-full h-full bg-black z-10 opacity-80"></div>
            <div className="absolute container mx-auto py-28 text-center text-white z-30">
                <div className="mb-6 text-5xl text-white font-bold  tracking-widest font-reemkufi">Snap Twins</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 mx-4">
                <div>
                        <div className='mb-4 font-bold font-reemkufi'>Upload Image Here : </div>
                        <div 
                            className="flex justify-center items-center w-3/4 mx-auto relative"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragOver}
                            onDragLeave={handleDragOver}
                        >
                            {imageURL && (
                                <img 
                                    src={imageURL} 
                                    alt="Uploaded" 
                                    className="object-contain h-80 w-3/5 md:w-10/12 rounded-lg" 
                                    onError={handleImageError} 
                                />
                            )}

                            {!imageURL && (
                                <div className="flex flex-col items-center justify-center h-80 w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-gray-500">Drag and drop image here</p>
                                    <p className="text-gray-400 mt-2">or click here to upload</p>
                                </div>
                            )}

                            <input
                                className="cursor-pointer absolute inset-0 block w-full opacity-0"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            
                        </div>
                    </div>
                    

                    <div className="container">
                        <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>
                        
                        <div className="mb-4">
                            <input 
                                className="w-3/5 text-md p-2 border border-gray-300 rounded mb-2 mr-5" 
                                type="file" 
                                onChange={handleZipFileChange} 
                                accept=".zip" 
                            />
                            <button 
                                className="px-4 py-3 bg-[#00ff3b] text-black font-semibold rounded-lg hover:bg-green-500"
                                onClick={handleUploadZip}
                            >
                                Upload ZIP
                            </button>
                        </div>

                        <div>
                            <input
                                className="mr-2 mt-20 h-5 w-12 appearance-none rounded-lg bg-neutral-300 before:pointer-events-none before:absolute before:h-5 before:w-5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-6 after:w-6 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-lg after:transition-all after:content-[''] checked:bg-blue-500 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.625rem] checked:after:h-6 checked:after:w-6 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-500 checked:after:shadow-lg checked:after:transition-all hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-lg focus:before:transition-all focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-6 focus:after:w-6 focus:after:rounded-full focus:after:content-[''] checked:focus:border-blue-500 checked:focus:bg-blue-500 checked:focus:before:ml-[1.625rem] checked:focus:before:scale-100 checked:focus:before:shadow-lg checked:focus:before:transition-all dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-blue-500 dark:checked:after:bg-blue-500 dark:focus:before:shadow-lg dark:checked:focus:before:shadow-lg"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                checked={isTextureMode}
                                onChange={handleToggleChange}
                            />
                            <label
                                className="inline-block pl-1 text-lg hover:cursor-pointer"
                                htmlFor="flexSwitchCheckDefault"
                            >
                                {isTextureMode ? 'Texture' : 'Color'}
                            </label>
                        </div>

                        {/* Search Button */}
                        <button 
                    onClick={handleSearch}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-300"
                >
                    Search Image Similarity
                </button>
                    </div>


                
                </div>
                
                {Array.isArray(searchResults) && (
                    searchResults.length > 0 ? (
                        <>
                                    <div className="my-6 p-4 bg-blue-100 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold text-blue-800">Search Results:</h3>
                                        <p className="text-blue-600">Total Images: <span className="font-bold">{totalImages}</span></p>
                                        <p className="text-blue-600">Search Duration: <span className="font-bold">{searchDuration.toFixed(2)} seconds</span></p>
                                    </div>
                                    <div className="container mx-auto p-4">
                        {/* Images grid */}
                        <div className="grid grid-cols-3 gap-4 mb-4 mx-28 truncate">
                            {searchResults.map((result, index) => (
                                <div key={index} className="w-4/5 h-3/5">
                                    <img src={`http://localhost:5000${result.image_url}`} alt={`Similar to uploaded`} className=" object-cover rounded-lg" />
                                    <div className="text-center mt-2">
                                        <p>Similarity: {result.similarity}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination control */}
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={handlePrev} disabled={currentPage === 1} className="flex items-center gap-2">
                                <ArrowLeftIcon className="h-4 w-4" /> Previous
                            </button>

                            {getPageNumbers().map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    disabled={currentPage === page}
                                    className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button onClick={handleNext} disabled={currentPage === totalPages} className="flex items-center gap-2">
                                Next <ArrowRightIcon className="h-4 w-4" />
                            </button>
                        </div>

                        </div>
                        <div><button onClick={handleDownloadPdf} className='text-2xl font-bold border-[#00ff3b]  text-black rounded-lg mt-[30px] py-[15px] px-[20px] bg-[#00ff3b] hover:bg-green-500 drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)]'>Download pdf</button></div>
                                </>
                    ) : (
                        <div className="my-6 p-4 bg-red-100 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-red-800">No Results Found</h3>
                            <p className="text-red-600">There are no similar images found in the dataset.</p>
                        </div>
                    )
                )}

                
                </div>

                {imageUploadSuccess && (
                    <div className="absolute right-10 bottom-10 text-white px-3 py-2 bg-green-500 z-50 rounded-lg flex items-center justify-center text-lg font-bold animate-bounce">
                        <CheckmarkIcon/>
                        Upload Success
                    </div>
                )}
                
                {isUploading && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="p-5 bg-white rounded-lg flex items-center justify-center text-xl font-bold">
                        {uploadSuccess ? (
                            <>
                                <CheckmarkIcon/>
                                <span className="ml-3">Upload successful!</span>
                            </>
                        ) : (
                            <>
                                <div className="spinner"></div>
                                <span className="ml-3">Uploading dataset... Please wait.</span>
                            </>
                        )}
                        </div>
                    </div>
                )}
                {isSearching && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="p-5 bg-white rounded-lg flex items-center justify-center text-xl font-bold">
                            <div className="spinner"></div>
                            <span className="ml-3">Searching... Please wait.</span>
                        </div>
                    </div>
                )}

                
        </div>
    );
}

export default Search2;
