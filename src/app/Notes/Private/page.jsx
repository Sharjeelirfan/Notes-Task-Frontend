"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const PrivateNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);
  //   console.log(user.token);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("Access Token:", token); // Debug

      if (!token) {
        setError("Token not found. Please log in again.");
        return;
      }

      try {
        const res = await api.get("/notes/private", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Failed to fetch private notes.");
      }
    };

    if (user) fetchNotes();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  //   console.log(notes);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔒 Private Notes</h1>

      {user ? (
        <div className="grid gap-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-bold mb-2">{note.title}</h2>
                <p className="text-gray-700">{note.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  👤 {note.user?.name || "Unknown"} | 📅{" "}
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p>No private notes available.</p>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Please Log In to View Private Notes
          </h2>
          <p className="text-red-500 mb-4">
            {error || "You are not authenticated."}
          </p>
        </div>
      )}
    </div>
  );
};

export default PrivateNotesPage;
