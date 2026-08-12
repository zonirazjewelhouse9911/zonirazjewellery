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
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return # Skip cover page header/footer
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#5d463c"))
        
        # Header line & text
        self.setStrokeColor(colors.HexColor("#C8A359"))
        self.setLineWidth(0.75)
        self.line(40, 755, 572, 755)
        self.drawString(40, 762, "ZONIRAZ JEWELHOUSE — SYSTEM ARCHITECTURE & DOCUMENTATION")
        
        # Footer line & text
        self.line(40, 45, 572, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        self.drawString(40, 32, "Confidential — Zoniraz Jewelhouse Pvt. Ltd.")
        
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 32, page_text)
        self.restoreState()

def create_pdf(output_path):
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
    CODE_BG = colors.HexColor("#F7FAFC")

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        alignment=1,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=SECONDARY,
        alignment=1,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=DARK_TEXT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=4
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

    # ================= COVER PAGE =================
    story.append(Spacer(1, 40))
    story.append(Paragraph("ZONIRAZ JEWELHOUSE PRIVATE LIMITED", title_style))
    story.append(Paragraph("A SYMPHONY OF BRILLIANCE AND ELEGANCE", subtitle_style))
    story.append(HRFlowable(width="80%", thickness=2, color=SECONDARY, spaceBefore=0, spaceAfter=30))
    
    meta_box = [
        [Paragraph("<b>Document Type:</b> Full Project Technical & System Specification", body_style)],
        [Paragraph("<b>Company Name:</b> Zoniraz Jewelhouse Private Limited", body_style)],
        [Paragraph("<b>Registered Store Address:</b> Shop No. 7, Hanuman Burj, Alwar, Rajasthan - 301001", body_style)],
        [Paragraph("<b>Contact Phone:</b> +91 8905836061 | <b>Email:</b> zonirazjewellery@gmail.com", body_style)],
        [Paragraph("<b>GSTIN:</b> 08AABCZ4653J1ZY | <b>State Code:</b> 08 | <b>PAN:</b> AABCZ4653J", body_style)],
        [Paragraph("<b>Core Subsystems:</b> Frontend (React 19), Backend (Node.js/Express), Admin Panel (TypeScript)", body_style)],
        [Paragraph("<b>Total Source Code Files:</b> 248 Source Code Files (47,764 Files Including Node Modules)", body_style)],
        [Paragraph("<b>Primary Typography:</b> Playfair Display (Serif Titles) & Inter (Sans-Serif UI Body)", body_style)],
    ]
    t_meta = Table(meta_box, colWidths=[6.8*inch])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, SECONDARY),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 30))

    exec_summary = """
    <b>Executive Summary:</b><br/>
    This comprehensive document contains the complete technical architecture, subsystem file breakdown, database schemas, API service logic, pricing algorithms, Gold Savings Scheme (Gold Mine 10+1) mechanics, email invoice generation rules, WebRTC live video consultation flow, and UI typography standards for the <b>Zoniraz Jewels</b> e-commerce platform.
    """
    story.append(Paragraph(exec_summary, body_style))
    story.append(PageBreak())

    # ================= PAGE 2: FILE COUNTS & SUBSYSTEMS =================
    story.append(Paragraph("1. System Subsystems & Directory Statistics", h1_style))
    story.append(Paragraph("The platform is structured into three primary decoupled subsystems: Customer Frontend, Node.js Backend Server, and TypeScript Admin Panel.", body_style))
    story.append(Spacer(1, 6))

    subsystem_data = [
        [
            Paragraph("Subsystem", table_header),
            Paragraph("Primary Tech Stack", table_header),
            Paragraph("Source Files", table_header),
            Paragraph("Total Files", table_header),
            Paragraph("Core Function & Responsibility", table_header)
        ],
        [
            Paragraph("<b>Customer Frontend</b>", table_cell),
            Paragraph("React 19, Vite, JS/JSX, Vanilla CSS, Lucide Icons", table_cell),
            Paragraph("<b>128 Files</b>", table_cell),
            Paragraph("9,687 Files", table_cell),
            Paragraph("Customer store, custom rate/weight calculator, Gold Mine portal, Razorpay checkout, digital gold wallet", table_cell)
        ],
        [
            Paragraph("<b>Backend Server</b>", table_cell),
            Paragraph("Node.js, Express, MongoDB, Nodemailer, Socket.io", table_cell),
            Paragraph("<b>95 Files</b>", table_cell),
            Paragraph("31,460 Files", table_cell),
            Paragraph("REST API backend, live pricing calculation engine, Gold Mine scheme, PDF/HTML invoice generator with embedded Base64 badges, WebRTC signaling", table_cell)
        ],
        [
            Paragraph("<b>Admin Panel</b>", table_cell),
            Paragraph("React 19, TypeScript, Vite, TailwindCSS 4", table_cell),
            Paragraph("<b>25 Files</b>", table_cell),
            Paragraph("6,617 Files", table_cell),
            Paragraph("Admin management portal, masterpiece catalog editor, orders ledger, 10+1 wallets control, live pricing editor", table_cell)
        ],
        [
            Paragraph("<b>TOTAL PROJECT</b>", table_header),
            Paragraph("<b>MERN Stack + WebRTC + Nodemailer PDF</b>", table_header),
            Paragraph("<b>248 Source Files</b>", table_header),
            Paragraph("<b>47,764 Total</b>", table_header),
            Paragraph("<b>Full Luxury Jewellery E-Commerce Ecosystem</b>", table_header)
        ]
    ]

    t_sub = Table(subsystem_data, colWidths=[1.1*inch, 1.6*inch, 0.9*inch, 0.9*inch, 2.7*inch])
    t_sub.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,-1), (-1,-1), SECONDARY),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_sub)
    story.append(Spacer(1, 14))

    # ================= TYPOGRAPHY & BRANDING =================
    story.append(Paragraph("2. Typography, Fonts & Design Tokens", h1_style))
    font_desc = """
    <b>Typography Standards:</b><br/>
    • <b>Primary Header Font (Serif):</b> <code>Playfair Display</code> (Google Fonts - Weights 400..700, Italic) — Renders luxury product titles, collection headings, section banners, price tags, and logo branding.<br/>
    • <b>Body & UI Font (Sans-Serif):</b> <code>Inter</code> (Google Fonts - Weights 300, 400, 500, 600, 700) — Renders navigation drawers, product specification tables, buttons, form controls, order receipts, and admin tables.<br/>
    <br/>
    <b>Design Color Palette:</b><br/>
    • <b>Deep Luxury Cocoa Brown:</b> <code>#5d463c</code> / <code>#231535</code> (Primary brand accent for headers, primary buttons, and sidebar navigation)<br/>
    • <b>Royal Gold:</b> <code>#c8a359</code> / <code>#C5A880</code> / <code>#B7791F</code> (Secondary highlight for prices, Gold Mine wallet balances, and badges)<br/>
    • <b>Cream Linen & Warm Canvas:</b> <code>#efe7e5</code> / <code>#FAF5EF</code> / <code>#f4f6f9</code> (Background for pages, modals, and product cards)<br/>
    • <b>Favicon Icon:</b> <code>/zoni1.png</code> — Official Zoniraz brand logo favicon configured in <code>frontend/index.html</code> and <code>adminSide/index.html</code>.
    """
    story.append(Paragraph(font_desc, body_style))
    story.append(Spacer(1, 14))

    # ================= PAGE 3: DYNAMIC PRICING ENGINE =================
    story.append(Paragraph("3. Realtime Dynamic Pricing & Weight Calculation Engine", h1_style))
    pricing_text = """
    The backend service <code>backend/src/services/productPriceCalculation.js</code> contains the custom formula that computes live jewellery prices and dynamic net/gross weights whenever a customer changes Ring/Chain Size or Karat Purity on <code>ProductDetailPage.jsx</code>.<br/><br/>
    <b>Formula & Rules:</b><br/>
    1. <b>Normalized Input Handling:</b> Metal selections (e.g. 9K, 14K, 18K, 22K, 24K) and Diamond Grades (IJ-SI, GH-VS, EF-VVS, FG-SI) are normalized to prevent default fallback errors.<br/>
    2. <b>Size Weight Adjustment:</b> For Rings, every size step past default Size 12 adds +0.140g gold weight. For Chains/Mangalsutras, every 1 inch past base length adds +0.500g.<br/>
    3. <b>Karat Density Multipliers:</b><br/>
       • 9K Gold = 37% 24K Rate | Weight Multiplier = 37 / 58.5<br/>
       • 14K Gold = 58.5% 24K Rate | Weight Multiplier = 1.00 (Base)<br/>
       • 18K Gold = 75% 24K Rate | Weight Multiplier = 75 / 58.5<br/>
       • 22K Gold = 91.6% 24K Rate | Weight Multiplier = 91.6 / 58.5<br/>
       • 24K Gold = 100% 24K Rate | Weight Multiplier = 100 / 58.5<br/>
    4. <b>Net Gold Weight Calculation:</b><br/>
       <code>Net Gold Weight = Gross Gold Weight - (Diamond Weight ct * 0.2) - (Solitaire Weight ct * 0.2) - (Gemstone Weight ct * 0.2)</code><br/>
    5. <b>Total Price Assembly:</b><br/>
       <code>Total Base Price = (Net Gold Weight * Gold Rate) + (Diamond Weight * Diamond Rate) + Solitaire Price + Gemstone Price + Making Charges</code><br/>
       <code>Final Customer Price = Total Base Price + 3% GST</code>
    """
    story.append(Paragraph(pricing_text, body_style))
    story.append(Spacer(1, 14))

    # ================= SCHEME & INVOICING =================
    story.append(Paragraph("4. Zoniraz 10+1 Gold Savings Scheme & Email Invoices", h1_style))
    scheme_text = """
    <b>Zoniraz 10+1 Gold Mine Scheme:</b><br/>
    • Customer deposits 10 consecutive monthly EMI installments.<br/>
    • Each installment is automatically converted into 24K pure gold grams based on the live gold rate on payment date and stored in customer's <code>UserDashboard</code> Gold Wallet.<br/>
    • <b>100% Free 11th Bonus Month:</b> If all 10 EMIs are paid on time (within 30-day grace period), Zoniraz contributes the 11th monthly installment completely free.<br/><br/>
    <b>Email Invoice & Base64 Certification Badges (<code>goldMineEmailService.js</code>):</b><br/>
    • Invoices & statements are sent via Nodemailer to customer and admin.<br/>
    • The footer section embeds 9 Base64-encoded Trust & Certification Badges: Assured Purity, 22K916 Hallmark, SGL Certified, IGI Certified, Trust & Safety, Certified Quality, 100% Natural Diamond, BIS Hallmarked Logo, and Authentic Jewellery Guarantee.
    """
    story.append(Paragraph(scheme_text, body_style))
    story.append(Spacer(1, 14))

    # ================= ADMIN PANEL & WEBRTC =================
    story.append(Paragraph("5. Admin Portal & Live WebRTC Video Consultation", h1_style))
    admin_spec = """
    <b>Admin Portal (<code>adminSide/</code>):</b><br/>
    • <b>Dashboard:</b> Revenue counters, total active Gold Mine wallets, recent orders.<br/>
    • <b>Catalog & Masterpiece Editor:</b> Add/edit products, stock levels, custom prices.<br/>
    • <b>Patron Ledger (Customers.tsx):</b> Null-safe customer search, lifetime spend tracking, account status suspension/activation.<br/>
    • <b>Gold Mine Wallets Manager:</b> View customer passbooks, credit manual EMIs, toggle 11th bonus status.<br/>
    • <b>Daily Pricing Settings:</b> Update live 24K gold rate, diamond grade modifiers, GST rate.<br/><br/>
    <b>WebRTC Live Video Consultation (<code>VideoCallContext.jsx</code> / <code>VideoCallPanel.tsx</code>):</b><br/>
    • Uses Socket.io signaling server to connect customer browser with admin for live virtual jewellery try-on calls.
    """
    story.append(Paragraph(admin_spec, body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("Full multi-page PDF generated successfully at:", output_path)

if __name__ == "__main__":
    p1 = "/Users/vikasjangid/Downloads/rezworld/newZoniraj/Zoniraz_Project_Documentation.pdf"
    p2 = "/Users/vikasjangid/Downloads/Zoniraz_Project_Documentation.pdf"
    p3 = "/Users/vikasjangid/Desktop/Zoniraz_Project_Documentation.pdf"
    
    create_pdf(p1)
    
    # Also save copies to Downloads and Desktop for user convenience
    import shutil
    try:
        shutil.copy(p1, p2)
        shutil.copy(p1, p3)
        print("Copies saved to Downloads and Desktop!")
    except Exception as e:
        print("Copied with notice:", e)
