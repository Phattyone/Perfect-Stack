"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateEmail, updatePassword, deleteAccount } from "../account-actions";

interface AccountViewProps {
  email: string;
  memberSince: string;
  subscriptionStatus: string;
  userId: string;
}

// ─── Inline password field with show/hide toggle ─────────────────────────────

function PasswordField({
  id,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder ?? "••••••••"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 pr-10 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.574-3.007-9.964-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Password strength indicator ─────────────────────────────────────────────

function getPasswordStrength(
  password: string
): { label: string; color: string; barColor: string } | null {
  if (!password) return null;
  if (password.length < 8) return { label: "Too short", color: "text-red-400", barColor: "bg-red-500" };
  const checks = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(password)
  ).length;
  if (password.length >= 12 && checks >= 3)
    return { label: "Strong", color: "text-green-400", barColor: "bg-green-500" };
  if (password.length >= 8 && checks >= 2)
    return { label: "Fair", color: "text-yellow-400", barColor: "bg-yellow-500" };
  return { label: "Weak", color: "text-red-400", barColor: "bg-red-500" };
}

// ─── Subscription badge ───────────────────────────────────────────────────────

function SubscriptionBadge({ status }: { status: string }) {
  if (status === "ultimate" || status === "complete") {
    return (
      <span className="rounded-full bg-green-900/40 px-2.5 py-0.5 text-xs font-semibold text-green-400">
        Ultimate
      </span>
    );
  }
  if (status === "foundation") {
    return (
      <span className="rounded-full bg-amber-900/40 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
        Foundation
      </span>
    );
  }
  return (
    <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-400">
      Free
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AccountView({
  email,
  memberSince,
  subscriptionStatus,
  userId,
}: AccountViewProps) {
  const router = useRouter();

  // Change email
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  // Change password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(newPw);

  async function handleEmailUpdate(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(null);
    const result = await updateEmail(newEmail, emailPassword);
    setEmailLoading(false);
    if (result.error) {
      setEmailError(result.error);
    } else {
      setEmailSuccess(
        `Verification email sent to ${newEmail}. Please click the link to confirm the change.`
      );
      setNewEmail("");
      setEmailPassword("");
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    setPwLoading(true);
    setPwError(null);
    setPwSuccess(null);
    const result = await updatePassword(currentPw, newPw);
    setPwLoading(false);
    if (result.error) {
      setPwError(result.error);
    } else {
      setPwSuccess("Password updated successfully");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") return;
    setDeleteLoading(true);
    setDeleteError(null);
    const result = await deleteAccount(userId);
    if (result.error) {
      setDeleteLoading(false);
      setDeleteError(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {/* ── Section 1: Account Information ──────────────────────────── */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-base font-semibold text-yellow-500">Account Information</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-zinc-500">Email</span>
            <span className="text-sm text-zinc-300 text-right break-all">{email}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-zinc-500">Member since</span>
            <span className="text-sm text-zinc-300">{memberSince}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-zinc-500">Plan</span>
            <SubscriptionBadge status={subscriptionStatus} />
          </div>
        </div>
        <div className="mt-5 border-t border-zinc-800 pt-4">
          <Link
            href="/pricing"
            className="text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            Manage subscription &rarr;
          </Link>
        </div>
      </section>

      {/* ── Section 2: Change Email ──────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-base font-semibold text-yellow-500">Change Email</h2>
        <p className="mt-1 text-sm text-zinc-400">
          A verification link will be sent to your new email address.
        </p>

        <form onSubmit={handleEmailUpdate} className="mt-5 space-y-4">
          <div>
            <label htmlFor="new-email" className="block text-sm font-medium text-zinc-300">
              New Email Address
            </label>
            <input
              id="new-email"
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
            />
          </div>
          <div>
            <label htmlFor="email-current-pw" className="block text-sm font-medium text-zinc-300">
              Current Password
            </label>
            <PasswordField
              id="email-current-pw"
              value={emailPassword}
              onChange={setEmailPassword}
              autoComplete="current-password"
            />
          </div>

          {emailError && <p className="text-sm text-red-400">{emailError}</p>}
          {emailSuccess && (
            <p className="rounded-md border border-green-700/40 bg-green-900/20 px-3 py-2 text-sm text-green-400">
              {emailSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={emailLoading || !newEmail || !emailPassword}
            className="rounded-md bg-yellow-600 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {emailLoading ? "Sending..." : "Update Email"}
          </button>
        </form>
      </section>

      {/* ── Section 3: Change Password ───────────────────────────────── */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-base font-semibold text-yellow-500">Change Password</h2>

        <form onSubmit={handlePasswordUpdate} className="mt-5 space-y-4">
          <div>
            <label htmlFor="current-pw" className="block text-sm font-medium text-zinc-300">
              Current Password
            </label>
            <PasswordField
              id="current-pw"
              value={currentPw}
              onChange={setCurrentPw}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label htmlFor="new-pw" className="block text-sm font-medium text-zinc-300">
              New Password
            </label>
            <PasswordField
              id="new-pw"
              value={newPw}
              onChange={setNewPw}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            {passwordStrength && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-zinc-700">
                  <div
                    className={`h-1 rounded-full transition-all ${passwordStrength.barColor} ${
                      passwordStrength.label === "Strong"
                        ? "w-full"
                        : passwordStrength.label === "Fair"
                        ? "w-2/3"
                        : "w-1/3"
                    }`}
                  />
                </div>
                <span className={`text-xs ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="confirm-pw" className="block text-sm font-medium text-zinc-300">
              Confirm New Password
            </label>
            <PasswordField
              id="confirm-pw"
              value={confirmPw}
              onChange={setConfirmPw}
              autoComplete="new-password"
            />
          </div>

          {pwError && <p className="text-sm text-red-400">{pwError}</p>}
          {pwSuccess && (
            <p className="rounded-md border border-green-700/40 bg-green-900/20 px-3 py-2 text-sm text-green-400">
              {pwSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={pwLoading || !currentPw || !newPw || !confirmPw}
            className="rounded-md bg-yellow-600 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pwLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>

      {/* ── Section 4: Danger Zone ───────────────────────────────────── */}
      <section className="rounded-lg border border-red-800 bg-red-950/20 p-6">
        <h2 className="text-base font-semibold text-red-400">Delete Account</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          This action is permanent and cannot be undone. All your data including your supplement
          stack, progress history, journal entries, and guide access will be permanently deleted.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-4 rounded-md border border-red-700 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-900/40"
          >
            Delete My Account
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-zinc-300">
              Type <span className="font-mono text-red-400">DELETE</span> to confirm
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="w-full max-w-xs rounded-md border border-red-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none"
            />

            {deleteError && <p className="text-sm text-red-400">{deleteError}</p>}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "DELETE" || deleteLoading}
                className="rounded-md bg-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInput("");
                  setDeleteError(null);
                }}
                className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
