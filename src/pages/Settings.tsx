import { useState } from 'react';
import { Key, Save } from 'lucide-react';

export default function Settings() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('drawspec-openai-key') || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem('drawspec-openai-key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-500 text-sm mb-8">Configure your DrawSpec instance.</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Key size={16} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">OpenAI API Key</p>
            <p className="text-xs text-gray-400">Required for AI text-to-drawing parsing</p>
          </div>
        </div>
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300" />
        <button onClick={save}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Save size={14} />
          {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-sm font-semibold text-gray-900 mb-2">About DrawSpec</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          DrawSpec generates engineering technical drawings from natural language specifications.
          Designed to replace the back-and-forth between designers and BIM/CAD teams — engineers describe what they need,
          DrawSpec renders it with proper dimensions, annotations, and title blocks.
        </p>
        <p className="text-xs text-gray-400 mt-3">Version 0.1.0 — Built with React, SVG, and a lot of engineering knowledge.</p>
      </div>
    </div>
  );
}
