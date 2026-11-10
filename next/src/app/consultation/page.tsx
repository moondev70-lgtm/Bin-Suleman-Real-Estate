export default function Consultation() {
  return (
    <section className="min-h-screen bg-surface-container p-8 sm:p-12 lg:p-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display-xl text-4xl sm:text-5xl mb-6 tracking-tight text-on-surface">
          Schedule a Consultation
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-on-surface/60 max-w-2xl">
          Book a free consultation with our experts to discuss your real estate needs. 
          We'll help you find the perfect property or assist with your construction project.
        </p>
        
        <form className="space-y-6" action="#" method="POST">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm sm:text-medium mb-2 font-medium text-on-surface">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                className="w-full rounded-border border-border bg-surface input-field sm:py-3 lg:py-4 placeholder-on-surface/40"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-medium mb-2 font-medium text-on-surface">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-border border-bg bg-surface input-field sm:py-3 lg:py-4 placeholder-on-surface/40"
                placeholder="you@email.com"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm sm:text-medium mb-2 font-medium text-on-surface">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full rounded-border border-border bg-surface input-field sm:py-3 lg:py-4 placeholder-on-surface/40"
                placeholder="+92 300 1234567"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-medium mb-2 font-medium text-on-surface">
                Service Interest
              </label>
              <select
                name="service"
                className="w-full rounded-border border-border bg-surface input-field sm:py-3 lg:py-4 placeholder-on-surface/40"
              >
                <option value="" disabled>
                  Select a service
                </option>
                <option value="residential">Residential Plots</option>
                <option value="commercial">Commercial Investment</option>
                <option value="construction">Turnkey Villa Construction</option>
                <option value="verification">DHA File Verification</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm sm:text-medium mb-2 font-medium text-on-surface">
              Message
              </label>
            <textarea
              name="message"
              rows={4}
              className="w-full rounded-border border-border bg-surface input-field sm:py-3 lg:py-4 placeholder-on-surface/40 resize-none"
              placeholder="Tell us about your requirements..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FED65B] to-[#c9a43a] text-[#0b1329] font-bold uppercase tracking-[0.08em] shadow-xl shadow-[#d4af37]/30 hover:scale-105 hover:shadow-[#d4af37]/50 transition-all duration-300 min-h-[44px]"
          >
            <span>Submit Request</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 4h18M5 12h14M9 20l7-7-7-7z" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}