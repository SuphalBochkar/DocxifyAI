import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Integrations", href: "/integrations" },
      { name: "Roadmap", href: "/roadmap" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "Support", href: "/support" },
      { name: "API Reference", href: "/api" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
    ],
  }

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl mr-3">
                D
              </div>
              <span className="text-xl font-bold text-slate-800">Docxify</span>
            </div>
            <p className="mt-4 text-slate-600 max-w-xs">
              Advanced AI document processing that extracts, analyzes, and retrieves missing information from your
              documents.
            </p>
            <div className="mt-6">
              <Link
                href="/demo"
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Request a demo
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">&copy; {currentYear} Docxify. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="text-slate-500 hover:text-blue-600 text-sm">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
