"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate }: { targetDate: string | null }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [isExpired, setIsExpired] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference <= 0) {
                setIsExpired(true);
                clearInterval(interval);
            } else {
                setIsExpired(false);
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!mounted || !targetDate) return null;

    if (isExpired) {
        return (
            <div className="bg-red-900/30 border border-red-500 text-red-300 font-bold py-3 px-6 rounded-2xl w-full max-w-md mx-auto text-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                Le iscrizioni sono CHIUSE.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-3 md:gap-6">
                {[
                    { label: "Giorni", value: timeLeft.days },
                    { label: "Ore", value: timeLeft.hours },
                    { label: "Minuti", value: timeLeft.minutes },
                    { label: "Secondi", value: timeLeft.seconds }
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center group">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden transition-all group-hover:border-oro/30 group-hover:bg-white/[0.08]">
                            <div className="absolute inset-0 bg-gradient-to-br from-oro/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="font-display text-3xl md:text-5xl font-black text-oro text-glow relative z-10">
                                {item.value.toString().padStart(2, "0")}
                            </span>
                        </div>
                        <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-4 opacity-80 group-hover:text-oro group-hover:opacity-100 transition-all">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
