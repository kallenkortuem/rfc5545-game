'use client';

import { useState } from 'react';

interface RecurrenceRule {
  freq: string;
  interval: number;
  byDay?: string[];
  byMonthDay?: number[];
  byMonth?: number[];
  count?: number;
  until?: string;
}

const FREQUENCIES = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' }
];

const WEEKDAYS = [
  { value: 'SU', label: 'Sunday' },
  { value: 'MO', label: 'Monday' },
  { value: 'TU', label: 'Tuesday' },
  { value: 'WE', label: 'Wednesday' },
  { value: 'TH', label: 'Thursday' },
  { value: 'FR', label: 'Friday' },
  { value: 'SA', label: 'Saturday' }
];

export default function RecurrenceRuleBuilder() {
  const [rule, setRule] = useState<RecurrenceRule>({
    freq: 'WEEKLY',
    interval: 1
  });
  const [endType, setEndType] = useState<'never' | 'count' | 'until'>('never');
  const [generatedRRule, setGeneratedRRule] = useState<string>('');
  const [exampleDates, setExampleDates] = useState<string[]>([]);

  const generateRRule = () => {
    const parts: string[] = [`FREQ=${rule.freq}`];
    
    if (rule.interval > 1) {
      parts.push(`INTERVAL=${rule.interval}`);
    }

    if (rule.byDay && rule.byDay.length > 0) {
      parts.push(`BYDAY=${rule.byDay.join(',')}`);
    }

    if (rule.byMonthDay && rule.byMonthDay.length > 0) {
      parts.push(`BYMONTHDAY=${rule.byMonthDay.join(',')}`);
    }

    if (rule.byMonth && rule.byMonth.length > 0) {
      parts.push(`BYMONTH=${rule.byMonth.join(',')}`);
    }

    if (endType === 'count' && rule.count) {
      parts.push(`COUNT=${rule.count}`);
    }

    if (endType === 'until' && rule.until) {
      const until = new Date(rule.until).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      parts.push(`UNTIL=${until}`);
    }

    const rrule = `RRULE:${parts.join(';')}`;
    setGeneratedRRule(rrule);
    generateExampleDates(rrule);
  };

  const generateExampleDates = (rrule: string) => {
    // Simple example date generation for demonstration
    // Note: rrule parameter is kept for potential future use with a proper RRULE library
    const baseDate = new Date('2024-07-22T10:00:00');
    const dates: string[] = [];
    
    // This is a simplified example generator - in a real app, you'd use a proper RRULE library
    const currentDate = new Date(baseDate);
    const maxDates = Math.min(rule.count || 10, 10);
    
    for (let i = 0; i < maxDates; i++) {
      dates.push(currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
      
      switch (rule.freq) {
        case 'DAILY':
          currentDate.setDate(currentDate.getDate() + rule.interval);
          break;
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + (7 * rule.interval));
          break;
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + rule.interval);
          break;
        case 'YEARLY':
          currentDate.setFullYear(currentDate.getFullYear() + rule.interval);
          break;
      }

      if (endType === 'until' && rule.until && currentDate > new Date(rule.until)) {
        break;
      }
    }
    
    setExampleDates(dates);
  };

  const loadPreset = (preset: string) => {
    switch (preset) {
      case 'daily':
        setRule({ freq: 'DAILY', interval: 1 });
        setEndType('never');
        break;
      case 'workdays':
        setRule({ 
          freq: 'WEEKLY', 
          interval: 1, 
          byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] 
        });
        setEndType('never');
        break;
      case 'biweekly':
        setRule({ freq: 'WEEKLY', interval: 2 });
        setEndType('never');
        break;
      case 'monthly':
        setRule({ freq: 'MONTHLY', interval: 1 });
        setEndType('never');
        break;
      case 'quarterly':
        setRule({ freq: 'MONTHLY', interval: 3 });
        setEndType('never');
        break;
      case 'yearly':
        setRule({ freq: 'YEARLY', interval: 1 });
        setEndType('never');
        break;
    }
  };

  const toggleWeekday = (day: string) => {
    const byDay = rule.byDay || [];
    const newByDay = byDay.includes(day) 
      ? byDay.filter(d => d !== day)
      : [...byDay, day].sort((a, b) => WEEKDAYS.findIndex(wd => wd.value === a) - WEEKDAYS.findIndex(wd => wd.value === b));
    
    setRule({ ...rule, byDay: newByDay.length > 0 ? newByDay : undefined });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recurrence Rule Builder</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'daily', label: 'Daily' },
                { id: 'workdays', label: 'Weekdays' },
                { id: 'biweekly', label: 'Bi-weekly' },
                { id: 'monthly', label: 'Monthly' },
                { id: 'quarterly', label: 'Quarterly' },
                { id: 'yearly', label: 'Yearly' }
              ].map(preset => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset.id)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <select
              value={rule.freq}
              onChange={(e) => setRule({ ...rule, freq: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FREQUENCIES.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interval (Every X {rule.freq.toLowerCase()})
            </label>
            <input
              type="number"
              value={rule.interval}
              onChange={(e) => setRule({ ...rule, interval: Math.max(1, parseInt(e.target.value) || 1) })}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(rule.freq === 'WEEKLY' || rule.freq === 'MONTHLY' || rule.freq === 'YEARLY') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days of Week
              </label>
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map(day => (
                  <button
                    key={day.value}
                    onClick={() => toggleWeekday(day.value)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      rule.byDay?.includes(day.value)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Condition
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="endType"
                  value="never"
                  checked={endType === 'never'}
                  onChange={(e) => setEndType(e.target.value as 'never' | 'count' | 'until')}
                  className="mr-2"
                />
                Never ends
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="endType"
                  value="count"
                  checked={endType === 'count'}
                  onChange={(e) => setEndType(e.target.value as 'never' | 'count' | 'until')}
                  className="mr-2"
                />
                After
                <input
                  type="number"
                  value={rule.count || ''}
                  onChange={(e) => setRule({ ...rule, count: parseInt(e.target.value) || undefined })}
                  disabled={endType !== 'count'}
                  className="w-20 px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                  placeholder="10"
                />
                occurrences
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="endType"
                  value="until"
                  checked={endType === 'until'}
                  onChange={(e) => setEndType(e.target.value as 'never' | 'count' | 'until')}
                  className="mr-2"
                />
                Until
                <input
                  type="date"
                  value={rule.until || ''}
                  onChange={(e) => setRule({ ...rule, until: e.target.value })}
                  disabled={endType !== 'until'}
                  className="px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                />
              </label>
            </div>
          </div>

          <button
            onClick={generateRRule}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate RRULE
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Generated RRULE</h2>
        
        {generatedRRule ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">RRULE String:</h3>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <code className="text-sm font-mono break-all">{generatedRRule}</code>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(generatedRRule)}
                className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy RRULE
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Example Occurrences:</h3>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <ul className="text-sm space-y-1">
                  {exampleDates.map((date, index) => (
                    <li key={index} className="flex justify-between">
                      <span>#{index + 1}</span>
                      <span>{date}</span>
                    </li>
                  ))}
                </ul>
                {exampleDates.length === 0 && (
                  <p className="text-gray-500 text-sm">No example dates to show</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">RRULE Components:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li><strong>FREQ:</strong> How often the event repeats (DAILY, WEEKLY, MONTHLY, YEARLY)</li>
                <li><strong>INTERVAL:</strong> The interval between each recurrence</li>
                <li><strong>BYDAY:</strong> Specific days of the week (SU, MO, TU, WE, TH, FR, SA)</li>
                <li><strong>COUNT:</strong> Number of occurrences before stopping</li>
                <li><strong>UNTIL:</strong> End date for the recurrence</li>
                <li><strong>BYMONTHDAY:</strong> Specific days of the month (1-31)</li>
                <li><strong>BYMONTH:</strong> Specific months (1-12)</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Common Patterns:</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li><strong>Every weekday:</strong> FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR</li>
                <li><strong>Every 2 weeks:</strong> FREQ=WEEKLY;INTERVAL=2</li>
                <li><strong>Monthly on the 15th:</strong> FREQ=MONTHLY;BYMONTHDAY=15</li>
                <li><strong>Yearly in December:</strong> FREQ=YEARLY;BYMONTH=12</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Configure your recurrence rule and click &quot;Generate RRULE&quot; to see the RFC 5545 formatted output.
          </div>
        )}
      </div>
    </div>
  );
}