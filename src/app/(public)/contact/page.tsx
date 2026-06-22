import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex-1 bg-background pt-10 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Let's talk.</h1>
              <p className="text-lg text-muted-foreground">
                Ready to make an impact? Get in touch with our team to discuss rates, availability, and campaign strategies.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="p-3 bg-secondary rounded-xl mr-5">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email us</h3>
                  <p className="text-muted-foreground text-sm mb-2">Our team usually responds within 2 hours.</p>
                  <a href="mailto:hello@oohmedia.com" className="font-medium text-primary hover:underline">hello@oohmedia.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-3 bg-secondary rounded-xl mr-5">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Call us</h3>
                  <p className="text-muted-foreground text-sm mb-2">Mon-Sat from 10am to 7pm IST.</p>
                  <a href="tel:+919876543210" className="font-medium text-primary hover:underline">+91 98765 43210</a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-3 bg-secondary rounded-xl mr-5">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Office</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A-12, Connaught Place<br />
                    2nd Floor, Block A<br />
                    New Delhi, Delhi 110001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
              <h2 className="font-heading text-2xl font-bold mb-8">Send an enquiry</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                    <input type="text" id="firstName" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Rahul" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                    <input type="text" id="lastName" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Sharma" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Work Email</label>
                  <input type="email" id="email" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="rahul@company.in" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-foreground">Company</label>
                  <input type="text" id="company" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Tata Communications" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                  <textarea id="message" rows={5} className="w-full p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" placeholder="Tell us about your campaign needs..."></textarea>
                </div>

                <button type="button" className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]">
                  Submit Enquiry
                </button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
