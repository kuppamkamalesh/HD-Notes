// import React, { useEffect, useState, useRef } from "react";
// import { motion } from "framer-motion";
// import HDLogo from "../components/HDlogo";
// import { Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { fetchNotes, createNote, deleteNote } from "../services/notes";
// import { toast } from "react-hot-toast";

// interface Note {
//   _id: string;
//   title: string;
//   content: string;
//   updatedAt: string;
// }

// const Dashboard: React.FC = () => {
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [newNote, setNewNote] = useState("");
//   const inputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadNotes = async () => {
//       try {
//         const data = await fetchNotes();
//         setNotes(data);
//       } catch (err) {
//         toast.error("Failed to load notes");
//       }
//     };
//     loadNotes();
//   }, []);

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteNote(id);
//       setNotes((prev) => prev.filter((note) => note._id !== id));
//       toast.success("Note deleted");
//     } catch (err) {
//       toast.error("Failed to delete note");
//     }
//   };

//   const handleCreateNote = async () => {
//     if (newNote.trim() === "") return;
//     try {
//       const note = await createNote(newNote, " ");
//       setNotes((prev) => [note, ...prev]);
//       setNewNote("");
//       inputRef.current?.focus();
//       toast.success("Note created");
//     } catch (err) {
//       toast.error("Failed to create note");
//     }
//   };

//   const handleSignOut = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     navigate("/signin");
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleCreateNote();
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.4 }}
//       className="min-h-screen bg-gray-50 px-4 py-6"
//     >
//       {/* Top Bar */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-2">
//           <HDLogo />
//           <h1 className="text-xl font-bold">Dashboard</h1>
//         </div>
//         <button
//           onClick={handleSignOut}
//           className="text-blue-600 font-medium hover:underline"
//         >
//           Sign Out
//         </button>
//       </div>

//       {/* Welcome Card */}
//       <div className="bg-white rounded-lg shadow p-4 mb-4">
//         <h2 className="text-lg font-semibold">Welcome, Kamalesh!</h2>
//         <p className="text-gray-500 text-sm">
//           Email: {JSON.parse(sessionStorage.getItem("user") || "{}").email}
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
//         <input
//           ref={inputRef}
//           type="text"
//           value={newNote}
//           onChange={(e) => setNewNote(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Enter a note..."
//           className="w-full md:flex-1 border border-gray-300 rounded-lg px-3 py-2"
//         />
//         <button
//           onClick={handleCreateNote}
//           className="w-full md:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
//         >
//           Create Note
//         </button>
//       </div>

//       {/* Notes Section */}
//       <h2 className="text-lg font-semibold mb-2">Notes</h2>
//       <div className="space-y-3">
//         {notes.length === 0 ? (
//           <p className="text-gray-500">No notes yet. Start by creating one!</p>
//         ) : (
//           notes.map((note) => (
//             <motion.div
//               key={note._id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
//             >
//               <span className="text-gray-800">{note.title}</span>
//               <button
//                 onClick={() => handleDelete(note._id)}
//                 className="text-gray-400 hover:text-red-500 transition"
//               >
//                 <Trash2 size={18} />
//               </button>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import HDLogo from "../components/HDlogo";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchNotes, createNote, deleteNote } from "../services/notes";
import type { Note } from "../services/notes";
import { toast } from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const data = await fetchNotes();
        setNotes(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load notes";
        toast.error(msg);
        if (msg.toLowerCase().includes("unauthorized")) {
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete note";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateNote = async () => {
    if (newNote.trim() === "") {
      toast.error("Note cannot be empty");
      return;
    }
    try {
      setCreating(true);
      const note = await createNote(newNote, "");
      setNotes((prev) => [note, ...prev]);
      setNewNote("");
      inputRef.current?.focus();
      toast.success("Note created");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create note";
      toast.error(msg);
      if (msg.toLowerCase().includes("unauthorized")) {
        navigate("/signin");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    toast.success("Signed out");
    navigate("/signin");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateNote();
    }
  };

  const userEmail =
    JSON.parse(sessionStorage.getItem("user") || "null")?.email ||
    JSON.parse(localStorage.getItem("user") || "null")?.email ||
    "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 px-4 py-6"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <HDLogo />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <button
          onClick={handleSignOut}
          className="text-blue-600 font-medium hover:underline"
        >
          Sign Out
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold">Welcome!</h2>
        <p className="text-gray-500 text-sm">Email: {userEmail}</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a note..."
          className="w-full md:flex-1 border border-gray-300 rounded-lg px-3 py-2"
          disabled={creating}
        />
        <button
          onClick={handleCreateNote}
          className="w-full md:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Note"}
        </button>
      </div>

      {/* Notes Section */}
      <h2 className="text-lg font-semibold mb-2">Notes</h2>
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">No notes yet. Start by creating one!</p>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
            >
              <span className="text-gray-800">{note.title}</span>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-gray-400 hover:text-red-500 transition disabled:opacity-60"
                disabled={deletingId === note._id}
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
