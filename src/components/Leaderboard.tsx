/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TryoutResult } from '../types.js';
import { Trophy, Search, CheckCircle, XCircle, ChevronDown, ChevronUp, AlertCircle, RefreshCcw } from 'lucide-react';

interface LeaderboardProps {
  id?: string;
  refreshTrigger: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ id, refreshTrigger }) => {
  const [candidates, setCandidates] = useState<TryoutResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPassed, setOnlyPassed] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/leaderboard?search=${encodeURIComponent(searchQuery)}&onlyPassed=${onlyPassed}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setCandidates(json.data);
      } else {
        setError(json.message || 'Gagal memuat data peringkat');
      }
    } catch (err) {
      setError('Jaringan terputus saat mengambil data leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [searchQuery, onlyPassed, refreshTrigger]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black shadow-xs">
            🥇
          </span>
        );
      case 2:
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 border border-slate-205 text-slate-700 text-xs font-black shadow-xs">
            🥈
          </span>
        );
      case 3:
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50/50 border border-amber-200/60 text-amber-600 text-xs font-black shadow-xs">
            🥉
          </span>
        );
      default:
        return <span className="text-slate-500 font-mono text-xs font-black">{rank}</span>;
    }
  };

  return (
    <div id={id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm relative">
      {/* Search Header Options */}
      <div className="p-4.5 border-b border-slate-200 bg-[#fbfcfd] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 border border-indigo-100">
            <Trophy className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-sm.5 font-bold text-slate-800 flex items-center gap-2">Peringkat Nasional Tryout CPNS</h4>
            <p className="text-[11px] text-slate-500 font-medium">Peringkat real-time dihitung dari skor tertinggi unik setiap pelamar</p>
          </div>
        </div>
