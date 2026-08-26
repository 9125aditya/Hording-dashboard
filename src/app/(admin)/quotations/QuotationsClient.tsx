"use client";

import { useState, useMemo } from "react";
import { 
  FileSpreadsheet, 
  Presentation, 
  Search, 
  MapPin, 
  Tag, 
  Check, 
  Plus, 
  Trash2, 
  Download, 
  Settings2, 
  Building, 
  Calendar, 
  User, 
  DollarSign, 
  Eye, 
  CheckSquare, 
  Square,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Percent,
  AlertCircle
} from "lucide-react";
import * as XLSX from "xlsx";
import pptxgen from "pptxgenjs";

type SiteItem = {
  id: number;
  uuid: string;
  code?: string;
  name: string;
  city: string;
  area: string;
  size: string;
  type: string;
  lit_type: string;
  status: string;
  net_rate: number;
  agency_rate: number;
  dcpm_rate: number;
  mounting_charges?: number;
  images: string[];
  photo: string;
  maps_link: string;
  remarks: string;
};

function getCityAbbreviation(city: string) {
  const c = (city || "Nagpur").trim().toUpperCase();
  if (c.startsWith("NAGPUR")) return "NGP";
  if (c.startsWith("MUMBAI")) return "MUM";
  if (c.startsWith("PUNE")) return "PUN";
  if (c.startsWith("DELHI")) return "DEL";
  if (c.startsWith("HYDERABAD")) return "HYD";
  if (c.startsWith("BANGALORE") || c.startsWith("BENGALURU")) return "BLR";
  if (c.startsWith("CHANDRAPUR")) return "CHP";
  if (c.startsWith("AMRAVATI")) return "AMR";
  if (c.startsWith("WARDHA")) return "WRD";
  if (c.startsWith("NASHIK")) return "NSK";
  if (c.startsWith("AURANGABAD") || c.startsWith("SAMBHAJINAGAR")) return "CSN";
  return c.slice(0, 3).toUpperCase();
}

function getMediaTypeAbbreviation(type: string) {
  const t = (type || "Hoarding").trim().toUpperCase();
  if (t.includes("GANTRY")) return "G";
  if (t.includes("UNIPOLE")) return "U";
  if (t.includes("KIOSK")) return "K";
  if (t.includes("METRO") || t.includes("PILLAR")) return "M";
  if (t.includes("SHELTER") || t.includes("BUS")) return "B";
  return "H"; // Hoarding default
}

function getSiteCode(site: SiteItem, fallbackIndex: number = 1): string {
  if (site.code) return site.code;
  const cityCode = getCityAbbreviation(site.city);
  const mediaCode = getMediaTypeAbbreviation(site.type);
  const serial = String(fallbackIndex).padStart(3, '0');
  return `${cityCode}/${mediaCode}/${serial}`;
}

type SelectedSite = SiteItem & {
  customRate: number;
  discountPercent?: number;
  customNotes: string;
};

const AVAILABLE_COLUMNS = [
  { id: "code", label: "Site Code (e.g. NGP/H/001)", default: true },
  { id: "name", label: "Site Name", default: true },
  { id: "city", label: "City", default: true },
  { id: "area", label: "Area / Location", default: true },
  { id: "size", label: "Size (Dimensions)", default: true },
  { id: "type", label: "Media Type", default: true },
  { id: "lit_type", label: "Illumination", default: true },
  { id: "status", label: "Availability Status", default: false },
  { id: "net_rate", label: "Standard / Card Rate (₹)", default: false },
  { id: "mounting_charges", label: "Mounting Charges (₹)", default: false },
  { id: "discountPercent", label: "Discount (%)", default: false },
  { id: "customRate", label: "Quoted Rate (₹/month)", default: true },
  { id: "customNotes", label: "Custom Proposal Remarks", default: true },
];

export default function QuotationsClient({ initialSites }: { initialSites: SiteItem[] }) {
  // Campaign & Client Info State
  const [clientName, setClientName] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [preparedBy, setPreparedBy] = useState("TrueSign Media");
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split("T")[0]);
  const [validityDays, setValidityDays] = useState("15 Days");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [includeGst, setIncludeGst] = useState<boolean>(false);
  const gstRate = 18; // 18% GST

  // Site Picker State
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Selected Sites in Quotation (uuid -> SelectedSite)
  const [selectedSitesMap, setSelectedSitesMap] = useState<Record<string, SelectedSite>>({});

  // Column Customization for Excel Export
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.filter(c => c.default).map(c => c.id)
  );

  // Active Tab: "builder" (site select & customize) | "preview"
  const [activeStep, setActiveStep] = useState<"select" | "rates" | "export">("select");
  const [isExporting, setIsExporting] = useState(false);

  // Extracted Filter Lists
  const citiesList = useMemo(() => {
    const cities = Array.from(new Set(initialSites.map(s => s.city).filter(Boolean)));
    return ["All", ...cities.sort()];
  }, [initialSites]);

  const typesList = useMemo(() => {
    const types = Array.from(new Set(initialSites.map(s => s.type).filter(Boolean)));
    return ["All", ...types.sort()];
  }, [initialSites]);

  // Filtered Site List in Picker
  const filteredSites = useMemo(() => {
    return initialSites.filter((site, index) => {
      if (selectedCity !== "All" && site.city?.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (selectedType !== "All" && site.type?.toLowerCase() !== selectedType.toLowerCase()) return false;
      if (selectedStatus !== "All" && site.status?.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const siteCode = (site.code || getSiteCode(site, index + 1)).toLowerCase();
        const matchName = site.name?.toLowerCase().includes(query);
        const matchCity = site.city?.toLowerCase().includes(query);
        const matchArea = site.area?.toLowerCase().includes(query);
        const matchCode = site.uuid?.toLowerCase().includes(query) || siteCode.includes(query);
        if (!matchName && !matchCity && !matchArea && !matchCode) return false;
      }
      return true;
    });
  }, [initialSites, search, selectedCity, selectedType, selectedStatus]);

  // Selected Sites as Array
  const selectedSitesList = useMemo(() => {
    return Object.values(selectedSitesMap);
  }, [selectedSitesMap]);

  // Total Calculations
  const totalStandardAmount = useMemo(() => {
    return selectedSitesList.reduce((sum, site) => sum + (Number(site.net_rate) || 0), 0);
  }, [selectedSitesList]);

  const baseQuotedAmount = useMemo(() => {
    const rawTotal = selectedSitesList.reduce((sum, site) => sum + (Number(site.customRate) || 0), 0);
    if (discountPercent > 0) {
      return Math.round(rawTotal * (1 - discountPercent / 100));
    }
    return rawTotal;
  }, [selectedSitesList, discountPercent]);

  const gstAmount = useMemo(() => {
    return includeGst ? Math.round(baseQuotedAmount * (gstRate / 100)) : 0;
  }, [includeGst, baseQuotedAmount, gstRate]);

  const totalQuotedAmount = useMemo(() => {
    return baseQuotedAmount + gstAmount;
  }, [baseQuotedAmount, gstAmount]);

  // Toggle Site Selection
  const toggleSite = (site: SiteItem) => {
    setSelectedSitesMap(prev => {
      const updated = { ...prev };
      if (updated[site.uuid]) {
        delete updated[site.uuid];
      } else {
        const cardRate = Number(site.net_rate) || 50000;
        updated[site.uuid] = {
          ...site,
          customRate: cardRate,
          discountPercent: 0,
          customNotes: `Prime visibility at ${site.area || site.city}. High vehicular traffic.`,
        };
      }
      return updated;
    });
  };

  // Bulk Select/Deselect
  const handleSelectAllFiltered = () => {
    setSelectedSitesMap(prev => {
      const updated = { ...prev };
      filteredSites.forEach(site => {
        if (!updated[site.uuid]) {
          const cardRate = Number(site.net_rate) || 50000;
          updated[site.uuid] = {
            ...site,
            customRate: cardRate,
            discountPercent: 0,
            customNotes: `Prime visibility at ${site.area || site.city}.`,
          };
        }
      });
      return updated;
    });
  };

  const handleClearSelection = () => {
    setSelectedSitesMap({});
  };

  // Update Custom Rate for a Site
  const handleCustomRateChange = (uuid: string, rate: number) => {
    setSelectedSitesMap(prev => {
      if (!prev[uuid]) return prev;
      const site = prev[uuid];
      const cardRate = Number(site.net_rate) || rate;
      const disc = cardRate > 0 && rate < cardRate ? Math.round(((cardRate - rate) / cardRate) * 100) : 0;
      return {
        ...prev,
        [uuid]: {
          ...prev[uuid],
          customRate: rate,
          discountPercent: disc,
        },
      };
    });
  };

  // Update Discount % for a Site
  const handleDiscountPercentChange = (uuid: string, discount: number) => {
    setSelectedSitesMap(prev => {
      if (!prev[uuid]) return prev;
      const site = prev[uuid];
      const cardRate = Number(site.net_rate) || 50000;
      const safeDiscount = Math.max(0, Math.min(100, discount));
      const calculatedRate = safeDiscount > 0 ? Math.round(cardRate * (1 - safeDiscount / 100)) : cardRate;
      return {
        ...prev,
        [uuid]: {
          ...prev[uuid],
          discountPercent: safeDiscount,
          customRate: calculatedRate,
        },
      };
    });
  };

  // Update Custom Notes for a Site
  const handleCustomNotesChange = (uuid: string, notes: string) => {
    setSelectedSitesMap(prev => {
      if (!prev[uuid]) return prev;
      return {
        ...prev,
        [uuid]: {
          ...prev[uuid],
          customNotes: notes,
        },
      };
    });
  };

  // Toggle Column for Excel Export
  const toggleColumn = (colId: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(colId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(id => id !== colId);
      }
      return [...prev, colId];
    });
  };
    // Helper to parse dimensions and sqft from size string (e.g. "40x20", "40*20", "40 x 20")
  const parseDimensions = (sizeStr: string) => {
    if (!sizeStr) return { w: 40, h: 20, sqft: 800 };
    const matches = sizeStr.match(/(\d+(?:\.\d+)?)\s*(?:[xX*×\/-]|\s*by\s*)\s*(\d+(?:\.\d+)?)/);
    if (matches) {
      const w = parseFloat(matches[1]);
      const h = parseFloat(matches[2]);
      return { w, h, sqft: Math.round(w * h) };
    }
    const single = sizeStr.match(/(\d+(?:\.\d+)?)/);
    if (single) {
      const s = parseFloat(single[1]);
      return { w: s, h: Math.round(s / 2), sqft: Math.round(s * (s / 2)) };
    }
    return { w: 40, h: 20, sqft: 800 };
  };

  // Helper to format lighting type as in Anurag Sir.xlsx (F/L, N.LIT, B/L)
  const formatLitType = (lit: string) => {
    const l = (lit || "").toLowerCase();
    if (l.includes("non") || l.includes("n.lit") || l.includes("unlit")) return "N.LIT";
    if (l.includes("back") || l.includes("b/l")) return "B/L";
    if (l.includes("digital") || l.includes("led")) return "Digital";
    return "F/L";
  };

  // ==========================================
  // 1. EXCEL EXPORT (.xlsx) - MATCHING ANURAG SIR.XLSX FORMAT
  // ==========================================
  const handleExportExcel = () => {
    if (selectedSitesList.length === 0) {
      alert("Please select at least one site to export.");
      return;
    }

    try {
      setIsExporting(true);

      const formattedDate = quotationDate ? quotationDate.split("-").reverse().join(".") : "22.08.2026";
      const primaryCity = selectedSitesList[0]?.city || "Nagpur";

      // Build Header Info matching Anurag Sir.xlsx
      const sheetData: any[][] = [
        ["Quotation For Advertisement"],
        [],
        [`Date - ${formattedDate}`],
        [],
        ["To,"],
        [clientName || "Valued Client"],
        [campaignName || "Marketing Department"],
        [`${selectedSitesList[0]?.area ? selectedSitesList[0].area + ", " : ""}${primaryCity}`],
        [],
        ["Subject: - Quotation of Advertsement"],
        [],
        ["We are pleased to submit our media quotation for as under:-"],
        ["Sr. No", "City", "Hoarding Location ", " LIT/ N.LIT", "Media", "W", "H", "Qty.", "Total Sq. ft.", "DCPM"],
      ];

      // Table Rows
      let grandTotalSqft = 0;
      selectedSitesList.forEach((site, index) => {
        const { w, h, sqft } = parseDimensions(site.size);
        grandTotalSqft += sqft;
        sheetData.push([
          index + 1,
          site.city || primaryCity,
          `${site.name}${site.area ? " (" + site.area + ")" : ""}`,
          formatLitType(site.lit_type),
          site.type || "Hoarding",
          w,
          h,
          1,
          sqft,
          Number(site.customRate) || 0
        ]);
      });

      // Total Row
      sheetData.push([
        "TOTAL",
        "",
        "",
        "",
        "",
        "",
        "",
        selectedSitesList.length,
        grandTotalSqft,
        totalQuotedAmount
      ]);

      if (includeGst) {
        sheetData.push([
          "TOTAL (INCL. 18% GST)",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          totalQuotedAmount
        ]);
      }

      sheetData.push([]);
      sheetData.push(["", "Terms & Conditions :-"]);
      sheetData.push(["", "1.  All the above mentioned sites are Subject to availability at the time of final booking/written confirmation."]);
      sheetData.push(["", "2.  Formal Add Release order to be drawn in favour of \"Truesign Media\"."]);
      sheetData.push(["", "3.  No mid term cancellation will be accepted."]);
      sheetData.push(["", "4.  Flex torn due to natural calamity or stolen by chance shall not be our responsibility."]);
      sheetData.push(["", "5.  Flex Mounting Charges @Rs.3/- Per Sq.ft  and Printing Charges for Non lit @ Rs. 09/- Per Sqr. Ft."]);
      sheetData.push(["", "6.  Rates mentioned above is inclusive of Ground Rent and Municipal Taxes."]);
      sheetData.push(["", includeGst ? "7.  Rates mentioned above are inclusive of 18.00% GST." : "7.  GST @18.00% extra."]);
      sheetData.push(["", "8. After completion of the campaign, the flex material may be collected by the party from our office within 7 (seven) days, failing which our"]);
      sheetData.push(["", "agency shall not be responsible for damage, or loss, and no claim regarding the flex will be entertained there."]);
      sheetData.push(["", "9. Payment is Advance."]);
      sheetData.push([]);
      sheetData.push(["", "Thanking you and looking forward for your favorable reply."]);
      sheetData.push(["", "Yours truly,"]);
      sheetData.push(["", preparedBy || "Jatin Dhakre"]);
      sheetData.push(["", "Mo.no. 9765556859 / 9765556861"]);
      sheetData.push(["", "Truesign Media"]);
      sheetData.push(["", "Nagpur"]);
      sheetData.push([]);
      sheetData.push(["Office Ad. - 123, Bhagwaghar Layout, Behind Traffic Park, Dharmapeth, Nagpur-440010. Ph: 0712-2544985, E-Mail : samarketing.nagpur@gmail.com"]);

      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // Auto column widths
      ws["!cols"] = [
        { wch: 8 },  // Sr. No
        { wch: 15 }, // City
        { wch: 45 }, // Hoarding Location
        { wch: 14 }, // LIT/ N.LIT
        { wch: 14 }, // Media
        { wch: 8 },  // W
        { wch: 8 },  // H
        { wch: 8 },  // Qty
        { wch: 15 }, // Total Sq. ft.
        { wch: 18 }, // DCPM
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const fileName = `Quotation_Advertisement_${(clientName || "Client").replace(/[^a-zA-Z0-9]/g, "_")}_${quotationDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      alert("Failed to export Excel: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // ==========================================
  // 2. POWERPOINT EXPORT (.pptx) - MATCHING ANURAG SIR.XLSX OFFICIAL FORMAT
  // ==========================================
  const handleExportPPT = async () => {
    if (selectedSitesList.length === 0) {
      alert("Please select at least one site to export.");
      return;
    }

    if (!clientName.trim()) {
      alert("Please enter the Client / Brand Name. It is mandatory for generating the proposal presentation.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!campaignName.trim()) {
      alert("Please enter the Campaign Name. It is mandatory for generating the proposal presentation.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setIsExporting(true);

      // Load TrueSign Media Logo as base64 for embedding
      let logoData = "";
      try {
        const logoResp = await fetch("/truesign_logo.png");
        if (logoResp.ok) {
          const blob = await logoResp.blob();
          logoData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve("");
            reader.readAsDataURL(blob);
          });
        }
      } catch (e) {
        console.warn("Could not load logo for PPT:", e);
      }

      const ppt = new pptxgen();
      
      // Explicit 16:9 Widescreen Canvas: 13.333 inches x 7.50 inches
      ppt.defineLayout({ name: "CUSTOM_16_9", width: 13.333, height: 7.5 });
      ppt.layout = "CUSTOM_16_9";
      ppt.author = preparedBy || "TrueSign Media";
      ppt.company = "TrueSign Media";
      ppt.title = `Quotation For Advertisement - ${clientName}`;

      // Professional White & Blue Corporate Color Palette
      const C_WHITE = "FFFFFF";
      const C_BG_LIGHT = "F8FAFC";
      const C_NAVY = "0A2540";
      const C_ROYAL_BLUE = "1E40AF";
      const C_ACCENT_BLUE = "2563EB";
      const C_ICE_BLUE = "EFF6FF";
      const C_BORDER_BLUE = "DBEAFE";
      const C_BORDER_LIGHT = "E2E8F0";
      const C_TEXT_DARK = "0F172A";
      const C_TEXT_SLATE = "334155";
      const C_TEXT_MUTED = "64748B";

      const uniqueCities = Array.from(new Set(selectedSitesList.map(s => s.city).filter(Boolean)));
      const citiesStr = uniqueCities.length > 0 ? uniqueCities.join(", ") : "Nagpur";
      const formattedDate = quotationDate ? quotationDate.split("-").reverse().join(".") : "22.08.2026";
      const primaryCity = selectedSitesList[0]?.city || "Nagpur";

      let grandTotalSqft = 0;
      selectedSitesList.forEach(site => {
        const { sqft } = parseDimensions(site.size);
        grandTotalSqft += sqft;
      });

      // -------------------------------------------------------------
      // SLIDE 1: Official Quotation Letter / Cover Slide (Anurag Sir format)
      // -------------------------------------------------------------
      const coverSlide = ppt.addSlide();
      coverSlide.background = { color: C_WHITE };

      // Top Primary Blue Accent Header Stripe
      coverSlide.addShape(ppt.ShapeType.rect, {
        x: 0, y: 0, w: 13.333, h: 0.18,
        fill: { color: C_ROYAL_BLUE },
      });

      // Left Vertical Blue Accent Bar
      coverSlide.addShape(ppt.ShapeType.rect, {
        x: 0.8, y: 0.65, w: 0.12, h: 2.5,
        fill: { color: C_ACCENT_BLUE },
      });

      // Top Category Pill
      coverSlide.addShape(ppt.ShapeType.roundRect, {
        x: 1.1, y: 0.65, w: 4.8, h: 0.42,
        fill: { color: C_ICE_BLUE },
        line: { color: C_BORDER_BLUE, width: 1 },
      });
      coverSlide.addText("TRUESIGN MEDIA · MEDIA QUOTATION", {
        x: 1.1, y: 0.65, w: 4.8, h: 0.42,
        fontSize: 10, fontFace: "Helvetica",
        bold: true, color: C_ROYAL_BLUE, align: "center", valign: "middle",
      });

      // Main Proposal Title matching Anurag Sir.xlsx
      coverSlide.addText("Quotation For Advertisement", {
        x: 1.1, y: 1.2, w: 8.8, h: 0.6,
        fontSize: 28, fontFace: "Helvetica",
        bold: true, color: C_NAVY,
      });

      // Add TrueSign Media Logo on Top Right
      if (logoData) {
        try {
          coverSlide.addImage({
            data: logoData,
            x: 10.4, y: 0.65,
            w: 2.1, h: 2.1,
            sizing: { type: "contain", w: 2.1, h: 2.1 },
          });
        } catch (e) {
          console.warn("Logo embed error:", e);
        }
      }

      // Addressee & Letter Text Container Box
      coverSlide.addShape(ppt.ShapeType.roundRect, {
        x: 1.1, y: 1.85, w: 8.8, h: 1.6,
        fill: { color: C_ICE_BLUE },
        line: { color: C_BORDER_BLUE, width: 1 },
      });

      coverSlide.addText(
        [
          { text: `Date - ${formattedDate}\n`, options: { bold: true, color: C_ROYAL_BLUE, fontSize: 10 } },
          { text: "To,\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 10 } },
          { text: `${clientName}\n`, options: { bold: true, color: C_NAVY, fontSize: 11 } },
          { text: `${campaignName}, ${selectedSitesList[0]?.area ? selectedSitesList[0].area + ", " : ""}${primaryCity}\n`, options: { color: C_TEXT_SLATE, fontSize: 9.5 } },
          { text: `Subject: - Quotation of Advertsement\n`, options: { bold: true, color: C_ACCENT_BLUE, fontSize: 10 } },
          { text: "We are pleased to submit our media quotation for as under:-", options: { italic: true, color: C_TEXT_SLATE, fontSize: 9.5 } },
        ],
        {
          x: 1.3, y: 1.95, w: 8.4, h: 1.4,
          fontFace: "Helvetica",
          lineSpacingMultiple: 1.05,
        }
      );

      // Bottom 4 Metric Showcase Cards
      const metrics = [
        { label: "TOTAL HOARDINGS", value: `${selectedSitesList.length} Locations` },
        { label: "TOTAL DISPLAY AREA", value: `${grandTotalSqft.toLocaleString("en-IN")} Sq. ft.` },
        { label: "TARGET CITIES", value: citiesStr },
        {
          label: includeGst ? "DCPM (INCL. 18% GST)" : "DCPM (MONTHLY TOTAL)",
          value: `₹${totalQuotedAmount.toLocaleString("en-IN")}`
        },
      ];

      const cardW = 2.72;
      const cardGap = 0.28;
      metrics.forEach((m, idx) => {
        const cardX = 0.8 + idx * (cardW + cardGap);
        coverSlide.addShape(ppt.ShapeType.roundRect, {
          x: cardX, y: 3.65, w: cardW, h: 2.3,
          fill: { color: idx === 3 ? C_ICE_BLUE : C_WHITE },
          line: { color: idx === 3 ? C_ACCENT_BLUE : C_BORDER_LIGHT, width: idx === 3 ? 1.5 : 1 },
        });

        coverSlide.addText(m.label, {
          x: cardX + 0.2, y: 3.9, w: cardW - 0.4, h: 0.35,
          fontSize: 9.5, fontFace: "Helvetica",
          bold: true, color: idx === 3 ? C_ROYAL_BLUE : C_TEXT_MUTED,
        });

        coverSlide.addText(m.value, {
          x: cardX + 0.2, y: 4.35, w: cardW - 0.4, h: 1.35,
          fontSize: idx === 3 ? 18 : 14.5, fontFace: "Helvetica",
          bold: true, color: idx === 3 ? C_ROYAL_BLUE : C_TEXT_DARK,
          valign: "top",
        });
      });

      // Footer brand bar
      coverSlide.addShape(ppt.ShapeType.roundRect, {
        x: 0.8, y: 6.35, w: 11.733, h: 0.65,
        fill: { color: C_ICE_BLUE },
        line: { color: C_BORDER_BLUE, width: 1 },
      });

      coverSlide.addText("TRUESIGN MEDIA · 123, Bhagwaghar Layout, Behind Traffic Park, Dharampeth, Nagpur-440010 · Ph: 0712-2544985 · samarketing.nagpur@gmail.com", {
        x: 1.0, y: 6.35, w: 11.333, h: 0.65,
        fontSize: 9.5, fontFace: "Helvetica",
        color: C_NAVY, bold: true, align: "center", valign: "middle",
      });

      // -------------------------------------------------------------
      // SLIDE 2: Media Quotation & Inventory Matrix (matching Anurag Sir.xlsx)
      // -------------------------------------------------------------
      const summarySlide = ppt.addSlide();
      summarySlide.background = { color: C_BG_LIGHT };

      // Header Banner (Navy Blue)
      summarySlide.addShape(ppt.ShapeType.rect, {
        x: 0, y: 0, w: 13.333, h: 1.1,
        fill: { color: C_NAVY },
      });
      summarySlide.addText("MEDIA QUOTATION & INVENTORY MATRIX", {
        x: 0.8, y: 0.18, w: 8.0, h: 0.4,
        fontSize: 18, fontFace: "Helvetica",
        bold: true, color: C_WHITE,
      });
      summarySlide.addText(`Subject: - Quotation of Advertsement · ${clientName} · ${campaignName}`, {
        x: 0.8, y: 0.6, w: 8.0, h: 0.3,
        fontSize: 11, fontFace: "Helvetica",
        color: C_BORDER_BLUE,
      });

      // Top Right Total Investment Pill
      summarySlide.addShape(ppt.ShapeType.roundRect, {
        x: 8.4, y: 0.2, w: 4.1, h: 0.7,
        fill: { color: C_ICE_BLUE },
        line: { color: C_ACCENT_BLUE, width: 1.5 },
      });
      summarySlide.addText(`Total: ₹${totalQuotedAmount.toLocaleString("en-IN")} / Mo ${includeGst ? "(Incl. GST)" : ""}`, {
        x: 8.4, y: 0.2, w: 4.1, h: 0.7,
        fontSize: 12.5, fontFace: "Helvetica",
        bold: true, color: C_NAVY,
        align: "center", valign: "middle",
      });

      // Summary Table Headers exactly matching Anurag Sir.xlsx
      const tableHeaders = [
        { text: "Sr. No", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9, align: "center" as const } },
        { text: "City", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9 } },
        { text: "Hoarding Location", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9 } },
        { text: "LIT/ N.LIT", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9, align: "center" as const } },
        { text: "Media", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9, align: "center" as const } },
        { text: "W", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9, align: "center" as const } },
        { text: "H", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9, align: "center" as const } },
        { text: "Qty.", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9, align: "center" as const } },
        { text: "Total Sq. ft.", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9, align: "right" as const } },
        { text: "DCPM (₹)", options: { bold: true, fill: { color: C_ROYAL_BLUE }, color: C_WHITE, fontSize: 9, align: "right" as const } },
      ];

      const tableBody = selectedSitesList.map((site, i) => {
        const { w, h, sqft } = parseDimensions(site.size);
        const bg = i % 2 === 0 ? C_WHITE : "F8FAFC";
        return [
          { text: String(i + 1), options: { align: "center" as const, fontSize: 9, color: C_TEXT_SLATE, fill: { color: bg } } },
          { text: site.city || primaryCity, options: { fontSize: 9, color: C_TEXT_SLATE, fill: { color: bg } } },
          { text: `${site.name}${site.area ? " (" + site.area + ")" : ""}`, options: { bold: true, fontSize: 9, color: C_TEXT_DARK, fill: { color: bg } } },
          { text: formatLitType(site.lit_type), options: { align: "center" as const, fontSize: 9, color: C_TEXT_SLATE, fill: { color: bg } } },
          { text: site.type || "Hoarding", options: { align: "center" as const, fontSize: 9, color: C_TEXT_SLATE, fill: { color: bg } } },
          { text: String(w), options: { align: "center" as const, fontSize: 9, color: C_TEXT_SLATE, fill: { color: bg } } },
          { text: String(h), options: { align: "center" as const, fontSize: 9, color: C_TEXT_SLATE, fill: { color: bg } } },
          { text: "1", options: { align: "center" as const, fontSize: 9, color: C_TEXT_SLATE, fill: { color: bg } } },
          { text: sqft.toLocaleString("en-IN"), options: { align: "right" as const, fontSize: 9, color: C_TEXT_SLATE, fill: { color: bg } } },
          { text: `₹${(Number(site.customRate) || 0).toLocaleString("en-IN")}`, options: { bold: true, fontSize: 9.5, color: C_ROYAL_BLUE, align: "right" as const, fill: { color: bg } } },
        ];
      });

      const tableTotalRow = [
        { text: "TOTAL", options: { bold: true, fill: { color: C_ICE_BLUE }, color: C_NAVY, fontSize: 9.5, align: "center" as const } },
        { text: `${uniqueCities.length} Cities`, options: { fill: { color: C_ICE_BLUE }, color: C_TEXT_SLATE, fontSize: 9 } },
        { text: `${selectedSitesList.length} Hoarding Sites`, options: { bold: true, fill: { color: C_ICE_BLUE }, color: C_NAVY, fontSize: 9 } },
        { text: "-", options: { fill: { color: C_ICE_BLUE }, color: C_TEXT_SLATE, fontSize: 9, align: "center" as const } },
        { text: "-", options: { fill: { color: C_ICE_BLUE }, color: C_TEXT_SLATE, fontSize: 9, align: "center" as const } },
        { text: "-", options: { fill: { color: C_ICE_BLUE }, color: C_TEXT_SLATE, fontSize: 9, align: "center" as const } },
        { text: "-", options: { fill: { color: C_ICE_BLUE }, color: C_TEXT_SLATE, fontSize: 9, align: "center" as const } },
        { text: String(selectedSitesList.length), options: { bold: true, fill: { color: C_ICE_BLUE }, color: C_NAVY, fontSize: 9, align: "center" as const } },
        { text: `${grandTotalSqft.toLocaleString("en-IN")} sq.ft.`, options: { bold: true, fill: { color: C_ICE_BLUE }, color: C_NAVY, fontSize: 9, align: "right" as const } },
        { text: `₹${totalQuotedAmount.toLocaleString("en-IN")}`, options: { bold: true, fill: { color: C_ICE_BLUE }, color: C_ROYAL_BLUE, fontSize: 10.5, align: "right" as const } },
      ];

      summarySlide.addTable([tableHeaders, ...tableBody, tableTotalRow], {
        x: 0.8, y: 1.35, w: 11.733,
        rowH: 0.36,
        colW: [0.6, 1.2, 3.8, 0.9, 1.0, 0.5, 0.5, 0.5, 1.1, 1.633],
        border: { color: "CBD5E1", pt: 0.5 },
        fill: { color: C_WHITE },
      });

      // -------------------------------------------------------------
      // SLIDES 3..N+2: Dedicated Site Showcase (1 Slide Per Site)
      // -------------------------------------------------------------
      selectedSitesList.forEach((site, index) => {
        const slide = ppt.addSlide();
        slide.background = { color: C_BG_LIGHT };

        const { w, h, sqft } = parseDimensions(site.size);

        // Top Header Banner (Navy Blue)
        slide.addShape(ppt.ShapeType.rect, {
          x: 0, y: 0, w: 13.333, h: 1.1,
          fill: { color: C_NAVY },
        });

        // Left Header: Site Title & Location
        slide.addText(
          [
            { text: `LOCATION ${index + 1} OF ${selectedSitesList.length}: `, options: { bold: true, color: C_BORDER_BLUE, fontSize: 10 } },
            { text: `${site.name.toUpperCase()}\n`, options: { bold: true, color: C_WHITE, fontSize: 15 } },
            { text: `📍 ${site.city}${site.area ? " · " + site.area : ""} · Code: ${site.uuid}`, options: { color: "93C5FD", fontSize: 9.5 } },
          ],
          {
            x: 0.8, y: 0.12, w: 8.2, h: 0.9,
            fontFace: "Helvetica",
          }
        );

        // Right Header: White/Blue Price Tag Box
        slide.addShape(ppt.ShapeType.roundRect, {
          x: 9.2, y: 0.18, w: 3.3, h: 0.74,
          fill: { color: C_WHITE },
          line: { color: C_ACCENT_BLUE, width: 1.5 },
        });
        slide.addText(
          `₹${(Number(site.customRate) || 0).toLocaleString("en-IN")} / Mo`,
          {
            x: 9.2, y: 0.18, w: 3.3, h: 0.42,
            fontSize: 15.5, fontFace: "Helvetica",
            bold: true, color: C_ROYAL_BLUE,
            align: "center",
          }
        );
        slide.addText(
          includeGst ? "+ 18% GST Included" : "+ Applicable GST",
          {
            x: 9.2, y: 0.58, w: 3.3, h: 0.28,
            fontSize: 8.5, fontFace: "Helvetica",
            color: C_TEXT_MUTED, bold: true,
            align: "center",
          }
        );

        // --------------------------------------------------
        // LEFT COLUMN: High-Impact Site Photo Frame
        // --------------------------------------------------
        const photoBoxX = 0.8;
        const photoBoxY = 1.35;
        const photoBoxW = 6.6;
        const photoBoxH = 5.2;

        slide.addShape(ppt.ShapeType.roundRect, {
          x: photoBoxX, y: photoBoxY, w: photoBoxW, h: photoBoxH,
          fill: { color: C_WHITE },
          line: { color: C_BORDER_LIGHT, width: 1 },
        });

        const sitePhotoUrl = site.photo || "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=800&q=80";
        try {
          slide.addImage({
            path: sitePhotoUrl,
            x: photoBoxX + 0.15, y: photoBoxY + 0.15,
            w: photoBoxW - 0.3, h: photoBoxH - 0.8,
            sizing: { type: "cover", w: photoBoxW - 0.3, h: photoBoxH - 0.8 },
          });
        } catch {
          slide.addShape(ppt.ShapeType.rect, {
            x: photoBoxX + 0.15, y: photoBoxY + 0.15,
            w: photoBoxW - 0.3, h: photoBoxH - 0.8,
            fill: { color: "E2E8F0" },
          });
          slide.addText("📷 SITE PHOTOGRAPH", {
            x: photoBoxX + 0.15, y: photoBoxY + 1.8,
            w: photoBoxW - 0.3, h: 0.8,
            align: "center", fontSize: 16, color: "64748B", bold: true,
          });
        }

        // Photo Footer Caption Bar
        slide.addShape(ppt.ShapeType.rect, {
          x: photoBoxX + 0.15, y: photoBoxY + photoBoxH - 0.6,
          w: photoBoxW - 0.3, h: 0.45,
          fill: { color: C_ROYAL_BLUE },
        });
        const siteCode = site.code || getSiteCode(site, index + 1);
        slide.addText(`📍 ${site.city}${site.area ? " · " + site.area : ""} | Code: ${siteCode}`, {
          x: 0.8 + 0.25, y: 1.35 + photoBoxH - 0.45,
          w: photoBoxW - 0.5, h: 0.45,
          fontSize: 10, fontFace: "Helvetica",
          bold: true, color: C_WHITE,
          valign: "middle",
        });

        // --------------------------------------------------
        // RIGHT COLUMN: Specifications & Key Highlights Cards
        // --------------------------------------------------
        const rightX = 7.7;
        const rightW = 4.833;

        // Card 1: Media Specifications matching Anurag Sir columns
        slide.addShape(ppt.ShapeType.roundRect, {
          x: rightX, y: 1.35, w: rightW, h: 2.8,
          fill: { color: C_WHITE },
          line: { color: C_BORDER_BLUE, width: 1.5 },
        });

        slide.addShape(ppt.ShapeType.rect, {
          x: rightX, y: 1.35, w: rightW, h: 0.45,
          fill: { color: C_ICE_BLUE },
        });
        slide.addText(`HOARDING SPECIFICATIONS (${siteCode})`, {
          x: rightX + 0.2, y: 1.35, w: rightW - 0.4, h: 0.45,
          fontSize: 10.5, fontFace: "Helvetica",
          bold: true, color: C_ROYAL_BLUE, valign: "middle",
        });

        const specsItems = [
          { text: "SITE CODE:\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 9.5 } },
          { text: `${siteCode}\n\n`, options: { color: C_ROYAL_BLUE, fontSize: 10.5, bold: true } },

          { text: "DIMENSIONS (W × H):\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 9.5 } },
          { text: `${w} ft × ${h} ft  (${sqft.toLocaleString("en-IN")} Total Sq. ft.)\n\n`, options: { color: C_TEXT_SLATE, fontSize: 10.5, bold: true } },

          { text: "MEDIA TYPE & ILLUMINATION:\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 9.5 } },
          { text: `${site.type || "Hoarding"} · ${formatLitType(site.lit_type)} (${site.lit_type || "Front Lit"})\n\n`, options: { color: C_TEXT_SLATE, fontSize: 10.5 } },

          { text: "DCPM / MONTHLY RATE:\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 9.5 } },
          { text: `₹${(Number(site.customRate) || 0).toLocaleString("en-IN")} / month`, options: { color: C_ROYAL_BLUE, fontSize: 10.5, bold: true } },
        ];

        slide.addText(specsItems, {
          x: rightX + 0.2, y: 1.85, w: rightW - 0.4, h: 2.2,
          fontFace: "Helvetica",
          lineSpacingMultiple: 0.95,
        });

        // Card 2: Visibility & Remarks
        slide.addShape(ppt.ShapeType.roundRect, {
          x: rightX, y: 4.35, w: rightW, h: 2.2,
          fill: { color: C_WHITE },
          line: { color: C_BORDER_LIGHT, width: 1 },
        });

        slide.addShape(ppt.ShapeType.rect, {
          x: rightX, y: 4.35, w: rightW, h: 0.45,
          fill: { color: "F1F5F9" },
        });
        slide.addText("LOCATION & VISIBILITY REMARKS", {
          x: rightX + 0.2, y: 4.35, w: rightW - 0.4, h: 0.45,
          fontSize: 10.5, fontFace: "Helvetica",
          bold: true, color: C_NAVY, valign: "middle",
        });

        const remarksText = site.customNotes || `Prime strategic visibility facing high vehicular traffic at ${site.name}, ${site.city}. Unobstructed viewing angle for high brand recall.`;
        slide.addText(remarksText, {
          x: rightX + 0.2, y: 4.9, w: rightW - 0.4, h: 1.5,
          fontSize: 10, fontFace: "Helvetica",
          color: C_TEXT_SLATE,
          italic: true,
          lineSpacingMultiple: 1.15,
        });

        // Footer Note
        slide.addText(
          `TrueSign Media · Quotation For Advertisement · Slide ${index + 3} of ${selectedSitesList.length + 3}`,
          {
            x: 0.8, y: 6.85, w: 11.733, h: 0.35,
            fontSize: 8.5, fontFace: "Helvetica",
            color: C_TEXT_MUTED, align: "center",
          }
        );
      });

      // -------------------------------------------------------------
      // FINAL SLIDE: Official Terms & Conditions & Sign-off (Exact match with Anurag Sir.xlsx)
      // -------------------------------------------------------------
      const finalSlide = ppt.addSlide();
      finalSlide.background = { color: C_BG_LIGHT };

      finalSlide.addShape(ppt.ShapeType.rect, {
        x: 0, y: 0, w: 13.333, h: 1.1,
        fill: { color: C_NAVY },
      });

      finalSlide.addText("TERMS & CONDITIONS", {
        x: 0.8, y: 0.18, w: 11.733, h: 0.4,
        fontSize: 18, fontFace: "Helvetica",
        bold: true, color: C_WHITE,
      });
      finalSlide.addText("Standard operational terms, execution guidelines & confirmation details", {
        x: 0.8, y: 0.6, w: 11.733, h: 0.3,
        fontSize: 11, fontFace: "Helvetica",
        color: C_BORDER_BLUE,
      });

      // Left Box: 9 Official Terms & Conditions exactly from Anurag Sir.xlsx
      finalSlide.addShape(ppt.ShapeType.roundRect, {
        x: 0.8, y: 1.35, w: 7.6, h: 4.6,
        fill: { color: C_WHITE },
        line: { color: C_BORDER_BLUE, width: 1.5 },
      });

      finalSlide.addShape(ppt.ShapeType.rect, {
        x: 0.8, y: 1.35, w: 7.6, h: 0.45,
        fill: { color: C_ICE_BLUE },
      });

      finalSlide.addText("TERMS & CONDITIONS :-", {
        x: 1.05, y: 1.35, w: 7.1, h: 0.45,
        fontSize: 11, fontFace: "Helvetica",
        bold: true, color: C_ROYAL_BLUE, valign: "middle",
      });

      const termsText = [
        { text: "1.  All the above mentioned sites are Subject to availability at the time of final booking/written confirmation.\n", options: { color: C_TEXT_SLATE, fontSize: 8.5 } },
        { text: "2.  Formal Add Release order to be drawn in favour of \"Truesign Media\".\n", options: { color: C_TEXT_SLATE, fontSize: 8.5 } },
        { text: "3.  No mid term cancellation will be accepted.\n", options: { color: C_TEXT_SLATE, fontSize: 8.5 } },
        { text: "4.  Flex torn due to natural calamity or stolen by chance shall not be our responsibility.\n", options: { color: C_TEXT_SLATE, fontSize: 8.5 } },
        { text: "5.  Flex Mounting Charges @Rs.3/- Per Sq.ft  and Printing Charges for Non lit @ Rs. 09/- Per Sqr. Ft.\n", options: { color: C_TEXT_SLATE, fontSize: 8.5 } },
        { text: "6.  Rates mentioned above is inclusive of Ground Rent and Municipal Taxes.\n", options: { color: C_TEXT_SLATE, fontSize: 8.5 } },
        { text: includeGst ? "7.  Rates mentioned above are inclusive of 18.00% GST.\n" : "7.  GST @18.00% extra.\n", options: { bold: true, color: C_ROYAL_BLUE, fontSize: 8.5 } },
        { text: "8.  After completion of the campaign, the flex material may be collected by the party from our office within 7 (seven) days, failing which our agency shall not be responsible for damage, or loss, and no claim regarding the flex will be entertained there.\n", options: { color: C_TEXT_SLATE, fontSize: 8.5 } },
        { text: "9.  Payment is Advance.", options: { bold: true, color: C_NAVY, fontSize: 9 } },
      ];

      finalSlide.addText(termsText, {
        x: 1.05, y: 1.9, w: 7.1, h: 3.9,
        fontFace: "Helvetica",
        lineSpacingMultiple: 1.1,
      });

      // Right Box: Official Sign-Off & Contact (from Anurag Sir.xlsx)
      finalSlide.addShape(ppt.ShapeType.roundRect, {
        x: 8.7, y: 1.35, w: 3.833, h: 4.6,
        fill: { color: C_WHITE },
        line: { color: C_BORDER_BLUE, width: 1.5 },
      });

      finalSlide.addShape(ppt.ShapeType.rect, {
        x: 8.7, y: 1.35, w: 3.833, h: 0.45,
        fill: { color: C_ICE_BLUE },
      });

      finalSlide.addText("AUTHORISED SIGN-OFF", {
        x: 8.95, y: 1.35, w: 3.3, h: 0.45,
        fontSize: 11, fontFace: "Helvetica",
        bold: true, color: C_ROYAL_BLUE, valign: "middle",
      });

      finalSlide.addText(
        [
          { text: "Thanking you and looking forward for your favorable reply.\n\n", options: { italic: true, color: C_TEXT_SLATE, fontSize: 9.5 } },
          { text: "Yours truly,\n\n", options: { color: C_TEXT_DARK, fontSize: 10 } },
          { text: `${preparedBy || "Jatin Dhakre"}\n`, options: { bold: true, color: C_NAVY, fontSize: 12 } },
          { text: "Mo.no. 9765556859 / 9765556861\n", options: { color: C_TEXT_SLATE, fontSize: 10 } },
          { text: "Truesign Media\n", options: { bold: true, color: C_ROYAL_BLUE, fontSize: 11 } },
          { text: "Nagpur", options: { color: C_TEXT_MUTED, fontSize: 10 } },
        ],
        {
          x: 8.95, y: 1.9, w: 3.3, h: 2.7,
          fontFace: "Helvetica",
        }
      );

      // Embedded TrueSign Media Logo in sign-off card
      if (logoData) {
        try {
          finalSlide.addImage({
            data: logoData,
            x: 9.0, y: 4.75,
            w: 3.2, h: 1.0,
            sizing: { type: "contain", w: 3.2, h: 1.0 },
          });
        } catch (e) {
          console.warn("Logo embed error in sign-off:", e);
        }
      }

      // Bottom Office Address Bar matching Anurag Sir.xlsx
      finalSlide.addShape(ppt.ShapeType.roundRect, {
        x: 0.8, y: 6.15, w: 11.733, h: 0.85,
        fill: { color: C_ICE_BLUE },
        line: { color: C_BORDER_BLUE, width: 1.5 },
      });

      finalSlide.addText(
        "Office Ad. - 123, Bhagwaghar Layout, Behind Traffic Park, Dharampeth, Nagpur-440010. Ph: 0712-2544985, E-Mail : samarketing.nagpur@gmail.com / truesignmedia@gmail.com",
        {
          x: 1.0, y: 6.15, w: 11.333, h: 0.85,
          fontSize: 9.5, fontFace: "Helvetica",
          bold: true, color: C_NAVY, align: "center", valign: "middle",
        }
      );

      const fileName = `Quotation_Advertisement_${clientName.replace(/[^a-zA-Z0-9]/g, "_")}_${quotationDate}.pptx`;
      await ppt.writeFile({ fileName });
    } catch (err: any) {
      alert("Failed to export PowerPoint: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // ==========================================
  // 3. EXPORT BOTH (PPT + EXCEL) AT THE SAME TIME
  // ==========================================
  const handleExportBoth = async () => {
    if (selectedSitesList.length === 0) {
      alert("Please select at least one site to export.");
      return;
    }

    if (!clientName.trim()) {
      alert("Please enter the Client / Brand Name. It is mandatory for generating the proposal.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!campaignName.trim()) {
      alert("Please enter the Campaign Name. It is mandatory for generating the proposal.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setIsExporting(true);
      // 1. Trigger Excel download
      handleExportExcel();
      // Brief pause to allow the browser to initiate the Excel download stream
      await new Promise(res => setTimeout(res, 400));
      // 2. Trigger PPT download
      await handleExportPPT();
    } catch (err: any) {
      alert("Failed to export files: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quotation &amp; Proposal Builder</h1>
              <p className="text-xs text-gray-500 mt-0.5">Select sites, customize rates, and export to clean Excel (.xlsx) and PowerPoint (.pptx).</p>
            </div>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            disabled={selectedSitesList.length === 0 || isExporting}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportPPT}
            disabled={selectedSitesList.length === 0 || isExporting}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Presentation className="h-4 w-4" />
            <span>PPT (.pptx)</span>
          </button>

          <button
            onClick={handleExportBoth}
            disabled={selectedSitesList.length === 0 || isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:brightness-110 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Download both PPT and Excel files with one click"
          >
            <Download className="h-4 w-4" />
            <span>Download Both (PPT + Excel)</span>
          </button>
        </div>
      </div>

      {/* Campaign Details Form */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-indigo-600" />
            Campaign &amp; Client Details
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* GST Toggle Switch */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-gray-700">Include 18% GST:</span>
              <button
                type="button"
                onClick={() => setIncludeGst(!includeGst)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  includeGst ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    includeGst ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-[11px] font-bold ${includeGst ? 'text-indigo-600' : 'text-gray-400'}`}>
                {includeGst ? "ON (+18%)" : "OFF"}
              </span>
            </div>

            <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full font-medium">
              * Client &amp; Campaign mandatory for PPT
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Client / Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="e.g. Tata Motors / Tanishq"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder="e.g. Festive Launch Q4"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Quotation Date</label>
            <input
              type="date"
              value={quotationDate}
              onChange={e => setQuotationDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 outline-none transition-all cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prepared By</label>
            <input
              type="text"
              value={preparedBy}
              onChange={e => setPreparedBy(e.target.value)}
              placeholder="TrueSign Media"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Sites</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{selectedSitesList.length} <span className="text-xs font-normal text-gray-500">sites</span></p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Standard Card Rate</p>
            <p className="text-2xl font-black text-slate-700 mt-1">₹{totalStandardAmount.toLocaleString("en-IN")}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Quoted (Excl. GST)</p>
            <p className="text-2xl font-black text-indigo-700 mt-1">₹{baseQuotedAmount.toLocaleString("en-IN")}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Percent className="h-6 w-6" />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-all ${
          includeGst ? "bg-emerald-50/50 border-emerald-300" : "bg-white border-gray-200"
        }`}>
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {includeGst ? "Total (Incl. 18% GST)" : "Total Quoted Monthly"}
            </p>
            <p className="text-2xl font-black text-emerald-700 mt-1">₹{totalQuotedAmount.toLocaleString("en-IN")}</p>
            {includeGst && (
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">+₹{gstAmount.toLocaleString("en-IN")} GST (18%)</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveStep("select")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeStep === "select"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>1. Select Inventory Sites ({selectedSitesList.length})</span>
        </button>

        <button
          onClick={() => setActiveStep("rates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeStep === "rates"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>2. Customize Rates & Remarks</span>
        </button>

        <button
          onClick={() => setActiveStep("export")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeStep === "export"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>3. Choose Excel Columns & Export</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: SELECT SITES */}
      {/* ========================================================================= */}
      {activeStep === "select" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search site, city, area..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/25 outline-none"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 text-sm font-bold bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-xs"
              >
                {citiesList.map(c => (
                  <option key={c} value={c} className="text-sm py-1.5">{c === "All" ? "All Cities" : c}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 text-sm font-bold bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-xs"
              >
                {typesList.map(t => (
                  <option key={t} value={t} className="text-sm py-1.5">{t === "All" ? "All Media Types" : t}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-200 text-sm font-bold bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-xs"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Blocked">Blocked</option>
              </select>

              <button
                onClick={handleSelectAllFiltered}
                className="h-12 px-5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
              >
                Select All Filtered ({filteredSites.length})
              </button>

              {selectedSitesList.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="h-12 px-5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-bold hover:bg-red-100 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Sites List View */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            {filteredSites.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-600">No inventory sites matched your search or filter.</p>
              </div>
            ) : (
              filteredSites.map((site, index) => {
                const isSelected = !!selectedSitesMap[site.uuid];
                const displayCode = site.code || getSiteCode(site, index + 1);
                const statusColor = site.status === 'Available'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : site.status === 'Blocked'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

                return (
                  <div
                    key={site.uuid}
                    onClick={() => toggleSite(site)}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:px-5 sm:py-3.5 gap-3 transition-all cursor-pointer select-none ${
                      isSelected
                        ? "bg-indigo-50/60 hover:bg-indigo-50/80"
                        : "hover:bg-gray-50/80 bg-white"
                    }`}
                  >
                    {/* Left: Checkbox & Details */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="h-5 w-5 rounded bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded border border-gray-300 bg-white hover:border-indigo-400 transition-colors" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs shrink-0">
                            {displayCode}
                          </span>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {site.name}
                          </p>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
                            {site.size || "Standard"}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor} shrink-0`}>
                            {site.status || "Available"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            {site.city}{site.area ? `, ${site.area}` : ""}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{site.type}</span>
                          <span className="text-gray-300">•</span>
                          <span>{site.lit_type || "Front Lit"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Rate */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-8 sm:pl-0 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-indigo-700">
                          ₹{Number(site.net_rate).toLocaleString("en-IN")}
                          <span className="text-xs font-normal text-gray-500 ml-1">/ mo</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Next Step Floating Bar */}
          {selectedSitesList.length > 0 && (
            <div className="sticky bottom-4 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{selectedSitesList.length} Sites Selected</p>
                <p className="text-xs text-slate-400">Total Standard Value: ₹{totalStandardAmount.toLocaleString("en-IN")}</p>
              </div>
              <button
                onClick={() => setActiveStep("rates")}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <span>Customize Rates & Remarks</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CUSTOMIZE RATES & REMARKS */}
      {/* ========================================================================= */}
      {activeStep === "rates" && (
        <div className="space-y-4">
          {selectedSitesList.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
              <Layers className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-800">No sites selected yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">Please go back to Step 1 and pick the billboard sites you want in this quotation.</p>
              <button
                onClick={() => setActiveStep("select")}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Go to Step 1: Select Sites
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Quotation Rate Matrix</h3>
                  <p className="text-xs text-gray-500">Edit the custom offer rate and client remarks for each billboard.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">Global Discount (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent || ""}
                    onChange={e => setDiscountPercent(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-16 h-8 px-2 rounded-lg border border-gray-300 text-xs font-bold text-center outline-none focus:ring-2 focus:ring-indigo-500/25"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Site Details &amp; Code</th>
                      <th className="px-4 py-3">City & Location</th>
                      <th className="px-4 py-3">Dimensions</th>
                      <th className="px-4 py-3">Card Rate (₹)</th>
                      <th className="px-4 py-3 w-28">Discount (%)</th>
                      <th className="px-4 py-3 min-w-[160px]">Custom Offer Rate (₹ / mo)</th>
                      <th className="px-4 py-3 min-w-[220px]">Proposal Remarks</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedSitesList.map((site, index) => {
                      const displayCode = site.code || getSiteCode(site, index + 1);
                      return (
                        <tr key={site.uuid} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-semibold text-gray-900">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                                {displayCode}
                              </span>
                              <span className="truncate font-bold">{site.name}</span>
                            </div>
                          </td>
                        <td className="px-4 py-3 text-gray-600">
                          {site.city}{site.area ? `, ${site.area}` : ""}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {site.size} <span className="text-[10px] text-gray-400 block">{site.type}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 line-through">
                          ₹{Number(site.net_rate).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={site.discountPercent || ""}
                              onChange={e => handleDiscountPercentChange(site.uuid, Number(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full h-8 pl-2 pr-6 rounded-lg border border-gray-300 font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center"
                            />
                            <span className="absolute right-2 top-2 text-gray-400 font-bold text-[10px]">%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <span className="absolute left-2.5 top-2 text-gray-400 font-bold">₹</span>
                            <input
                              type="number"
                              value={site.customRate}
                              onChange={e => handleCustomRateChange(site.uuid, Number(e.target.value))}
                              className="w-full h-8 pl-6 pr-2 rounded-lg border border-gray-300 font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={site.customNotes}
                            onChange={e => handleCustomNotesChange(site.uuid, e.target.value)}
                            placeholder="Visibility notes..."
                            className="w-full h-8 px-2.5 rounded-lg border border-gray-200 text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleSite(site)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Site"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-gray-200 divide-y divide-gray-200/60">
                    <tr>
                      <td colSpan={5} className="px-4 py-2.5 text-right text-gray-700 text-xs">
                        BASE QUOTED MONTHLY:
                      </td>
                      <td colSpan={3} className="px-4 py-2.5 text-gray-900 text-xs font-bold">
                        ₹{baseQuotedAmount.toLocaleString("en-IN")} / Month
                        {discountPercent > 0 && (
                          <span className="text-[11px] text-amber-600 font-normal ml-2">({discountPercent}% global discount applied)</span>
                        )}
                      </td>
                    </tr>
                    {includeGst && (
                      <tr className="bg-indigo-50/40">
                        <td colSpan={5} className="px-4 py-2 text-right text-indigo-700 text-xs font-semibold">
                          GST (18%):
                        </td>
                        <td colSpan={3} className="px-4 py-2 text-indigo-800 text-xs font-bold">
                          + ₹{gstAmount.toLocaleString("en-IN")} / Month
                        </td>
                      </tr>
                    )}
                    <tr className="bg-slate-100">
                      <td colSpan={5} className="px-4 py-3 text-right text-gray-900 text-sm font-bold">
                        TOTAL PAYABLE {includeGst ? "(INCL. 18% GST)" : "(EXCL. GST)"}:
                      </td>
                      <td colSpan={3} className="px-4 py-3 text-emerald-700 text-base font-black">
                        ₹{totalQuotedAmount.toLocaleString("en-IN")} / Month
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setActiveStep("select")}
                  className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50"
                >
                  ← Back to Sites
                </button>
                <button
                  onClick={() => setActiveStep("export")}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  <span>Proceed to Export</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: CHOOSE EXCEL COLUMNS & EXPORT */}
      {/* ========================================================================= */}
      {activeStep === "export" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column Customizer Panel */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Settings2 className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900">Choose Excel Columns</h3>
            </div>
            <p className="text-xs text-gray-500">
              Select which fields will be included in the exported Excel spreadsheet.
            </p>

            <div className="space-y-2">
              {AVAILABLE_COLUMNS.map(col => {
                const isChecked = selectedColumns.includes(col.id);
                return (
                  <label
                    key={col.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-xs font-semibold text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleColumn(col.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>{col.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Export Summary Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Ready to Generate Proposal</h3>
              <p className="text-xs text-gray-500 mt-1">Download official customer-facing documents instantly in your preferred format.</p>

              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Client:</span>
                  <span className="font-bold">{clientName || "Valued Client"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Campaign:</span>
                  <span className="font-bold">{campaignName || "General Outdoor Campaign"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Sites Count:</span>
                  <span className="font-bold">{selectedSitesList.length} Locations</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Base Quoted (Excl. GST):</span>
                  <span className="font-bold">₹{baseQuotedAmount.toLocaleString("en-IN")}</span>
                </div>
                {includeGst && (
                  <div className="flex justify-between py-1 border-b border-slate-200/50 text-indigo-700">
                    <span className="font-semibold">GST (18%):</span>
                    <span className="font-bold">+ ₹{gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Active Columns in Excel:</span>
                  <span className="font-bold">{selectedColumns.length} Columns</span>
                </div>
                <div className="flex justify-between py-1 pt-2 text-sm font-black text-emerald-700">
                  <span>Total Quoted Monthly {includeGst ? "(Incl. 18% GST)" : "(Excl. GST)"}:</span>
                  <span>₹{totalQuotedAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {(!clientName.trim() || !campaignName.trim()) && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Client &amp; Campaign details required:</strong> Please fill in both Client Name and Campaign Name in the top details form before downloading PPT.
                  </span>
                </div>
              )}
            </div>

            {/* Big Action Download Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={handleExportExcel}
                disabled={selectedSitesList.length === 0 || isExporting}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <FileSpreadsheet className="h-5 w-5 shrink-0" />
                <div className="text-left">
                  <div>Excel Sheet (.xlsx)</div>
                  <div className="text-[10px] text-emerald-100 font-normal">Standard Data Sheet</div>
                </div>
              </button>

              <button
                onClick={handleExportPPT}
                disabled={selectedSitesList.length === 0 || isExporting}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <Presentation className="h-5 w-5 shrink-0" />
                <div className="text-left">
                  <div>PowerPoint (.pptx)</div>
                  <div className="text-[10px] text-blue-100 font-normal">Executive Deck with Photos</div>
                </div>
              </button>

              <button
                onClick={handleExportBoth}
                disabled={selectedSitesList.length === 0 || isExporting}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer ring-2 ring-indigo-400/30"
              >
                <Download className="h-5 w-5 shrink-0" />
                <div className="text-left">
                  <div>Download Both</div>
                  <div className="text-[10px] text-indigo-100 font-normal">PPT + Excel Together</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
