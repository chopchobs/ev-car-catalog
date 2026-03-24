import Navbar from "@/components/layout/Navbar"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
            <Navbar/>
            
            {/* Header Section */}
            <div className="pt-32 pb-16 bg-white border-b border-neutral-200">
              <div className="container mx-auto px-6 max-w-5xl">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
                  Get in touch
                </h1>
                <p className="text-lg text-neutral-500 max-w-2xl font-light">
                  Have a question about our EV catalog? Whether you're interested in a specific model, need support, or just want to say hello, we're here to help.
                </p>
              </div>
            </div>

            {/* Content Section */}
            <main className="flex-grow container mx-auto px-6 max-w-5xl py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Left Side: Contact Info */}
                <div className="flex flex-col space-y-12">
                  <div>
                    <h2 className="text-xl font-medium text-neutral-900 mb-6">Contact Information</h2>
                    <div className="space-y-6">
                      
                      {/* Address */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 bg-neutral-100 p-3 rounded-full">
                          <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <p className="text-sm font-medium text-neutral-900">Office</p>
                          <p className="mt-1 text-sm text-neutral-500 leading-relaxed font-light">
                            123 EV Boulevard, Suite 500<br />
                            Bangkok, Thailand 10110
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 bg-neutral-100 p-3 rounded-full">
                          <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <p className="text-sm font-medium text-neutral-900">Phone</p>
                          <p className="mt-1 text-sm text-neutral-500 font-light">+66 2 123 4567</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 bg-neutral-100 p-3 rounded-full">
                          <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <p className="text-sm font-medium text-neutral-900">Email</p>
                          <p className="mt-1 text-sm text-neutral-500 font-light">support@evcatalog.com</p>
                        </div>
                      </div>
                      
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-medium text-neutral-900 mb-6">Business Hours</h2>
                    <ul className="space-y-3 text-sm text-neutral-500 font-light">
                      <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                        <span>Monday - Friday</span>
                        <span className="text-neutral-900">9:00 AM - 6:00 PM</span>
                      </li>
                      <li className="flex justify-between items-center pb-2 border-b border-neutral-100">
                        <span>Saturday</span>
                        <span className="text-neutral-900">10:00 AM - 4:00 PM</span>
                      </li>
                      <li className="flex justify-between items-center pb-2 border-neutral-100">
                        <span>Sunday</span>
                        <span className="text-neutral-400">Closed</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">First Name</label>
                        <input type="text" id="firstName" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">Last Name</label>
                        <input type="text" id="lastName" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                      <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700">Subject</label>
                      <input type="text" id="subject" className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200" placeholder="How can we help?" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700">Message</label>
                      <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 resize-none" placeholder="Tell us more about your inquiry..."></textarea>
                    </div>

                    <button type="button" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3.5 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 group">
                      <span>Send Message</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </form>
                </div>

              </div>
            </main>
        </div>
    );
}