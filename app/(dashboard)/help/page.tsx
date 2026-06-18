'use client';

import { useState } from 'react';

const FAQS = [
  { q: 'How does VivaahAI matching work?', a: 'Our AI analyzes your profile, preferences, values, and behavior to suggest highly compatible matches. We consider factors like religion, education, location, interests, and family background to calculate a compatibility score.' },
  { q: 'Is my profile information safe?', a: 'Yes, absolutely. We use end-to-end encryption for all communications and strict privacy controls. You can control exactly who sees your phone number, photos, and personal details from the Privacy Settings.' },
  { q: 'How do I contact someone I like?', a: 'You can send an "Interest" to a profile. If they accept, both of you can start chatting. Premium members can also view contact numbers and make video calls directly.' },
  { q: 'Can I hide my profile temporarily?', a: 'Yes! Go to Settings → Privacy and toggle "Pause Profile" to hide your profile temporarily without deleting it.' },
  { q: 'How do I verify my profile?', a: 'Go to your Profile page and look for the "Get Verified" badge. We verify through Aadhaar/PAN card, email, and mobile number. Verified profiles get 3x more responses.' },
  { q: 'What is Family Connect?', a: 'Family Connect lets you invite trusted family members (parents, siblings) to your account. They can view matches, give feedback, and interact on your behalf with your permission.' },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticket, setTicket] = useState({ subject: '', category: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSent(true);
    await new Promise((r) => setTimeout(r, 1500));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Help & Support</h1>
        <p className="text-sm text-neutral-500 mt-0.5">We're here to help you find your perfect match</p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '💬', title: 'Live Chat', desc: 'Chat with us now', action: 'Start Chat' },
          { icon: '📧', title: 'Email Support', desc: 'We reply in 24h', action: 'Send Email' },
          { icon: '📞', title: 'Call Us', desc: '9AM – 6PM IST', action: '1800-123-456' },
          { icon: '📚', title: 'Help Center', desc: 'Browse articles', action: 'View Articles' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4 text-center hover:shadow-card-hover transition-all cursor-pointer group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{item.icon}</div>
            <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
            <p className="text-xs text-primary-700 font-medium mt-2">{item.action}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-vivaah-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-vivaah-bg transition-colors">
                  <span className="text-sm font-medium text-neutral-800 pr-4">{faq.q}</span>
                  <span className={`text-neutral-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-neutral-600 leading-relaxed border-t border-vivaah-border bg-vivaah-bg">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Submit a Support Ticket</h2>
          {sent ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-semibold text-neutral-900">Ticket Submitted!</h3>
              <p className="text-sm text-neutral-500 mt-1">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm text-primary-700 font-medium hover:underline">Submit another ticket</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Category</label>
                <select value={ticket.category} onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700">
                  <option value="">Select category</option>
                  <option>Account Issue</option>
                  <option>Profile Problem</option>
                  <option>Payment / Billing</option>
                  <option>Match / Connection Issue</option>
                  <option>Privacy Concern</option>
                  <option>Report a User</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Subject</label>
                <input type="text" value={ticket.subject} onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Message</label>
                <textarea value={ticket.message} onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                  placeholder="Describe your issue in detail..." rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none" />
              </div>
              <button onClick={handleSend} disabled={!ticket.subject || !ticket.category || !ticket.message}
                className="w-full py-3 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                Submit Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
