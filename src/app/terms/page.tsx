import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-yellow-600">Perfect Stack</Link>
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white">Sign In</Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: April 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-300">
          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Acceptance of Terms</h2>
            <p>By creating an account or using Perfect Stack, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Description of Service</h2>
            <p>Perfect Stack is a men&apos;s health companion app providing supplement protocol recommendations, progress tracking, meal plans, exercise programming, and wellness information. The service includes both free and paid subscription tiers.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Medical Disclaimer</h2>
            <div className="rounded-lg border border-yellow-600/30 bg-yellow-600/5 p-4 text-zinc-300">
              <p>Perfect Stack provides general wellness and supplement information for educational purposes only. <strong className="text-white">This is not medical advice.</strong></p>
              <p className="mt-2">Always consult a qualified physician before starting any supplement protocol, making changes to prescription medications, or if you have a medical condition. The supplement recommendations in this app are not intended to diagnose, treat, cure, or prevent any disease.</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Eligibility</h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>You must be at least 18 years of age to use this service</li>
              <li>You must provide accurate and complete information when creating your account and health profile</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Subscriptions and Payments</h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>Subscriptions are billed monthly or annually depending on the plan selected</li>
              <li>You may cancel your subscription at any time via the pricing page</li>
              <li>No refunds are issued for partial subscription periods</li>
              <li>Prices are subject to change with 30 days advance notice</li>
              <li>All payments are processed securely through Stripe</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Affiliate Disclosure</h2>
            <p>Perfect Stack participates in the Amazon Associates Program and other affiliate programs. When you click product links and make a purchase, we may earn a commission at no additional cost to you. Affiliate relationships do not influence our supplement recommendations, which are based on published research and clinical evidence.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Intellectual Property</h2>
            <p>All content, guides, recipes, supplement data, algorithms, and original material within Perfect Stack are owned by Perfect Stack and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Prohibited Uses</h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>Scraping, crawling, or automated data extraction from the service</li>
              <li>Reverse engineering or decompiling any part of the application</li>
              <li>Sharing account credentials or allowing unauthorized access</li>
              <li>Using the service for any unlawful purpose</li>
              <li>Attempting to interfere with the service or its infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Limitation of Liability</h2>
            <p className="text-zinc-400">Perfect Stack is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted by law, Perfect Stack shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Governing Law</h2>
            <p>These terms shall be governed by the laws of the Commonwealth of Massachusetts, United States, without regard to conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Contact</h2>
            <p>For questions about these terms, contact us at <span className="text-yellow-600">hello@getperfectstack.com</span></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6">
          <span className="text-xs text-zinc-600">&copy; 2026 Perfect Stack. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-zinc-500 hover:text-zinc-400">Privacy</Link>
            <Link href="/terms" className="text-xs text-zinc-500 hover:text-zinc-400">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
