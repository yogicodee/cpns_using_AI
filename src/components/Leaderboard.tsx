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

                return (
                  <React.Fragment key={participant.id}>
                    <tr
                      onClick={() => toggleExpand(participant.id)}
                      className={`transition-all duration-200 cursor-pointer text-xs ${isMe
                        ? 'bg-indigo-50/[0.22] hover:bg-indigo-50/[0.4] border-l-4 border-indigo-650'
                        : 'hover:bg-slate-50/65'
                        }`}
                    >
                      {/* Rank Column */}
                      <td className="px-5 py-3 text-center font-bold text-slate-800">
                        <div className="flex items-center justify-center">
                          {getRankBadge(participant.rank || 0)}
                        </div>
                      </td>

                      {/* Name Card */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={participant.userAvatar}
                            alt={participant.userName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100 object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {participant.userName}
                              {isMe && (
                                <span className="ml-1.5 inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 py-0.5 text-[8.5px] font-black">
                                  Anda
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold block truncate max-w-[150px] sm:max-w-xs">{participant.title}</span>
                          </div>
                        </div>
                      </td>

                      {/* Sub-Scores (Hidden Mobile) */}
                      <td className="px-4 py-3 text-center font-mono font-bold hidden md:table-cell text-slate-650">
                        <span className={participant.scores.twk >= 65 ? 'text-slate-650' : 'text-rose-600 font-extrabold'}>
                          {participant.scores.twk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold hidden md:table-cell text-slate-650">
                        <span className={participant.scores.tiu >= 80 ? 'text-slate-650' : 'text-rose-600 font-extrabold'}>
                          {participant.scores.tiu}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold hidden md:table-cell text-slate-650">
                        <span className={participant.scores.tkp >= 166 ? 'text-slate-650' : 'text-rose-600 font-extrabold'}>
                          {participant.scores.tkp}
                        </span>
                      </td>

                      {/* PG Status Column */}
                      <td className="px-5 py-3 text-center">
                        <div className="flex justify-center">
                          {participant.isPassed ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 border border-emerald-150">
                              <CheckCircle className="h-3 w-3 text-emerald-600" /> Lulus PG
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[9.5px] font-bold text-rose-700 border border-rose-150">
                              <XCircle className="h-3 w-3 text-rose-600" /> Gagal PG
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Score Column */}
                      <td className="px-5 py-3 text-right font-black font-mono text-slate-900 text-sm">
                        {participant.totalScore}
                      </td>

                      {/* Toggle arrow */}
                      <td className="px-4 py-3 text-center text-slate-400">
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5 mx-auto" /> : <ChevronDown className="h-3.5 w-3.5 mx-auto" />}
                      </td>
                    </tr>

                    {/* Expandable Panel */}
                    {isExpanded && (
                      <tr className={isMe ? 'bg-indigo-50/[0.1]' : 'bg-slate-50/45'}>
                        <td colSpan={8} className="px-5 py-3.5 border-l-2 border-r border-b border-indigo-100 border-slate-150 shadow-inner">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
                            <div className="space-y-1">
                              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Metrik CPNS</span>
                              <p className="text-slate-700 font-bold">Peserta ke-{participant.rank} Terbaik dari {candidates.length}</p>
                              <p className="text-slate-500 font-semibold">Berada di top <span className="font-extrabold text-indigo-650">{participant.percentile}%</span> Nasional</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Breakdown Nilai SKD</span>
                              <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                                <div className="flex justify-between w-28">
                                  <span>TWK (Min 65):</span>
                                  <span className={`font-black ${participant.scores.twk >= 65 ? 'text-indigo-650' : 'text-rose-600'}`}>{participant.scores.twk}</span>
                                </div>
                                <div className="flex justify-between w-28">
                                  <span>TIU (Min 80):</span>
                                  <span className={`font-black ${participant.scores.tiu >= 80 ? 'text-indigo-650' : 'text-rose-600'}`}>{participant.scores.tiu}</span>
                                </div>
                                <div className="flex justify-between w-28">
                                  <span>TKP (Min 166):</span>
                                  <span className={`font-black ${participant.scores.tkp >= 166 ? 'text-indigo-650' : 'text-rose-600'}`}>{participant.scores.tkp}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Durasi & Selesai</span>
                              <p className="text-slate-700">Waktu: <span className="font-bold text-slate-800">{Math.floor(participant.durationSeconds / 60)} menit {participant.durationSeconds % 60} det</span></p>
                              <p className="text-slate-400 font-mono text-[9px]">Submitted: {new Date(participant.submittedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Informasi Nilai</span>
                              <p className="text-slate-600">Benar: <span className="font-bold text-indigo-600 font-mono">{participant.correctAnswers}</span>, Salah: <span className="font-bold text-rose-500 font-mono">{participant.wrongAnswers}</span></p>
                              <p className="text-slate-400 text-[10px]">Ketepatan akurasi: {Math.round((participant.correctAnswers / 110) * 100)}%</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
