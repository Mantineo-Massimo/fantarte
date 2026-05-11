"use client";

import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0a0f1c] text-white font-sans antialiased">
        <main className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="space-y-8 max-w-lg">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="text-5xl font-black tracking-tighter">Errore <span className="text-oro">Critico</span></h2>
              <p className="text-gray-400 text-lg">
                Si è verificato un problema fondamentale nel sistema. Prova a ricaricare l&apos;intera applicazione.
              </p>
            </motion.div>
            
            <button
              onClick={() => reset()}
              className="px-10 py-5 bg-oro text-blunotte font-black rounded-2xl flex items-center justify-center gap-3 mx-auto shadow-2xl"
            >
              <FiRefreshCw size={20} />
              Ricarica Applicazione
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
