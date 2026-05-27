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

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Searching */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 bg-transparent -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama peserta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-52 rounded-lg border border-slate-250 bg-slate-50 pl-8.5 pr-3 py-1.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-indigo-500/50 focus:outline-none transition shadow-xs"
            />
          </div>

          {/* Passed Filter */}
          <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-250 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-800 transition shadow-xs group">
            <input
              type="checkbox"
              checked={onlyPassed}
              onChange={(e) => setOnlyPassed(e.target.checked)}
              className="rounded-md border-slate-300 h-4 w-4 text-indigo-650 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
            <span className="font-bold select-none text-[11px]">Hanya Lulus PG</span>
          </label>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center space-y-4">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs text-slate-500 font-medium">Menghitung ranking & passing grade nasional...</p>
        </div>
      ) : error ? (
        <div className="p-10 flex flex-col items-center text-center">
          <AlertCircle className="h-10 w-10 text-rose-550" />
          <h5 className="mt-2 text-sm font-bold text-slate-850">Gagal Menghitung Ranking</h5>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Segarkan
          </button>
        </div>
      ) : candidates.length === 0 ? (
        <div className="p-16 text-center">
          <Trophy className="h-12 w-12 text-slate-400 mx-auto opacity-50" />
          <p className="mt-3 text-sm font-extrabold text-slate-700">Tidak ada peserta ditemukan</p>
          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau matikan filter Lulus PG</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                <th className="px-5 py-2.5 text-center w-16">Peringkat</th>
                <th className="px-4 py-2.5">Nama Lengkap</th>
                <th className="px-4 py-2.5 hidden md:table-cell text-center">TWK</th>
                <th className="px-4 py-2.5 hidden md:table-cell text-center">TIU</th>
                <th className="px-4 py-2.5 hidden md:table-cell text-center">TKP</th>
                <th className="px-4 py-2.5 text-center">Kelulusan PG</th>
                <th className="px-5 py-2.5 text-right">Skor Total</th>
                <th className="px-4 py-2.5 text-center w-12">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {candidates.map((participant) => {
                const isMe = participant.userId === 'current-user';
                const isExpanded = expandedId === participant.id;