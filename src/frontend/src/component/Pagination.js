import React, { useState } from 'react';

function Pagination() {
    const [imageFile, setImageFile] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const handleImageFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSearchImage = () => {
        if (!imageFile) {
            alert("Please select an image file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', imageFile);

        fetch(`http://localhost:5000/search?page=${currentPage}`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            setSearchResults(data.images);
            setTotalPages(data.total_pages);
        })
        .catch(error => console.error(error));
    };

    const goToPage = (pageNum) => {
        setCurrentPage(pageNum);
        handleSearchImage();
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Image Search</h2>
            
            <div className="mb-4">
                <input 
                    className="block w-full text-md p-2 border border-gray-300 rounded mb-2" 
                    type="file" 
                    onChange={handleImageFileChange} 
                    accept="image/*" 
                />
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSearchImage}
                >
                    Search Image
                </button>
            </div>

            <div className="search-results">
                {searchResults.map((result, index) => (
                    <div key={index} className="result-item">
                        <p>{result.image_name}: {result.similarity_score}</p>
                    </div>
                ))}
            </div>

            <div className="pagination">
                {[...Array(totalPages).keys()].map((pageNum) => (
                    <button 
                        key={pageNum} 
                        onClick={() => goToPage(pageNum + 1)}
                        className={`px-2 py-1 ${currentPage === pageNum + 1 ? 'bg-blue-300' : 'bg-gray-200'}`}
                    >
                        {pageNum + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Pagination;
