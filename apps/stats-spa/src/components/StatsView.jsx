import { useEffect, useState } from 'react';

import './StatsView.css';

function StatsView() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api.php', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Error loading data');
      }

      const data = await response.json();
      setStats(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return parseFloat(num).toFixed(6);
  };

  if (loading) {
    return (
      <div className="stats-view">
        <div className="stats-header">
          <h2>Statistics History</h2>
          <button className="btn btn-refresh" onClick={loadStats}>
            Refresh
          </button>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-view">
        <div className="stats-header">
          <h2>Statistics History</h2>
          <button className="btn btn-refresh" onClick={loadStats}>
            Refresh
          </button>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="stats-view">
      <div className="stats-header">
        <h2>Statistics History</h2>
        <button className="btn btn-refresh" onClick={loadStats}>
          Refresh
        </button>
      </div>

      {stats.length === 0 ? (
        <div className="no-data">No data to display</div>
      ) : (
        <div className="table-container">
          <table className="stats-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Count</th>
                <th>Mean</th>
                <th>Median</th>
                <th>Min</th>
                <th>Max</th>
                <th>Std. Dev.</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.id}>
                  <td>{stat.id}</td>
                  <td>{formatDate(stat.created_at || stat.timestamp)}</td>
                  <td>{stat.count}</td>
                  <td>{formatNumber(stat.average || stat.mean)}</td>
                  <td>{formatNumber(stat.median)}</td>
                  <td>{formatNumber(stat.min)}</td>
                  <td>{formatNumber(stat.max)}</td>
                  <td>{formatNumber(stat.std_dev || stat.stdDev)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StatsView;
