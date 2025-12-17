import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: '',
    capacity: 10,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.events
      .get(id)
      .then((res) => {
        const e = res.data;
        setForm({
          title: e.title,
          description: e.description || '',
          dateTime: e.dateTime
            ? new Date(e.dateTime).toISOString().slice(0, 16)
            : '',
          location: e.location || '',
          capacity: e.capacity,
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load event');
      });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.events.update(id, {
        ...form,
        capacity: Number(form.capacity),
        dateTime: new Date(form.dateTime),
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update event');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Event</h1>

        <label className="block text-sm mb-1">Title</label>
        <input
          name="title"
          className="w-full border rounded px-3 py-2 mb-3"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          className="w-full border rounded px-3 py-2 mb-3"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />

        <label className="block text-sm mb-1">Date &amp; Time</label>
        <input
          type="datetime-local"
          name="dateTime"
          className="w-full border rounded px-3 py-2 mb-3"
          value={form.dateTime}
          onChange={handleChange}
          required
        />

        <label className="block text-sm mb-1">Location</label>
        <input
          name="location"
          className="w-full border rounded px-3 py-2 mb-3"
          value={form.location}
          onChange={handleChange}
          required
        />

        <label className="block text-sm mb-1">Capacity</label>
        <input
          type="number"
          name="capacity"
          min="1"
          className="w-full border rounded px-3 py-2 mb-3"
          value={form.capacity}
          onChange={handleChange}
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Update event
        </button>
      </form>
    </div>
  );
}
