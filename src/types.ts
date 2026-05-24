/**
 * Types and Interfaces for CricMind AI
 */

export type QueryType = 'fantasy' | 'prediction' | 'analysis' | 'insights' | 'chat';

export interface HistoryItem {
  id?: string;
  userId: string;
  userEmail?: string;
  queryType: QueryType;
  prompt: string;
  response: string;
  createdAt: any; // Date or Firestore Timestamp
}

export interface PlayerStats {
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
  team: string;
  rating: number; // custom fantasy rating or rank
  recentForm: string; // descriptive or array
  reason: string; // AI generated reason for including
}

export interface CaptainSuggestion {
  captain: string;
  viceCaptain: string;
  reasoning: string;
}

export interface FantasyTeamResponse {
  teamName: string;
  squad: PlayerStats[];
  captains: CaptainSuggestion;
  strategy: string; // key matches to focus on, stadium report, pitch report
}

export interface MatchPredictionResponse {
  teams: string[];
  headToHead: string;
  venueAnalysis: string;
  winnerProbability: {
    [teamName: string]: number; // e.g. "Mumbai Indians": 55, "KKR": 45
  };
  keyPerformers: string[];
  predictedWinner: string;
  tacticalEdge: string;
}

export interface PlayerAnalysisResponse {
  playerName: string;
  currentFormGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  strengths: string[];
  weaknesses: string[];
  recentPerformances: string[];
  fantasyMultiplierRating: number; // 1-10 scale
  aiVerdict: string;
}

export interface MatchInsightsResponse {
  matchupName: string;
  venueInfo: string;
  pitchReport: string;
  weatherForecast: string;
  keyTacticalClashes: string[];
  geminiIndexScore: number; // 1-100 indicating match exciting level
  summary: string;
}
