import type { ReactNode } from "react";
import ProfileVisual from "./visuals/ProfileVisual";
import PreferencesVisual from "./visuals/PreferencesVisual";
import MatchmakingVisual from "./visuals/MatchmakingVisual";
import MatchesVisual from "./visuals/MatchesVisual";
import ChatVisual from "./visuals/ChatVisual";
import RelationshipVisual from "./visuals/RelationshipVisual";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StepDetail {
  number: number;
  title: string;
  bullets: string[];
  badge: string;
  visual: ReactNode;
}

export interface ProcessNode {
  icon: ReactNode;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const STEP_DETAILS: StepDetail[] = [
  {
    number: 1,
    title: "Create Profile",
    visual: <ProfileVisual />,
    bullets: [
      "Quick & easy registration",
      "Add photos & basic details",
      "Verify your mobile number",
      "Profile privacy control",
    ],
    badge: "Takes 2-3 minutes",
  },
  {
    number: 2,
    title: "Set Preferences",
    visual: <PreferencesVisual />,
    bullets: [
      "Set partner preferences",
      "Choose your must-haves",
      "Add lifestyle & hobbies",
      "Define deal-breakers",
    ],
    badge: "Takes 3-5 minutes",
  },
  {
    number: 3,
    title: "AI Matchmaking",
    visual: <MatchmakingVisual />,
    bullets: [
      "Advanced AI algorithm",
      "100+ compatibility factors",
      "Behavioral analysis",
      "Continuous learning",
    ],
    badge: "Works 24/7 for you",
  },
  {
    number: 4,
    title: "Review Matches",
    visual: <MatchesVisual />,
    bullets: [
      "View curated matches",
      "See compatibility score",
      "Detailed insights",
      "Save your favorites",
    ],
    badge: "New matches daily",
  },
  {
    number: 5,
    title: "Connect & Chat",
    visual: <ChatVisual />,
    bullets: [
      "Send interest to connect",
      "Safe & secure chat",
      "Ice-breaker suggestions",
      "Report & block option",
    ],
    badge: "You're in control",
  },
  {
    number: 6,
    title: "Build Relationship",
    visual: <RelationshipVisual />,
    bullets: [
      "Get to know each other",
      "Involve family (optional)",
      "Take it offline safely",
      "Forever starts here",
    ],
    badge: "Forever starts here",
  },
];

export const PROCESS_NODES: ProcessNode[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20c0-3.866 3.358-7 7.5-7s7.5 3.134 7.5 7" />
      </svg>
    ),
    label: "Your Profile",
  },
  {
    icon: <span className="text-xs font-extrabold tracking-wide">AI</span>,
    label: "AI Match",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.93 7.93 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: "Connect",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="14.5" r="6" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8l3-5 3 5" />
      </svg>
    ),
    label: "Happy Marriage",
  },
];
