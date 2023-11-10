import React, { useState, useEffect } from 'react';

function Search2() {
    const [imageURL, setImageURL] = useState(localStorage.getItem('imageURL') || null);
    const [zipFile, setZipFile] = useState(null);
    const [isTextureMode, setIsTextureMode] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    
    useEffect(() => {
        setImageURL(null);
        setImageFile(null);
        localStorage.removeItem('imageURL'); // Remove from localStorage if you're using it
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            setImageFile(file); // Set the file for upload
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

    const handleSearch = () => {
        if (!imageURL) {
            alert("Please upload an image first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', imageFile); // imageFile needs to be set when an image is selected

        fetch('http://localhost:5000/search', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setSearchResults(data.images); // Assuming 'data.images' is the format of the response
        })
        .catch(error => console.error(error));
    };

    // Update handleFileChange to also set imageFile
    

    return (
        <div className="container mx-auto py-20 text-center">
            <div className="mb-6 text-5xl">Similar Image</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 mx-4">
                <div className="mx-auto">
                    <div className="mb-2">Uploaded Image:</div>
                    <div className="flex justify-center items-center w-full">
                            {imageURL ? (
                                <img 
                                    src={imageURL} 
                                    alt="Uploaded" 
                                    className="object-contain h-96 w-full md:w-11/12 rounded-lg" 
                                    onError={handleImageError} 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-96 w-full md:w-11/12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                    

                                    <p className="text-gray-500">No image uploaded</p>
                                    <p className="text-gray-400 mt-2">Click below to upload</p>
                                </div>
                            )}
                        </div>


                    <div className="relative w-4/5 mx-auto mt-4">
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


                {/* Display search results */}
            <div>
                        {Array.isArray(searchResults) && searchResults.map((result, index) => (
                <div key={index}>
                    <p>{result.image_name}</p>
                    <p>Similarity: {result.similarity_score}</p>
                </div>
            ))}
            </div>
            </div>
            {/* <ImagePagination searchCriteria={isTextureMode ? 'texture' : 'color'} /> */}
        </div>
    );
}

export default Search2;
