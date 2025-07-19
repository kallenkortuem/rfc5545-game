"use client";

import { ParseResult, ValidationError, ValidationWarning } from '@/lib/icalParser';

interface ValidationPanelProps {
  parseResult: ParseResult;
  ruleResults: Array<{
    id: string;
    description: string;
    passed: boolean;
    errorMessage: string;
  }>;
  isComplete: boolean;
}

export default function ValidationPanel({ parseResult, ruleResults, isComplete }: ValidationPanelProps) {
  const hasErrors = parseResult.errors.length > 0 || ruleResults.some(r => !r.passed);
  const hasWarnings = parseResult.warnings.length > 0;

  if (isComplete) {
    return (
      <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🎉</div>
          <div>
            <h3 className="text-xl font-semibold text-green-400">Challenge Complete!</h3>
            <p className="text-sm text-green-300 mt-1">Great job! Your iCalendar is valid.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Challenge Rules */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Challenge Requirements</h3>
        <div className="space-y-2">
          {ruleResults.map((rule) => (
            <div key={rule.id} className="flex items-start gap-2">
              <div className={`mt-0.5 ${rule.passed ? 'text-green-400' : 'text-red-400'}`}>
                {rule.passed ? '✓' : '✗'}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${rule.passed ? 'text-green-300' : 'text-slate-300'}`}>
                  {rule.description}
                </p>
                {!rule.passed && (
                  <p className="text-xs text-red-400 mt-1">{rule.errorMessage}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RFC 5545 Validation */}
      {(hasErrors || hasWarnings) && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">RFC 5545 Validation</h3>
          
          {parseResult.errors.length > 0 && (
            <div className="space-y-2 mb-3">
              {parseResult.errors.map((error: ValidationError, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-red-400 text-sm">✗</span>
                  <div className="flex-1">
                    <p className="text-sm text-red-300">
                      Line {error.line}: {error.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Code: {error.code}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {parseResult.warnings.length > 0 && (
            <div className="space-y-2">
              {parseResult.warnings.map((warning: ValidationWarning, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-yellow-400 text-sm">⚠</span>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-300">
                      Line {warning.line}: {warning.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Code: {warning.code}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {!hasErrors && ruleResults.every(r => r.passed) && (
        <div className="bg-slate-800/50 rounded-lg border border-green-500/30 p-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <p className="text-sm text-green-300">Your iCalendar is valid! All requirements met.</p>
          </div>
        </div>
      )}
    </div>
  );
}