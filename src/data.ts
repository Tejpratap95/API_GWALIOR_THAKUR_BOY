export interface TournamentTeam {
  id: string;
  name: string;
  shortName: string;
  intensityColor: string; // Tailwind glow border color style
  logo: string;
  keyPlayers: string[];
}

export const IPL_TEAMS: TournamentTeam[] = [
  {
    id: "csk",
    name: "Chennai Super Kings",
    shortName: "CSK",
    intensityColor: "from-yellow-400 to-yellow-600 border-yellow-500 shadow-yellow-500/20",
    logo: "🏏",
    keyPlayers: ["Ruturaj Gaikwad", "Ravindra Jadeja", "Matheesha Pathirana", "Shivam Dube"]
  },
  {
    id: "rcb",
    name: "Royal Challengers Bengaluru",
    shortName: "RCB",
    intensityColor: "from-red-500 to-red-800 border-red-600 shadow-red-600/20",
    logo: "🏏",
    keyPlayers: ["Virat Kohli", "Faf du Plessis", "Mohammed Siraj", "Rajat Patidar"]
  },
  {
    id: "mi",
    name: "Mumbai Indians",
    shortName: "MI",
    intensityColor: "from-blue-500 to-indigo-600 border-blue-500 shadow-blue-500/20",
    logo: "🏏",
    keyPlayers: ["Jasprit Bumrah", "Hardik Pandya", "Suryakumar Yadav", "Rohit Sharma"]
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    intensityColor: "from-purple-600 to-indigo-800 border-purple-500 shadow-purple-500/20",
    logo: "🏏",
    keyPlayers: ["Sunil Narine", "Rinku Singh", "Shreyas Iyer", "Andre Russell"]
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    intensityColor: "from-orange-500 to-red-600 border-orange-500 shadow-orange-500/20",
    logo: "🏏",
    keyPlayers: ["Travis Head", "Abhishek Sharma", "Heinrich Klaasen", "Pat Cummins"]
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    shortName: "DC",
    intensityColor: "from-sky-500 to-blue-700 border-sky-500 shadow-sky-500/20",
    logo: "🏏",
    keyPlayers: ["Rishabh Pant", "Axar Patel", "Kuldeep Yadav", "Jake Fraser-McGurk"]
  }
];

export const FAMOUS_PLAYERS = [
  "Virat Kohli", "MS Dhoni", "Jasprit Bumrah", "Suryakumar Yadav", 
  "Travis Head", "Heinrich Klaasen", "Sunil Narine", "Ruturaj Gaikwad",
  "Hardik Pandya", "Rashid Khan"
];

export const PRESET_PROMPTS = {
  fantasy: [
    { title: "CSK vs RCB Fantasy XI", prompt: "Generate fantasy XI for CSK vs RCB" },
    { title: "MI vs KKR Dream Squad", prompt: "Generate highly optimized fantasy cricket playing combination for Mumbai Indians vs Kolkata Knight Riders match" },
    { title: "SRH High Multiplier", prompt: "Generate SRH vs DC high reward risk fantasy squad with wildcards" }
  ],
  prediction: [
    { title: "Predict MI vs KKR Winner", prompt: "Predict winner of MI vs KKR incorporating toss and pitch factors" },
    { title: "Predict CSK vs SRH Outcome", prompt: "Perform deep analysis and predict match winner between Chennai Super Kings and Sunrisers Hyderabad" },
    { title: "Predict RCB vs DC", prompt: "Provide win probability percentage map and key match winner forecast for RCB vs DC" }
  ],
  analysis: [
    { title: "Virat Kohli Current Form", prompt: "Analyze Virat Kohli form, strengths, weaknesses, and direct match-up against spin" },
    { title: "Jasprit Bumrah Yorkers", prompt: "Deconstruct Jasprit Bumrah death bowling statistics and fantasy rating multiplier" },
    { title: "Heinrich Klaasen Spin", prompt: "Analyze Heinrich Klaasen batting efficiency against express spin in current season" }
  ],
  insights: [
    { title: "Wankhede Pitch Analysis", prompt: "Analyze Wankhede Stadium Mumbai pitch report, average scores, and chase-friendly index" },
    { title: "M. Chinnaswamy Boundaries", prompt: "Evaluate weather and short boundary influence at M. Chinnaswamy Stadium, Bengaluru" },
    { title: "Eden Gardens Spin Grip", prompt: "Report pitch wear and spin grip performance patterns at Eden Gardens, Kolkata" }
  ],
  chat: [
    { title: "Who is the IPL King?", prompt: "Tell me who statistically holds the highest efficiency rating in modern IPL history and explain why." },
    { title: "Toss Strategy", prompt: "Why do teams prefer to chase first on hot dry surfaces versus dewy evening grounds?" },
    { title: "What is CricMind AI?", prompt: "Explain how you generate cricket intelligence and calculate winning probability maps." }
  ]
};

export const RECENT_IPL_SCHEDULE = [
  { matchId: 101, homeTeam: "rcb", awayTeam: "csk", venue: "M. Chinnaswamy Stadium, Bengaluru", date: "Tonight, 19:30", status: "Upcoming" },
  { matchId: 102, homeTeam: "mi", awayTeam: "kkr", venue: "Wankhede Stadium, Mumbai", date: "Tomorrow, 19:30", status: "Upcoming" },
  { matchId: 103, homeTeam: "srh", awayTeam: "dc", venue: "Rajiv Gandhi Stadium, Hyderabad", date: "May 26, 19:30", status: "Upcoming" }
];
