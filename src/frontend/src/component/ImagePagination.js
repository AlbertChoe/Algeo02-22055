import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function ImagePagination({ searchResults, currentPage, setCurrentPage, totalPages }) {
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
        <div className="container mx-auto p-4">
            {/* Images grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {searchResults.map((result, index) => (
                    <div key={index} className="w-full">
                        <img src={`http://localhost:5000${result.image_url}`} alt={`Similar to uploaded`} className="w-full h-auto object-cover rounded-lg" />
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
    );
}

export default ImagePagination;
