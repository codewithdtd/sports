import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="inline-flex -space-x-px">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-400 rounded-l-lg hover:bg-gray-300 hover:text-gray-700 
                ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <i className="ri-arrow-left-s-fill"></i>
            </button>
          </li>

          {pages.map((page) => (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 leading-tight border border-gray-400 hover:bg-gray-300 hover:text-gray-700 
                  ${page === currentPage ? "bg-green-500 text-white" : "text-gray-500 bg-white"}`}
              >
                {page}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-400 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 
                ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
            >
                <i className="ri-arrow-right-s-fill"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
