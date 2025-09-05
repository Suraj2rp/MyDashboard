import jsPDF from "jspdf";
import { toPng } from "html-to-image";

/**
 * Generate a PDF from dashboard sections.
 * - Each section on its own page
 * - Auto-scales content/charts to fit
 * - Adds subtitles for each chart
 * - Automatic filename (e.g., Dashboard_Report_September-2025.pdf)
 */
export const downloadPDF = async (
  logoPath = "/logo.png",
  footerNote = "Confidential - For Internal Use Only"
) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Full date for header
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Filename (Dashboard_Report_September-2025.pdf)
    const fileDateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }).replace(" ", "-");
    const fileName = `Dashboard_Report_${fileDateStr}.pdf`;

    // Try to load logo as Base64
    let logoBase64 = null;
    try {
      const response = await fetch(logoPath);
      const blob = await response.blob();
      logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch {
      console.warn("Logo not found, skipping logo.");
    }

    // 🔹 Header + Footer
    const addHeaderFooter = (pageNumber) => {
      if (logoBase64) {
        try {
          pdf.addImage(logoBase64, "PNG", 10, 5, 20, 15);
        } catch (e) {
          console.warn("Logo could not be added:", e);
        }
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Dashboard Report", 35, 15);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated: ${dateStr}`, pageWidth - 60, 15);

      pdf.setDrawColor(150);
      pdf.setLineWidth(0.5);
      pdf.line(10, 25, pageWidth - 10, 25);

      // Footer
      pdf.setDrawColor(200);
      pdf.setLineWidth(0.3);
      pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      const wrappedNote = pdf.splitTextToSize(footerNote, pageWidth - 40);
      pdf.text(wrappedNote, 10, pageHeight - 8 - (wrappedNote.length - 1) * 4);

      pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 8, {
        align: "center",
      });
    };

    // 🔹 Detect all pdf sections
    const sections = document.querySelectorAll("#dashboard .pdf-section");
    if (!sections.length) {
      console.warn("No sections found for PDF export.");
      return;
    }

    let pageNumber = 0;

    // 🔹 Loop through sections
    for (let i = 0; i < sections.length; i++) {
      if (i > 0) pdf.addPage();
      pageNumber++;
      addHeaderFooter(pageNumber);

      const section = sections[i];
      const sectionTitle = section.getAttribute("data-title") || `Section ${i + 1}`;

      // Section title
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(sectionTitle, 10, 35);

      // Special case: charts section (split each chart)
      const charts = section.querySelectorAll(".pdf-chart");
      if (charts.length > 0) {
        let chartY = 50;
        for (let c = 0; c < charts.length; c++) {
          const chartNode = charts[c];
          const chartTitle = chartNode.getAttribute("data-title") || `Chart ${c + 1}`;

          // Subtitle
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          pdf.text(chartTitle, 10, chartY);

          // Capture chart
          const imgData = await toPng(chartNode, {
            cacheBust: true,
            backgroundColor: "#ffffff",
            pixelRatio: 2,
          });
          const imgProps = pdf.getImageProperties(imgData);

          // Auto-scale chart if too tall
          let imgW = pageWidth - 20;
          let imgH = (imgProps.height * imgW) / imgProps.width;
          if (imgH > pageHeight - 80) {
            imgH = pageHeight - 80;
            imgW = (imgProps.width * imgH) / imgProps.height;
          }

          pdf.addImage(imgData, "PNG", 10, chartY + 5, imgW, imgH);
          chartY += imgH + 20;

          // If next chart won’t fit, new page
          if (c < charts.length - 1 && chartY + 100 > pageHeight) {
            pdf.addPage();
            pageNumber++;
            addHeaderFooter(pageNumber);
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(sectionTitle + " (cont.)", 10, 35);
            chartY = 50;
          }
        }
      } else {
        // Regular section
        const imgData = await toPng(section, {
          cacheBust: true,
          backgroundColor: "#ffffff",
          pixelRatio: 2,
        });
        const imgProps = pdf.getImageProperties(imgData);

        let imgW = pageWidth - 20;
        let imgH = (imgProps.height * imgW) / imgProps.width;
        if (imgH > pageHeight - 60) {
          imgH = pageHeight - 60;
          imgW = (imgProps.width * imgH) / imgProps.height;
        }

        pdf.addImage(imgData, "PNG", 10, 40, imgW, imgH);
      }
    }

    // 🔹 Save with automatic filename
    pdf.save(fileName);
  } catch (error) {
    console.error("PDF download failed:", error);
  }
};
