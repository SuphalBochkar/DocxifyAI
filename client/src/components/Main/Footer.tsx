import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [{ name: "Features", href: "/features" }],
    company: [{ name: "About Us", href: "/about" }],
    resources: [{ name: "Documentation", href: "/docs" }],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
    ],
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Main footer content in one row */}
        <div className="flex flex-wrap items-start justify-between">
          {/* Brand and description */}
          <div className="w-full md:w-auto md:max-w-xs mb-4 md:mb-0 mr-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white font-bold text-sm mr-2">
                D
              </div>
              <span className="text-lg font-bold text-slate-800">DocxifyAI</span>
            </div>
            <p className="text-sm text-slate-600 mt-2 leading-snug">
              Advanced AI document processing for your documents.
            </p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Product</h3>
              <ul className="mt-2 space-y-1">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">Company</h3>
              <ul className="mt-2 space-y-1">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">Resources</h3>
              <ul className="mt-2 space-y-1">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="flex flex-wrap justify-between items-center pt-4 mt-4 border-t border-slate-200 text-xs text-slate-500">
          <p className="order-1 md:order-none">&copy; {currentYear} DocxifyAI. All rights reserved.</p>
          <div className="flex gap-4 order-none md:order-1">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
