import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container max-w-3xl prose prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> April 9, 2026</p>

        <p>SuperJobs Kenya ("we", "us", or "our") operates the superjobskenya.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our Service.</p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, time spent on the site, browser type, device information, and referring URLs.</li>
          <li><strong>Cookies &amp; Tracking:</strong> We use cookies and similar technologies to analyse traffic and improve your experience.</li>
        </ul>
        <p>We do <strong>not</strong> collect personal information such as names, email addresses, or phone numbers through this website. When you click "Apply Now," you are redirected to third-party employer websites whose privacy policies govern any data you provide to them.</p>

        <h2>2. How We Use Information</h2>
        <ul>
          <li>To operate and maintain the website</li>
          <li>To analyse usage and improve content and user experience</li>
          <li>To detect and prevent fraud or abuse</li>
        </ul>

        <h2>3. Third-Party Links</h2>
        <p>Our site contains links to external employer career portals (Quickmart, Naivas, Carrefour, Cleanshelf). We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies before submitting personal information.</p>

        <h2>4. Cookies</h2>
        <p>Cookies are small data files stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some portions of our Service may not function properly without cookies.</p>

        <h2>5. Data Security</h2>
        <p>We value your trust and strive to use commercially acceptable means to protect any data collected. However, no method of transmission over the Internet is 100% secure.</p>

        <h2>6. Children's Privacy</h2>
        <p>Our Service does not address anyone under the age of 18. We do not knowingly collect information from children under 18.</p>

        <h2>7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.</p>

        <h2>8. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, contact us at:</p>
        <address className="not-italic">
          SuperJobs Kenya<br />
          209 Lenana Road, Nairobi, Kenya<br />
          Phone: +254 105 575 260
        </address>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
