/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Users, Calendar, Filter, ChevronRight, BarChart3, Info } from "lucide-react";
import { format, isAfter, isBefore, parse, addHours, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HORARIOS, DIAS, BARTENDER_COLORS } from "./constants";
import { cn } from "./lib/utils";
import { ScheduleEntry, BartenderStats } from "./types";

// Helper to calculate hours between two times, handling midnight crossover
const calculateDuration = (startTime: string, endTime: string): number => {
  const start = parse(startTime, "HH:mm", new Date(2000, 0, 1));
  let end = parse(endTime, "HH:mm", new Date(2000, 0, 1));
  
  if (isBefore(end, start)) {
    end = addHours(end, 24);
  }
  
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

// Helper to check if a shift is active right now
const isShiftActive = (entry: ScheduleEntry, now: Date): boolean => {
  const dayMap: Record<string, number> = {
    "Domingo": 0, "Segunda": 1, "Terça": 2, "Quarta": 3, "Quinta": 4, "Sexta": 5, "Sábado": 6
  };
  
  const currentDay = now.getDay();
  const yesterdayDay = (currentDay + 6) % 7;
  
  const currentTimeStr = format(now, "HH:mm");
  const current = parse(currentTimeStr, "HH:mm", new Date(2000, 0, 1));
  const start = parse(entry.inicio, "HH:mm", new Date(2000, 0, 1));
  const end = parse(entry.fim, "HH:mm", new Date(2000, 0, 1));

  // Case 1: Shift started TODAY
  if (dayMap[entry.dia] === currentDay) {
    if (isBefore(start, end)) {
      // Normal day shift (e.g., 12:00 - 20:00)
      return (isAfter(current, start) || currentTimeStr === entry.inicio) && isBefore(current, end);
    } else {
      // Overnight shift that started today (e.g., Starts 22:00 Monday, Ends 03:00 Tuesday)
      return (isAfter(current, start) || currentTimeStr === entry.inicio);
    }
  }

  // Case 2: Shift started YESTERDAY and crosses into today
  if (dayMap[entry.dia] === yesterdayDay) {
    if (isBefore(end, start)) {
      // It was an overnight shift. Early this morning (e.g., before 03:00 Tuesday)
      return isBefore(current, end);
    }
  }
  
  return false;
};

export default function App() {
  const [filter, setFilter] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const hours: Record<string, number> = {};
    HORARIOS.forEach(h => {
      hours[h.funcionario] = (hours[h.funcionario] || 0) + calculateDuration(h.inicio, h.fim);
    });
    
    return Object.entries(hours).map(([name, totalHours]) => ({
      name,
      totalHours,
      color: BARTENDER_COLORS[name] || "#ffffff"
    })).sort((a, b) => b.totalHours - a.totalHours);
  }, []);

  const currentWorking = useMemo(() => {
    return HORARIOS.filter(h => isShiftActive(h, now));
  }, [now]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-black pb-12">
      {/* Top Banner */}
      <div className="bg-orange-500 text-black py-1.5 px-4 text-center font-black uppercase text-[10px] tracking-widest sticky top-0 z-50">
        CHEERS O BAR • BOM TRABALHO EQUIPA!
      </div>

      <div className="max-w-4xl mx-auto px-3 py-6">
        
        {/* Header - Compact Line */}
        <header className="flex justify-between items-end mb-8 border-b border-zinc-900 pb-4">
          <div className="flex flex-col">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
              CHEERS <span className="text-orange-500">O BAR</span>
            </h1>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Staff Schedule</span>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-black tabular-nums">{format(now, "HH:mm")}</div>
            <div className="text-[10px] uppercase font-bold text-zinc-500">{format(now, "d MMM", { locale: ptBR })}</div>
          </div>
        </header>

        {/* Now Working - Compact Badge */}
        {currentWorking.length > 0 && (
          <div className="mb-10 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-orange-500">No Balcão</span>
            </div>
            <div className="flex gap-2">
              {currentWorking.map((h, i) => (
                <div 
                  key={i}
                  className="px-3 py-1 rounded-lg text-black font-black uppercase text-xs"
                  style={{ backgroundColor: BARTENDER_COLORS[h.funcionario] }}
                >
                  {h.funcionario}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Matrix - Scan everything in 8s */}
        <section className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Equipa</h2>
            <div className="flex gap-2">
              {stats.map(s => (
                <button 
                  key={s.name}
                  onClick={() => setFilter(filter === s.name ? null : s.name)}
                  className={cn(
                    "w-8 h-8 rounded-full text-[10px] font-black transition-all flex items-center justify-center border",
                    filter === s.name 
                      ? "bg-white text-black border-white ring-4 ring-white/10 scale-110" 
                      : "bg-zinc-900 text-zinc-500 border-zinc-800"
                  )}
                >
                  {s.name[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            {DIAS.map((dia) => {
              const diaHorarios = HORARIOS.filter(h => h.dia === dia);
              const isToday = DIAS[(now.getDay() + 6) % 7] === dia;

              return (
                <div 
                  key={dia} 
                  className={cn(
                    "relative overflow-hidden rounded-xl border transition-all",
                    isToday ? "bg-zinc-900 border-orange-500/30" : "bg-zinc-950/50 border-zinc-900",
                    filter && "opacity-50"
                  )}
                >
                  <div className="flex items-center p-1.5">
                    {/* Day Column */}
                    <div className="w-12 text-center border-r border-zinc-900/50">
                      <div className={cn(
                        "text-[10px] font-black uppercase tracking-tight",
                        isToday ? "text-orange-500" : "text-zinc-700"
                      )}>
                        {dia.substring(0, 3)}
                      </div>
                    </div>

                    {/* Shifts Column */}
                    <div className="flex-1 px-3 flex flex-wrap gap-1.5 py-1">
                      {diaHorarios.map((h, i) => {
                        const isFiltered = filter && h.funcionario !== filter;
                        const active = isShiftActive(h, now);
                        return (
                          <div 
                            key={i}
                            className={cn(
                              "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[10px] font-black transition-all",
                              active ? "bg-white text-black border-white" : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400",
                              isFiltered ? "opacity-10 grayscale scale-90" : "opacity-100 scale-100",
                              filter === h.funcionario && "ring-1 ring-white/50 opacity-100 scale-105"
                            )}
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BARTENDER_COLORS[h.funcionario] }} />
                            <span className="uppercase">{h.funcionario}</span>
                            <span className="opacity-40 font-mono text-[9px]">{h.inicio}-{h.fim}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats Row */}
        <footer className="mt-12 flex flex-wrap gap-4 border-t border-zinc-900 pt-8 justify-center">
          {stats.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] font-black uppercase text-zinc-600">{s.name} <span className="text-zinc-400">{s.totalHours}h</span></span>
            </div>
          ))}
        </footer>
      </div>
    </div>
  );
}

