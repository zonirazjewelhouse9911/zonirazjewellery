const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const GoldMine = require('../models/goldMineModel');

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'vikasjangid3352@gmail.com',
    pass: 'wtqe znhi gtmv oyfa'
  }
});

// Helper to load image asset as Base64 Data URI
function getBadgeBase64(filename) {
  try {
    const filePath = path.join(__dirname, '../../../frontend/src/assets', filename);
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath);
      return `data:image/jpeg;base64,${fileData.toString('base64')}`;
    }
  } catch (err) {
    console.error('Error loading invoice badge image:', filename, err.message);
  }
  return '';
}

// Load and cache all 9 trust/certification images
const badgeImages = {
  purityBadge: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.04 PM (1).jpeg'),
  purityMark: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.04 PM.jpeg'),
  sglCert: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.05 PM (1).jpeg'),
  igiCert: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.05 PM.jpeg'),
  trustSafety: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.06 PM (1).jpeg'),
  certQuality: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.06 PM (2).jpeg'),
  naturalDiamond: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.06 PM.jpeg'),
  bisLogo: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.07 PM (1).jpeg'),
  authenticJewellery: getBadgeBase64('WhatsApp Image 2026-07-24 at 12.32.07 PM.jpeg')
};

// Helper to convert amount to words
function convertNumberToWords(amount) {
  const num = Math.floor(Number(amount) || 0);
  if (num === 0) return 'Rupees Zero Only';

  const words = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n) {
    if (n < 20) return words[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + words[n % 10] : '');
    if (n < 1000) return words[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }

  return 'Rupees ' + convert(num) + ' Only';
}

// Generate Passbook HTML Table matching exact screenshot format
function generatePassbookHtml(plan, actionType = 'EMI_PAYMENT') {
  const installments = plan.installments || [];
  const startDate = plan.startDate ? new Date(plan.startDate) : new Date();
  const maturityDate = plan.maturityDate ? new Date(plan.maturityDate) : new Date();

  const formattedStartDate = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
  const formattedMaturityDate = maturityDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
  const currentDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });

  // Generate 11 installment rows
  let rowsHtml = '';
  for (let i = 1; i <= 11; i++) {
    const inst = installments.find(item => item.installmentNumber === i);
    let rowPaymentDate = '';
    let rowAmount = '';
    let rowGoldRate = '';
    let rowGoldWeight = '';
    let rowDepositDate = '';
    let rowMode = '';

    if (inst) {
      const pDate = new Date(inst.paymentDate || Date.now());
      const fDate = pDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
      rowPaymentDate = fDate;
      rowAmount = `₹${(inst.amount || 0).toLocaleString('en-IN')}`;
      rowGoldRate = inst.goldRate24k ? `₹${inst.goldRate24k}` : 'N/A';
      rowGoldWeight = inst.goldWeight24kGrams ? `${inst.goldWeight24kGrams} g` : '0 g';
      rowDepositDate = fDate;
      rowMode = inst.paidBy === 'ZONIRAZ_BONUS' ? '🎁 ZONIRAZ 100% FREE BONUS' : (inst.paymentMethod || 'Razorpay (UPI/Card)');
    } else {
      // Estimated future due date
      const estDueDate = new Date(startDate);
      estDueDate.setMonth(estDueDate.getMonth() + (i - 1));
      rowPaymentDate = estDueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    }

    const isBonusRow = i === 11 && inst && inst.paidBy === 'ZONIRAZ_BONUS';
    const rowBg = inst ? (isBonusRow ? '#E6FFFA' : '#F7FAFC') : '#FFFFFF';

    rowsHtml += `
      <tr style="background-color: ${rowBg}; border-bottom: 1px solid #CBD5E0;">
        <td style="padding: 6px; text-align: center; font-weight: bold; border-right: 1px solid #CBD5E0;">${i}</td>
        <td style="padding: 6px; text-align: center; border-right: 1px solid #CBD5E0;">${rowPaymentDate}</td>
        <td style="padding: 6px; text-align: center; font-weight: bold; border-right: 1px solid #CBD5E0;">${rowAmount}</td>
        <td style="padding: 6px; text-align: center; border-right: 1px solid #CBD5E0;">${rowGoldRate}</td>
        <td style="padding: 6px; text-align: center; font-weight: bold; color: #B7791F; border-right: 1px solid #CBD5E0;">${rowGoldWeight}</td>
        <td style="padding: 6px; text-align: center; border-right: 1px solid #CBD5E0;">${rowDepositDate}</td>
        <td style="padding: 6px; text-align: center; font-size: 11px; font-weight: 600; color: #2B6CB0;">${rowMode}</td>
      </tr>
    `;
  }

  const totalPaidWords = convertNumberToWords(plan.totalSavingsAmount || 0);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Zoniraz 10+1 Gold Saving Plan Invoice</title>
  </head>
  <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #1A202C;">
    <div style="max-width: 850px; margin: 0 auto; background: #ffffff; border: 2px solid #1A202C; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Top Title Bar -->
      <div style="text-align: center; border-bottom: 2px solid #1A202C; padding-bottom: 10px; margin-bottom: 16px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #1A202C;">ZONIRAZ JEWELHOUSE PRIVATE LIMITED</h1>
        <h3 style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #C8A359;">Zoniraz 10+1 Gold & Diamond Saving Plan Statement / Invoice</h3>
      </div>

      <!-- Account & Company Info Box -->
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #1A202C; margin-bottom: 16px; font-size: 12px;">
        <tr>
          <!-- Company Info Left -->
          <td style="width: 50%; vertical-align: top; padding: 10px; border-right: 1px solid #1A202C; background-color: #FAF5EF;">
            <div style="font-weight: 900; font-size: 13px; margin-bottom: 4px; color: #1A202C;">ZONIRAZ JEWELHOUSE PRIVATE LIMITED</div>
            <div>SHOP NO. 7, HANUMAN BURJ</div>
            <div>ALWAR, RAJ. 301001</div>
            <div>CONTACT NO.: <strong>8905836061</strong></div>
            <div>GSTIN: <strong>08AABCZ4653J1ZY</strong></div>
            <div>State Code: <strong>08</strong></div>
            <div>PAN: <strong>AABCZ4653J</strong></div>
          </td>

          <!-- Customer Info Right -->
          <td style="width: 50%; vertical-align: top; padding: 10px; background-color: #FFFFFF;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr><td style="font-weight: bold; width: 45%; padding: 2px 0;">Name of Account Holder:</td><td>${plan.userName || 'Valued Customer'}</td></tr>
              <tr><td style="font-weight: bold; padding: 2px 0;">Email Address:</td><td>${plan.userEmail}</td></tr>
              <tr><td style="font-weight: bold; padding: 2px 0;">Plan ID / Account No.:</td><td style="font-weight: bold; color: #C8A359;">${plan.planId}</td></tr>
              <tr><td style="font-weight: bold; padding: 2px 0;">Enrollment Date:</td><td>${formattedStartDate}</td></tr>
              <tr><td style="font-weight: bold; padding: 2px 0;">Maturity Date:</td><td>${formattedMaturityDate}</td></tr>
              <tr><td style="font-weight: bold; padding: 2px 0;">Mobile No.:</td><td>${plan.userPhone || 'N/A'}</td></tr>
              <tr><td style="font-weight: bold; padding: 2px 0;">Nominee Name:</td><td>N/A</td></tr>
              <tr><td style="font-weight: bold; padding: 2px 0;">11th Bonus Status:</td><td style="font-weight: bold; color: ${plan.bonusLapsed ? '#C53030' : '#276749'};">${plan.bonusLapsed ? '⚠️ Free 11th Bonus Lapsed (Late Payment)' : '✨ Free 11th Bonus Eligible'}</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Installment Table -->
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #1A202C; font-size: 11px; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #E2E8F0; color: #1A202C; text-transform: uppercase;">
            <th style="padding: 8px; border: 1px solid #1A202C; width: 10%;">Installment NO.</th>
            <th style="padding: 8px; border: 1px solid #1A202C; width: 15%;">PAYMENT DATE</th>
            <th style="padding: 8px; border: 1px solid #1A202C; width: 15%;">AMOUNT</th>
            <th style="padding: 8px; border: 1px solid #1A202C; width: 15%;">GOLD RATE (24K)</th>
            <th style="padding: 8px; border: 1px solid #1A202C; width: 15%;">GOLD Weight (gm)</th>
            <th style="padding: 8px; border: 1px solid #1A202C; width: 15%;">DEPOSIT DATE</th>
            <th style="padding: 8px; border: 1px solid #1A202C; width: 15%;">Mode of payment</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <!-- Totals Summary -->
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #1A202C; font-size: 12px; margin-bottom: 16px;">
        <tr style="background-color: #EDF2F7;">
          <td style="padding: 8px; font-weight: bold; border-right: 1px solid #1A202C; width: 70%;">Total Amount Paid</td>
          <td style="padding: 8px; font-weight: 900; font-size: 14px; text-align: right; color: #276749;">₹${(plan.totalSavingsAmount || 0).toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-right: 1px solid #1A202C;">Total (In Words)</td>
          <td style="padding: 8px; font-style: italic; font-weight: bold; text-align: right;">${totalPaidWords}</td>
        </tr>
        <tr style="background-color: #FEFCBF;">
          <td style="padding: 8px; font-weight: bold; border-right: 1px solid #1A202C; color: #744210;">Total Gold Accumulated in grams as on ${currentDateStr}</td>
          <td style="padding: 8px; font-weight: 900; font-size: 15px; text-align: right; color: #975A16;">${plan.totalGold24kGrams || 0} grams (24K Gold)</td>
        </tr>
      </table>

      <!-- Terms & Conditions Section -->
      <div style="border: 1px solid #1A202C; padding: 12px; font-size: 9.5px; line-height: 1.4; color: #2D3748; margin-bottom: 16px;">
        <div style="font-weight: 900; font-size: 11px; margin-bottom: 6px; text-decoration: underline; color: #1A202C;">Terms & Conditions</div>
        <ol style="margin: 0; padding-left: 16px;">
          <li>The customer must pay 10 consecutive monthly installments on or before the due date.</li>
          <li>The 11th installment will be paid by <strong>Zoniraz</strong>, provided the customer has paid all 10 monthly installments on time.</li>
          <li>If any monthly installment is not paid within the prescribed time limit (e.g., 30 days), the customer will no longer be eligible for the free 11th installment offered by Zoniraz.</li>
          <li>If the customer discontinues the plan before completion, the amount deposited can only be used for purchasing Zoniraz Jewellery. No cash refund will be provided, except where required by applicable law.</li>
          <li>The accumulated plan amount shall be valid only for the purchase of Gold Jewellery, Diamond Jewellery, and Gemstones.</li>
          <li>Each monthly installment will be converted into gold (in grams) at the prevailing gold rate on the date of receipt of the installment and credited to the customer's Gold Account.</li>
          <li>Making Charges, Wastage Charges, Stone Charges, Diamond Charges, GST, and any other applicable taxes or charges shall be payable separately unless otherwise stated in a promotional offer.</li>
          <li>The plan is non-transferable. (If permitted by the company, transfer may be allowed only after completion of the required KYC formalities.)</li>
          <li>At the time of purchase, the customer must present the Plan ID/Receipt along with valid KYC documents.</li>
          <li>The plan shall remain valid for 6 months from the date of the customer's last installment. After the validity period expires, all special benefits under the plan shall automatically lapse.</li>
          <li>Any refund, if applicable, shall be processed only in accordance with the company's Refund Policy.</li>
          <li>The Company reserves the right to amend, modify, or discontinue the plan and its terms and conditions at any time without prior notice.</li>
          <li>In the event of any dispute, the matter shall be subject to the exclusive jurisdiction of the courts at Alwar, Rajasthan, India.</li>
          <li>Only one offer/promotion can be availed at a time. Multiple offers cannot be combined.</li>
          <li>This plan is solely intended for the purchase of jewellery and cannot be used for any other purpose, including earning or claiming any interest.</li>
          <li>If the customer pays all 10 monthly installments on time, Zoniraz will contribute the 11th installment (equal to one monthly installment) at its own cost. As a result, the customer will be eligible to purchase jewellery equivalent to the value of 11 installments.</li>
        </ol>
      </div>

      <!-- Declaration & Signatures -->
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #1A202C; font-size: 11px; margin-bottom: 16px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #1A202C; background-color: #F7FAFC;" colspan="2">
            <strong>Declaration:</strong> I/We hereby declare that I/We have carefully read, fully understood, and accepted all the Terms & Conditions of this plan. I/We voluntarily sign this Agreement without any force, coercion, or undue influence. I/We agree to abide by all the terms of the plan and shall not raise any objection or dispute regarding these Terms & Conditions in the future.
          </td>
        </tr>
        <tr style="height: 60px; vertical-align: bottom;">
          <td style="width: 50%; padding: 12px; border-right: 1px solid #1A202C;">
            <strong>Customer's Signature</strong><br><br>
            Signature: ___________________________
          </td>
          <td style="width: 50%; padding: 12px; text-align: right;">
            <strong>For Zoniraz Jewelhouse Pvt. Ltd. (Authorized Signature)</strong><br><br>
            Signature: ___________________________
          </td>
        </tr>
      </table>

      <!-- Footer Quality & Certification Badges -->
      <div style="border-top: 2px solid #1A202C; padding-top: 16px; margin-top: 20px; text-align: center;">
        <div style="font-weight: 900; font-size: 12px; color: #1A202C; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
          Our Trust, Quality & Purity Assurances
        </div>
        <table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin: 0 auto;">
          <tr>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.purityBadge}" alt="Assured Purity" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.purityMark}" alt="Purity Mark" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.sglCert}" alt="SGL Certified" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
          </tr>
          <tr>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.igiCert}" alt="IGI Certified" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.trustSafety}" alt="Trust & Safety" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.certQuality}" alt="Certified Quality" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
          </tr>
          <tr>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.naturalDiamond}" alt="Natural Diamond" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.bisLogo}" alt="BIS Logo" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
            <td style="width: 33.33%; text-align: center; vertical-align: middle; background-color: #FFFFFF; border: 1px solid #CBD5E0; border-radius: 10px; padding: 8px; height: 75px;">
              <img src="${badgeImages.authenticJewellery}" alt="Authentic Jewellery" style="max-width: 100%; max-height: 65px; width: auto; height: auto; display: block; margin: 0 auto; object-fit: contain;" />
            </td>
          </tr>
        </table>
      </div>

    </div>
  </body>
  </html>
  `;
}

// Send Invoice Email to both User and Admin
exports.sendInvoiceEmail = async ({ planId, userEmail, actionType = 'EMI_PAYMENT' }) => {
  try {
    if (!planId || !userEmail) return;

    const plan = await GoldMine.findOne({ planId: planId });
    if (!plan) return;

    const passbookHtml = generatePassbookHtml(plan, actionType);

    const isRegister = actionType === 'REGISTER';
    const subjectTitle = isRegister
      ? `🎉 Zoniraz 10+1 Gold Saving Plan Registration Statement - Plan ID: ${plan.planId}`
      : `🧾 Updated Statement & EMI Receipt - Zoniraz 10+1 Gold Plan ${plan.planId}`;

    const adminEmail = 'zonirazjewellery@gmail.com';
    const fallbackAdmin = 'vikasjangid3352@gmail.com';

    // Send to User
    const userMailOptions = {
      from: `"Zoniraz Jewelhouse" <vikasjangid3352@gmail.com>`,
      to: userEmail,
      subject: subjectTitle,
      html: passbookHtml
    };
    await transporter.sendMail(userMailOptions);

    // Send to Admin
    const adminMailOptions = {
      from: `"Zoniraz Jewelhouse Portal" <vikasjangid3352@gmail.com>`,
      to: `${adminEmail}, ${fallbackAdmin}`,
      subject: `[ADMIN NOTIFICATION] ${subjectTitle} - Customer: ${plan.userName || userEmail}`,
      html: passbookHtml
    };
    await transporter.sendMail(adminMailOptions);

    console.log(`[GoldMine Email] Statement successfully sent to customer (${userEmail}) and admin (${adminEmail}) for plan ${planId}`);
  } catch (err) {
    console.error('Error sending Gold Mine invoice email:', err.message);
  }
};
