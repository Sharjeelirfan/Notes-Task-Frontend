"use client";

import { useEffect, useState } from "react";
import NoteItem from "@/components/NoteItem";
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
          notes.map((note) => <NoteItem key={note.id} note={note} />)
        ) : (
          <p>No public notes found.</p>
        )}
      </div>
    </div>
  );
};

export default PublicNotesPage;
