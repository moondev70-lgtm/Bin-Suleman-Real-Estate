export const metadata = {
  title: 'Privacy Policy | Bin Suleman Real Estate & Builders',
  description:
    'Bin Suleman Real Estate & Builders privacy policy explaining how we collect, use, and protect your personal information.',
} as const;

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full bg-surface min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="prose lg:prose-xl text-left text-on-surface">
          <h1 className="font-display-xl text-4xl sm:text-5xl mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} </p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Introduction</h2>
          <p className="mb-6">
            At Bin Suleman Real Estate & Builders ('we', 'our', or 'us'), we are committed to protecting your privacy. This privacy policy explains how we collect, use, and safeguard your personal information when you visit our website at <code>binsuleman.com</code> or interact with our services.
          </p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Information We Collect</h2>
          <h3 className="font-headline-md text-headline-md mb-3">Personal Information</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Name and contact details when you voluntarily provide them through our contact forms or WhatsApp inquiries</li>
            <li>Email address and phone number for communication purposes</li>
            <li>Inquiry details regarding property interests, preferences, and requirements</li>
          </ul>
          <h3 className="font-headline-md text-headline-md mb-4">Automatically Collected Information</h3>
          <ul className="list-disc list-inside mb-4">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring and exit pages</li>
          </ul>
          <h2 className="font-headline-lg text-headline-lg mb-4">How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-6">
            <li>To respond to your inquiries and provide property-related information</li>
            <li>To improve our website and services</li>
            <li>To communicate with you about new listings, services, or updates</li>
            <li>To analyze trends and usage patterns</li>
          </ul>
          <h2 className="font-headline-lg text-headline-lg mb-4">Cookies</h2>
          <p className="mb-6">We may use cookies and similar tracking technologies to enhance your experience, analyze usage, and serve personalized content. You can control cookie preferences through your browser settings.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Data Security</h2>
          <p className="mb-6">We implement appropriate data security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Third-Party Links</h2>
          <p className="mb-6">Our website may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Your Rights</h2>
          <ul className="list-disc list-inside mb-6">
            <li>You have the right to access, correct, or delete personal information we hold about you</li>
            <li>You may withdraw consent at any time where we process your data based on consent</li>
            <li>You may object to processing of your personal data for direct marketing</li>
          </ul>
          <h2 className="font-headline-lg text-headline-lg mb-4">Changes to This Policy</h2>
          <p className="mb-6">We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page, and the 'Last updated' date will be revised. We encourage you to review this privacy policy periodically for any changes.</p>
          <h2 className="font-headline-lg text-headline-lg mb-4">Contact Us</h2>
          <p className="mb-6">If you have any questions or concerns about this privacy policy or our data practices, please contact us:</p>
          <div className="bg-surface-container-high/5 rounded-lg p-6 mb-6">
            <p className="font-body-md">
              <strong>Bin Suleman Real Estate & Builders</strong><br />
              Suite 104, Main Commercial Boulevard,<br />
              DHA Phase 9 Prism, Lahore, Pakistan<br />
              <a href="mailto:info@binsuleman.com">info@binsuleman.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}