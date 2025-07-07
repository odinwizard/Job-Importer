'use client';
import { useState } from 'react';

export default function JobFeedsForm({ onImport }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFeed, setActiveFeed] = useState(null);

  const jobFeeds = [
    {
      name: "All Jobs",
      url: "https://jobicy.com/?feed=job_feed"
    },
    {
      name: "Social Media (Full-time)",
      url: "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time"
    },
    {
      name: "Sellers in France (Full-time)",
      url: "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france"
    },
    {
      name: "Design & Multimedia",
      url: "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia"
    },
    {
      name: "Data Science",
      url: "https://jobicy.com/?feed=job_feed&job_categories=data-science"
    },
    {
      name: "Copywriting",
      url: "https://jobicy.com/?feed=job_feed&job_categories=copywriting"
    },
    {
      name: "Business",
      url: "https://jobicy.com/?feed=job_feed&job_categories=business"
    },
    {
      name: "Management",
      url: "https://jobicy.com/?feed=job_feed&job_categories=management"
    },
    {
      name: "Higher Education Jobs",
      url: "https://www.higheredjobs.com/rss/articleFeed.cfm"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onImport(url);
      setUrl('');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedSelect = (feedUrl, index) => {
    setUrl(feedUrl);
    setActiveFeed(index);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setActiveFeed(null); // Reset active feed when typing manually
          }}
          placeholder="Enter job feed URL"
          required
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Importing...' : 'Import Jobs'}
        </button>
      </form>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="mt-4">
        <p className="font-medium mb-2">Predefined Job Feeds:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {jobFeeds.map((feed, index) => (
            <button 
              key={feed.url}
              type="button"
              onClick={() => handleFeedSelect(feed.url, index)}
              className={`p-3 border rounded text-left transition-colors ${
                activeFeed === index
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium block text-black">{feed.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
