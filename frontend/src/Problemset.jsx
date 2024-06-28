import React, { useState, useEffect } from "react";
import { probleming } from "./services/api";
import { Link } from "react-router-dom";

function Problemset() {
  const [problems, setProblems] = useState([]); // Array to store fetched problems
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [isLoading, setIsLoading] = useState(false); // Flag for loading state

  // Function to fetch problems based on the current page number
  const fetchProblems = async (pageNumber) => {
    console.log(pageNumber);
    setIsLoading(true);
    try {
      const response = await probleming(pageNumber);
      setProblems(response);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setIsLoading(false);
    }
    console.log(problems);
  };

  // Fetch problems on initial render and page changes
  useEffect(() => {
    fetchProblems(currentPage);
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
    <div>
      {isLoading ? (
        <p>Loading problems...</p>
      ) : problems.length > 0 ? (
        <table className="mx-96 my-8">
          <thead>
            <tr>
              <th className="px-6 py-3 border border-black border-double shadow text-left text-3xl font-medium text-gray-500 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-3 border border-black border-double shadow text-left text-3xl font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id}>
                <td className="px-6 py-4 border border-slate-500 whitespace-nowrap text-center text-xl font-medium text-gray-700">
                  <Link to={`/problem/${problem.slug}`}>{problem.title}</Link>
                </td>
                <td className="px-6 py-4 border border-slate-500 whitespace-nowrap text-center text-xl font-medium text-gray-700">
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
        className="border font-mono text-2xl ml-96 mr-24"
      >
        Prev
      </button>
      <button
        disabled={isLoading}
        onClick={handleNextPage}
        className="border font-mono text-2xl ml-52"
      >
        Next
      </button>
    </div>
  );
}

export default Problemset;
