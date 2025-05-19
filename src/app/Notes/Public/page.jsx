"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

const PublicNotesPage = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes/public");
        console.log(res);
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌍 Public Notes</h1>
      <div className="grid gap-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-gray-600">{note.content}</p>
            </div>
          ))
        ) : (
          <p>No public notes found.</p>
        )}
      </div>
    </div>
  );
};

export default PublicNotesPage;
