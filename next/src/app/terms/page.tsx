export const metadata = {
  title: 'Terms of Service | Bin Suleman Real Estate & Builders',
  description:
    'Bin Suleman Real Estate & Builders terms of service governing the use of our website and services.',
} as const;

export default function TermsPage() {
  return (
    <main className="w-full bg-surface min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="prose lg:prose-xl text-left text-on-surface">
          <h1 className="font-display-xl text-4xl sm:text-5xl mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric })}</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Agreement to Terms</h2>
          <p className="mb-6">
            These terms of service set forth the terms and conditions governing the use of this website. By accessing this website, you accept these terms and conditions. If you disagree with any part of these terms, you may not access the site.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Use of Our Website</h2>
          <p className="mb-6">
            You must be at least 18 years of age to use this website. By using this website, you represent and warrant that you are at least 18 years of age. You may not use this website for any illegal or unauthorized purpose. You must not, in the use of the website, violate any laws in your jurisdiction, including but not limited to copyright laws.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Intellectual Property</h2>
          <p className="mb-6">
            All content included on this website, such as text, graphics, logos, button designs, images, digital downloads, data, and software is the property of Bin Suleman Real Estate & Builders or its content suppliers and is protected by international copyright laws. The collection and organization of content on this website is the exclusive property of Bin Suleman Real Estate & Builders and is protected by international laws.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Links To Third-Party Websites</h2>
          <p className="mb-6">
            This website may contain links to third-party websites or services that are not operated by us. We have no control over the content, privacy policies, or practices of any third-party sites or services, and we do not assume any responsibility therefor. The inclusion of any links does not imply endorsement or association with the linked site.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Limitation of Liability</h2>
          <p className="mb-6">
            In no event shall Bin Suleman Real Estate & Builders, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation lost profits, data, use, or other intangible losses, resulting from (i) your access to or use of the website, or (ii) any conduct or content of third parties on the website. Some jurisdictions do not allow the exclusion of liability for consequential or incidental damages, so the above limitation may not apply to you.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Indemnification</h2>
          <p className="mb-6">
            You agree to indemnify, defend, and hold harmless Bin Suleman Real Estate & Builders and its licensee and/or licensor, and their directors, employees, and affiliates, from and against any and all claims, losses, damages, liabilities, costs and expenses, including reasonable attorneys' fees, resulting from or arising out of your use of the website, your connection to the website, or a violation of these terms.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">General Conditions</h2>
          <p className="mb-6">
            These terms and conditions are applicable to your use of this website. By using this website, you agree to comply with these terms and conditions. These terms and conditions apply to all visitors, users, and others who access or use the website.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Changes to These Terms</h2>
          <p className="mb-6">
            Bin Suleman Real Estate & Builders reserves the right, at its sole discretion, to modify or replace these terms and conditions at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Contact Us</h2>
          <p className="mb-6">
            If you have any questions about these terms and conditions, please contact us:</p>
          <div className="bg-surface-container-high/5 rounded-lg p-6 mb-6">
            <p className="font-body-md">
              <strong>Bin Suleman Real Estate & Builders</strong><br />
              Suite 104, Main Commercial Boulevard,<br />
              DHA Phase 9 Prism, Lahore, Pakistan<br />
              <a href="mailto:info@binsuleman.com">info@binsuleman.com</a>
            </p>
          </div>
        </div>
      </main>
    </main>
  );
}