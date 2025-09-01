import { Router } from "express";
import Note from "../models/Note";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Get all notes
router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const notes = await Note.find({ user: req.user?.id }).sort({ updatedAt: -1 });
  res.json(notes);
});

// Create a note
router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { title, content } = req.body;
  const note = await Note.create({
    user: req.user?.id,
    title,
    content,
  });
  res.status(201).json(note);
});

// Update a note
router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { title, content } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user?.id },
    { title, content },
    { new: true }
  );
  if (!note)
    return res.status(404).json({ error: { message: "Note not found" } });
  res.json(note);
});

// Delete a note
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user?.id,
  });
  if (!note)
    return res.status(404).json({ error: { message: "Note not found" } });
  res.json({ message: "Note deleted" });
});

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { q } = req.query;
  const query = {
    user: req.user?.id,
    ...(q && { title: { $regex: q, $options: "i" } }),
  };
  const notes = await Note.find(query).sort({ updatedAt: -1 });
  res.json(notes);
});

export default router;
