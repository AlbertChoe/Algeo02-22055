import React, { useState, useEffect } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function ImagePagination({ searchCriteria }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [images, setImages] = useState([]);
    const [totalPages, setTotalPages] = useState(5); // Adjust based on your data

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace with your actual API call
                const response = await fetch(`your-api-endpoint?page=${currentPage}&criteria=${searchCriteria}`);
                const data = await response.json();
                setImages(data.images);
                setTotalPages(data.totalPages); // Set total pages from response
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentPage, searchCriteria]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrev = () => {
        setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
    };

    const handleNext = () => {
        setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} className="w-full">
                            <img src={image.src} alt={image.alt} className="w-full h-80 object-cover rounded-lg" />
                            <p className="text-center mt-2">Similarity: {image.similarity}%</p>
                        </div>
                    ))
                ) : (
                    // Placeholder images
                    [...Array(6)].map((_, index) => (
                        <div key={index} className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                        </div>
                    ))
                )}
            </div>

            <div className="flex items-center justify-center gap-4">
                <button onClick={handlePrev} disabled={currentPage === 1} className="flex items-center gap-2 disabled:opacity-50">
                    <ArrowLeftIcon className="h-4 w-4" /> Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button onClick={handleNext} disabled={currentPage === totalPages} className="flex items-center gap-2 disabled:opacity-50">
                    Next <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

export default ImagePagination;
