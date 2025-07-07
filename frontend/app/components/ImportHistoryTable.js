'use client';
export default function ImportHistoryTable({ data, total, page, onPageChange, loading }) {
  const totalPages = Math.ceil(total / 10);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };


  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="p-3 text-left border-b">Source URL</th>
              <th className="p-3 text-left border-b">Timestamp</th>
              <th className="p-3 text-left border-b">Total</th>
              <th className="p-3 text-left border-b">New</th>
              <th className="p-3 text-left border-b">Updated</th>
              <th className="p-3 text-left border-b">Failed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center border-b">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center border-b">No import history found</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b max-w-xs truncate">{`imported-${item.sourceUrl}`}</td>
                  <td className="p-3 border-b whitespace-nowrap">{formatDate(item.timestamp)}</td>
                  <td className="p-3 border-b">{item.totalFetched}</td>
                  <td className="p-3 border-b">{item.newJobs}</td>
                  <td className="p-3 border-b">{item.updatedJobs}</td>
                  <td className="p-3 border-b">{item.failedJobs}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => onPageChange(page - 1)} 
          disabled={page <= 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
        >
          Previous
        </button>
        
        <span className="text-sm">
          Page {page} of {totalPages} | Total {total} records
        </span>
        
        <button 
          onClick={() => onPageChange(page + 1)} 
          disabled={page >= totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
