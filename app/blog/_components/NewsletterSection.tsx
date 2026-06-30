export default function NewsletterSection() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-safe">
        <div className="bg-[#6B1B3D] rounded-2xl px-6 sm:px-10 py-7 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <span className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Stay Updated with Relationship Tips</h2>
              <p className="text-sm text-white/70 mt-0.5">Subscribe to our newsletter and never miss an update.</p>
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-2 max-w-md">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
            />
            <button
              type="button"
              className="flex-shrink-0 px-5 py-3 bg-[#D4AF37] hover:bg-[#c19d2f] text-[#6B1B3D] text-sm font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
