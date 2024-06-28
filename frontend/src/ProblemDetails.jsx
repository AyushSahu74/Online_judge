import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import { problem_calling } from './services/api';

function ProblemDetails() {
  const { slug } = useParams(); // Extract slug from URL parameter
  const [problemDetails, setProblemDetails] = useState({
    title:"",
    desc:"",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      setIsLoading(true);
      try {
        const response = await problem_calling(slug); // Assuming your API endpoint is at /api/problem
        console.log(response);
        
        setProblemDetails({title:response.title,desc:response.desc});
        console.log("pd",problemDetails);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
      
    };

    fetchProblemDetails();
  }, [slug]);
  return (
    <div>
      {isLoading ? (
        <p>Loading problems...</p>
      ) : (
    <div>
        <div>hi</div>
        <div>{problemDetails.title}</div>
        </div>
      )}
      
    </div>
  );

  // ... (render problem details based on problemDetails state)
}

export default ProblemDetails;
