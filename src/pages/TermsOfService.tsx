import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container max-w-3xl prose prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
        <h1>Terms of Service</h1>
        <p><strong>Effective date:</strong> April 9, 2026</p>

        <p>Welcome to SuperJobs Kenya. By accessing or using our website at superjobskenya.com (the "Service"), you agree to be bound by these Terms of Service.</p>

        <h2>1. Description of Service</h2>
        <p>SuperJobs Kenya is a free job listing aggregator that connects Kenyan job seekers with employment opportunities at leading supermarket chains including Quickmart, Naivas, Carrefour, and Cleanshelf. We provide information about available positions and redirect users to official employer career portals.</p>

        <h2>2. No Employment Relationship</h2>
        <p>SuperJobs Kenya is <strong>not</strong> an employer, staffing agency, or recruitment firm. We do not participate in hiring decisions, salary negotiations, or employment contracts. All employment relationships are solely between you and the respective employer.</p>

        <h2>3. Accuracy of Information</h2>
        <p>While we strive to keep job listings current and accurate, we make no warranties or representations regarding the accuracy, completeness, or timeliness of any information on this site. Job availability is subject to change without notice.</p>

        <h2>4. Third-Party Websites</h2>
        <p>Our Service contains links to third-party employer websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of these sites. You access third-party websites at your own risk.</p>

        <h2>5. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to gain unauthorised access to any part of the Service</li>
          <li>Use automated systems to scrape or extract data from the Service</li>
          <li>Interfere with the proper functioning of the Service</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>All content on this website, including text, graphics, logos, and design, is the property of SuperJobs Kenya or its content suppliers and is protected by intellectual property laws. Supermarket logos and brand names belong to their respective owners.</p>

        <h2>7. Disclaimer of Warranties</h2>
        <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free.</p>

        <h2>8. Limitation of Liability</h2>
        <p>In no event shall SuperJobs Kenya be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.</p>

        <h2>9. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to conflict of law provisions.</p>

        <h2>10. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

        <h2>11. Contact</h2>
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

export default TermsOfService;
