import Navbar from "@/components/layout/Navbar"
import ContactForm from "@/components/ui/ContactForm"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <Navbar/>
            
            {/* Header Section */}
            <div className="pt-32 pb-16 bg-white border-b border-neutral-200">
              <div className="container mx-auto px-6 max-w-5xl">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-4">
                  ติดต่อเรา
                </h1>
                <p className="text-lg text-neutral-500 max-w-2xl font-light">
                  มีคำถามเกี่ยวกับแคตตาล็อกรถยนต์ไฟฟ้าของเราหรือไม่? ไม่ว่าคุณจะสนใจรถยนต์รุ่นใด ต้องการความช่วยเหลือ หรือเพียงต้องการทักทาย เราพร้อมช่วยเหลือคุณ
                </p>
              </div>
            </div>

            {/* Content Section */}
            <main className="flex-grow container mx-auto px-6 max-w-5xl py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Left Side: Contact Info */}
                <div className="flex flex-col space-y-12">
                  <div>
                    <h2 className="text-xl font-medium text-neutral-900 mb-6">ข้อมูลการติดต่อ</h2>
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
                <ContactForm />

              </div>
            </main>
        </div>
    );
}