/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TryoutSimulatorProps {
  id?: string;
  onSubmissionSuccess: () => void;
}

export const TryoutSimulator: React.FC<TryoutSimulatorProps> = ({ id, onSubmissionSuccess }) => {
  const [title, setTitle] = useState('Uji Coba Latihan Mandiri SKD');
  const [twk, setTwk] = useState(85);
  const [tiu, setTiu] = useState(90);
  const [tkp, setTkp] = useState(175);
  const [durationMin, setDurationMin] = useState(90); // minutes
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Constants
  const PASSING_TWK = 65;
  const PASSING_TIU = 80;
  const PASSING_TKP = 166;

  const twkPassed = twk >= PASSING_TWK;
  const tiuPassed = tiu >= PASSING_TIU;
  const tkpPassed = tkp >= PASSING_TKP;
  const overallPassed = twkPassed && tiuPassed && tkpPassed;
  const currentTotal = twk + tiu + tkp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage(null);

      const res = await fetch('/api/tryouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          twk,
          tiu,
          tkp,
          durationSeconds: durationMin * 60,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({
          type: 'success',
          text: `Hasil Tryout berhasil terdata! Skor Total: ${json.data.totalScore}. Peringkat Leaderboard Anda diperbarui ke #${json.data.rank}.`,
        });
        // Call callback to trigger parent component refresh
        onSubmissionSuccess();
      } else {
        setMessage({ type: 'error', text: json.message || 'Gagal menyimpan skor' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Sambungan jaringan terputus ke backend.' });
    } finally {
      setSubmitting(false);
    }
  };

  const loadPreset = (presetName: string) => {
    switch (presetName) {
      case 'perfect':
        setTitle('Tryout SKD CPNS Maksimal');
        setTwk(150);
        setTiu(175);
        setTkp(225);
        setDurationMin(80);
        break;
      case 'pass':
        setTitle('Tryout SKD CPNS Lulus Tipis');
        setTwk(70);
        setTiu(85);
        setTkp(170);
        setDurationMin(100);
        break;
      case 'fail_tiu':
        setTitle('Latihan Mandiri TIU Lemah');
        setTwk(90);
        setTiu(60); // failed TIU
        setTkp(180);
        setDurationMin(95);
        break;
      case 'fail_tkp':
        setTitle('Latihan Mandiri TKP Lemah');
        setTwk(100);
        setTiu(110);
        setTkp(150); // failed TKP
        setDurationMin(85);
        break;
    }
  };

  return (
    <div id={id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-indigo-500/[0.03] blur-xl pointer-events-none" />

      <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Play className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Simulator Input Tryout CPNS</h3>
          <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Uji coba metrik leaderboard, passing grades, & grafik analitik</p>
        </div>
      </div>

      {/* Preset Fast Actions */}
      <div className="mt-3.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast Presets Simulator:</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => loadPreset('perfect')}
            className="rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/60 px-2.5 py-1 text-xs text-indigo-700 transition font-bold"
          >
            Lulus PG Maksimal
          </button>
          <button
            type="button"
            onClick={() => loadPreset('pass')}
            className="rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-100/60 px-2.5 py-1 text-xs text-emerald-700 transition font-bold"
          >
            Lulus PG Minimum
          </button>
          <button
            type="button"
            onClick={() => loadPreset('fail_tiu')}
            className="rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-150 px-2.5 py-1 text-xs text-rose-700 transition font-bold"
          >
            Gagal TIU
          </button>
          <button
            type="button"
            onClick={() => loadPreset('fail_tkp')}
            className="rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-150 px-2.5 py-1 text-xs text-amber-700 transition font-bold"
          >
            Gagal TKP
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4.5 space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Judul Tryout / Latihan</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 font-bold focus:border-indigo-500/50 focus:bg-white focus:outline-none transition-all shadow-xs"
            placeholder="Ketik judul latihan atau nama paket tryout"
            required
          />
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* TWK Slider (Max 150) */}
          <div className="rounded-xl border border-slate-150 bg-slate-50/40 p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-600">TWK (Nasionalisme)</span>
              <span className="font-mono text-slate-900 font-black">{twk} / 150</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={twk}
              onChange={(e) => setTwk(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4f46e5]"
            />
            <div className="flex items-center justify-between text-[10px] mt-1.5">
              <span className="text-slate-500 font-semibold">Batas Lulus: 65</span>
              {twkPassed ? (
                <span className="flex items-center gap-0.5 text-emerald-600 font-extrabold"><CheckCircle className="h-3 w-3" /> Lolos</span>
              ) : (
                <span className="flex items-center gap-0.5 text-rose-600 font-extrabold"><XCircle className="h-3 w-3" /> Gagal</span>
              )}
            </div>
          </div>

          {/* TIU Slider (Max 175) */}
          <div className="rounded-xl border border-slate-150 bg-slate-50/40 p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-600">TIU (Inteligensia)</span>
              <span className="font-mono text-slate-900 font-black">{tiu} / 175</span>
            </div>
            <input
              type="range"
              min="0"
              max="175"
              step="5"
              value={tiu}
              onChange={(e) => setTiu(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4f46e5]"
            />
            <div className="flex items-center justify-between text-[10px] mt-1.5">
              <span className="text-slate-500 font-semibold">Batas Lulus: 80</span>
              {tiuPassed ? (
                <span className="flex items-center gap-0.5 text-emerald-600 font-extrabold"><CheckCircle className="h-3 w-3" /> Lolos</span>
              ) : (
                <span className="flex items-center gap-0.5 text-rose-600 font-extrabold"><XCircle className="h-3 w-3" /> Gagal</span>
              )}
            </div>
          </div>

          {/* TKP Slider (Max 225) */}
          <div className="rounded-xl border border-slate-150 bg-slate-50/40 p-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-600">TKP (Karakteristik)</span>
              <span className="font-mono text-slate-900 font-black">{tkp} / 225</span>
            </div>
            <input
              type="range"
              min="0"
              max="225"
              step="1"
              value={tkp}
              onChange={(e) => setTkp(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4f46e5]"
            />
            <div className="flex items-center justify-between text-[10px] mt-1.5">
              <span className="text-slate-500 font-semibold">Batas Lulus: 166</span>
              {tkpPassed ? (
                <span className="flex items-center gap-0.5 text-emerald-600 font-extrabold"><CheckCircle className="h-3 w-3" /> Lolos</span>
              ) : (
                <span className="flex items-center gap-0.5 text-rose-600 font-extrabold"><XCircle className="h-3 w-3" /> Gagal</span>
              )}
            </div>
          </div>
        </div>

        {/* Duration Input & Calc */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-slate-600 mr-2 w-full">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Durasi Ujian:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="10"
                max="200"
                value={durationMin}
                onChange={(e) => setDurationMin(Math.max(1, Number(e.target.value)))}
                className="w-16 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-center font-mono text-xs text-slate-800 font-bold focus:bg-white focus:border-indigo-500"
              />
              <span className="text-xs text-slate-500 font-bold">menit</span>
            </div>
          </div>

          {/* Core Calculation Output Box */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-150 rounded-xl p-3 shadow-xs">
            <div className="text-left">
              <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">Skor Total</span>
              <span className="text-xl font-mono font-black text-slate-900">{currentTotal}</span>
            </div>

            <div className="h-8 w-[1px] bg-slate-200" />

            <div className="text-right">
              <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">Kelulusan</span>
              {overallPassed ? (
                <span className="inline-flex rounded bg-emerald-100 px-2.5 py-0.5 text-[9px] font-black text-emerald-800 border border-emerald-200">LULUS PG</span>
              ) : (
                <span className="inline-flex rounded bg-rose-100 px-2.5 py-0.5 text-[9px] font-black text-rose-800 border border-rose-200">GAGAL PG</span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={`p-3 rounded-lg border text-xs leading-relaxed ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-150 text-emerald-800 font-medium'
                : 'bg-rose-50 border-rose-150 text-rose-800 font-medium'
            }`}
          >
            {message.type === 'success' ? (
              <strong className="text-emerald-700 flex items-center gap-1 font-bold mb-0.5"><CheckCircle className="h-4 w-4" /> Berhasil!</strong>
            ) : (
              <strong className="text-rose-750 flex items-center gap-1 font-bold mb-0.5"><XCircle className="h-4 w-4" /> Gagal!</strong>
            )}
            {message.text}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Simpan & Kirim Skor Simulasi</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
