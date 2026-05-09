import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Fingerprint,
  Layers,
  Link as LinkIcon,
  ArrowRight,
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router";

// --- DATA ---
const sections = [
  {
    title: "Secure Voting System",
    desc: "Every vote is cryptographically signed and verified, ensuring complete authenticity and tamper-proof integrity.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent & Verifiable",
    desc: "Merkle proofs allow every user to independently verify their vote inclusion without trusting the backend.",
    icon: Fingerprint,
  },
  {
    title: "Scalable Architecture",
    desc: "Batch processing and Layer-2 concepts ensure the system scales efficiently without compromising security.",
    icon: Layers,
  },
  {
    title: "Blockchain Anchoring",
    desc: "Final vote batches are anchored on-chain, creating a permanent and immutable audit trail.",
    icon: LinkIcon,
  },
];

const logos = ["Meta", "Google", "Airbnb", "Stripe", "Amazon"];

// --- COMPONENTS ---

const IllustrationPlaceholder = ({ Icon }) => (
  <div className="w-full aspect-square md:aspect-[4/3] rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden shadow-2xl group hover:border-white/20 transition-colors duration-500">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors duration-500" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:bg-white/10 transition-colors duration-500" />

    <Icon className="w-16 h-16 mb-4 opacity-50 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-110 transform" strokeWidth={1} />
    <span className="text-sm font-medium tracking-widest uppercase opacity-70">Illustration Space</span>
    <span className="text-xs mt-2 opacity-40">Replace with your image</span>
  </div>
);

// --- MAIN HOMEPAGE ---

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            System Live & Anchoring
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Next-Generation <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400">
              Blockchain Voting
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
            A framework for secure, transparent, and verifiable elections. Powered by advanced cryptography and decentralized ledgers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/vote-page")}
              className="px-8 py-4 bg-white text-slate-950 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors duration-300"
            >
              Enter Voting App
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
              Read Documentation
            </button>
          </div>
        </motion.div>
      </section>

      {/* LOGO STRIP */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-slate-500 tracking-widest uppercase mb-8">
            Trusted by Forward-Thinking Organizations
          </p>
          <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-50 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            {logos.map((logo, i) => (
              <span key={i} className="text-xl font-bold tracking-tight text-slate-300">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SCROLL SECTIONS */}
      <div className="py-24 space-y-32">
        {sections.map((sec, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <section key={index} className="flex items-center px-6 md:px-16 max-w-7xl mx-auto">
              <div className={`flex flex-col md:flex-row gap-12 lg:gap-24 items-center w-full ${isReversed ? "md:flex-row-reverse" : ""}`}>
                
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="flex-1 space-y-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-blue-400 mb-6">
                    <sec.icon className="w-7 h-7" />
                  </div>

                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-100">
                    {sec.title}
                  </h2>

                  <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                    {sec.desc}
                  </p>

                  <button className="group inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors pt-4">
                    Learn how it works
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="flex-1 w-full"
                >
                  <IllustrationPlaceholder Icon={ImageIcon} />
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative z-10 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-12 md:p-20 text-center shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-100 tracking-tight">
            Ready to secure your next election?
          </h2>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of organizations conducting transparent and verifiable votes.
          </p>

          <button
            onClick={() => navigate("/vote-page")}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
          >
            Launch Voting Application
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Blockchain Voting Framework
      </footer>
    </div>
  );
};

export default Home;