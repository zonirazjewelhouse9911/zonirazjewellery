import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

pdf_filename = "/Users/vikasjangid/Downloads/rezworld/newZoniraj/Zoniraz_Project_Documentation.pdf"
doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=40,
    leftMargin=40,
    topMargin=40,
    bottomMargin=40
)

styles = getSampleStyleSheet()

# Custom Palette
PRIMARY = colors.HexColor("#5d463c")     # Deep Cocoa Brown
SECONDARY = colors.HexColor("#C8A359")   # Luxury Gold
DARK_BG = colors.HexColor("#1A202C")     # Charcoal Dark
LIGHT_BG = colors.HexColor("#FAF5EF")    # Cream Linen
ACCENT = colors.HexColor("#2B6CB0")      # Elegant Blue
TEXT_DARK = colors.HexColor("#2D3748")   # Body text

# Custom Typography Styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=PRIMARY,
    alignment=1, # Center
    spaceAfter=6
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=16,
    textColor=SECONDARY,
    alignment=1,
    spaceAfter=15
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
    'BodyTextCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=TEXT_DARK,
    spaceAfter=6
)

bullet_style = ParagraphStyle(
    'BulletCustom',
    parent=body_style,
    leftIndent=12,
    firstLineIndent=-8,
    spaceAfter=4
)

table_header_style = ParagraphStyle(
    'TableHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=11,
    textColor=colors.white,
    alignment=1
)

table_cell_style = ParagraphStyle(
    'TableCell',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=11,
    textColor=TEXT_DARK
)

story = []

# Title & Banner Header
story.append(Paragraph("ZONIRAZ JEWELHOUSE PRIVATE LIMITED", title_style))
story.append(Paragraph("COMPLETE TECHNICAL & ARCHITECTURAL SYSTEM DOCUMENTATION", subtitle_style))
story.append(HRFlowable(width="100%", thickness=2, color=SECONDARY, spaceBefore=0, spaceAfter=12))

# Overview Box
overview_text = """
<b>Project Overview:</b> Zoniraz Jewels is a full-stack luxury gold, diamond, and gemstone e-commerce platform featuring an integrated 10+1 Gold Savings Scheme (Gold Mine Wallet), live daily gold rate dynamic pricing engine, custom WebRTC video consultation, Nodemailer HTML invoice generator, and a comprehensive TypeScript Admin Portal.
"""
story.append(Paragraph(overview_text, body_style))
story.append(Spacer(1, 8))

# Section 1: System Subsystems & File Counts
story.append(Paragraph("1. System Architecture & Subsystem Summary", h1_style))

summary_data = [
    [
        Paragraph("Subsystem", table_header_style),
        Paragraph("Primary Technologies", table_header_style),
        Paragraph("Source Files", table_header_style),
        Paragraph("Total Files", table_header_style),
        Paragraph("Role & Core Responsibility", table_header_style)
    ],
    [
        Paragraph("<b>Frontend</b>", table_cell_style),
        Paragraph("React 19, Vite, JS/JSX, Vanilla CSS, Lucide", table_cell_style),
        Paragraph("<b>128 Files</b>", table_cell_style),
        Paragraph("9,687 Files", table_cell_style),
        Paragraph("Customer store, custom pricing calculator, Gold Mine portal, Razorpay checkout, live video call client", table_cell_style)
    ],
    [
        Paragraph("<b>Backend</b>", table_cell_style),
        Paragraph("Node.js, Express, MongoDB, Nodemailer, Socket.io", table_cell_style),
        Paragraph("<b>95 Files</b>", table_cell_style),
        Paragraph("31,460 Files", table_cell_style),
        Paragraph("REST API backend, live pricing calculation engine, Gold Mine scheme, PDF/HTML invoice generator, Socket WebRTC", table_cell_style)
    ],
    [
        Paragraph("<b>Admin Panel</b>", table_cell_style),
        Paragraph("React 19, TypeScript, Vite, TailwindCSS", table_cell_style),
        Paragraph("<b>25 Files</b>", table_cell_style),
        Paragraph("6,617 Files", table_cell_style),
        Paragraph("Admin management portal, masterpiece catalog editor, orders ledger, 10+1 wallets control, live pricing editor", table_cell_style)
    ],
    [
        Paragraph("<b>Total Project</b>", table_header_style),
        Paragraph("<b>MERN Stack + WebRTC + Nodemailer PDF</b>", table_header_style),
        Paragraph("<b>248 Source Files</b>", table_header_style),
        Paragraph("<b>47,764 Total</b>", table_header_style),
        Paragraph("<b>Complete End-to-End Luxury Jewellery System Ecosystem</b>", table_header_style)
    ]
]

t1 = Table(summary_data, colWidths=[1.1*inch, 1.6*inch, 0.9*inch, 0.9*inch, 2.7*inch])
t1.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), PRIMARY),
    ('ALIGN', (0,0), (-1,-1), 'LEFT'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
    ('BACKGROUND', (0,-1), (-1,-1), SECONDARY),
    ('PADDING', (0,0), (-1,-1), 5),
]))
story.append(t1)
story.append(Spacer(1, 10))

# Section 2: Typography & Design System
story.append(Paragraph("2. Typography, Fonts & Design System Palette", h1_style))
font_info = """
<b>Design System & Branding Specs:</b><br/>
• <b>Serif Header Font:</b> <code>Playfair Display</code> (Google Fonts - 400, 500, 600, 700, Italic) - Used for luxury titles, collection headers, price tags, and logo branding.<br/>
• <b>Sans-Serif Interface Font:</b> <code>Inter</code> (Google Fonts - 300, 400, 500, 600, 700) - Used for navigation, product details, specs, buttons, forms, and tables.<br/>
• <b>Primary Brand Color:</b> Deep Luxury Cocoa Brown (<code>#5d463c</code> / <code>#231535</code>)<br/>
• <b>Accent Gold Color:</b> Royal Gold (<code>#c8a359</code> / <code>#C5A880</code> / <code>#B7791F</code>)<br/>
• <b>Background Palette:</b> Cream Linen (<code>#efe7e5</code> / <code>#FAF5EF</code>) & Clean Slate White (<code>#ffffff</code>)<br/>
• <b>Brand Favicon Icon:</b> Custom Brand Logo <code>/zoni1.png</code> (configured in both Frontend & Admin HTML headers).
"""
story.append(Paragraph(font_info, body_style))
story.append(Spacer(1, 10))

# Section 3: Frontend Subsystem Details
story.append(Paragraph("3. Frontend Architecture & Modules", h1_style))
frontend_text = """
<b>Frontend Stack (<code>frontend/</code>):</b> React 19, Vite, JavaScript (JSX), Custom Vanilla CSS, Lucide Icons, Socket.io Client, Simple-Peer.<br/>
<b>Key Frontend Modules:</b><br/>
• <code>Header.jsx</code>: Responsive mega-drawer navigation, category links, search modal, cart & wishlist counters.<br/>
• <code>ProductDetailPage.jsx</code>: Dynamic customizer for Metal Purity (9K, 14K, 18K, 22K, 24K), Ring/Chain Size, Diamond Grade (IJ-SI, GH-VS, EF-VVS, FG-SI), and Solitaire. Computes live Gross Weight, Net Weight, and Price Breakup.<br/>
• <code>GoldMinePage.jsx</code>: Zoniraz 10+1 Gold Savings Scheme registration page, EMI schedule breakdown, and 11th Month Free Bonus rules.<br/>
• <code>GoldExchange.jsx</code>: Gold valuation section rendering 9 Trust & Certification Badges (BIS Hallmark, SGL, IGI, Natural Diamond, Assured Purity, etc.).<br/>
• <code>CartPage.jsx</code> & <code>CheckoutPage.jsx</code>: Cart manager with coupon application, Razorpay payment gateway integration, and order receipt generation.<br/>
• <code>UserDashboard.jsx</code>: Digital Gold Wallet passbook tracking accumulated 24K pure gold grams.
"""
story.append(Paragraph(frontend_text, body_style))
story.append(Spacer(1, 10))

# Section 4: Backend Subsystem Details
story.append(Paragraph("4. Backend Architecture, Models & Services", h1_style))
backend_text = """
<b>Backend Stack (<code>backend/</code>):</b> Node.js, Express.js, MongoDB (Mongoose ORM), Nodemailer, Socket.io, Razorpay Node SDK, JWT Auth.<br/>
<b>Core Database Models & Services:</b><br/>
• <code>productPriceCalculation.js</code>: Realtime dynamic pricing engine calculating gold cost by karat density, diamond rates by purity grade, making charges, and 3% GST.<br/>
• <code>goldMineService.js</code>: Manages 10+1 Gold Savings Scheme accounts, monthly EMI payments, 30-day grace period tracking, and 100% free 11th installment bonus allocation.<br/>
• <code>goldMineEmailService.js</code>: Generates Gold Mine Passbook Statements & Invoices with embedded Base64 Trust & Certification Badges, emailed directly to customer & admin.<br/>
• <code>jewelleryPricingModel.js</code>: Live 24K gold daily rates, karat conversion percentages, diamond purity rate modifiers.<br/>
• <code>socket.js</code>: WebRTC signaling server for live customer-to-admin video consultation calls.
"""
story.append(Paragraph(backend_text, body_style))
story.append(Spacer(1, 10))

# Section 5: Admin Panel Subsystem Details
story.append(Paragraph("5. Admin Panel Architecture & Panels", h1_style))
admin_text = """
<b>Admin Panel Stack (<code>adminSide/</code>):</b> React 19, TypeScript, Vite, TailwindCSS 4, Lucide Icons.<br/>
<b>Admin Modules & Management Panels:</b><br/>
• <code>Dashboard.tsx</code>: Business KPI metrics, revenue counters, order summaries.<br/>
• <code>ProductEditor.tsx</code> & Catalog: Masterpiece product creation, price controls, gallery, stock tracking.<br/>
• <code>Orders.tsx</code>: Order ledger, status management (Pending, Shipped, Delivered), printable receipts.<br/>
• <code>GoldMineWallets.tsx</code>: Customer 10+1 Gold Savings scheme manager, manual EMI credit, passbook viewer.<br/>
• <code>Customers.tsx</code>: Patron ledger, lifetime spend, order history, null-safe account suspension/activation.<br/>
• <code>PricingSettings.tsx</code>: Live 24K gold rate updater, diamond grade rate modifiers, GST editor.<br/>
• <code>VideoCallPanel.tsx</code>: Admin video consultation interface to accept incoming customer calls.<br/>
• <code>Leads Management</code>: Franchise Leads, Exchange Leads, and Sell Gold Leads panels.
"""
story.append(Paragraph(admin_text, body_style))
story.append(Spacer(1, 14))

# Verification Footer
story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=6, spaceAfter=8))
footer_text = "<b>Zoniraz Jewelhouse Pvt. Ltd. Technical Documentation</b> — Generated for Project Vault & Developer Reference"
story.append(Paragraph(footer_text, ParagraphStyle('Foot', parent=body_style, fontSize=8, alignment=1, textColor=colors.HexColor("#718096"))))

doc.build(story)
print("PDF successfully generated at:", pdf_filename)
