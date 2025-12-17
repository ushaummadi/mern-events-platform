import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: '',
    capacity: 10,
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1) create event
      const { data: created } = await api.events.create({
        ...form,
        capacity: Number(form.capacity),
        dateTime: new Date(form.dateTime),
      });

      // 2) upload image (optional)
      if (imageFile) {
        await api.events.uploadImage(created._id, imageFile);
      }

      navigate('/');
    } catch (err) {
      console.error('CREATE EVENT ERROR', err);
      setError(err.response?.data?.error || 'Failed to create event');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Create Event</h1>

        <label className="block text-sm mb-1">Title</label>
        <input
          name="title"
          className="w-full border rounded px-3 py-2 mb-3"
          onChange={handleChange}
          required
        />

        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          className="w-full border rounded px-3 py-2 mb-3"
          rows="3"
          onChange={handleChange}
        />

        <label className="block text-sm mb-1">Date &amp; Time</label>
        <input
          type="datetime-local"
          name="dateTime"
          className="w-full border rounded px-3 py-2 mb-3"
          onChange={handleChange}
          required
        />

        <label className="block text-sm mb-1">Location</label>
        <input
          name="location"
          className="w-full border rounded px-3 py-2 mb-3"
          onChange={handleChange}
          required
        />

        <label className="block text-sm mb-1">Capacity</label>
        <input
          type="number"
          name="capacity"
          min="1"
          className="w-full border rounded px-3 py-2 mb-3"
          onChange={handleChange}
          required
        />

        <label className="block text-sm mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full mb-3"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Save event
        </button>
      </form>
    </div>
  );
}
