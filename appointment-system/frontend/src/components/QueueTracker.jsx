import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8081/api';

export default function QueueTracker({ fullWidth }) {
  const [queueData, setQueueData] = useState({ currentQueueNumber: '-', timeSlot: '-', status: 'LOADING' });

  const fetchQueue = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments/queue/live`);
      if (res.ok) {
        setQueueData(await res.json());
      }
    } catch (e) {
      console.error('Error fetching live queue');
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel queue-display" style={{ width: fullWidth ? '100%' : 'auto', maxWidth: fullWidth ? '600px' : 'auto', margin: fullWidth ? '0 auto' : '0' }}>
      <h2>Live Queue Tracking</h2>
      <p style={{ color: 'var(--text-muted)' }}>Currently Serving</p>
      
      <div className="queue-number">
        {queueData.currentQueueNumber || 0}
      </div>
      
      {queueData.currentName && queueData.currentName !== '-' && (
        <h3 style={{ margin: '10px 0', color: 'white' }}>{queueData.currentName}</h3>
      )}
      
      <div>
        <span style={{ marginRight: '10px' }}>Slot: <strong>{queueData.timeSlot}</strong></span>
        <span style={{ 
          background: queueData.status === 'SERVING' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'
        }}>
          {queueData.status}
        </span>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Next in Line</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Q#{queueData.nextQueueNumber || '-'}</span>
            <span style={{ marginLeft: '10px', color: 'white' }}>{queueData.nextName || '-'}</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {queueData.nextTimeSlot || '-'}
          </div>
        </div>
      </div>
      
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '20px' }}>Auto-updates every 5s</p>
    </div>
  );
}
