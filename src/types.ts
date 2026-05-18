/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScheduleEntry {
  dia: string;
  inicio: string;
  fim: string;
  funcionario: string;
}

export interface BartenderStats {
  name: string;
  totalHours: number;
  color: string;
}
