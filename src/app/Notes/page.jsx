"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true); // renamed to avoid conflict
  const { user, loading } = useAuth(); // loading here is for auth state
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [user, loading]);

  // Fetch user notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (err) {
        alert("Failed to load notes");
      } finally {
        setNotesLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading || notesLoading) return <p>Loading notes...</p>;

  if (!user) return <p>Redirecting to login...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">My Notes</h1>
        <Link href="/Notes/Add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add Note
          </button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border p-4 rounded hover:shadow transition"
            >
              <Link href={`/Notes/${note.id}`}>
                <h2 className="text-xl font-semibold">{note.title}</h2>
                <p className="text-gray-600 text-sm">
                  Visibility: {note.visibility}
                </p>
                <p className="mt-2 text-gray-800 line-clamp-2">
                  {note.description}
                </p>
                {note.tags.length > 0 && (
                  <div className="text-sm text-blue-600 mt-2">
                    Tags: {note.tags.join(", ")}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
