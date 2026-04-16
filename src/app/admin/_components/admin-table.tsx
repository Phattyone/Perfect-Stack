"use client";

import { useState, useMemo } from "react";

export interface AdminUserRow {
  id: string;
  email: string;
  full_name: string | null;
  subscription_status: string;
  age_group: string | null;
  stack_selection: string[] | null;
  health_status: string[] | null;
  latest_checkin_score: number | null;
  journal_count: number;
  created_at: string;
  updated_at: string | null;
}

function SubBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const styles =
    s === "ultimate" || s === "complete"
      ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40"
      : s === "foundation" || s === "active"
      ? "bg-blue-600/20 text-blue-400 border border-blue-600/40"
      : "bg-zinc-700/40 text-zinc-400 border border-zinc-700";

  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${styles}`}>
      {status || "free"}
    </span>
  );
}

function fmt(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminTable({ rows }: { rows: AdminUserRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.email.toLowerCase().includes(q) ||
        (r.full_name ?? "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div>
      {/* Search + count bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">
          <span className="font-semibold text-white">{filtered.length}</span>
          {filtered.length !== rows.length && (
            <span className="text-zinc-500"> of {rows.length}</span>
          )}{" "}
          user{rows.length !== 1 ? "s" : ""}
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by email or name…"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600 sm:w-72"
        />
      </div>

      {/* Horizontally scrollable table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-800 text-sm">
          <thead className="bg-zinc-900">
            <tr>
              {[
                "Email",
                "Name",
                "Subscription",
                "Health Status",
                "Age",
                "Stacks",
                "Check-in Score",
                "Journal Entries",
                "Created",
                "Updated",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-950">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-8 text-center text-zinc-500"
                >
                  No users match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-zinc-900/60"
                >
                  {/* Email */}
                  <td className="min-w-48 px-4 py-3 font-mono text-xs text-zinc-200">
                    {row.email}
                  </td>

                  {/* Name */}
                  <td className="min-w-32 px-4 py-3 text-zinc-300">
                    {row.full_name ?? <span className="text-zinc-600">—</span>}
                  </td>

                  {/* Subscription */}
                  <td className="min-w-28 px-4 py-3">
                    <SubBadge status={row.subscription_status} />
                  </td>

                  {/* Health Status */}
                  <td className="min-w-52 px-4 py-3 text-zinc-400">
                    {row.health_status && row.health_status.length > 0 ? (
                      <span className="text-xs">
                        {row.health_status.join(", ")}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* Age Group */}
                  <td className="min-w-24 px-4 py-3 text-zinc-400">
                    {row.age_group ?? <span className="text-zinc-600">—</span>}
                  </td>

                  {/* Stacks */}
                  <td className="min-w-24 px-4 py-3">
                    {row.stack_selection && row.stack_selection.length > 0 ? (
                      <span className="text-xs font-medium text-yellow-500">
                        {row.stack_selection.join(", ")}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* Latest check-in score */}
                  <td className="min-w-32 px-4 py-3 text-center">
                    {row.latest_checkin_score !== null ? (
                      <span
                        className={`font-semibold ${
                          row.latest_checkin_score >= 7
                            ? "text-green-400"
                            : row.latest_checkin_score >= 4
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {row.latest_checkin_score.toFixed(1)}
                        <span className="text-xs font-normal text-zinc-500">
                          /10
                        </span>
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* Journal count */}
                  <td className="min-w-24 px-4 py-3 text-center text-zinc-300">
                    {row.journal_count > 0 ? (
                      row.journal_count
                    ) : (
                      <span className="text-zinc-600">0</span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="min-w-32 whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                    {fmt(row.created_at)}
                  </td>

                  {/* Updated */}
                  <td className="min-w-32 whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                    {fmt(row.updated_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
