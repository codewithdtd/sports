import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const generatePages = () => {
    const pages = [];

    // Luôn hiển thị trang đầu tiên
    pages.push(1);

    // Nếu currentPage > 3, thêm dấu "..." sau trang đầu
    if (currentPage > 3) {
      pages.push("...");
    }

    // Hiển thị 2 trang trước và sau trang hiện tại, nhưng không vượt quá số trang đầu và cuối
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Nếu currentPage < totalPages - 2, thêm dấu "..." trước trang cuối
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Luôn hiển thị trang cuối cùng
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="inline-flex -space-x-px">
          {/* Nút Previous */}
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

          {/* Hiển thị các số trang */}
          {pages.map((page, index) => (
            <li key={index} className="leading-tight text-gray-500 bg-white border border-gray-400">
              {page === "..." ? (
                <p className="px-3 py-2">...</p>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2
                    ${page === currentPage ? "bg-green-500 text-white" : "text-gray-500 bg-white"}`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          {/* Nút Next */}
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
