"use client";

const statusBadge = (status) => {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  switch (status) {
    case "pending":
      return <span className={`${base} bg-gray-100 text-gray-700`}>Pending</span>;
    case "dialing":
      return <span className={`${base} bg-blue-100 text-blue-700`}>Dialing</span>;
    case "completed":
      return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
    case "failed":
      return <span className={`${base} bg-red-100 text-red-700`}>Failed</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
  }
};

export default function LeadsTable({ leads, onRemove }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="p-2">Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Status</th>
            <th className="p-2">Details</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">No leads yet</td>
            </tr>
          )}
          {leads.map(lead => (
            <tr key={lead.id} className="border-t">
              <td className="p-2 font-medium">{lead.name}</td>
              <td className="p-2">{lead.phone}</td>
              <td className="p-2">{statusBadge(lead.status)}</td>
              <td className="p-2 text-xs text-gray-500">
                {lead.error ? `Error: ${lead.error}` : lead.callSid ? `Call SID: ${lead.callSid}` : ""}
              </td>
              <td className="p-2 text-right">
                <button onClick={() => onRemove(lead.id)} className="rounded-md bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
