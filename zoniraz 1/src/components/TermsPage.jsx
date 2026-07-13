import React, { useEffect } from 'react';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="terms-page-wrapper">
      <style>{`
        .terms-page-wrapper {
          background: #FAF8F6;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #2C2520;
          min-height: 100vh;
          padding: 80px 24px 120px;
        }
        .terms-container {
          max-width: 900px;
          margin: 0 auto;
          background: #FFFFFF;
          border: 1px solid #EAE5E0;
          border-radius: 24px;
          padding: 60px 50px;
          box-shadow: 0 10px 40px rgba(44, 37, 32, 0.03);
          line-height: 1.8;
        }
        .terms-main-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 12px;
          color: #2C2520;
        }
        .terms-main-subtitle {
          text-align: center;
          font-size: 14px;
          color: #8C827A;
          margin-bottom: 50px;
        }
        .terms-divider {
          height: 1px;
          background: #EAE5E0;
          margin: 40px 0;
        }
        .terms-header-section {
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
        .terms-sub-header {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #2C2520;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .terms-paragraph {
          font-size: 14.5px;
          color: #5D544F;
          margin-bottom: 20px;
          text-align: justify;
        }
        .terms-bullet-list {
          margin-left: 20px;
          margin-bottom: 20px;
          font-size: 14.5px;
          color: #5D544F;
        }
        .terms-bullet-list li {
          margin-bottom: 10px;
        }
        .terms-policy-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          font-size: 13.5px;
        }
        .terms-policy-table th, .terms-policy-table td {
          border: 1px solid #EAE5E0;
          padding: 14px 18px;
          text-align: left;
        }
        .terms-policy-table th {
          background: #FAF8F6;
          font-weight: 700;
          color: #2C2520;
        }
        .terms-policy-table td {
          color: #5D544F;
        }
        @media (max-width: 768px) {
          .terms-page-wrapper {
            padding: 40px 16px 80px;
          }
          .terms-container {
            padding: 30px 20px;
          }
          .terms-main-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="terms-container">
        <h1 className="terms-main-title">Terms &amp; Conditions</h1>
        <p className="terms-main-subtitle">Zoniraz Jewels - Official Policy and Guides</p>

        <p className="terms-paragraph" style={{ fontWeight: '600', color: '#2C2520' }}>
          All the terms and conditions mention here will be applicable on the buyer at the time of buying any type of product from Zoniraz.com
        </p>

        <div className="terms-divider"></div>

        <div className="terms-paragraph">
          <strong>Use of the website</strong> - The customer agrees and acknowledge that this website can be used only by individual who are 18 year and above. Minor are not eligible to use this website and buy any product. At the time of purchase, seller will consider buyer age is 18 year and above.
        </div>
        <p className="terms-paragraph">
          By using Zoniraz.com, you are eligible to buy any product at the given price only. Seller reserves all the rights to terminate Customer’s access, refuse to deliver the product in case of conflict and refund the money after deducting all expenditure bear by seller during the sale-purchase agreement between seller and buyer.
        </p>

        <p className="terms-paragraph">
          <strong>Trademarks</strong> - All the trademarks and logo appear on the website are registered. Any individual, company or any other firm can’t use the trademark, logo, name of website and information given on this website without written permission. If they do so, they will be liable for the penalty.
        </p>

        <p className="terms-paragraph">
          <strong>External Links</strong> - All the external links provided on this website are available for the convenience of customer. Use the links and information given on this website at your own risk seller is not liable for them because they are beyond the control of the website owner.
        </p>

        <p className="terms-paragraph">
          <strong>Warranties</strong> - Through representing products, their information and selling them to the customer not bound seller and his product in any kind of warranty and guarantees towards customer.
        </p>

        <p className="terms-paragraph">
          <strong>Prices</strong> - Products Price given on the website are calculated using precious metal and gem prices in the market to provide you the best value. Price of Zoniraz.com can change without notice due to precious metal and gems market fluctuation.
        </p>

        <p className="terms-paragraph">
          <strong>Disclaimer of Liability</strong> - Zoniraz.com owner will not be liable and responsible for any loss, damage, personal injury of buyer and third party, whatsoever is the cause. In other words, neither website owner nor content writer, website developer and third party will be liable for any directly and indirect loss, damage of buyer and third party and whomsoever is suffering from the cause.
          Zoniraz.com also not liable for decline of the transaction, money deduction and order not placed.
        </p>

        <p className="terms-paragraph">
          <strong>Conflict of terms</strong> - In case of conflict between seller and buyer, policies, notice, terms and conditions, any section and module given on the website. Seller reserves all the rights and seller decision will be the last decision and applicable on the seller &amp; buyer.
        </p>

        <p className="terms-paragraph">
          <strong>Severability</strong> - Any provision of any relevant terms and condition, policies and notice become unenforceable in any jurisdiction due to invalidity, illegality, unlawfulness or for any reason the remainder should still apply.
        </p>

        <h2 className="terms-header-section">Jewellery Guide</h2>
        
        <h3 className="terms-sub-header">Buying and Price Guide</h3>
        
        <p className="terms-paragraph">
          <strong>Gold Jewellery Guide</strong> - <br />
          <strong>How to buy Gold Jewellery online</strong> - Gold is an attractive metal and its attractive shine and color can cheat anyone if you do not visit a trustworthy online seller. Quality, price, exchange and buyback policy need to check before purchasing any gold item.
        </p>
        <p className="terms-paragraph">
          <strong>Trustworthy online seller</strong> - Before buying any gold jewellery you need to look an online trustworthy seller with good history. We are trustworthy seller with 50 years of experience in the market and sell right product with accurate quality at right price. We don’t hide any condition behind sell of the product. Our goal is customer satisfaction not a profit so you can trust on us.
        </p>
        <p className="terms-paragraph">
          <strong>Purity Standards</strong> - Before purchase anything from the seller you need to check, is seller have purity approved gold jewellery as per the government standards. Our all gold jewellery are BIS hallmarked approved. We match all the standards of gold purity recommended by government. So, you don’t need to worry.
        </p>
        <p className="terms-paragraph">
          <strong>Check Buyback and Exchange policy</strong> - Right online seller always provides buyback and Exchange policy and we are one of them our buyback and exchange policies are lifetime for our customers.
        </p>
        <p className="terms-paragraph">
          <strong>Is Buying Gold A investment</strong> - Looking at economy and market trend buying Gold Jewellery is an investment for all of us because this is the only commodity which easily liquidate and provide good rate of return. It’s rusts free, environment condition free and easily store anywhere. It’s a Universally accepted commodity. If you have ideal time and money, then we suggest it’s a best thing to invest.
        </p>
        <p className="terms-paragraph">
          <strong>Making Charge</strong> - Jewellery is not a piece of gold it’s a concept of a designer and hard work of jewellery maker. When you fall in love with a jewellery and wants to buy it. It’s mean you are going to buy hard work and design of jeweller. In price of that we apply making charge and rest is the metal cost as per the market. No extra benefit we are making here.
        </p>

        <p className="terms-paragraph">
          <strong>Diamond Jewellery Guide</strong> - <br />
          <strong>Buying Loose Diamond</strong> - You can buy loose diamond for design your own jewellery. Before buying loose diamond it’s important have some information about diamond.
        </p>
        <p className="terms-paragraph">
          <strong>Carat Weight</strong> - Carat weight is important thing to check before buying because slight difference in the carat may not make any difference in appearance but impact on the price.
        </p>
        <p className="terms-paragraph">
          <strong>Trustworthy online seller</strong> - If you are looking our website for buying loose diamond then you are at the right place because we are reputed seller and provide assured qualitative product.
        </p>
        
        <p className="terms-paragraph">
          <strong>Type of Diamond</strong> - Before buying diamond necklace, bangles, rings most of the people need clarity.
        </p>
        <ul className="terms-bullet-list">
          <li><strong>Natural Diamonds</strong> - A white shining rock comes out from mining is call white natural diamond.</li>
          <li><strong>Treated Diamonds</strong> - Initially these diamonds are natural when found in the mine but after some artificial enhancement and treatment to make them look better and shaped they become Treated Diamond.</li>
          <li><strong>Manmade Diamond</strong> - These diamonds are created by mans in the industry. Now days they are in the fashion because of less cost.</li>
          <li><strong>Natural colored Diamonds</strong> - They are rare in the numbers and can be found in red, blue, green and black color.</li>
        </ul>

        <p className="terms-paragraph">
          <strong>Buying a Solitaire in Budget</strong> - With us, you will be able to buy reasonable rate diamond for solitaire jewellery. Diamonds are graded as per the color and you can buy any diamond as per budget. If you want to buy larger diamond, then you need to compromise with color however in a white diamond metal impact on the color such as gold metal make diamond yellowish and platinum keep it white. A carat of diamond measure from its weight. Your diamond can lose its weight after polish. It’s not easy to find perfect diamond because they are so expensive.
        </p>
        <p className="terms-paragraph">
          However, we provide best quality and trustworthy diamond at best price in the market for your solitaire jewellery.
        </p>

        <h2 className="terms-header-section">Certification Guide</h2>
        
        <p className="terms-paragraph">
          <strong>BIS Hallmark</strong> - BIS Hallmark is a symbol of gold purity. We recommended you buy hallmarked jewellery only. Government provided some standards for gold jewellery and these standards are needs to follow by every jeweller. We provide only those Jewellery which have BIS Hallmark. Purest gold is 24K, but it can’t be converted into jewellery due to softness. To convert it into jewellery all jewellers mix a tiny quantity of copper and this is legal.
        </p>
        
        <p className="terms-paragraph">
          <strong>What is mention in the BIS hallmark?</strong>
        </p>
        <ul className="terms-bullet-list">
          <li>A triangle shape mark given on your jewellery and it is a symbol of purity.</li>
          <li>Purity grade of gold is mention on the jewellery with hallmark. Gold jewellery purity found in the Karat and denote with “K” word. In india 22K to 14K jewelleries are available in the market.</li>
          <li>With purity grade, 3-digit no. also mentioned on the jewellery. It discloses how much gold used in the jewellery. In 22K jewellery you will be found 916 written it means 91.6% gold has been used.</li>
        </ul>

        <p className="terms-paragraph">
          <strong>Reason to buy Hallmarked gold</strong>
        </p>
        <ul className="terms-bullet-list">
          <li>If you buy BIS hallmarked gold, then you don’t need to prove the purity of your gold jewellery.</li>
          <li>You can easily liquidate BIS hallmarked jewellery anywhere.</li>
          <li>You will get market price of gold easily.</li>
          <li>These types of jewellery are trustable and helpful in taking gold loan as well.</li>
        </ul>

        <p className="terms-paragraph">
          <strong>IGI</strong> - International Gemologist Institute provide certification to gems stone. It’s a largest authenticated and trustworthy independent lab. If you are looking for diamond and gemstone, make sure that your jeweller have certified products. It’s not easy to determine quality of diamond and you can not trust on anyone easily because you are investing your hard money. We understand all your situations and to provide you more secure and trustworthy product we have all certified diamond products for you.
          A certificate discloses originality of diamond it gives all the require details about purity and value of diamond which you can’t see from your naked eyes.
        </p>

        <p className="terms-paragraph">
          <strong>What information IGI provide:</strong>
        </p>
        <ul className="terms-bullet-list">
          <li>It mentions Diamond complete report such as carat, color, shape, cut. It also shows diamond is natural or lab grown.</li>
          <li>Diamond actual value will appear in the certificate.</li>
          <li>Gemstone exact variety name, color, weight, cut and shape.</li>
        </ul>

        <h2 className="terms-header-section">Diamond and Solitaire Guide</h2>
        
        <p className="terms-paragraph">
          <strong>Diamond Carat</strong> - This Carat word is not similar to Karat word. Karat word used for purity of metal such as 24K Gold. Carat weight is a way of measuring diamond. One carat is equals to 0.2 gram. Jewellers normally divide diamond into point so if you are buying 50 points rings then its diamond carat weight is 0.50 carat.
          The diamond with high carat weight is more expensive then less carat weight diamond but this is not only the reason of price difference there are some other reason also impact diamond price such as diamond clarity, color, shape and cut.
        </p>

        <p className="terms-paragraph">
          <strong>Diamond Clarity</strong> - Diamond clarity is another reason of its high price. When a diamond has higher clarity then it’s necessary to have lesser flaws. Some diamonds have microscopic flaws and gemologist use microscope to identify diamond flaws. There are multiple grades of diamonds such as FL and IF, VVS, SI3 or I1 range.
        </p>

        <p className="terms-paragraph">
          <strong>Diamond Color</strong> - Color is one of the characteristics of diamond. Color less diamonds are most expensive diamond due to their shine and grace. These diamonds look so fashionable and rich with gold and platinum. Very light color diamonds have low price range because they are less in demand. Faint color diamonds have appearance of light-yellow color which we can see easily. These diamonds are also not expensive.
        </p>

        <p className="terms-paragraph">
          <strong>Diamond Cuts and Shape</strong> - Diamonds cuts also impact the price of diamond. A brilliant cut of diamond shine much better than a roughly cut diamond. Princess diamond and cushion diamond are the types of diamond and princess diamond shines much better than any other diamond. Diamond is also one of the characteristics. People like diamond cuts as per their choice and we have all choices available under one roof such as oval, square, round etc.
        </p>
        <ul className="terms-bullet-list">
          <li><strong>Brilliance:</strong> When sunlight enters in this cut of diamond it shines more and give grace in your personality.</li>
          <li><strong>Step Cut Style:</strong> These types of diamonds have more edge and step cuts. Which shines against light.</li>
          <li><strong>Fancy Cut:</strong> These types of diamond have not any specific cut. They can come in heart, pear, oval cut.</li>
          <li><strong>Mixed Cut:</strong> This is most popular cut and it given a dimensional body to a diamond.</li>
        </ul>

        <p className="terms-paragraph">
          <strong>Solitaire</strong> - Solitaire diamond rings, necklace, earrings are in fashion now. These types of jewellery give a simple and sober personality to people. It’s a piece of jewellery with one diamond. We suggest these types of jewellery to our customers on their anniversary and special occasions.
          Our huge diamond collection can fulfill your requirement, you have to choose diamond only.
        </p>

        <p className="terms-paragraph">
          <strong>For selecting solitaire keep 4 C’s in your mind:</strong>
        </p>
        <ul className="terms-bullet-list">
          <li><strong>Cut</strong> - A brilliance cut of diamond always suit of solitaire jewellery. There are multiple cuts such as oval, round, cushion, princess, emerald, marquise etc. Right cut of diamond shine more and give grace to you and jewellery.</li>
          <li><strong>Color</strong> - White diamonds are in trend and they suit on gold and platinum both. These diamonds are more expensive but more your move towards light color diamonds you will find budget diamonds there.</li>
          <li><strong>Clarity</strong> - It’s also an important part of any diamond. Transparency and clarity of diamond increase their price, but they are perfectly cut diamond as well. Sometime clarity we can’t measure with naked eyes but in that case, we suggest you should buy only high-grade clarity diamonds.</li>
          <li><strong>Carat/weight</strong> - On basis of your jewellery size, you need to select carat of diamond. Jewellers use technical term and call weight or carat in the points 0.50 carat is equals to 50 point.</li>
        </ul>
        <p className="terms-paragraph">
          Some people think less carat diamond are less beautiful, but we suggest you don’t be confuse. There is no impact of carat on the beauty and shine of diamond. It’s all depends on the cut of diamond. It should be brilliance cut.
        </p>

        <h2 className="terms-header-section">Gemstone Guide</h2>
        
        <p className="terms-paragraph">
          <strong>Amethyst</strong> - This is a purple color attractive stone. Other colors are red and rose. It’s a birthstone for February. An amethyst range start from transparent to translucent. This stone can be cut in any shape. Carat aspect is not important for this stone.
        </p>
        <p className="terms-paragraph">
          <strong>Emerald</strong> - Emerald is most expensive stone even from diamond. It’s a birth stone of people who born in May. Emerald are pure deep green with blue green shade. Carat refers to the weight of a gemstone. During mining Emerald get fractured and from that fractured part it cuts in the different shape.
        </p>
        <p className="terms-paragraph">
          <strong>Pearls</strong> - Pearls are created by living creatures. It’s a white color, round, semi hard from diamond stone. Birthstone of June born people and zodiac sign of Gemini and Cancer.
        </p>
        <p className="terms-paragraph">
          <strong>Ruby</strong> - Ruby is a stone of kings and fall under category of expensive stones. It’s a deep purplish red color stone. Birthstone of July born people. It improves grace of your jewellery make them richer.
        </p>
        <p className="terms-paragraph">
          <strong>Sapphire</strong> - Very big name wear this stone such as Amitabh Bacchan, A.R. Rahman, Aishwarya Rai. It’s a royal blue colour stone good for September born people. Clear blue sapphire rare to found. Most commercial sapphire quality weigh less than 5 carats.
        </p>
        <p className="terms-paragraph">
          <strong>Topaz</strong> - When color is the all reason of purchase. This is a small size stone with blue and red color creates a different story of your jewellery. Yellow topaz is a birthstone of November born however the blue variant is the birthstone of December born. It’s a transparent gemstone even light can pass from this stone.
        </p>

        <h2 className="terms-header-section">Gifting Guide</h2>
        
        <p className="terms-paragraph">
          <strong>Gift to Your Mom</strong> - In this world it’s difficult to show your love physically for your Mom. We understand your requirement and we know what suits on her personality. We have unique design and sober jewellery which can make her personality classic.
        </p>
        <p className="terms-paragraph">
          <strong>Mother’s day Jewellery</strong> - We have a collection of jewellery which can make your mother’s day special.
        </p>
        <ul className="terms-bullet-list">
          <li><strong>Express your love with flower jewellery</strong> - You can express your love with your mother through flower design earring. They are look so simple and daily wearable items.</li>
          <li><strong>Pearls represent her personality</strong> - Pearls increase gold value. Pearl earrings and pearl necklace represent her flawless personality. It suits on the people whose age around 40-50.</li>
          <li><strong>Diamond shine on sober personality</strong> - Mother’s normally wear simple silk saree and diamond improve their grace in the saree. She will love this surprise.</li>
        </ul>

        <p className="terms-paragraph">
          <strong>Gift Gold to Your In Laws</strong> - In Laws are most important part of a girl life. After getting married on no. of occasions you would like to gift something unique to them. We can solve your trouble with our variety of ornaments.
        </p>
        <p className="terms-paragraph">
          <strong>Let’s Gift them as per occasion</strong> - We have special range for Diwali, Christmas, Birthday, Anniversaries and Life events. You can gift them pair of earrings on Birthday and Anniversaries, gold coins on Akshaya Tritiya and Diwali, Zodiac diamond pendant on your sister in law birthday, Bracelet on your brother in law marriage.
        </p>
        <p className="terms-paragraph">
          <strong>As per their Age</strong> - Gift them something which suit to their age and cloths. We have sober jewellery collection which suit on the age and cloths of your mother in law and father in law.
        </p>
        <p className="terms-paragraph">
          <strong>Get the Right Size</strong> - If you have issue of size then don’t need to be worry buy those things which have universal size such as earrings, nose pin, pendant.
        </p>

        <p className="terms-paragraph">
          <strong>Gift for your Wife</strong> - This is really tough to answer but we can guarantee you will find answer here only. We have huge range of jewellery with different designs and your wife will definitely love them. You need choose the jewellery as per occasion and she will love that.
        </p>
        <ul className="terms-bullet-list">
          <li><strong>If you are newly married</strong> - Gift her gold necklace, chain or ring on her birthday. It will express your love for her.</li>
          <li><strong>First Anniversary Gift</strong> - If you didn’t get diamond ring for her yet then this is your second chance to buy a unique diamond ring for her from us. It will represent your unbreakable and unconditional love like a diamond.</li>
          <li><strong>Valentine day Gift</strong> - It’s a right time to give something different from gold and diamond. Let’s give her Ruby studded jewellery or Gemstone jewellery.</li>
        </ul>

        <h2 className="terms-header-section">Jewellery Care Guide</h2>
        
        <p className="terms-paragraph">
          <strong>Caring for Gemstone</strong> - Gemstones shape, multiple colors and shine improve the grace of jewellary and make them different. It is necessary to keep them carefully because shine and their colors can be damage.
        </p>
        <ul className="terms-bullet-list">
          <li>Clean the Gemstone time to time with the help of thin and soft cloth.</li>
          <li>Do not put so much of pressure on gemstone. Diamond is a hardest stone, but gemstone can break according to their less hard body.</li>
          <li>Do not keep them in sunlight and heat because appearance can be damage.</li>
          <li>Store Gemstone ornaments separately from other Jewellery because if other metal Jewellery rub against your Gemstone jewellary it can cause of damage.</li>
          <li>Some gems such as pearls and opals need to store in fabric lining jewellary box only because they observe moisture from air.</li>
          <li>Don’t wear gemstone during makeup, gardening and travelling.</li>
        </ul>

        <p className="terms-paragraph">
          <strong>Caring for Gold</strong> - Nobody wants their gold ornaments lose their shine. So, what we will do to save their shine? Should we lock them in the locker? The answer is No.
          Daily use of gold ornaments is the reason of gold loses his shine, but we are not saying you should stop wearing them regularly. We are suggesting few ways to save your gold ornaments shine which are hassle free.
        </p>
        <ul className="terms-bullet-list">
          <li>Regular cleaning of gold ornaments through soft cloth is necessary. It removes the layer of dust and oil of your skin.</li>
          <li>Always use cosmetic and spray before wearing gold.</li>
          <li>Don’t sleep with wearing gold ornaments it can bent the shape.</li>
          <li>Soap and water solution are the best solution for cleaning gold. You should rub the ornaments gently with the help of soft cloth.</li>
          <li>To clean gold with gemstone ornament, use soft toothbrush under running water.</li>
          <li>Never scrub your jewellery.</li>
        </ul>

        <p className="terms-paragraph">
          <strong>Caring for Diamonds</strong> - Diamonds quality appears in his shine and his shine improve your grace. It’s necessary to keep few things in mind when use a diamond.
        </p>
        <ul className="terms-bullet-list">
          <li>Don’t use hair spray, cosmetics, lotion, makeup and perfume when you are having any diamond ring, earring, nose ring, necklace and bangles because they crate a layer on the diamond which make diamond appearance dirty and diamond lost his shine temporarily.</li>
          <li>Regularly cleaning of diamond is necessary because your skin oil, some small particles of dust in the environment remove their shine temporarily.</li>
          <li>Store them in the jewellary box.</li>
          <li>Don’t wear them regularly because they suit only on some special occasion example if you are on a beach for picnic and wear diamond ring then soil and salty water make diamond dirty temporarily.</li>
          <li>Touch diamond gently and softly. Diamond can’t be break but scrubbing and rubbing them without care can create scratch on the diamond and decrease the value. If you want to clean them then reach out to your nearest trustworthy jeweller shop.</li>
        </ul>

        <h2 className="terms-header-section">Policies</h2>
        
        <p className="terms-paragraph">
          <strong>Lifetime buy back and Exchange Policy</strong> - Zoniraz gives an opportunity of product exchange and buy back at the current market value after deduction of making charge and processing charges.
        </p>
        <p className="terms-paragraph">
          <strong>Lifetime Exchange Policy</strong> - If you have original product certificate then we can exchange the product as per the purity, quality and market value in the no time. Please note making charges are not count with the product value.
        </p>
        <p className="terms-paragraph">
          <strong>Lifetime Buy Back Policy</strong> - In case of Buy Back, product value calculated at market rate after all the satisfactory check. Amount will be paid to the customer via bank transfer.
        </p>
        <p className="terms-paragraph">
          Both are the policies are implemented after the quality inspection of the product. Zoniraz reserve the right to change the Exchange and Buy-Back amount of the product.
        </p>

        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '30px' }}>
          <table className="terms-policy-table" style={{ minWidth: '600px', margin: '0' }}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Exchange Value</th>
                <th>Buy Back Value</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Diamond</strong></td>
                <td>100% of diamond value at current market rate</td>
                <td>90% of diamond value at current market rate</td>
                <td>Available</td>
              </tr>
              <tr>
                <td><strong>Gold Jewellery</strong></td>
                <td>100% of gold value at market rate</td>
                <td>95% of Gold value at market rate</td>
                <td>Available</td>
              </tr>
              <tr>
                <td><strong>Coins</strong></td>
                <td>100% of gold value at market rate</td>
                <td>100% of gold value at market rate</td>
                <td>Available</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="terms-paragraph">
          <strong>Cancellation and Return Policy</strong> - <br />
          <strong>Cancellation Policy</strong> - Zoniraz reserves all the rights of cancellation any order at the time of discrepancy. We also have the right to check information and purpose of buying product in few cases. We will inform you, if your order cancelled partially or completely.
        </p>
        <p className="terms-paragraph">
          <strong>Return Policy</strong> - We suggest before ordering any product you should ensure your self that you are ordering right product from our site. We provide you enough time for taking any decision before order.
          Zoniraz reserves all the rights of accepting return request of the product and in some cases, we do not accept any return because we are providing prime product with excellence service to our customer.
        </p>
        <p className="terms-paragraph">
          <strong>Procedure of Availing Policy</strong> - Call our customer care team at 18005726599 or email us at customercare@zoniraz.com and place your exchange / return request.
        </p>
        <p className="terms-paragraph">
          Make sure that during return you should give payment invoice, certificate of jewellery, product, jewellery box in a good condition, product and packet should be packed in the same form it was delivered. Do not give open packet to our return product collection representative. After quality and design check within 10 working days refund will be processed.
        </p>
        <p className="terms-paragraph">
          <strong>Non-Acceptance of Return</strong> - Damaged product will not be accepted and refunded. Any item reworked, customized design by third party jeweller will not be exchanged and refund. Without original certificate and invoice product will not be accepted. Zoniraz reserves all the right of decline any return and exchange of product.
          The policy applicable for order delivered within India.
        </p>
        <p className="terms-paragraph">
          <strong>Shipping Charges in case of Return</strong> - We charge reasonable shipping charge from customer in case of return and it will be deducted from the cost of product you have paid us during product purchase.
        </p>

        <p className="terms-paragraph">
          <strong>Payment Policy</strong> - We do not provide Cash on Delivery policy to our customers for saving them from fraudulent activity. Zoniraz encourage online payment and provides hassle free payment gateway at the time of ordering product from our ecommerce website.
        </p>

        <p className="terms-paragraph">
          <strong>Delivery Duration</strong> - Zoniraz understand your excitement after purchasing the prime product from us. This is the only reason we try to deliver your product as soon as possible after order. Before proceeding towards shipping we did all the quality and design checks of product.
          We provide free delivery all over India to our customers. Shipping time takes 24-48hrs for “Available in stocks” and 2 weeks to make it deliver.
        </p>

        <h2 className="terms-header-section">Shop with Confidence</h2>
        
        <h3 className="terms-sub-header">Why Buy From US?</h3>
        <p className="terms-paragraph">
          <strong>Customer Satisfaction</strong> - We believe in customer satisfaction and our goal is to provide best quality of product to our customer at right price.
        </p>
        <p className="terms-paragraph">
          <strong>Trustworthy Product Quality</strong> - Our product fulfills all the benchmarks of government in sense of authenticity and purity of product. Diamond and Gold Jewellery you buy from us are delivered with the certificate of authenticity. It creates trust between you and us.
        </p>
        <p className="terms-paragraph">
          <strong>Unique Design</strong> - We have so many designs of jewellery to impress you. All the designs are unique and lovable. The collection you will find here are not available anywhere.
        </p>
        <p className="terms-paragraph">
          <strong>Competitive Price</strong> - We have own manufacturing house which provides our customer less price as compare to another seller. Also, there is no mediator between you and us it creates more margin in the competitive price. Metal price always vary as per the market rate.
        </p>
        <p className="terms-paragraph">
          <strong>Lifetime Exchange</strong> - If you are felling bored from one design then it’s time to get in touch with us. We will exchange your jewellery based on current market value and after deduction of making charge in the no time.
        </p>
        <p className="terms-paragraph">
          <strong>Lifetime Buy Back</strong> - We understand your needs, and this is the only reason buy back facility is available for our customer. After authenticity and quality check we will pay you market value of the product.
        </p>
        <p className="terms-paragraph">
          <strong>Our Certifications</strong> - All the Jewellery are certified from prestigious laboratories and government recommended quality marks such as BIS hallmark, INGEMCO.
        </p>

        <h2 className="terms-header-section">Customer Delight</h2>
        <p className="terms-paragraph" style={{ fontWeight: '600', fontSize: '16px', color: '#2C2520' }}>
          Contact Us - 9784836060 - shantnu
        </p>
      </div>
    </div>
  );
}
