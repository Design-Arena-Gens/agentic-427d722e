"use client";

export default function CampaignControls({ calling, onStart, onStop, pendingCount }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      {!calling ? (
        <button
          onClick={onStart}
          className="rounded-md bg-green-600 px-3 py-2 text-white text-sm hover:bg-green-700 disabled:opacity-50"
          disabled={pendingCount === 0}
        >
          Start Campaign ({pendingCount} pending)
        </button>
      ) : (
        <button
          onClick={onStop}
          className="rounded-md bg-red-600 px-3 py-2 text-white text-sm hover:bg-red-700"
        >
          Stop
        </button>
      )}
    </div>
  );
}
