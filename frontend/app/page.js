'use client';
import { useEffect, useState } from 'react';
import ImportHistoryTable from './components/ImportHistoryTable';
import JobFeedsForm from './components/JobFeedsForm';
import { getImportHistory, importJobs } from './lib/api';

export default function Home() {
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImportHistory = async () => {
    setLoading(true);
    try {
      const data = await getImportHistory(page);
      setHistory(data.importLogs || data); // Adjust based on your actual response structure
      setTotal(data.total || data.length); // Adjust based on your actual response
    } catch (err) {
      setError(err.message || 'Failed to fetch import history');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (url) => {
    try {
      await importJobs(url);
      fetchImportHistory(); // Refresh history after import
    } catch (err) {
      setError(err.message || 'Failed to start import');
    }
  };

  useEffect(() => {
    fetchImportHistory();
  }, [page]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Job Import Dashboard</h1>
      
      <JobFeedsForm onImport={handleImport} />
      
      {error && <div className="p-4 mb-4 text-red-600 bg-red-100 rounded">{error}</div>}
      
      <ImportHistoryTable 
        data={history} 
        total={total} 
        page={page} 
        onPageChange={setPage} 
        loading={loading} 
      />
    </main>
  );
}
