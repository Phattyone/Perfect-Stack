import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-yellow-600 no-underline hover:no-underline">Perfect Stack</Link>
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white">Sign In</Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: April 18, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-300">
          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Introduction</h2>
            <p>Perfect Stack (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the Perfect Stack web application. This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Information We Collect</h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li><span className="text-zinc-300">Account information</span> - email address and password, managed through Supabase Auth</li>
              <li><span className="text-zinc-300">Profile data</span> - age group, health goals, training style, medication flags, and health conditions you provide during profile setup</li>
              <li><span className="text-zinc-300">Usage data</span> - progress entries, journal entries, supplement selections, and performance scores you log in the app</li>
              <li><span className="text-zinc-300">Payment information</span> - processed entirely by Stripe. We do not store credit card numbers or bank details on our servers</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">How We Use Your Information</h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>To personalize your supplement protocol based on your health profile</li>
              <li>To process payments and manage your subscription</li>
              <li>To improve the app and user experience</li>
              <li>To communicate important updates about your account or the service</li>
            </ul>
            <p className="mt-3 font-semibold text-white">We never sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Health Data</h2>
            <p>Your health profile, including medication flags and health conditions, is stored securely and used only to personalize your supplement recommendations. This data is never shared with third parties, advertisers, or employers.</p>
            <p className="mt-2 text-zinc-400">This app provides wellness information only and is not a medical service. It does not diagnose, treat, cure, or prevent any disease.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Data Storage and Security</h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>Data stored in Supabase with row-level security - each user can only access their own data</li>
              <li>Payments processed by Stripe, which is PCI DSS compliant</li>
              <li>We use industry-standard encryption for data in transit and at rest</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Third Party Services</h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li><span className="text-zinc-300">Supabase</span> - database, authentication, and file storage</li>
              <li><span className="text-zinc-300">Stripe</span> - payment processing</li>
              <li><span className="text-zinc-300">Amazon</span> - affiliate product links. We participate in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click an Amazon affiliate link and make a purchase, we may earn a commission at no additional cost to you.</li>
              <li><span className="text-zinc-300">Anthropic Claude AI</span> - powers the Perfect Chat assistant. Messages you send are processed by Anthropic</li>
              <li><span className="text-zinc-300">Vercel</span> - application hosting</li>
              <li><span className="text-zinc-300">Namecheap Private Email</span> - We use Namecheap Private Email to manage our business email communications at hello@getperfectstack.com.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Cookies</h2>
            <p>We use essential cookies for authentication only. We do not use advertising cookies or third-party tracking cookies.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Your Rights</h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>Access, correct, or delete your personal data by contacting us</li>
              <li>Cancel your subscription at any time via the pricing page</li>
              <li>Request complete account deletion by emailing us</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Children</h2>
            <p>This service is intended for adults aged 18 and over. We do not knowingly collect information from anyone under 18.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Changes to This Policy</h2>
            <p>We will notify users of material changes to this policy via email. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-yellow-600">Contact</h2>
            <p>For privacy-related questions or requests, contact us at <span className="text-yellow-600">hello@getperfectstack.com</span></p>
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
