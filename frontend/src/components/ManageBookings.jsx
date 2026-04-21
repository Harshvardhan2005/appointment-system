import { useState } from 'react';

const API_BASE = 'http://localhost:8081/api';

export default function ManageBookings() {
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [searched, setSearched] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editSlot, setEditSlot] = useState('');

  const fetchBookings = async (e) => {
    e.preventDefault();
    if (!phone) return;
    
    try {
      const res = await fetch(`${API_BASE}/appointments?phone=${phone}`);
      if (res.ok) {
        setAppointments(await res.json());
        setSearched(true);
      }
    } catch (err) {
      console.error('Error fetching bookings', err);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}/status?status=CANCELLED`, {
        method: 'PUT'
      });
      if (res.ok) {
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'CANCELLED' } : app));
      }
    } catch (err) {
      console.error('Error cancelling appointment', err);
    }
  };

  const startEdit = (app) => {
    setEditingId(app.id);
    setEditDate(app.appointmentDate);
    setEditSlot(app.timeSlot);
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}/slot?date=${editDate}&timeSlot=${editSlot}`, {
        method: 'PUT'
      });
      if (res.ok) {
        const updated = await res.json();
        setAppointments(prev => prev.map(app => app.id === id ? updated : app));
        setEditingId(null);
      } else {
        alert("Failed to update slot (may be already booked).");
      }
    } catch (err) {
      console.error('Error updating appointment slot', err);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Manage Your Bookings</h2>
      
      <form onSubmit={fetchBookings} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="tel" 
          placeholder="Enter your phone number to find bookings..." 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
        />
        <button type="submit" className="btn">Find Bookings</button>
      </form>

      {searched && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>
                    {editingId === app.id ? (
                      <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{ padding: '4px', background: 'white' }} />
                    ) : app.appointmentDate}
                  </td>
                  <td>
                    {editingId === app.id ? (
                      <select value={editSlot} onChange={(e) => setEditSlot(e.target.value)} style={{ padding: '4px', background: 'white' }}>
                        <option value="09:00-09:30">09:00-09:30</option>
                        <option value="09:30-10:00">09:30-10:00</option>
                        <option value="10:00-10:30">10:00-10:30</option>
                        <option value="10:30-11:00">10:30-11:00</option>
                        <option value="11:00-11:30">11:00-11:30</option>
                      </select>
                    ) : app.timeSlot}
                  </td>
                  <td>
                    <span style={{
                      background: app.status === 'SCHEDULED' ? 'rgba(59, 130, 246, 0.2)' : 
                                 app.status === 'IN_PROGRESS' ? 'rgba(16, 185, 129, 0.2)' : 
                                 app.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 0', display: 'flex', gap: '8px' }}>
                    {(app.status === 'SCHEDULED') && (
                      <>
                        {editingId === app.id ? (
                          <>
                            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#3b82f6' }} onClick={() => saveEdit(app.id)}>Save</button>
                            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', border: '1px solid #9ca3af', color: '#9ca3af' }} onClick={() => setEditingId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6' }} onClick={() => startEdit(app)}>Update</button>
                            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }} onClick={() => cancelAppointment(app.id)}>Cancel</button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found for this number.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
