import { Mail, Phone, MapPin } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export default function ContactPage() {
  return (
    <div className="flex-1 bg-background pt-10 pb-24 relative overflow-hidden">
      {/* Ambient glowing elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-[100px] pointer-events-none animate-float-slow" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-10">
            <AnimateOnScroll animation="fade-right" duration={800}>
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Let's talk.</h1>
                <p className="text-lg text-muted-foreground">
                  Ready to make an impact? Get in touch with our team to discuss rates, availability, and campaign strategies.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="space-y-8 stagger-children">
              <AnimateOnScroll animation="fade-right" delay={100}>
                <div className="flex items-start group">
                  <div className="p-3 bg-secondary rounded-xl mr-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">Email us</h3>
                    <p className="text-muted-foreground text-sm mb-2">Our team usually responds within 2 hours.</p>
                    <a href="mailto:hello@outreachooh.in" className="font-medium text-primary hover:underline">hello@outreachooh.in</a>
                  </div>
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={200}>
                <div className="flex items-start group">
                  <div className="p-3 bg-secondary rounded-xl mr-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">Call us</h3>
                    <p className="text-muted-foreground text-sm mb-2">Mon-Sat from 10am to 7pm IST.</p>
                    <a href="tel:+919000000000" className="font-medium text-primary hover:underline">+91 90000 00000</a>
                  </div>
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={300}>
                <div className="flex items-start group">
                  <div className="p-3 bg-secondary rounded-xl mr-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">Office</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      12, Sitabuldi Main Road<br />
                      Nagpur, Maharashtra 440012
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <AnimateOnScroll animation="blur-in" delay={300} duration={1000}>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm hover-lift relative overflow-hidden group">
                {/* Form glow effect */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <h2 className="font-heading text-2xl font-bold mb-8 relative z-10">Send an enquiry</h2>
                
                <form className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group/input">
                      <label htmlFor="firstName" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">First Name</label>
                      <input type="text" id="firstName" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="Rahul" />
                    </div>
                    <div className="space-y-2 group/input">
                      <label htmlFor="lastName" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Last Name</label>
                      <input type="text" id="lastName" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="Sharma" />
                    </div>
                  </div>

                  <div className="space-y-2 group/input">
                    <label htmlFor="email" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Work Email</label>
                    <input type="email" id="email" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="rahul@company.in" />
                  </div>

                  <div className="space-y-2 group/input">
                    <label htmlFor="company" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Company</label>
                    <input type="text" id="company" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="Tata Communications" />
                  </div>

                  <div className="space-y-2 group/input">
                    <label htmlFor="message" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Message</label>
                    <textarea id="message" rows={5} className="w-full p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50 resize-none" placeholder="Tell us about your campaign needs..."></textarea>
                  </div>

                  <button type="button" className="relative w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] overflow-hidden group/btn">
                    <span className="relative z-10">Submit Enquiry</span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] skew-x-12" />
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By submitting this form, you agree to our privacy policy.
                  </p>
                </form>
              </div>
            </AnimateOnScroll>
          </div>

        </div>
      </div>
    </div>
  );
}
