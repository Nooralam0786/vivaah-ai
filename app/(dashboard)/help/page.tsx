'use client';

import { useRef, useState } from 'react';
import { MessageCircle, Mail, Phone, BookOpen, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAuthFromStorage } from '@/lib/auth';

const SUPPORT_EMAIL = 'support@vivaahai.com';
const SUPPORT_PHONE = '+919876543210';

const FAQS = [
  { q: 'How does VivaahAI matching work?', a: 'Our AI analyzes your profile, preferences, values, and behavior to suggest highly compatible matches. We consider factors like religion, education, location, interests, and family background to calculate a compatibility score.' },
  { q: 'Is my profile information safe?', a: 'Yes, absolutely. We use end-to-end encryption for all communications and strict privacy controls. You can control exactly who sees your phone number, photos, and personal details from the Privacy Settings.' },
  { q: 'How do I contact someone I like?', a: 'You can send an "Interest" to a profile. If they accept, both of you can start chatting. Premium members can also view contact numbers and make video calls directly.' },
  { q: 'Can I hide my profile temporarily?', a: 'Yes! Go to Settings → Privacy and toggle "Pause Profile" to hide your profile temporarily without deleting it.' },
  { q: 'How do I verify my profile?', a: 'Go to your Profile page and look for the "Get Verified" badge. We verify through Aadhaar/PAN card, email, and mobile number. Verified profiles get 3x more responses.' },
  { q: 'What is Family Connect?', a: 'Family Connect lets you invite trusted family members (parents, siblings) to your account. They can view matches, give feedback, and interact on your behalf with your permission.' },
];

export default function HelpPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticket, setTicket] = useState({ subject: '', category: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    setSending(true);
    setSendError(null);
    try {
      const auth = getAuthFromStorage();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(auth ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
        },
        body: JSON.stringify({
          fullName: (user as { fullName?: string } | null)?.fullName || 'VivaahAI User',
          email: user?.email || '',
          subject: ticket.category ? `[${ticket.category}] ${ticket.subject}` : ticket.subject,
          message: ticket.message,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to submit ticket');
      setSent(true);
      setTicket({ subject: '', category: '', message: '' });
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to submit ticket');
    } finally {
      setSending(false);
    }
  };

  const scrollToTicketForm = () => {
    ticketRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => messageRef.current?.focus(), 400);
  };

  const scrollToFaq = () => {
    faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with us now', action: 'Start Chat', onClick: scrollToTicketForm },
          { icon: Mail, title: 'Email Support', desc: 'We reply in 24h', action: 'Send Email', href: `mailto:${SUPPORT_EMAIL}` },
          { icon: Phone, title: 'Call Us', desc: '9AM – 6PM IST', action: '+91 98765 43210', href: `tel:${SUPPORT_PHONE}` },
          { icon: BookOpen, title: 'Help Center', desc: 'Browse articles', action: 'View Articles', onClick: scrollToFaq },
        ].map((item) => {
          const cardClass = 'bg-white rounded-2xl border border-vivaah-border shadow-card p-4 text-center hover:shadow-card-hover transition-all cursor-pointer group block';
          const content = (
            <>
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 group-hover:scale-110 transition-transform duration-200">
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
              <p className="text-xs text-primary-700 font-medium mt-2">{item.action}</p>
            </>
          );
          return item.href ? (
            <a key={item.title} href={item.href} className={cardClass}>{content}</a>
          ) : (
            <button key={item.title} type="button" onClick={item.onClick} className={cardClass}>{content}</button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FAQ */}
        <div ref={faqRef} className="bg-white rounded-2xl border border-vivaah-border shadow-card p-6 scroll-mt-20">
          <h2 className="font-bold text-neutral-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-vivaah-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-vivaah-bg transition-colors">
                  <span className="text-sm font-medium text-neutral-800 pr-4">{faq.q}</span>
                  <span className={`text-neutral-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
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
        <div ref={ticketRef} className="bg-white rounded-2xl border border-vivaah-border shadow-card p-6 scroll-mt-20">
          <h2 className="font-bold text-neutral-900 mb-4">Submit a Support Ticket</h2>
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold text-neutral-900">Ticket Submitted!</h3>
              <p className="text-sm text-neutral-500 mt-1">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm text-primary-700 font-medium hover:underline">Submit another ticket</button>
            </div>
          ) : (
            <div className="space-y-4">
              {sendError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{sendError}</p>
              )}
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
                <textarea ref={messageRef} value={ticket.message} onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                  placeholder="Describe your issue in detail..." rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none" />
              </div>
              <button onClick={handleSend} disabled={sending || !ticket.subject || !ticket.category || !ticket.message}
                className="w-full py-3 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                {sending ? 'Submitting…' : 'Submit Ticket'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
