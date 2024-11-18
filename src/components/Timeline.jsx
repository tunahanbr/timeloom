import React from "react";
import { RiMore2Line } from "react-icons/ri";


function Timeline( {timeline} ) {
  return (
    <>
      <div className="relative bg-gray-50 overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <td className="px-6 py-3">Name</td>
              <td className="px-6 py-3">Start</td>
              <td className="px-6 py-3">Duration</td>
              <td></td>
            </tr>
          </thead>
          {timeline.map((item, i) => (
            <tr>
              <td className="px-6 py-3">{item.name}</td>
              <td className="px-6 py-3">{item.start_time}</td>
              <td className="px-6 py-3">{item.duration}</td>
              <td>
                <RiMore2Line className="hover:text-black cursor-pointer" />
              </td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}

export default Timeline;
