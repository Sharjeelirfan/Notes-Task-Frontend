"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";

const ViewNotePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedNote, setUpdatedNote] = useState({
    title: "",
    description: "",
    visibility: "PRIVATE",
    tags: "",
  });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/Notes/${id}`);
        setNote(response.data);
        setUpdatedNote(response.data);
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };

    fetchNote();
  }, [id]);

  const handleChange = (e) => {
    setUpdatedNote({ ...updatedNote, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/Notes/${id}`, updatedNote);
      setNote(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/Notes/${id}`);
      alert("Note deleted");
      router.push("/Notes"); // redirect to list
    } catch (err) {
      alert("Failed to delete note.");
      console.error(err);
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      {isEditing ? (
        <div>
          <input
            type="text"
            name="title"
            value={updatedNote.title}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
          />
          <textarea
            name="description"
            value={updatedNote.description}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
            rows={6}
          />
          <select
            name="visibility"
            value={updatedNote.visibility}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
          >
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
          </select>
          <input
            type="text"
            name="tags"
            value={updatedNote.tags}
            onChange={handleChange}
            placeholder="Comma separated tags"
            className="w-full border p-2 mb-4"
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
          <p className="mb-4">{note.description}</p>
          <p className="text-sm text-gray-600 mb-2">
            Visibility: {note.visibility}
          </p>
          <p className="text-sm text-gray-600 mb-4">Tags: {note.tags}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewNotePage;
