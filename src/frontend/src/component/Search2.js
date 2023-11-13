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
        })
        .catch(error => {
            console.error(error);
            setSearchResults([]);
            setTotalPages(0);
        });
    };
    
    const handleSearch = () => {
        if (!imageFile) {
            alert("Please upload an image first.");
            return;
        }
        setCurrentPage(1);
        fetchImages(1); 
    };
    
    
    useEffect(() => {
        if (imageFile) {
            fetchImages(currentPage);
        }
    }, [currentPage]);
    
    

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            setImageFile(file); 
        }
    };

    const handleZipFileChange = (event) => {
        setZipFile(event.target.files[0]);
    };

    const handleUploadZip = () => {
        if (!zipFile) {
            alert("Please select a ZIP file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', zipFile);

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    };

    const handleToggleChange = () => {
        setIsTextureMode(!isTextureMode);
    };
    

    const handleImageError = () => {
        setImageURL(null);
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

    return (
        <div>
        <div className="container mx-auto py-28 text-center">
            <div className="mb-6 text-5xl">Similar Image</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 mx-4">
                <div >
                    <div className="mb-2 ">Uploaded Image:</div>
                    <div className="flex justify-center items-center w-3/4 mx-auto">
                            {imageURL ? (
                                <img 
                                    src={imageURL} 
                                    alt="Uploaded" 
                                    className="object-contain h-96 w-3/5 md:w-10/12 rounded-lg" 
                                    onError={handleImageError} 
                                />
                            ) : (
                                <div className="flex  flex-col items-center justify-center h-96 w-full  bg-gray-100 rounded-lg border-2 border-dashed border-gray-300  ">
                                    
                                    
                                    <p className="text-gray-500 ">No image uploaded</p>
                                    <p className="text-gray-400 mt-2 ">Click below to upload</p>
                                </div>
                            )}
                        </div>


                    <div className="relative w-3/5 mx-auto mt-4">
                        <input
                            className="cursor-pointer absolute block w-full opacity-0"
                            type="file"
                            name="documents[]"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full flex items-center justify-center">
                            <span>Upload Image</span>
                        </button>
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
                            className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                    </>
                ) : (
                    <div className="my-6 p-4 bg-red-100 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-red-800">No Results Found</h3>
                        <p className="text-red-600">There are no similar images found in the dataset.</p>
                    </div>
                )
            )}
            </div>

            </div>
    );
}

export default Search2;
