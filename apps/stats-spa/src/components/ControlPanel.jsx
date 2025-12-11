import './ControlPanel.css';

function ControlPanel({
  batchSize,
  isConnected,
  messageCount,
  onReset,
  onShowStats,
  onStart,
  setBatchSize,
  showStats,
  status
}) {
  const handleBatchSizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setBatchSize(value);
    }
  };

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h2>Management</h2>

        <div className="input-group">
          <label htmlFor="batchSize">Number of quotes in the batch:</label>
          <input
            className="batch-input"
            disabled={isConnected}
            id="batchSize"
            min="1"
            type="number"
            value={batchSize}
            onChange={handleBatchSizeChange}
          />
        </div>

        <div className="button-group">
          <button
            className={`btn btn-primary ${isConnected ? 'btn-stop' : 'btn-start'}`}
            onClick={onStart}
          >
            {isConnected ? 'Stop' : 'Start'}
          </button>

          <button className="btn btn-secondary" onClick={onShowStats}>
            {showStats ? 'Hide statistics' : 'Statistics'}
          </button>

          <button
            className="btn btn-danger"
            disabled={isConnected}
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="panel-section status-section">
        <div className="status-item">
          <span className="status-label">Status:</span>
          <span
            className={`status-value ${isConnected ? 'connected' : 'disconnected'}`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Messages received:</span>
          <span className="status-value">{messageCount}</span>
        </div>

        {status && (
          <div className="status-item status-message">
            <span className="status-value">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlPanel;
