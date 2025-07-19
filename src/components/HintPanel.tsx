"use client";

interface HintPanelProps {
  hints: string[];
  showHints: boolean;
  hintsUsed: number;
  onShowHint: () => void;
  onNextHint: () => void;
  onShowSolution: () => void;
}

export default function HintPanel({
  hints,
  showHints,
  hintsUsed,
  onShowHint,
  onNextHint,
  onShowSolution
}: HintPanelProps) {
  if (!showHints && hints.length > 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-4">Need help? Hints are available.</p>
          <button
            onClick={onShowHint}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
          >
            Show Hint (affects score)
          </button>
        </div>
      </div>
    );
  }

  if (hints.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-yellow-500/30 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-yellow-400">💡</span> Hints
      </h3>
      
      <div className="space-y-3">
        {hints.slice(0, hintsUsed).map((hint, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-yellow-400 text-sm mt-0.5">{index + 1}.</span>
            <p className="text-sm text-slate-300">{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        {hintsUsed < hints.length && (
          <button
            onClick={onNextHint}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
          >
            Next Hint ({hintsUsed}/{hints.length})
          </button>
        )}
        
        {hintsUsed === hints.length && (
          <button
            onClick={onShowSolution}
            className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 border border-red-700 rounded text-sm transition-colors text-red-300"
          >
            Show Solution (0 stars)
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Using hints affects your star rating
      </p>
    </div>
  );
}