import { OTHER_INQUIRIES } from "./constants";

export interface ContactFormState {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormSectionProps {
  contactForm: ContactFormState;
  setContactForm: (form: ContactFormState) => void;
  submitting: boolean;
  submitResult: { type: "success" | "error"; message: string } | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ContactFormSection({
  contactForm,
  setContactForm,
  submitting,
  submitResult,
  onSubmit,
}: ContactFormSectionProps) {
  return (
    <section id="contact-form" className="pb-14 sm:pb-16 scroll-mt-20">
      <div className="container-safe">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6B1B3D] mb-2">Send Us a Message</h2>
          <span className="block w-12 h-0.5 bg-[#D4AF37] mx-auto mb-3" />
          <p className="text-sm sm:text-base text-neutral-500">
            Fill out the form below and our team will get back to you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
          <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={contactForm.fullName}
                onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-[#6B1B3D] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="Enter your email address"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-[#6B1B3D] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Subject</label>
              <select
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:border-[#6B1B3D] transition-colors"
              >
                <option value="">What is this regarding?</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing">Billing</option>
                <option value="Partnership">Partnership</option>
                <option value="Feedback">Feedback</option>
                <option value="Report a Profile">Report a Profile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">Message</label>
              <textarea
                rows={5}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Type your message here..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-[#6B1B3D] transition-colors resize-none"
              />
            </div>

            {submitResult && (
              <p className={`text-sm rounded-lg px-3 py-2 border ${submitResult.type === "success" ? "text-green-700 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"}`}>
                {submitResult.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6B1B3D] text-white font-semibold rounded-xl hover:bg-[#581630] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              {submitting ? "Sending…" : "Send Message"}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Your information is secure and will never be shared.
            </p>
          </form>

          <div className="bg-[#FFF3F0] rounded-2xl p-6 sm:p-7 h-fit">
            <h3 className="text-base font-bold text-neutral-900 mb-5">Other Inquiries</h3>
            <div className="space-y-4">
              {OTHER_INQUIRIES.map((inq) => (
                <div key={inq.title} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white text-[#6B1B3D] flex items-center justify-center shadow-sm">
                    {inq.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{inq.title}</div>
                    <a href={`mailto:${inq.email}`} className="text-xs text-[#6B1B3D] hover:text-[#D4AF37] transition-colors">
                      {inq.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
