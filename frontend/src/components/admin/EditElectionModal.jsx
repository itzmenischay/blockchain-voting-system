import React, { useState, useEffect } from "react";

import { X, Plus } from "lucide-react";

import {
  updateElection,
  addCandidate,
  removeCandidate,
} from "../../services/adminElectionService";
import { formatForDateTimeInput } from "../../utils/dateTime";

const EditElectionModal = ({ open, onClose, election, onUpdated }) => {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [candidates, setCandidates] = useState(["", ""]);

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);

  const [candidateLoading, setCandidateLoading] = useState(false);

  const isEditable = election?.status === "upcoming";

  useEffect(() => {
    if (!election) {
      return;
    }

    setTitle(election.title || "");

    setDescription(election.description || "");

    setCandidates(election.candidates || ["", ""]);

    setStartTime(formatForDateTimeInput(election.startTime));

    setEndTime(formatForDateTimeInput(election.endTime));
  }, [election]);

  if (!open) {
    return null;
  }

  // Add candidate
  const handleAddCandidate = async () => {
    const name = prompt("Candidate name");

    if (!name?.trim()) {
      return;
    }

    try {
      setCandidateLoading(true);

      const res = await addCandidate(election._id, name);

      setCandidates(res.data.candidates);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add candidate");
    } finally {
      setCandidateLoading(false);
    }
  };

  // Remove Candidate
  const handleRemoveCandidate = async (candidate) => {
    const confirmed = window.confirm(`Remove ${candidate}?`);

    if (!confirmed) {
      return;
    }

    try {
      setCandidateLoading(true);

      const res = await removeCandidate(election._id, candidate);

      setCandidates(res.data.candidates);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove candidate");
    } finally {
      setCandidateLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateElection(election._id, {
        title,
        description,
        // candidates,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });

      onUpdated();

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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-md pt-24 pb-6 px-4 overflow-hidden">
      <div className="w-full max-w-2xl max-h-[calc(100vh-7rem)]rounded-[32px] border border-white/10 bg-[#0d1117]/95 backdrop-blur-2xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-8 pb-6 border-b border-white/10 shrink-0">
          <h2 className="text-2xl font-bold">Update Election</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-5 scrollbar-thin scrollbar-thumb-white/10"
        >
          <input
            type="text"
            placeholder="Election title"
            value={title}
            disabled={!isEditable}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
          />

          <textarea
            placeholder="Description"
            value={description}
            disabled={!isEditable}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none h-28"
          />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Candidates</h3>

              {election?.status === "upcoming" && (
                <button
                  type="button"
                  onClick={handleAddCandidate}
                  disabled={candidateLoading}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              )}
            </div>

            <div className="space-y-3">
              {candidates.map((candidate) => (
                <div
                  key={candidate}
                  className="flex justify-between items-center rounded-2xl bg-white/5 border border-white/10 px-5 py-4"
                >
                  <span>{candidate}</span>

                  {election?.status === "upcoming" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCandidate(candidate)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={startTime}
              disabled={!isEditable}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
            />

            <input
              type="datetime-local"
              value={endTime}
              disabled={!isEditable}
              onChange={(e) => setEndTime(e.target.value)}
              className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
            />
          </div>
        </form>
        <div className="sticky bottom-0 bg-[#0d1117]/95 pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={loading || !isEditable}
            className="w-full py-4 rounded-2xl bg-white text-black font-semibold disabled:opacity-50"
          >
            {!isEditable
              ? "Election Locked"
              : loading
                ? "Updating..."
                : "Update Election"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditElectionModal;
