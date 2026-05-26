/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CategoryScores {
  twk: number; // Max 150, Passing threshold 65
  tiu: number; // Max 175, Passing threshold 80
  tkp: number; // Max 225, Passing threshold 166
}

export interface TryoutResult {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string; // e.g. "Tryout Akbar CPNS #1" or "Materi Khusus TIU"
  scores: CategoryScores;
  totalScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  durationSeconds: number;
  submittedAt: string;
  isPassed: boolean; // Passing status: passed all thresholds
  rank?: number; // Dynamically computed rank
  percentile?: number; // Dynamically computed percentile
}

export interface PerformanceAnalytics {
  averageScores: CategoryScores;
  averageTotalScore: number;
  highestScores: CategoryScores;
  highestTotalScore: number;
  passingRate: number; // Percentage of tryouts that passed all thresholds
  tryoutCount: number;
  scoreProgress: Array<{
    date: string;
    twk: number;
    tiu: number;
    tkp: number;
    total: number;
    title: string;
  }>;
  categoryPerformance: Array<{
    category: string;
    userAverage: number;
    passingGrade: number;
    maxScore: number;
    percentage: number;
  }>;
}

export interface AICoachInsights {
  overallEvaluation: string;
  categoryBreakdown: {
    twk: { analysis: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; actionableTopics: string[] };
    tiu: { analysis: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; actionableTopics: string[] };
    tkp: { analysis: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; actionableTopics: string[] };
  };
  keyStrengths: string[];
  keyWeaknesses: string[];
  predictedPassingChance: number; // 0 - 100%
  recommendedDailyPlan: string[];
}
