import React, { useState, useEffect } from "react";
import { probleming } from "./services/api";
import { Link } from "react-router-dom";

function Problemset() {
  const [problems, setProblems] = useState([]); // Array to store fetched problems
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [isLoading, setIsLoading] = useState(false); // Flag for loading state

  // Function to fetch problems based on the current page number
  const fetchProblems = async () => {
    console.log(currentPage);
    setIsLoading(true);
    try {
      const response = await probleming(currentPage);
      setProblems(response);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch problems on initial render and page changes
  useEffect(() => {
    fetchProblems();
  }, [currentPage]);

  const handleNextPage = () => {
    if (!isLoading) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (!isLoading) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };
  return (
    <div >
      {isLoading ? (
        <p>Loading problems...</p>
      ) : problems.length > 0 ? (
        <table className="mx-auto my-8">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-teal-400 rounded-full  shadow text-left text-3xl font-medium text-white uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-3 bg-teal-400 rounded-full  shadow text-left text-3xl font-medium text-white uppercase tracking-wider">
                Difficulty
              </th>
            </tr>
          </thead>
          <tbody >
            {problems.map((problem, index) => (
              <tr key={problem._id}>
                <td className="px-4 py-4 bg-purple-200 rounded-full whitespace-nowrap text-center text-xl font-medium text-black">
                  <Link to={`/problem/${problem.slug}`}>{problem.title}</Link>
                </td>
                <td className="px-6 py-4 bg-pink-200 rounded-full whitespace-nowrap text-center text-xl font-medium text-black">
                  {problem.difficulty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No problems found.</p>
      )}
      <button
        disabled={isLoading}
        onClick={handlePrevPage}
        className="mx-96 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Prev
      </button>
      <button
        disabled={isLoading}
        onClick={handleNextPage}
        className="mx-64 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Next
      </button>
    </div>
  );
}

export default Problemset;
