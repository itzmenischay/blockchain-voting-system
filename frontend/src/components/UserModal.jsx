import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Wallet, Lock, LogOut, X } from "lucide-react";

const UserModal = ({ open, onClose, user, logout }) => {
  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-88 left-256 -translate-x-1/2 -translate-y-1/2 z-[60] w-[92%] max-w-sm"
            style={{
              background:
                "linear-gradient(145deg, rgba(18,18,22,0.98) 0%, rgba(10,10,14,0.99) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "28px",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            {/* Inner glow top edge */}
            <div
              className="absolute inset-x-0 top-0 h-px rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)",
              }}
            />

            <div className="p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                }}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Profile section */}
              <div className="flex flex-col items-center pt-2 pb-6">
                {/* Avatar */}
                <div className="relative mb-5">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03), rgba(255,255,255,0.15))",
                      padding: "1.5px",
                      borderRadius: "50%",
                    }}
                  />

                  <div
                    className="w-20 h-20 rounded-full overflow-hidden relative"
                    style={{
                      border: "2px solid rgba(255,255,255,0.08)",
                      boxShadow:
                        "0 0 0 4px rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.4)",
                    }}
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                        }}
                      >
                        <span
                          className="text-2xl font-semibold"
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: "'Georgia', serif",
                          }}
                        >
                          {user?.name?.[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <h2
                  className="text-xl font-semibold tracking-tight"
                  style={{
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  {user?.name}
                </h2>

                <span
                  className="mt-1.5 text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                >
                  {user?.role || "User"}
                </span>
              </div>

              {/* Divider */}
              <div
                className="mb-5"
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
                }}
              />

              {/* Details */}
              <div className="space-y-2.5 mb-6">
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={user?.email}
                />

                <InfoRow
                  icon={<Wallet className="w-4 h-4" />}
                  label="Wallet"
                  value={user?.walletAddress || "Not connected"}
                  mono
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                <ActionButton
                  icon={<Lock className="w-3.5 h-3.5" />}
                  label="Change Password"
                />

                <ActionButton
                  icon={<LogOut className="w-3.5 h-3.5" />}
                  label="Log Out"
                  onClick={handleLogout}
                  variant="danger"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const InfoRow = ({ icon, label, value, mono = false }) => (
  <div
    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <span
      style={{
        color: "rgba(255,255,255,0.25)",
      }}
    >
      {icon}
    </span>

    <div className="min-w-0">
      <p
        className="text-xs mb-0.5"
        style={{
          color: "rgba(255,255,255,0.28)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontSize: "10px",
        }}
      >
        {label}
      </p>

      <p
        className="text-sm truncate"
        style={{
          color: "rgba(255,255,255,0.75)",
          fontFamily: mono ? "'SF Mono', 'Fira Code', monospace" : "inherit",
          fontSize: mono ? "12px" : "13px",
        }}
      >
        {value}
      </p>
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, variant = "default" }) => {
  const isDanger = variant === "danger";

  const base = {
    background: isDanger ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.05)",

    border: isDanger
      ? "1px solid rgba(239,68,68,0.15)"
      : "1px solid rgba(255,255,255,0.07)",

    color: isDanger ? "rgba(252,165,165,0.85)" : "rgba(255,255,255,0.55)",
  };

  const hover = {
    background: isDanger ? "rgba(239,68,68,0.14)" : "rgba(255,255,255,0.09)",

    color: isDanger ? "rgba(252,165,165,1)" : "rgba(255,255,255,0.85)",
  };

  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
      style={{
        ...base,
        letterSpacing: "0.01em",
      }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hover);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, base);
      }}
    >
      {icon}
      {label}
    </button>
  );
};

export default UserModal;
