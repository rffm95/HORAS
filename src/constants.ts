import { ScheduleEntry } from './types';

export const HORARIOS: ScheduleEntry[] = [
  { dia: "Segunda", inicio: "12:00", fim: "15:00", funcionario: "Rui" },
  { dia: "Segunda", inicio: "15:00", fim: "20:00", funcionario: "Dinis" },
  { dia: "Segunda", inicio: "20:00", fim: "02:30", funcionario: "Bento" },
  { dia: "Segunda", inicio: "22:00", fim: "02:30", funcionario: "David" },

  { dia: "Terça", inicio: "12:00", fim: "20:00", funcionario: "Dinis" },
  { dia: "Terça", inicio: "20:00", fim: "02:30", funcionario: "Bento" },
  { dia: "Terça", inicio: "22:00", fim: "02:30", funcionario: "David" },

  { dia: "Quarta", inicio: "12:00", fim: "20:00", funcionario: "Bento" },
  { dia: "Quarta", inicio: "20:00", fim: "02:30", funcionario: "Divad" },
  { dia: "Quarta", inicio: "22:00", fim: "02:30", funcionario: "David" },

  { dia: "Quinta", inicio: "12:00", fim: "15:00", funcionario: "Rui" },
  { dia: "Quinta", inicio: "15:00", fim: "20:00", funcionario: "Dinis" },
  { dia: "Quinta", inicio: "20:00", fim: "02:30", funcionario: "Divad" },
  { dia: "Quinta", inicio: "22:00", fim: "02:30", funcionario: "David" },

  { dia: "Sexta", inicio: "11:00", fim: "20:00", funcionario: "David" },
  { dia: "Sexta", inicio: "20:00", fim: "03:00", funcionario: "Bento" },
  { dia: "Sexta", inicio: "22:00", fim: "03:00", funcionario: "David" },
  { dia: "Sexta", inicio: "22:00", fim: "03:00", funcionario: "JP" },

  { dia: "Sábado", inicio: "12:00", fim: "20:00", funcionario: "Bento" },
  { dia: "Sábado", inicio: "20:00", fim: "03:00", funcionario: "David" },
  { dia: "Sábado", inicio: "22:00", fim: "03:00", funcionario: "Rui" },
  { dia: "Sábado", inicio: "22:00", fim: "03:00", funcionario: "JP" },

  { dia: "Domingo", inicio: "12:00", fim: "20:30", funcionario: "Dinis" },
  { dia: "Domingo", inicio: "15:00", fim: "20:30", funcionario: "Bento" }
];

export const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export const BARTENDER_COLORS: Record<string, string> = {
  "Bento": "#FF4D00",   // Electric Orange
  "JP": "#00FF66",      // Neon Green
  "David": "#0099FF",   // Sky Blue
  "Divad": "#FF00E6",   // Magenta
  "Dinis": "#FFD700",    // Gold
  "Rui": "#00FF69"      // Neon Green
};
