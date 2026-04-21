import { useState } from 'react';

const API_BASE = 'http://localhost:8081/api';

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00-09:30'
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setMessage(`Success! Your Queue Number is ${data.queueNumber}`);
        setFormData({ ...formData, name: '', email: '', phone: '' });
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.error || 'Failed to book'}`);
      }
    } catch (error) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="glass-panel">
      <h2>Book an Appointment</h2>
      {message && <div style={{ marginBottom: '15px', color: message.includes('Error') ? '#ef4444' : '#10b981' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
        </div>
        <div className="input-group">
          <label>Email Address</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" />
        </div>
        <div className="input-group">
          <label>Date</label>
          <input type="date" name="appointmentDate" required value={formData.appointmentDate} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Time Slot</label>
          <select name="timeSlot" value={formData.timeSlot} onChange={handleChange}>
            <optgroup label="Morning Shift (9 AM - 2 PM)">
              <option value="09:00-09:30">09:00 - 09:30 AM</option>
              <option value="09:30-10:00">09:30 - 10:00 AM</option>
              <option value="10:00-10:30">10:00 - 10:30 AM</option>
              <option value="10:30-11:00">10:30 - 11:00 AM</option>
              <option value="11:00-11:30">11:00 - 11:30 AM</option>
              <option value="11:30-12:00">11:30 - 12:00 PM</option>
              <option value="12:00-12:30">12:00 - 12:30 PM</option>
              <option value="12:30-13:00">12:30 - 01:00 PM</option>
              <option value="13:00-13:30">01:00 - 01:30 PM</option>
              <option value="13:30-14:00">01:30 - 02:00 PM</option>
            </optgroup>
            <optgroup label="Evening Shift (5 PM - 9 PM)">
              <option value="17:00-17:30">05:00 - 05:30 PM</option>
              <option value="17:30-18:00">05:30 - 06:00 PM</option>
              <option value="18:00-18:30">06:00 - 06:30 PM</option>
              <option value="18:30-19:00">06:30 - 07:00 PM</option>
              <option value="19:00-19:30">07:00 - 07:30 PM</option>
              <option value="19:30-20:00">07:30 - 08:00 PM</option>
              <option value="20:00-20:30">08:00 - 08:30 PM</option>
              <option value="20:30-21:00">08:30 - 09:00 PM</option>
            </optgroup>
          </select>
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Book Now</button>
      </form>
    </div>
  );
}
