// client/src/pages/EventsList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

function EventsList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // load events
  useEffect(() => {
    api.events.list().then((res) => setEvents(res.data));
  }, []);

  const handleRSVP = async (eventId, isAttending) => {
    const method = isAttending ? api.events.leave : api.events.rsvp;
    const res = await method(eventId);
    setEvents((prev) => prev.map((e) => (e._id === eventId ? res.data : e)));
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    await api.events.delete(eventId);
    setEvents((prev) => prev.filter((e) => e._id !== eventId));
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 text-lg">📅</span>
            </div>
            <span className="font-semibold text-xl text-purple-800">
              EventHorizon
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/events/new")}
              className="hidden sm:inline-flex text-sm bg-purple-600 text-white px-3 py-1.5 rounded-full"
            >
              + Create
            </button>
            <span className="hidden sm:inline text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-purple-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Discover Unforgettable <br className="hidden sm:block" />
            Experiences
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Find and join local events, meet new people, and create memories
            that last a lifetime.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm"
            />
            <button className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white flex items-center justify-center gap-2">
              <span className="text-gray-600">All Categories</span>
              <span>▾</span>
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Events cards */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Upcoming Events
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filtered.length} events
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => {
              const isOwner = e.createdBy?._id === user?.id;
              const attendees = e.attendees || [];
              const isAttending = attendees.some((a) => a._id === user?.id);
              const isFull = attendees.length >= e.capacity;

              return (
                <article
                  key={e._id}
                  className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                >
                  {/* image + category badge */}
                  <div className="relative">
                    {e.imageUrl && (
                      <img
                        src={`${import.meta.env.VITE_API_URL.replace(
                          "/api",
                          ""
                        )}${e.imageUrl}`}
                        alt={e.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <span className="absolute top-3 right-3 text-xs font-semibold bg-purple-600 text-white px-3 py-1 rounded-full">
                      TECH
                    </span>
                  </div>

                  {/* content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* date */}
                    <p className="text-xs font-medium text-purple-600 flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(e.dateTime).toLocaleString()}</span>
                    </p>

                    {/* title */}
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">
                      {e.title}
                    </h3>

                    {/* description */}
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {e.description}
                    </p>

                    {/* location + capacity */}
                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                      <p className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{e.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>👥</span>
                        <span>
                          {attendees.length} / {e.capacity} attending
                        </span>
                      </p>
                    </div>

                    {/* buttons */}
                    <div className="mt-5 space-y-2">
                      {isOwner && (
                        <>
                          <button
                            onClick={() => navigate(`/events/${e._id}/edit`)}
                            className="w-full text-xs font-medium px-3 py-2 rounded-full bg-amber-100 text-amber-900"
                          >
                            Edit event
                          </button>
                          <button
                            onClick={() => handleDelete(e._id)}
                            className="w-full text-xs font-medium px-3 py-2 rounded-full bg-rose-100 text-rose-800"
                          >
                            Delete event
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleRSVP(e._id, isAttending)}
                        disabled={!isAttending && isFull}
                        className={`w-full text-xs font-medium px-3 py-2 rounded-full ${
                          isAttending
                            ? "bg-red-600 text-white"
                            : isFull
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-purple-600 text-white"
                        }`}
                      >
                        {isAttending
                          ? "Leave event"
                          : isFull
                          ? "Event full"
                          : "Join event"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventsList;
