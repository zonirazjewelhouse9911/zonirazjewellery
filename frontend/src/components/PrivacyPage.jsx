import React, { useEffect } from 'react';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="privacy-page-wrapper">
      <style>{`
        .privacy-page-wrapper {
          background: #FAF8F6;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #2C2520;
          min-height: 100vh;
          padding: 80px 24px 120px;
        }
        .privacy-container {
          max-width: 900px;
          margin: 0 auto;
          background: #FFFFFF;
          border: 1px solid #EAE5E0;
          border-radius: 24px;
          padding: 60px 50px;
          box-shadow: 0 10px 40px rgba(44, 37, 32, 0.03);
          line-height: 1.8;
        }
        .privacy-main-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 12px;
          color: #2C2520;
        }
        .privacy-main-subtitle {
          text-align: center;
          font-size: 14px;
          color: #8C827A;
          margin-bottom: 50px;
        }
        .privacy-divider {
          height: 1px;
          background: #EAE5E0;
          margin: 40px 0;
        }
        .privacy-header-section {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #2C2520;
          margin-top: 50px;
          margin-bottom: 20px;
          border-bottom: 2px solid #2C2520;
          padding-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .privacy-sub-header {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #2C2520;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .privacy-paragraph {
          font-size: 14.5px;
          color: #5D544F;
          margin-bottom: 20px;
          text-align: justify;
        }
        .privacy-policy-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          font-size: 13.5px;
        }
        .privacy-policy-table th, .privacy-policy-table td {
          border: 1px solid #EAE5E0;
          padding: 14px 18px;
          text-align: left;
        }
        .privacy-policy-table th {
          background: #FAF8F6;
          font-weight: 700;
          color: #2C2520;
        }
        .privacy-policy-table td {
          color: #5D544F;
        }
        @media (max-width: 768px) {
          .privacy-page-wrapper {
            padding: 40px 16px 80px;
          }
          .privacy-container {
            padding: 30px 20px;
          }
          .privacy-main-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="privacy-container">
        <h1 className="privacy-main-title">Privacy Policy</h1>
        <p className="privacy-main-subtitle">Shipping, Delivery Information &amp; Selling Terms</p>

        <p className="privacy-paragraph" style={{ fontWeight: '600', color: '#2C2520' }}>
          Hello and welcome to the Shipping and Delivery Information page! Here you can get acquainted with useful information on terms and conditions of our goods delivery.
        </p>

        <p className="privacy-paragraph">
          You can purchase your items online and pick them up at our street store, or ship them directly to your doorstep. Shipping is free on some orders. We use the best carriers in the business to make sure your order gets to you on time. From the Secure Checkout page you'll see your item description, price and delivery timing. Where available, you can also choose a faster delivery method for each item on your order, for an additional fee. Delivery times vary according to your selected delivery address, availability of your items and the time of day you place your order.
        </p>

        <div className="privacy-divider"></div>

        <h3 className="privacy-sub-header">Cost &amp; Services</h3>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '30px' }}>
          <table className="privacy-policy-table" style={{ minWidth: '600px', margin: '0' }}>
            <thead>
              <tr>
                <th>Service</th>
                <th>Locations</th>
                <th>Delivery Schedule</th>
                <th>Cost per Shipment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Royal mail 1st Class Service</strong> (Order value $20 or less)</td>
                <td>All of UK &amp; some European Countries</td>
                <td>1-3 days<br />Monday - Saturday</td>
                <td>$3.95</td>
              </tr>
              <tr>
                <td><strong>Royal mail Tracker</strong> (Order value $50 or less)</td>
                <td>All of UK</td>
                <td>1-3 days<br />Monday - Saturday</td>
                <td>$4.95</td>
              </tr>
              <tr>
                <td><strong>Standard Courier Delivery</strong></td>
                <td>UK mainland only</td>
                <td>1-3 days<br />Delivery 7.30am - 5.30am<br />Monday - Friday</td>
                <td>$5.95</td>
              </tr>
              <tr>
                <td><strong>Standard Courier Delivery</strong></td>
                <td>Northern Ireland, Eire, Scilly Isles</td>
                <td>1-3 days<br />Delivery 7.30am - 5.30am<br />Monday - Friday</td>
                <td>$9.95</td>
              </tr>
              <tr>
                <td><strong>Priority courier pre 12pm Next Working Day</strong></td>
                <td>UK mainland only</td>
                <td>Pre 12pm<br />Delivery 7.30am - 12pm<br />Monday - Friday</td>
                <td>$8.95</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="privacy-sub-header">Free Delivery</h3>
        <p className="privacy-paragraph">
          Free two-day shipping is available on in-stock items. You can see in your bag if your item is in stock. Free two-day shipping is not available on customized, engraved products, and for certain order types, including orders paid for with financing or by bank transfer. To get free two-day shipping, you will need to place your order by 5pm, Monday to Friday. For instance, if you order your goods before 5:00 pm, Monday to Friday we will deliver them in two business days.
        </p>

        <h2 className="privacy-header-section">Terms &amp; Conditions</h2>

        <p className="privacy-paragraph">
          <strong>Entire agreement</strong><br />
          If you require a complete delivery of your orders, please enter an X in the Complete Delivery field on the shipping screen of the customer master record. The indicator is copied into the order header, which you can also use for the purpose.
        </p>

        <p className="privacy-paragraph">
          <strong>Controlling terms</strong><br />
          Buyer expressly agrees that Seller’s Invoice and these Terms and Conditions of Sale represent the complete agreement of the parties with respect to the sale of the product(s) listed on the Invoice and no different or additional terms or conditions in Buyer’s purchase order or in any other prior or subsequent communications in any way adding to, modifying or otherwise changing these Terms and Conditions of Sale shall be binding upon Seller.
        </p>

        <p className="privacy-paragraph">
          <strong>acceptance of orders</strong><br />
          Seller may accept buyer’s offer to purchase and shall be bound to supply the applicable Goods in accordance with these terms and conditions either by execution of the acknowledgment copy of the order, or acceptable electronic transmission, delivery of the Goods to CAI or by any other statement, act or course of conduct which constitutes acceptance under applicable law.
        </p>

        <p className="privacy-paragraph">
          <strong>prices</strong><br />
          Unless otherwise indicated on the face of the invoice, all prices are quoted on a per pound basis. Buyer is responsible for any tax or government charges imposed upon the sale or transfer of the Product. Buyer shall not have any right to set off any amounts due hereunder against any amounts which may become payable to Seller under any other agreement.
        </p>

        <p className="privacy-paragraph">
          <strong>delivery</strong><br />
          Unless otherwise agrees in writing signed by officer of Seller, all delivery dates are estimates Seller shall use its reasonable efforts to deliver all Product within the time specified; however, in no case shall Seller be liable for any expense, loss or damage whatsoever suffered by Buyer as a result of the Seller’s failure to deliver Product by the specified date.
        </p>

        <p className="privacy-paragraph">
          <strong>transportation and risk of loss</strong><br />
          The method and route of shipment are at Seller’s discretion unless Buyer timely supplies explicit instructions otherwise. Title to the Product passes to Buyer when Product is delivered to the selected carrier, even if Seller made a nonconforming tender. Buyer attempts to revoke acceptance of the Product, or Buyer repudiates this document after the Products have been identified hereto.
        </p>

        <p className="privacy-paragraph">
          <strong>cancellation or modification</strong><br />
          Any order placed with and accepted by Seller may be canceled by Buyer only upon Seller’s approval in a writing signed by an officer of Seller and upon terms that indemnify Seller against any loss. Seller will not accept order cancellations once a product has been delivered to a carrier, without charging a cancellation fee of twenty-five percent (25%) of order value to recover retrieval costs incurred. Seller will not accept cancellations of special orders of non-standard, non-price list products. Seller may cancel all or any part of this order and discontinue its performance hereunder without liability to Buyer in the event Buyer materially breaches this contract, becomes insolvent, is the subject to bankruptcy protection, or is the subject of a receivership, liquidation, dissolution or similar proceeding.
        </p>

        <p className="privacy-paragraph">
          <strong>warranty and disclaimer</strong><br />
          Seller warrants that the purchased Product is free from defects in materials and workmanship at the time of delivery. If an analysis is stated on the face of the Invoice, it is not intended to be a complete analysis and is not to be regarded as a specification or warranty, unless specifically stated in writing to be such.
        </p>

        <p className="privacy-paragraph">
          <strong>limitation of liability</strong><br />
          Buyer acknowledges and agrees that seller’s liability for any claims with respect to the products shall not exceed the amount paid by buyer for the products under the invoice. Such limitations on seller’s liability hereunder shall apply even if seller’s liability is due in whole or in part to its own negligence. Any action by or on behalf of Buyer or its successors or assigns for breach of this document must be commenced within one (1) year after the cause of action as accrued.
        </p>

        <p className="privacy-paragraph">
          <strong>return of material</strong><br />
          Upon delivery of Product, Buyer shall have five (5) days to inspect Product and notify Seller, in writing, of any defective goods or other cause for rejection. Buyer agrees that five (5) day period provides Buyer a reasonable opportunity to inspect the Product. Such notification shall identify each and every reason for any rejection of Product. Buyer’s failure to reject Product within such five (5) day period shall constitute a waiver of Buyer’s inspection right and an unqualified and irrevocable acceptance of the Product by Buyer.
        </p>

        <p className="privacy-paragraph">
          <strong>indemnity</strong><br />
          Buyer shall defend, indemnify and hold harmless Seller and its affiliated or related companies from and against any and all claims, losses, liability, damages and expenses including, but not limited to, attorneys’ fees and cost of defense arising from, related to or in any way connected with or alleged to arise from or out of any asserted deficiencies or defects in Product caused by any alteration or modification thereof by Buyer with or without Seller’s consent, or improper handling or storage by Buyer, the breach of any term or condition stated herein, Buyer’s failure to label Product or Buyer’s improper labeling of Product regardless of whether the labeling was done with or without the advice of Seller.
        </p>

        <p className="privacy-paragraph">
          <strong>payment</strong><br />
          Net cash thirty (30) days from the date of Invoice. Amounts not paid within thirty (30) days are overdue and shall accrue interest at a rate of one and one-half percent (1-1/2%) per month or the highest allowed by law, whichever is less. Buyer shall reimburse Seller for any costs incurred in collecting past due sums or any other amounts owed by Buyer for any reason whatsoever, including, but not limited to, court costs and attorneys’ fees.
        </p>

        <p className="privacy-paragraph">
          <strong>governing law and arbitration</strong><br />
          This document shall be interpreted and governed by the law of the State of America, excluding its conflicts of laws rules. The parties specifically exclude the application of the United Nations Convention on the Sale of Goods.
        </p>

        <p className="privacy-paragraph">
          <strong>taxes</strong><br />
          Buyer is responsible for any tax or governmental charge imposed upon the sale or transfer of any product. Any such tax or governmental charge will be added to the total invoice amount. All prices are FOB Seller’s facilities. Applicable freight costs will be added to the invoice.
        </p>
      </div>
    </div>
  );
}
