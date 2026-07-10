# OOH Media Platform (Hoarding Dashboard)

Welcome to the **OOH Media Platform** repository! 👋 

This is a modern, premium web application built to make finding and booking Out-of-Home (OOH) advertising spaces—like billboards, unipolar displays, and digital hoardings—visual, seamless, and secure. We focus on premium locations across North India (Delhi, Gurgaon, Noida, Chandigarh, Jaipur, etc.).

🟢 **Live Demo:** [https://sellads advertising-ooh-dashboard.vercel.app](https://sellads advertising-ooh-dashboard.vercel.app)

---

## 🌟 What's Inside?

We built this platform with a dual-focus: an incredible public-facing catalog for brands, and a secure, powerful management backend for the Sellads Advertising team.

- **Public Features:**
  - **Interactive Map Search:** A smooth, live Leaflet map to visually hunt down the best hoarding locations by city or landmark.
  - **Visual Catalog:** Browse through high-quality images of available, booked, or blocked sites with all technical details (dimensions, lighting type, coordinates).
  - **Mobile-First Experience:** Native-feeling mobile navigation, sliding menus, and completely responsive grid layouts.

- **Admin & Management Features:**
  - **Security Wall:** Strict role-based middleware guarding all management routes.
  - **Separate Login Portals:** Dedicated, isolated login portals for `Clients/Brands` vs. `Admin Staff`.
  - **Admin Dashboard:** A centralized control room to oversee KPIs, manage site statuses, and handle incoming booking enquiries.

---

## 🛠️ Tech Stack

Under the hood, the platform is blazing fast and type-safe:
- **Framework:** [Next.js 16](https://nextjs.org/) (React, App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Maps:** Leaflet & React-Leaflet
- **Authentication Guard:** Next.js Middleware & Server Actions
- **Deployment:** Vercel

---

## 🚀 How to run it locally

If you want to spin this up on your own machine, it's pretty straightforward:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/ESTROCtech/Hoarding-Dashboard.git
   cd Hoarding-Dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. **Explore:**
   - Public Catalog: [http://localhost:3000](http://localhost:3000)
   - Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Enjoy exploring the code! 🚀
