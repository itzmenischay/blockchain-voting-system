import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BatchPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/batches");
        setBatches(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold mb-10 text-center">Batch Explorer</h2>

      {loading ? (
        <p className="text-center text-slate-400">Loading batches...</p>
      ) : batches.length === 0 ? (
        <p className="text-center text-slate-400">No batches yet</p>
      ) : (
        <div className="space-y-6">
          {batches.map((batch) => (
            <motion.div
              key={batch.batchId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold mb-2">{batch.batchId}</h3>

              <p className="text-sm text-slate-400 break-all">
                Root: {batch.merkleRoot || "Not stored"}
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Votes: {batch.votes.length}
              </p>

              <details className="mt-4">
                <summary className="cursor-pointer text-blue-400">
                  View Votes
                </summary>

                <div className="mt-2 text-xs text-slate-400 space-y-1">
                  {batch.votes.map((v, i) => (
                    <div key={i} className="break-all">
                      {v}
                    </div>
                  ))}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchPage;
