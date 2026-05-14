import React, { useState, useEffect } from "react";
import {
  getAllElections,
  deleteElection,
} from "../services/adminElectionService";
import { Link } from "react-router";
import CreateElectionModal from "../components/admin/CreateElectionModal";
import EditElectionModal from "../components/admin/EditElectionModal";
import { formatToIST } from "../utils/dateTime";

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [selectedElection, setSelectedElection] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);

  const limit = 10;

  // Fetch elections
  const fetchElections = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      const res = await getAllElections(page, limit);

      setElections((prev) => {
        const prevMap = new Map(
          prev.map((election) => [election._id, election]),
        );

        return (res.data || []).map((election) => {
          const oldElection = prevMap.get(election._id);

          // preserve reference
          // if nothing changed
          if (
            oldElection &&
            JSON.stringify(oldElection) === JSON.stringify(election)
          ) {
            return oldElection;
          }

          return election;
        });
      });

      setPagination(res.pagination || null);

      // sync modal election
      if (selectedElection) {
        const updatedElection = (res.data || []).find(
          (election) => election._id === selectedElection._id,
        );

        if (updatedElection) {
          setSelectedElection(updatedElection);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchElections();

    const interval = setInterval(() => {
      fetchElections(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [page]);

  // Edit election
  const handleEdit = (election) => {
    setSelectedElection(election);

    setOpenEditModal(true);
  };

  // Delete election
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this election?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteElection(id);

      setElections((prev) => prev.filter((election) => election._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete election");
    }
  };

  // Status badge styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20";

      case "ended":
        return "bg-red-500/20 text-red-300 border border-red-500/20";

      default:
        return "bg-blue-500/20 text-blue-300 border border-blue-500/20";
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>

          <p className="text-slate-400 mt-2">Manage elections</p>
        </div>

        <button
          onClick={() => setOpenCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-white text-black font-medium hover:opacity-90 transition"
        >
          Create Election
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {loading ? (
          <p className="text-slate-400">Loading elections...</p>
        ) : elections.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            No elections found
          </div>
        ) : (
          <div className="space-y-5">
            {elections.map((election) => (
              <div
                key={election._id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{election.title}</h2>

                    <div className="mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                          election.status,
                        )}`}
                      >
                        {election.status}
                      </span>
                    </div>

                    <p className="text-slate-400 mt-3">
                      Candidates: {election.candidates.length}
                    </p>

                    <p className="text-slate-500 mt-3 text-sm">
                      Starts: {formatToIST(election.startTime)}
                    </p>

                    <p className="text-slate-500 text-sm">
                      Ends: {formatToIST(election.endTime)}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      disabled={election.status === "ended"}
                      onClick={() => handleEdit(election)}
                      className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>

                    <button
                      disabled={election.status === "active"}
                      onClick={() => handleDelete(election._id)}
                      className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>

                    <Link
                      to={`/admin/results/${election._id}`}
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300"
                    >
                      Results
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-12 pt-8">
        <button
          disabled={!pagination?.hasPrevPage}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-slate-400 flex items-center">
          Page {pagination?.page || 1}
        </span>

        <button
          disabled={!pagination?.hasNextPage}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <CreateElectionModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreated={fetchElections}
      />

      <EditElectionModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        election={selectedElection}
        onUpdated={fetchElections}
      />
    </div>
  );
};

export default AdminDashboard;
