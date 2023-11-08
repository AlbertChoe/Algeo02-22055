import React, { useEffect } from 'react';
import Navbar from './component/Navbar';

function App() {
  useEffect(() => {
    // Make a GET request to the Flask API endpoint
    const func = async () => {
      const res = await fetch('http://127.0.0.1:5000/api/data')
      const body = await res.json()
      console.log(body)
    }
    // fetch('http://127.0.0.1:5000/test') // Replace with your Flask API endpoint
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     console.log(response)
    //     return response.json(); // Assuming the response is JSON
    //   })
    //   .then(data => {
    //     // Handle the response data here
    //     console.log('Data from Flask:', data);
    //   })
    //   .catch(error => {
    //     // Handle any errors
    //     console.error('Fetch Error:', error);
    // });
    func();
  }); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div>
      <Navbar/>
    </div>
  );
}

export default App;
