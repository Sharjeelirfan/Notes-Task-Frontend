"use client";
import { useEffect } from "react";
import NoteForm from "@/components/NoteForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddNotePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [user, loading]);

  if (loading)
    return (
      <>
        <p>Loading....</p>
      </>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Note</h1>

      {user && <NoteForm />}
    </div>
  );
}
