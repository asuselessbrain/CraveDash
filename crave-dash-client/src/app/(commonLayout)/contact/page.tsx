import { Mail, MapPin, Phone, Clock3, MessageSquareText, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How fast can I expect a response?",
    a: "Most queries are answered within 2-6 business hours.",
  },
  {
    q: "Can I report an order issue after delivery?",
    a: "Yes. Share order details and we will verify and resolve quickly.",
  },
  {
    q: "Do you support provider onboarding help?",
    a: "Yes, our onboarding team provides setup and listing guidance.",
  },
];

export default function ContactPage() {
  return (
    <main className="food-landing-bg pb-16 pt-10">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-7 shadow-sm sm:p-8 dark:border-orange-400/20 dark:bg-slate-900/90">
            <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Contact</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
              Let&apos;s Talk
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Have questions, feedback, or partnership ideas? Reach out and our team will get back to you.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                <Mail className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                <span className="text-sm text-slate-700 dark:text-slate-300">support@cravedash.com</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                <Phone className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                <span className="text-sm text-slate-700 dark:text-slate-300">+880 1700 000000</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                <Clock3 className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Support Hours: 9:00 AM - 11:00 PM (Everyday)</span>
              </div>
            </div>
          </div>

          <form className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900/90">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-orange-600 dark:text-orange-300" />
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Send a Message</h2>
            </div>
            <div className="mt-5 grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <select
                name="subject"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                defaultValue=""
              >
                <option value="" disabled>Select subject</option>
                <option value="order">Order Issue</option>
                <option value="payment">Payment Support</option>
                <option value="partnership">Provider Partnership</option>
                <option value="other">Other</option>
              </select>
              <textarea
                name="message"
                rows={5}
                placeholder="Write your message..."
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                type="submit"
                className="h-11 rounded-xl bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-400"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-orange-600 dark:text-orange-300" />
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Frequently Asked Questions</h3>
            </div>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-xl border border-slate-200 bg-white/90 p-3 dark:border-slate-700 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.q}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.a}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-orange-200/70 bg-linear-to-br from-orange-50 to-amber-50 p-6 shadow-sm dark:border-orange-400/20 dark:from-slate-900 dark:to-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Office Presence</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              We operate with a local-first support team to ensure fast and context-aware assistance for customers and providers.
            </p>
            <div className="mt-4 rounded-2xl border border-orange-200/70 bg-white/85 p-4 dark:border-orange-400/20 dark:bg-slate-900/70">
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Primary Office</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Dhanmondi, Dhaka</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Mon-Sun, 9:00 AM to 11:00 PM</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
