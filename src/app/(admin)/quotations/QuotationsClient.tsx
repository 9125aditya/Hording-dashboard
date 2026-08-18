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
  ArrowRight
} from "lucide-react";
import * as XLSX from "xlsx";
import pptxgen from "pptxgenjs";

type SiteItem = {
  id: number;
  uuid: string;
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
  images: string[];
  photo: string;
  maps_link: string;
  remarks: string;
};

type SelectedSite = SiteItem & {
  customRate: number;
  customNotes: string;
};

const AVAILABLE_COLUMNS = [
  { id: "uuid", label: "Site ID / Code", default: true },
  { id: "name", label: "Site Name", default: true },
  { id: "city", label: "City", default: true },
  { id: "area", label: "Area / Location", default: true },
  { id: "size", label: "Size (Dimensions)", default: true },
  { id: "type", label: "Media Type", default: true },
  { id: "lit_type", label: "Illumination", default: true },
  { id: "status", label: "Availability Status", default: false },
  { id: "customRate", label: "Quoted Rate (₹/month)", default: true },
  { id: "net_rate", label: "Standard / Card Rate (₹)", default: false },
  { id: "customNotes", label: "Custom Proposal Remarks", default: true },
];

export default function QuotationsClient({ initialSites }: { initialSites: SiteItem[] }) {
  // Campaign & Client Info State
  const [clientName, setClientName] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [preparedBy, setPreparedBy] = useState("Sellads Outdoor Advertising");
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split("T")[0]);
  const [validityDays, setValidityDays] = useState("15 Days");
  const [discountPercent, setDiscountPercent] = useState<number>(0);

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
    return initialSites.filter(site => {
      if (selectedCity !== "All" && site.city?.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (selectedType !== "All" && site.type?.toLowerCase() !== selectedType.toLowerCase()) return false;
      if (selectedStatus !== "All" && site.status?.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = site.name?.toLowerCase().includes(query);
        const matchCity = site.city?.toLowerCase().includes(query);
        const matchArea = site.area?.toLowerCase().includes(query);
        const matchCode = site.uuid?.toLowerCase().includes(query);
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

  const totalQuotedAmount = useMemo(() => {
    const rawTotal = selectedSitesList.reduce((sum, site) => sum + (Number(site.customRate) || 0), 0);
    if (discountPercent > 0) {
      return Math.round(rawTotal * (1 - discountPercent / 100));
    }
    return rawTotal;
  }, [selectedSitesList, discountPercent]);

  // Toggle Site Selection
  const toggleSite = (site: SiteItem) => {
    setSelectedSitesMap(prev => {
      const updated = { ...prev };
      if (updated[site.uuid]) {
        delete updated[site.uuid];
      } else {
        updated[site.uuid] = {
          ...site,
          customRate: Number(site.net_rate) || 50000,
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
          updated[site.uuid] = {
            ...site,
            customRate: Number(site.net_rate) || 50000,
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
      return {
        ...prev,
        [uuid]: {
          ...prev[uuid],
          customRate: rate,
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

  // ==========================================
  // 1. EXCEL EXPORT (.xlsx) - ZERO IMAGES
  // ==========================================
  const handleExportExcel = () => {
    if (selectedSitesList.length === 0) {
      alert("Please select at least one site to export.");
      return;
    }

    try {
      setIsExporting(true);

      // Build Header Info
      const headerData: any[][] = [
        ["SELLADS OUTDOOR ADVERTISING - MEDIA PROPOSAL / QUOTATION"],
        [],
        ["Client Name:", clientName || "Valued Client", "Date:", quotationDate],
        ["Campaign:", campaignName || "Outdoor Campaign", "Validity:", validityDays],
        ["Prepared By:", preparedBy, "Total Sites:", selectedSitesList.length],
        [],
      ];

      // Build Table Columns
      const headers = AVAILABLE_COLUMNS
        .filter(c => selectedColumns.includes(c.id))
        .map(c => c.label);

      const tableRows = selectedSitesList.map((site, index) => {
        const row: any[] = [];
        AVAILABLE_COLUMNS.filter(c => selectedColumns.includes(c.id)).forEach(col => {
          switch (col.id) {
            case "uuid":
              row.push(site.uuid);
              break;
            case "name":
              row.push(site.name);
              break;
            case "city":
              row.push(site.city);
              break;
            case "area":
              row.push(site.area || "-");
              break;
            case "size":
              row.push(site.size);
              break;
            case "type":
              row.push(site.type);
              break;
            case "lit_type":
              row.push(site.lit_type);
              break;
            case "status":
              row.push(site.status);
              break;
            case "customRate":
              row.push(Number(site.customRate) || 0);
              break;
            case "net_rate":
              row.push(Number(site.net_rate) || 0);
              break;
            case "customNotes":
              row.push(site.customNotes || "-");
              break;
            default:
              row.push("");
          }
        });
        return row;
      });

      // Total Row
      const totalRow: any[] = [];
      let totalQuotedColIndex = -1;
      AVAILABLE_COLUMNS.filter(c => selectedColumns.includes(c.id)).forEach((col, idx) => {
        if (idx === 0) {
          totalRow.push("TOTAL MONTHLY RENTAL");
        } else if (col.id === "customRate") {
          totalRow.push(totalQuotedAmount);
          totalQuotedColIndex = idx;
        } else if (col.id === "net_rate") {
          totalRow.push(totalStandardAmount);
        } else {
          totalRow.push("");
        }
      });

      // Combine Sheet Data
      const wsData = [
        ...headerData,
        headers,
        ...tableRows,
        [],
        totalRow,
        [],
        ["* Note: Rates are exclusive of GST. Printing & Mounting extra as applicable."],
        ["* For bookings & confirmations, contact: truesignmedia@gmail.com | +91 9765556861, +91 9765556859"],
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Auto column widths
      const colWidths = headers.map((h, i) => {
        let maxLen = h.length;
        tableRows.forEach(r => {
          const valStr = String(r[i] || "");
          if (valStr.length > maxLen) maxLen = valStr.length;
        });
        return { wch: Math.min(Math.max(maxLen + 4, 14), 45) };
      });
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Quotation");

      const fileName = `Sellads_Quotation_${(clientName || "Client").replace(/[^a-zA-Z0-9]/g, "_")}_${quotationDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err: any) {
      alert("Failed to export Excel: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // ==========================================
  // 2. POWERPOINT EXPORT (.pptx) - EXECUTIVE SLIDES
  // ==========================================
  const handleExportPPT = async () => {
    if (selectedSitesList.length === 0) {
      alert("Please select at least one site to export.");
      return;
    }

    try {
      setIsExporting(true);
      const ppt = new pptxgen();
      
      // Explicit 16:9 Widescreen Canvas: 13.333 inches x 7.50 inches
      ppt.defineLayout({ name: "CUSTOM_16_9", width: 13.333, height: 7.5 });
      ppt.layout = "CUSTOM_16_9";
      ppt.author = preparedBy;
      ppt.company = "Sellads Outdoor Advertising";
      ppt.title = `Outdoor Media Proposal - ${clientName || "Client"}`;

      // Color Palette constants
      const C_NAVY = "03164C";
      const C_NAVY_LIGHT = "0A2570";
      const C_GOLD = "FAB935";
      const C_GOLD_DARK = "D97706";
      const C_WHITE = "FFFFFF";
      const C_BG_LIGHT = "F4F7FB";
      const C_BORDER = "E2E8F0";
      const C_TEXT_DARK = "0F172A";
      const C_TEXT_SLATE = "334155";
      const C_GREEN = "10B981";

      const uniqueCities = Array.from(new Set(selectedSitesList.map(s => s.city).filter(Boolean)));
      const citiesStr = uniqueCities.length > 0 ? uniqueCities.join(", ") : "Nagpur";

      // -------------------------------------------------------------
      // SLIDE 1: Premium Title & Cover Slide
      // -------------------------------------------------------------
      const coverSlide = ppt.addSlide();
      coverSlide.background = { color: C_NAVY };

      // Left Accent Bars
      coverSlide.addShape(ppt.ShapeType.rect, {
        x: 0, y: 0, w: 0.35, h: 7.5,
        fill: { color: C_GOLD },
      });
      coverSlide.addShape(ppt.ShapeType.rect, {
        x: 0.35, y: 0, w: 0.08, h: 7.5,
        fill: { color: "DC2626" },
      });

      // Top Tag Pill
      coverSlide.addShape(ppt.ShapeType.roundRect, {
        x: 0.8, y: 0.65, w: 4.2, h: 0.42,
        fill: { color: C_NAVY_LIGHT },
        line: { color: "234B9E", width: 1 },
      });
      coverSlide.addText("OUTDOOR MEDIA PROPOSAL · 2026", {
        x: 0.8, y: 0.65, w: 4.2, h: 0.42,
        fontSize: 11, fontFace: "Helvetica",
        bold: true, color: C_GOLD, align: "center", valign: "middle",
      });

      // Main Proposal Title
      coverSlide.addText("PREMIUM OUTDOOR MEDIA\nCAMPAIGN PROPOSAL", {
        x: 0.8, y: 1.35, w: 11.5, h: 1.3,
        fontSize: 30, fontFace: "Helvetica",
        bold: true, color: C_WHITE,
        lineSpacingMultiple: 1.1,
      });

      // Client Subtitle Box
      coverSlide.addText(
        `Prepared Exclusively For: ${clientName ? clientName.toUpperCase() : "VALUED BRAND"}${campaignName ? ` · ${campaignName}` : ""}`,
        {
          x: 0.8, y: 2.85, w: 11.5, h: 0.5,
          fontSize: 17, fontFace: "Helvetica",
          color: C_GOLD, bold: true,
        }
      );

      // Bottom 4 Metric Cards (Exact Proportions with safe margins)
      const metrics = [
        { label: "TOTAL LOCATIONS", value: `${selectedSitesList.length} Prime Sites` },
        { label: "TARGET CITIES", value: citiesStr },
        { label: "PROPOSAL DATE", value: `${quotationDate} (${validityDays})` },
        { label: "MONTHLY INVESTMENT", value: `₹${totalQuotedAmount.toLocaleString("en-IN")}` },
      ];

      const cardW = 2.72;
      const cardGap = 0.28;
      metrics.forEach((m, idx) => {
        const cardX = 0.8 + idx * (cardW + cardGap);
        coverSlide.addShape(ppt.ShapeType.roundRect, {
          x: cardX, y: 3.8, w: cardW, h: 2.2,
          fill: { color: C_NAVY_LIGHT },
          line: { color: idx === 3 ? C_GOLD : "1D3D8F", width: idx === 3 ? 1.5 : 1 },
        });

        coverSlide.addText(m.label, {
          x: cardX + 0.18, y: 4.05, w: cardW - 0.36, h: 0.35,
          fontSize: 9.5, fontFace: "Helvetica",
          bold: true, color: idx === 3 ? C_GOLD : "94A3B8",
        });

        coverSlide.addText(m.value, {
          x: cardX + 0.18, y: 4.5, w: cardW - 0.36, h: 1.2,
          fontSize: idx === 3 ? 18 : 15, fontFace: "Helvetica",
          bold: true, color: idx === 3 ? C_GOLD : C_WHITE,
          valign: "top",
        });
      });

      // Footer brand
      coverSlide.addText("SELLADS OUTDOOR ADVERTISING · NAGPUR · TRUESIGNMEDIA@GMAIL.COM · +91 9765556861 / +91 9765556859", {
        x: 0.8, y: 6.65, w: 11.7, h: 0.35,
        fontSize: 9, fontFace: "Helvetica",
        color: "94A3B8", bold: true,
      });

      // -------------------------------------------------------------
      // SLIDE 2: Executive Campaign Summary Table
      // -------------------------------------------------------------
      const summarySlide = ppt.addSlide();
      summarySlide.background = { color: C_BG_LIGHT };

      // Header Banner
      summarySlide.addShape(ppt.ShapeType.rect, {
        x: 0, y: 0, w: 13.333, h: 1.1,
        fill: { color: C_NAVY },
      });
      summarySlide.addText("EXECUTIVE PROPOSAL MATRIX", {
        x: 0.8, y: 0.18, w: 8.0, h: 0.4,
        fontSize: 18, fontFace: "Helvetica",
        bold: true, color: C_WHITE,
      });
      summarySlide.addText(`Summary of all ${selectedSitesList.length} proposed media inventory locations`, {
        x: 0.8, y: 0.6, w: 8.0, h: 0.3,
        fontSize: 11, fontFace: "Helvetica",
        color: C_GOLD,
      });

      // Top Right Total Pill
      summarySlide.addShape(ppt.ShapeType.roundRect, {
        x: 8.8, y: 0.2, w: 3.7, h: 0.7,
        fill: { color: C_GOLD },
      });
      summarySlide.addText(`Total: ₹${totalQuotedAmount.toLocaleString("en-IN")} / Mo`, {
        x: 8.8, y: 0.2, w: 3.7, h: 0.7,
        fontSize: 14, fontFace: "Helvetica",
        bold: true, color: C_NAVY,
        align: "center", valign: "middle",
      });

      // Summary Table Data
      const tableHeaders = [
        { text: "#", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE, fontSize: 10, align: "center" as const } },
        { text: "Site Name & Location", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE, fontSize: 10 } },
        { text: "City", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE, fontSize: 10 } },
        { text: "Size (W x H)", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE, fontSize: 10 } },
        { text: "Type & Illumination", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE, fontSize: 10 } },
        { text: "Quoted Rate (₹)", options: { bold: true, fill: { color: C_NAVY }, color: C_WHITE, fontSize: 10, align: "right" as const } },
      ];

      const tableBody = selectedSitesList.map((site, i) => [
        { text: String(i + 1), options: { align: "center" as const, fontSize: 9.5, color: C_TEXT_SLATE } },
        { text: site.name, options: { bold: true, fontSize: 9.5, color: C_TEXT_DARK } },
        { text: site.city, options: { fontSize: 9.5, color: C_TEXT_SLATE } },
        { text: site.size || "-", options: { fontSize: 9.5, color: C_TEXT_SLATE } },
        { text: `${site.type} · ${site.lit_type}`, options: { fontSize: 9.5, color: C_TEXT_SLATE } },
        { text: `₹${(Number(site.customRate) || 0).toLocaleString("en-IN")}`, options: { bold: true, fontSize: 10, color: C_NAVY, align: "right" as const } },
      ]);

      const tableTotalRow = [
        { text: "TOTAL", options: { bold: true, fill: { color: "E2E8F0" }, color: C_NAVY, fontSize: 10, align: "center" as const } },
        { text: "TOTAL MONTHLY CAMPAIGN INVESTMENT", options: { bold: true, fill: { color: "E2E8F0" }, color: C_NAVY, fontSize: 10 } },
        { text: `${uniqueCities.length} Cities`, options: { fill: { color: "E2E8F0" }, color: C_TEXT_SLATE, fontSize: 9.5 } },
        { text: "-", options: { fill: { color: "E2E8F0" }, color: C_TEXT_SLATE, fontSize: 9.5, align: "center" as const } },
        { text: `${selectedSitesList.length} Locations`, options: { bold: true, fill: { color: "E2E8F0" }, color: C_NAVY, fontSize: 9.5 } },
        { text: `₹${totalQuotedAmount.toLocaleString("en-IN")}`, options: { bold: true, fill: { color: C_GOLD }, color: C_NAVY, fontSize: 10.5, align: "right" as const } },
      ];

      summarySlide.addTable([tableHeaders, ...tableBody, tableTotalRow], {
        x: 0.8, y: 1.35, w: 11.733,
        rowH: 0.38,
        colW: [0.6, 4.0, 1.8, 1.8, 1.8, 1.733],
        border: { color: "CBD5E1", pt: 0.5 },
        fill: { color: C_WHITE },
      });

      // -------------------------------------------------------------
      // SLIDES 3..N+2: Dedicated Site Showcase (1 Slide Per Site)
      // -------------------------------------------------------------
      selectedSitesList.forEach((site, index) => {
        const slide = ppt.addSlide();
        slide.background = { color: C_BG_LIGHT };

        // Top Header Banner
        slide.addShape(ppt.ShapeType.rect, {
          x: 0, y: 0, w: 13.333, h: 1.1,
          fill: { color: C_NAVY },
        });

        // Left Header: Site Title & Location
        slide.addText(
          `SITE #${String(index + 1).padStart(2, "0")}: ${site.name.toUpperCase()}`,
          {
            x: 0.8, y: 0.15, w: 8.2, h: 0.45,
            fontSize: 17, fontFace: "Helvetica",
            bold: true, color: C_WHITE,
          }
        );

        slide.addText(
          `${site.city.toUpperCase()}${site.area ? ` · ${site.area.toUpperCase()}` : ""} | INVENTORY ID: ${site.uuid}`,
          {
            x: 0.8, y: 0.6, w: 8.2, h: 0.35,
            fontSize: 11, fontFace: "Helvetica",
            bold: true, color: C_GOLD,
          }
        );

        // Right Header: Gold Price Tag Box
        slide.addShape(ppt.ShapeType.roundRect, {
          x: 9.2, y: 0.18, w: 3.3, h: 0.74,
          fill: { color: C_GOLD },
        });
        slide.addText(
          `₹${(Number(site.customRate) || 0).toLocaleString("en-IN")} / Mo`,
          {
            x: 9.2, y: 0.18, w: 3.3, h: 0.42,
            fontSize: 16, fontFace: "Helvetica",
            bold: true, color: C_NAVY,
            align: "center",
          }
        );
        slide.addText(
          "+ Applicable GST",
          {
            x: 9.2, y: 0.58, w: 3.3, h: 0.28,
            fontSize: 8.5, fontFace: "Helvetica",
            color: "78350F", bold: true,
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

        // Container Card
        slide.addShape(ppt.ShapeType.roundRect, {
          x: photoBoxX, y: photoBoxY, w: photoBoxW, h: photoBoxH,
          fill: { color: C_WHITE },
          line: { color: C_BORDER, width: 1 },
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
          fill: { color: C_NAVY },
        });
        slide.addText(`📍 ${site.name} · ${site.city}`, {
          x: photoBoxX + 0.25, y: photoBoxY + photoBoxH - 0.6,
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

        // Card 1: Technical Media Specs
        slide.addShape(ppt.ShapeType.roundRect, {
          x: rightX, y: 1.35, w: rightW, h: 2.8,
          fill: { color: C_WHITE },
          line: { color: C_BORDER, width: 1 },
        });

        slide.addText("MEDIA SPECIFICATIONS", {
          x: rightX + 0.2, y: 1.5, w: rightW - 0.4, h: 0.35,
          fontSize: 12, fontFace: "Helvetica",
          bold: true, color: C_NAVY,
        });

        // Specs Grid Text
        const specsItems = [
          { text: "DIMENSIONS / SIZE:\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 10 } },
          { text: `${site.size} (Width × Height)\n\n`, options: { color: C_TEXT_SLATE, fontSize: 11, bold: true } },

          { text: "MEDIA TYPE:\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 10 } },
          { text: `${site.type}\n\n`, options: { color: C_TEXT_SLATE, fontSize: 11 } },

          { text: "ILLUMINATION:\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 10 } },
          { text: `${site.lit_type}\n\n`, options: { color: C_TEXT_SLATE, fontSize: 11 } },

          { text: "AVAILABILITY STATUS:\n", options: { bold: true, color: C_TEXT_DARK, fontSize: 10 } },
          { text: `${site.status}`, options: { color: site.status === "Available" ? C_GREEN : C_GOLD_DARK, fontSize: 11, bold: true } },
        ];

        slide.addText(specsItems, {
          x: rightX + 0.2, y: 1.85, w: rightW - 0.4, h: 2.1,
          fontFace: "Helvetica",
          lineSpacingMultiple: 1.0,
        });

        // Card 2: Strategic Location Highlights & Remarks
        slide.addShape(ppt.ShapeType.roundRect, {
          x: rightX, y: 4.35, w: rightW, h: 2.2,
          fill: { color: "F8FAFC" },
          line: { color: "CBD5E1", width: 1 },
        });

        slide.addText("CAMPAIGN & VISIBILITY HIGHLIGHTS", {
          x: rightX + 0.2, y: 4.5, w: rightW - 0.4, h: 0.35,
          fontSize: 11, fontFace: "Helvetica",
          bold: true, color: C_NAVY,
        });

        const remarksText = site.customNotes || "Prime visibility facing high-density vehicular and pedestrian traffic. Unobstructed viewing angle for maximum brand recall.";
        slide.addText(remarksText, {
          x: rightX + 0.2, y: 4.85, w: rightW - 0.4, h: 1.5,
          fontSize: 10, fontFace: "Helvetica",
          color: C_TEXT_SLATE,
          italic: true,
          lineSpacingMultiple: 1.15,
        });

        // Footer Note
        slide.addText(
          `Sellads Outdoor Advertising · Proposal for ${clientName || "Valued Client"} · Slide ${index + 3} of ${selectedSitesList.length + 3}`,
          {
            x: 0.8, y: 6.85, w: 11.733, h: 0.35,
            fontSize: 8.5, fontFace: "Helvetica",
            color: "94A3B8", align: "center",
          }
        );
      });

      // -------------------------------------------------------------
      // FINAL SLIDE: Commercials, Terms & Next Steps
      // -------------------------------------------------------------
      const finalSlide = ppt.addSlide();
      finalSlide.background = { color: C_NAVY };

      finalSlide.addText("TERMS, NEXT STEPS & BOOKING", {
        x: 0.8, y: 0.6, w: 11.733, h: 0.45,
        fontSize: 24, fontFace: "Helvetica",
        bold: true, color: C_WHITE,
      });
      finalSlide.addText("Commercial summary and execution guidelines for campaign commencement", {
        x: 0.8, y: 1.05, w: 11.733, h: 0.35,
        fontSize: 11, fontFace: "Helvetica",
        color: C_GOLD,
      });

      // Left Box: Commercial Summary
      finalSlide.addShape(ppt.ShapeType.roundRect, {
        x: 0.8, y: 1.55, w: 5.7, h: 4.0,
        fill: { color: C_NAVY_LIGHT },
        line: { color: "1E40AF", width: 1 },
      });

      finalSlide.addText("COMMERCIAL TERMS", {
        x: 1.05, y: 1.75, w: 5.2, h: 0.35,
        fontSize: 13, fontFace: "Helvetica",
        bold: true, color: C_GOLD,
      });

      finalSlide.addText(
        [
          { text: "Total Monthly Rental: ", options: { bold: true, color: C_WHITE, fontSize: 11 } },
          { text: `₹${totalQuotedAmount.toLocaleString("en-IN")} + GST\n\n`, options: { bold: true, color: C_GOLD, fontSize: 13 } },
          { text: "1. Advance Payment: ", options: { bold: true, color: C_WHITE, fontSize: 10 } },
          { text: "100% advance along with formal Purchase Order / Confirmation.\n\n", options: { color: "CBD5E1", fontSize: 9.5 } },
          { text: "2. Printing & Mounting: ", options: { bold: true, color: C_WHITE, fontSize: 10 } },
          { text: "Flex printing and mounting charges extra as applicable.\n\n", options: { color: "CBD5E1", fontSize: 9.5 } },
          { text: "3. Proposal Validity: ", options: { bold: true, color: C_WHITE, fontSize: 10 } },
          { text: `This quotation is valid for ${validityDays} from ${quotationDate}. Sites subject to availability at time of confirmation.`, options: { color: "CBD5E1", fontSize: 9.5 } },
        ],
        {
          x: 1.05, y: 2.15, w: 5.2, h: 3.2,
          fontFace: "Helvetica",
        }
      );

      // Right Box: Execution Next Steps
      finalSlide.addShape(ppt.ShapeType.roundRect, {
        x: 6.833, y: 1.55, w: 5.7, h: 4.0,
        fill: { color: C_NAVY_LIGHT },
        line: { color: "1E40AF", width: 1 },
      });

      finalSlide.addText("CAMPAIGN EXECUTION TIMELINE", {
        x: 7.08, y: 1.75, w: 5.2, h: 0.35,
        fontSize: 13, fontFace: "Helvetica",
        bold: true, color: C_GOLD,
      });

      finalSlide.addText(
        [
          { text: "STEP 1: Site Confirmation\n", options: { bold: true, color: C_WHITE, fontSize: 10.5 } },
          { text: "Sign and return the proposal along with campaign dates.\n\n", options: { color: "CBD5E1", fontSize: 9.5 } },
          { text: "STEP 2: Creative Delivery\n", options: { bold: true, color: C_WHITE, fontSize: 10.5 } },
          { text: "Provide high-resolution CDR / TIFF artworks as per site dimensions.\n\n", options: { color: "CBD5E1", fontSize: 9.5 } },
          { text: "STEP 3: Mounting & Go-Live\n", options: { bold: true, color: C_WHITE, fontSize: 10.5 } },
          { text: "On-ground installation completed within 48-72 hours with photo proof.\n\n", options: { color: "CBD5E1", fontSize: 9.5 } },
          { text: "STEP 4: Monitoring & Proof of Display\n", options: { bold: true, color: C_WHITE, fontSize: 10.5 } },
          { text: "Continuous inspection and maintenance throughout campaign duration.", options: { color: "CBD5E1", fontSize: 9.5 } },
        ],
        {
          x: 7.08, y: 2.15, w: 5.2, h: 3.2,
          fontFace: "Helvetica",
        }
      );

      // Bottom Contact Bar
      finalSlide.addShape(ppt.ShapeType.roundRect, {
        x: 0.8, y: 5.75, w: 11.733, h: 1.15,
        fill: { color: C_GOLD },
      });

      finalSlide.addText("SELLADS OUTDOOR ADVERTISING · NAGPUR", {
        x: 1.0, y: 5.85, w: 11.333, h: 0.35,
        fontSize: 12, fontFace: "Helvetica",
        bold: true, color: C_NAVY, align: "center",
      });

      finalSlide.addText("Office: 123, Bhagwaghar Layout, Dharampeth, Nagpur 440010 | Email: truesignmedia@gmail.com | Phone: +91 9765556861, +91 9765556859", {
        x: 1.0, y: 6.2, w: 11.333, h: 0.5,
        fontSize: 9.5, fontFace: "Helvetica",
        bold: true, color: "78350F", align: "center",
      });

      const fileName = `Sellads_Proposal_${(clientName || "Client").replace(/[^a-zA-Z0-9]/g, "_")}_${quotationDate}.pptx`;
      await ppt.writeFile({ fileName });
    } catch (err: any) {
      alert("Failed to export PowerPoint: " + err.message);
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
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quotation & Proposal Builder</h1>
              <p className="text-xs text-gray-500 mt-0.5">Select sites, customize rates, and export to clean Excel (.xlsx) and PowerPoint (.pptx).</p>
            </div>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            disabled={selectedSitesList.length === 0 || isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportPPT}
            disabled={selectedSitesList.length === 0 || isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-105 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Presentation className="h-4 w-4" />
            <span>Export PPT (.pptx)</span>
          </button>
        </div>
      </div>

      {/* Campaign Details Form */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-indigo-600" />
          Campaign & Client Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Client / Brand Name</label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="e.g. Tata Motors / Tanishq"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder="e.g. Festive Launch Q4"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Quotation Date</label>
            <input
              type="date"
              value={quotationDate}
              onChange={e => setQuotationDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prepared By</label>
            <input
              type="text"
              value={preparedBy}
              onChange={e => setPreparedBy(e.target.value)}
              placeholder="Sellads Outdoor Advertising"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Standard / Card Value</p>
            <p className="text-2xl font-black text-slate-700 mt-1">₹{totalStandardAmount.toLocaleString("en-IN")}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Quoted Monthly</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">₹{totalQuotedAmount.toLocaleString("en-IN")}</p>
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
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search site, city, area..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500/25 outline-none"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 focus:outline-none"
              >
                {citiesList.map(c => (
                  <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 focus:outline-none"
              >
                {typesList.map(t => (
                  <option key={t} value={t}>{t === "All" ? "All Media Types" : t}</option>
                ))}
              </select>

              <button
                onClick={handleSelectAllFiltered}
                className="h-10 px-3 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                Select All Filtered ({filteredSites.length})
              </button>

              {selectedSitesList.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="h-10 px-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSites.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-200">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-600">No inventory sites matched your search or filter.</p>
              </div>
            ) : (
              filteredSites.map(site => {
                const isSelected = !!selectedSitesMap[site.uuid];
                return (
                  <div
                    key={site.uuid}
                    onClick={() => toggleSite(site)}
                    className={`bg-white rounded-2xl border transition-all cursor-pointer p-4 relative overflow-hidden group ${
                      isSelected
                        ? "border-indigo-600 ring-2 ring-indigo-600/20 shadow-md bg-indigo-50/20"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Selection Box */}
                      <div className="mt-0.5 shrink-0">
                        {isSelected ? (
                          <div className="h-5 w-5 rounded bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded border border-gray-300 bg-white" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-sm font-bold text-gray-900 truncate">{site.name}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 shrink-0">
                            {site.size}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{site.city}{site.area ? `, ${site.area}` : ""}</span>
                        </p>

                        <div className="mt-2.5 flex items-center justify-between text-xs pt-2.5 border-t border-gray-100">
                          <span className="text-gray-500">{site.type} · {site.lit_type}</span>
                          <span className="font-bold text-indigo-700">₹{Number(site.net_rate).toLocaleString("en-IN")} / mo</span>
                        </div>
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
                      <th className="px-4 py-3">Site Details</th>
                      <th className="px-4 py-3">City & Location</th>
                      <th className="px-4 py-3">Dimensions</th>
                      <th className="px-4 py-3">Card Rate (₹)</th>
                      <th className="px-4 py-3 min-w-[160px]">Custom Offer Rate (₹ / mo)</th>
                      <th className="px-4 py-3 min-w-[220px]">Proposal Remarks</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedSitesList.map(site => (
                      <tr key={site.uuid} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {site.name}
                          <span className="block text-[10px] text-gray-400 font-normal">ID: {site.uuid}</span>
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
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-gray-200">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right text-gray-700 text-sm">
                        TOTAL QUOTED AMOUNT:
                      </td>
                      <td colSpan={3} className="px-4 py-3 text-emerald-700 text-base font-black">
                        ₹{totalQuotedAmount.toLocaleString("en-IN")} / Month
                        {discountPercent > 0 && (
                          <span className="text-xs text-amber-600 font-normal ml-2">({discountPercent}% discount applied)</span>
                        )}
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
                  <span className="font-semibold text-slate-500">Active Columns in Excel:</span>
                  <span className="font-bold">{selectedColumns.length} Columns</span>
                </div>
                <div className="flex justify-between py-1 pt-2 text-sm font-black text-emerald-700">
                  <span>Total Quoted Monthly:</span>
                  <span>₹{totalQuotedAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Big Action Download Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleExportExcel}
                disabled={selectedSitesList.length === 0 || isExporting}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <FileSpreadsheet className="h-5 w-5" />
                <div className="text-left">
                  <div>Download Excel (.xlsx)</div>
                  <div className="text-[10px] text-emerald-100 font-normal">Data sheet with no images</div>
                </div>
              </button>

              <button
                onClick={handleExportPPT}
                disabled={selectedSitesList.length === 0 || isExporting}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:brightness-110 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <Presentation className="h-5 w-5" />
                <div className="text-left">
                  <div>Download PowerPoint (.pptx)</div>
                  <div className="text-[10px] text-amber-100 font-normal">1 slide per site + photos</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
