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

