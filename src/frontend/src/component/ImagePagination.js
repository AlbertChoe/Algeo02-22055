// import React, { useState, useEffect } from "react";
// import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// function ImagePagination({ searchCriteria }) {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [images, setImages] = useState([]);
//     const [totalPages, setTotalPages] = useState(5); // Adjust based on your data

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Replace with your actual API call
//                 const response = await fetch(`your-api-endpoint?page=${currentPage}&criteria=${searchCriteria}`);
//                 const data = await response.json();
//                 setImages(data.images);
//                 setTotalPages(data.totalPages); // Set total pages from response
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         fetchData();
//     }, [currentPage, searchCriteria]);

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };

//     const handlePrev = () => {
//         setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
//     };

//     const handleNext = () => {
//         setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage);
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <div className="grid grid-cols-3 gap-4 mb-4">
//                 {images.map((image, index) => (
//                     <div key={index} className="w-full">
//                         <img src={image.src} alt={image.alt} className="w-full h-auto object-cover" />
//                     </div>
//                 ))}
//             </div>

//             <div className="flex items-center justify-center gap-4">
//                 <button onClick={handlePrev} disabled={currentPage === 1}>
//                     <ArrowLeftIcon className="h-4 w-4" /> Previous
//                 </button>

//                 {[...Array(totalPages)].map((_, index) => (
//                     <button
//                         key={index}
//                         onClick={() => handlePageChange(index + 1)}
//                         disabled={currentPage === index + 1}
//                     >
//                         {index + 1}
//                     </button>
//                 ))}

//                 <button onClick={handleNext} disabled={currentPage === totalPages}>
//                     Next <ArrowRightIcon className="h-4 w-4" />
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default ImagePagination;
