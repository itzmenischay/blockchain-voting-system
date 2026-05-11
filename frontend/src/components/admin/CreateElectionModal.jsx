import React, { useState } from "react";

import { X, Plus, Trash2 } from "lucide-react";

import { createElection } from "../../services/adminElectionService";

const CreateElectionModal = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [candidates, setCandidates] = useState(["", ""]);

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const updateCandidate = (index, value) => {
    const updated = [...candidates];

    updated[index] = value;

    setCandidates(updated);
  };

  const addCandidate = () => {
    setCandidates([...candidates, ""]);
  };

  const removeCandidate = (index) => {
    if (candidates.length <= 2) return;

    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createElection({
        title,
        description,
        candidates,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });

      onCreated();

      onClose();

      setTitle("");
      setDescription("");

      setCandidates(["", ""]);

      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to create election");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0d1117]/95 backdrop-blur-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Create Election</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Election title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none h-28"
          />

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Candidates</h3>

              <button
                type="button"
                onClick={addCandidate}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {candidates.map((candidate, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder={`Candidate ${index + 1}`}
                    value={candidate}
                    onChange={(e) => updateCandidate(index, e.target.value)}
                    className="flex-1 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => removeCandidate(index)}
                    className="px-4 rounded-2xl bg-red-500/20 text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
            />

            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-white text-black font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Election"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateElectionModal;
