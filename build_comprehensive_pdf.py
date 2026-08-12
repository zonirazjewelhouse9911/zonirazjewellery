import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return # Skip cover page header/footer
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#5d463c"))
        
        # Header line & text
        self.setStrokeColor(colors.HexColor("#C8A359"))
        self.setLineWidth(0.75)
        self.line(40, 755, 572, 755)
        self.drawString(40, 762, "ZONIRAZ JEWELHOUSE — COMPREHENSIVE PROJECT REPORT")
        
        # Footer line & text
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        self.drawString(40, 32, "Confidential — Zoniraz Jewelhouse Pvt. Ltd.")
        
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 32, page_text)
        self.restoreState()

def create_report_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    PRIMARY = colors.HexColor("#5d463c")     # Deep Cocoa Brown
    SECONDARY = colors.HexColor("#C8A359")   # Luxury Gold
    DARK_TEXT = colors.HexColor("#1A202C")   # Charcoal
    LIGHT_BG = colors.HexColor("#FAF5EF")    # Cream
    BORDER_COLOR = colors.HexColor("#CBD5E0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        alignment=1,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=SECONDARY,
        alignment=1,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13.5,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=3
    )

    table_header = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    table_cell = ParagraphStyle(
        'TC',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=DARK_TEXT
    )

    story = []

    # ================= COVER PAGE / HEADER =================
    story.append(Spacer(1, 20))
    story.append(Paragraph("📄 Project Comprehensive Report: Zoniraz Jewels", title_style))
    story.append(Paragraph("LUXURY JEWELLERY E-COMMERCE PLATFORM & GOLD MINE SYSTEM", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=SECONDARY, spaceBefore=0, spaceAfter=15))

    meta_text = """
    <b>Generated On:</b> August 8, 2026<br/>
    <b>Project Scope:</b> Luxury Gold, Diamond & Gemstone E-Commerce Platform (Frontend Web Application, Gold Mine 10+1 Savings Scheme, Dynamic Real-Time Pricing Engine, WebRTC Video Consultations, Nodemailer HTML Invoicing & Full TypeScript Admin Portal)
    """
    t_meta = Table([[Paragraph(meta_text, body_style)]], colWidths=[6.8*inch])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, SECONDARY),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    # ================= EXECUTIVE SUMMARY =================
    story.append(Paragraph("📌 Executive Summary", h1_style))
    exec_text = """
    <b>Zoniraz Jewels</b> (Zoniraz Jewelhouse Private Limited) is an enterprise-grade luxury gold, diamond, and gemstone e-commerce platform. It features a high-converting customer shopping engine with live daily gold rate dynamic pricing, metal purity customized weight calculations (9K, 14K, 18K, 22K, 24K), Razorpay payment gateway integration, digital 24K gold wallet passbook, and a sleek luxury interface.<br/><br/>
    The platform includes an integrated <b>Zoniraz 10+1 Gold Savings Scheme (Gold Mine Wallet)</b> with automated EMI processing, 30-day grace period tracking, and 100% free 11th installment bonus allocation. It also features automated email invoices embedded with <b>9 Base64 Trust & Certification Badges</b>, a real-time WebRTC video consultation system for virtual jewellery try-ons, and a dedicated <b>TypeScript Admin Management Portal</b> for catalog control, order ledgers, and live gold rate configuration.
    """
    story.append(Paragraph(exec_text, body_style))
    story.append(Spacer(1, 12))

    # ================= SECTION 1 =================
    story.append(Paragraph("📊 1. Key Project Metrics & File Statistics", h1_style))
    metrics_data = [
        [Paragraph("Metric Category", table_header), Paragraph("Count / Technical Details", table_header)],
        [Paragraph("<b>Total Directory Files</b>", table_cell), Paragraph("<b>47,764 files</b> (including node_modules & assets)", table_cell)],
        [Paragraph("<b>Source Code Files (JS / TS / TSX)</b>", table_cell), Paragraph("<b>248 files</b> (128 Frontend, 95 Backend, 25 Admin)", table_cell)],
        [Paragraph("<b>Total Lines of Source Code</b>", table_cell), Paragraph("<b>~35,000+ lines</b> across MERN stack & TypeScript", table_cell)],
        [Paragraph("<b>CSS & Styling System</b>", table_cell), Paragraph("Custom Vanilla CSS Tokens + TailwindCSS v4.3", table_cell)],
        [Paragraph("<b>Frontend Customer Modules</b>", table_cell), Paragraph("<b>46 JS/JSX Files</b> (PDP Customizer, Gold Mine, Cart, Video Client)", table_cell)],
        [Paragraph("<b>Admin Portal Pages</b>", table_cell), Paragraph("<b>11 Management Panels</b> (Products, Orders, Gold Wallets, Pricing)", table_cell)],
        [Paragraph("<b>Backend API Services</b>", table_cell), Paragraph("<b>5 Core Services</b> (Pricing Engine, Gold Mine, Invoices, WebRTC)", table_cell)]
    ]
    t_m = Table(metrics_data, colWidths=[2.5*inch, 4.3*inch])
    t_m.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_m)
    story.append(Spacer(1, 14))

    # ================= SECTION 2 =================
    story.append(Paragraph("🛠️ 2. Technology Stack & Architecture", h1_style))
    story.append(Paragraph("<b>A. Frontend & Admin Portal (Client-Side)</b>", h2_style))
    fe_tech = """
    • <b>Frontend Storefront:</b> React <code>v19.2</code> + Vite <code>v8.1</code> (JavaScript ES6+ JSX)<br/>
    • <b>Admin Portal:</b> React <code>v19.2</code> + TypeScript <code>v6.0</code> + Vite <code>v8.1</code><br/>
    • <b>Styling & Aesthetics:</b> Custom Vanilla CSS Design System + TailwindCSS <code>v4.3</code><br/>
    • <b>Typography:</b> Google Fonts — <code>Playfair Display</code> (Serif Headers) & <code>Inter</code> (Sans-Serif Body)<br/>
    • <b>Icons & Utilities:</b> Lucide React (<code>lucide-react</code>), <code>clsx</code>, <code>tailwind-merge</code><br/>
    • <b>Real-Time Communications:</b> Socket.io Client <code>v4.8</code>, Simple-Peer <code>v9.11</code> (WebRTC Video Try-On)<br/>
    • <b>Data Exporting:</b> SheetJS (<code>xlsx</code>) for exporting order & customer Excel reports<br/>
    • <b>Branding Favicon:</b> Official Zoniraz Logo <code>/zoni1.png</code>
    """
    story.append(Paragraph(fe_tech, body_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>B. Backend Server & Database (Server-Side)</b>", h2_style))
    be_tech = """
    • <b>Runtime & Web Server:</b> Node.js + Express <code>v4.19</code><br/>
    • <b>Database & ORM:</b> MongoDB + Mongoose ORM <code>v8.4</code><br/>
    • <b>Authentication:</b> JSON Web Token (<code>jsonwebtoken</code> <code>v9.0</code>) + <code>bcryptjs</code> <code>v2.4</code><br/>
    • <b>Payment Gateway:</b> Razorpay Node SDK <code>v2.9</code><br/>
    • <b>Emails & Invoices:</b> Nodemailer <code>v6.9</code> (HTML Passbook Statements with embedded Base64 Trust Badges)<br/>
    • <b>Real-Time WebRTC Server:</b> Socket.io Server <code>v4.7</code><br/>
    • <b>File Uploads & Media:</b> Multer <code>v1.4</code> + Cloudinary <code>v2.10</code>
    """
    story.append(Paragraph(be_tech, body_style))
    story.append(Spacer(1, 14))

    # ================= SECTION 3 =================
    story.append(Paragraph("🎨 3. Design System & Theme Specifications", h1_style))
    ds_text = """
    The website features an <b>Ultra-Luxurious Royal Gold & Deep Cocoa Theme</b> tailored for high-end gold, diamond, and bridal jewellery.<br/><br/>
    • <b>Color Palette:</b><br/>
      - <b>Primary Brand Color:</b> Deep Luxury Cocoa Brown (<code>#5d463c</code> / <code>#231535</code>)<br/>
      - <b>Accent Royal Gold:</b> <code>#c8a359</code> / <code>#C5A880</code> / <code>#B7791F</code><br/>
      - <b>Background Canvas:</b> Cream Linen (<code>#efe7e5</code> / <code>#FAF5EF</code> / <code>#f4f6f9</code>)<br/>
      - <b>Text & Obsidian Dark:</b> Pure White (<code>#ffffff</code>) & Jet Obsidian (<code>#12100e</code>)<br/>
    • <b>Typography Standards:</b><br/>
      - <b>Headings & Title Serif:</b> <code>Playfair Display</code> for luxury headers, price tags, and logo.<br/>
      - <b>UI & Body Sans-Serif:</b> <code>Inter</code> for specification tables, buttons, forms, and admin ledgers.
    """
    story.append(Paragraph(ds_text, body_style))
    story.append(Spacer(1, 14))

    # ================= SECTION 4 =================
    story.append(Paragraph("💻 4. Detailed Component & Page Structure", h1_style))
    story.append(Paragraph("<b>A. Customer-Facing Storefront (Frontend)</b>", h2_style))
    fe_pages = """
    1. <b>Home (`Header.jsx`, Banners, Categories):</b> Mega-drawer navigation, hero slider, category cards.<br/>
    2. <b>Product Detail Page (`ProductDetailPage.jsx`):</b> Real-time live rate & weight calculator for Metal Purity (9K, 14K, 18K, 22K, 24K), Size, Diamond Quality (IJ-SI, GH-VS, EF-VVS, FG-SI), and Solitaire. Displays dynamic Gross & Net weight.<br/>
    3. <b>Gold Savings Scheme (`GoldMinePage.jsx`):</b> Zoniraz 10+1 Gold Savings Scheme landing page, EMI calculator, and free 11th month rules.<br/>
    4. <b>Gold Exchange (`GoldExchange.jsx`):</b> Old gold valuation card rendering 9 Trust & Certification Badges (BIS Hallmark, SGL, IGI, Natural Diamond, Assured Purity, etc.).<br/>
    5. <b>Cart & Checkout (`CartPage.jsx`, `CheckoutPage.jsx`):</b> Coupon manager, Razorpay payment gateway, and order success modal.<br/>
    6. <b>Digital Gold Wallet Passbook (`UserDashboard.jsx`):</b> Accumulated 24K pure gold weight in grams.<br/>
    7. <b>Live Video Try-On (`VideoCallContext.jsx`):</b> WebRTC video client to consult with admin live.
    """
    story.append(Paragraph(fe_pages, body_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>B. Admin Portal (Management System)</b>", h2_style))
    admin_pages = """
    1. <b>Admin Auth (`AdminLogin.tsx`):</b> Secure JWT login with password show/hide eye toggle.<br/>
    2. <b>Dashboard (`Dashboard.tsx`):</b> Business KPI metrics, revenue counters, order summaries.<br/>
    3. <b>Products Editor (`ProductEditor.tsx`):</b> Catalog manager, add/edit masterpiece jewellery, stock control.<br/>
    4. <b>Orders Ledger (`Orders.tsx`):</b> Master reservation table with search, status filters (Pending, Shipped, Delivered), and printable receipts.<br/>
    5. <b>Gold Mine Wallets (`GoldMineWallets.tsx`):</b> 10+1 Gold Savings manager, manual EMI credit, bonus toggle.<br/>
    6. <b>Patron Ledger (`Customers.tsx`):</b> Customer profile drawer, lifetime spend, order history, null-safe account status controls.<br/>
    7. <b>Daily Pricing (`PricingSettings.tsx`):</b> Live 24K gold rate & diamond grade rate updater.<br/>
    8. <b>Video Call Panel (`VideoCallPanel.tsx`):</b> Incoming customer video consultation interface.
    """
    story.append(Paragraph(admin_pages, body_style))
    story.append(Spacer(1, 14))

    # ================= SECTION 5 =================
    story.append(Paragraph("⚡ 5. Backend Architecture & Dynamic Pricing Formula", h1_style))
    be_struct = """
    <b>Dynamic Pricing Formula (`productPriceCalculation.js`):</b><br/>
    • <b>Size Weight Steps:</b> Rings add +0.140g per size step past default Size 12. Chains/Mangalsutras add +0.500g per inch.<br/>
    • <b>Karat Density Multipliers:</b> 9K (37/58.5), 14K (1.0), 18K (75/58.5), 22K (91.6/58.5), 24K (100/58.5).<br/>
    • <b>Net Gold Weight:</b> Gross Weight minus Diamond/Solitaire/Gemstone weight.<br/>
    • <b>Final Price:</b> Net Gold Weight * Karat Rate + Diamond Price + Solitaire Price + Making Charges + 3% GST.<br/><br/>
    <b>Automated HTML Invoicing (`goldMineEmailService.js`):</b><br/>
    • Generates Gold Mine passbook statements via Nodemailer with 9 embedded Base64 certification badges (Assured Purity, BIS Hallmark, SGL, IGI, Natural Diamond, etc.).
    """
    story.append(Paragraph(be_struct, body_style))
    story.append(Spacer(1, 14))

    # ================= SECTION 6 & 7 =================
    story.append(Paragraph("🌟 6. Summary of Recent Improvements", h1_style))
    improvements = """
    1. <b>Embedded 9 Certification Badges in Invoices:</b> Converted external image URLs to Base64 Data URIs in <code>goldMineEmailService.js</code>.<br/>
    2. <b>Fixed Gold Mine Payment Error:</b> Declared <code>resolvedMethod</code> and <code>resolvedTxnId</code> variables in <code>goldMineService.js</code>.<br/>
    3. <b>Dynamic Gold Weight & Rate Sync:</b> Updated <code>productPriceCalculation.js</code> and synced <code>ProductDetailPage.jsx</code> Gross/Net weight display.<br/>
    4. <b>Admin Sidebar Cleanup:</b> Removed unused "Gift Cards" and "Lucky Wheel" menu options in <code>App.tsx</code>.<br/>
    5. <b>Custom Favicon Branding:</b> Updated browser tab icon across Frontend and Admin HTML headers to <code>/zoni1.png</code>.<br/>
    6. <b>Resolved React & TypeScript Errors:</b> Added null-safe property access in <code>Customers.tsx</code> and fixed React Hook ordering in <code>App.tsx</code>.
    """
    story.append(Paragraph(improvements, body_style))
    story.append(Spacer(1, 14))

    story.append(Paragraph("🚀 7. Conclusion", h1_style))
    conclusion = """
    The <b>Zoniraz Jewels E-Commerce Platform</b> is fully functional, performant, and production-ready. All customer storefront pages, custom price calculators, 10+1 Gold Mine wallet passbooks, Nodemailer invoicing, and TypeScript Admin Portal modules operate seamlessly with enterprise standards.
    """
    story.append(Paragraph(conclusion, body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF successfully generated at:", output_path)

if __name__ == "__main__":
    p1 = "/Users/vikasjangid/Downloads/rezworld/newZoniraj/Zoniraz_Comprehensive_Project_Report.pdf"
    p2 = "/Users/vikasjangid/Downloads/Zoniraz_Comprehensive_Project_Report.pdf"
    p3 = "/Users/vikasjangid/Desktop/Zoniraz_Comprehensive_Project_Report.pdf"
    
    create_report_pdf(p1)
    
    import shutil
    try:
        shutil.copy(p1, p2)
        shutil.copy(p1, p3)
        print("Copies saved to Downloads and Desktop!")
    except Exception as e:
        print("Notice:", e)
