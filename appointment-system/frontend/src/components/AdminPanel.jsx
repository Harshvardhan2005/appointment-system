import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8081/api';

export default function AdminPanel() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments`);
      if (res.ok) {
        setAppointments(await res.json());
      }
    } catch (e) {
      console.error('Error fetching appointments');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE}/appointments/${id}/status?status=${newStatus}`, {
        method: 'PUT'
      });
      fetchAppointments();
    } catch (e) {
      console.error('Error updating status');
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this appointment?")) return;
    try {
      await fetch(`${API_BASE}/appointments/${id}`, {
        method: 'DELETE'
      });
      fetchAppointments();
    } catch (e) {
      console.error('Error deleting appointment');
    }
  };

  return (
    <div className="glass-panel">
      <h2>Admin Dashboard</h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px' }}>Q#</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{app.queueNumber}</td>
                <td>{app.appointmentDate}</td>
                <td>{app.timeSlot}</td>
                <td>
                  <div>{app.customerName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.customerEmail}</div>
                </td>
                <td>
                  <span style={{
                    background: app.status === 'SCHEDULED' ? 'rgba(59, 130, 246, 0.2)' : 
                               app.status === 'IN_PROGRESS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'
                  }}>
                    {app.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px', padding: '12px 0' }}>
                  {app.status === 'SCHEDULED' && (
                    <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => updateStatus(app.id, 'IN_PROGRESS')}>Start</button>
                  )}
                  {app.status === 'IN_PROGRESS' && (
                    <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#10b981' }} onClick={() => updateStatus(app.id, 'COMPLETED')}>Complete</button>
                  )}
                  {app.status !== 'COMPLETED' && app.status !== 'CANCELLED' && (
                    <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }} onClick={() => updateStatus(app.id, 'CANCELLED')}>Cancel</button>
                  )}
                  {app.status === 'COMPLETED' && (
                    <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#ef4444' }} onClick={() => deleteAppointment(app.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
