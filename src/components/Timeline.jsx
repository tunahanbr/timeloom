import { useState } from "react";
import { RiMore2Line } from "react-icons/ri";

const Timeline = ({ timeline = [] }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = timeline.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(timeline.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="bg-gray-50 shadow-sm sm:rounded-lg">
        {timeline.length !== 0 ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <td className="px-6 py-3 w-1/2">Name</td>
                <td className="px-6 py-3 w-1/4">Start</td>
                <td className="px-6 py-3 w-1/4">Duration</td>
                <td className="w-10"></td>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 break-words">
                    <div className="max-w-xs">{item.name}</div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{item.start_time}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{item.duration}</td> {/* Directly display duration as a string */}
                  <td className="px-4 py-2 hover:text-black cursor-pointer">
                    <RiMore2Line />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-2 text-center">No entries</p>
        )}
      </div>

      {/* Pagination controls */}
      {timeline.length !== 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm">{`${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Timeline