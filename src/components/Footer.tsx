'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: ['Features', 'Pricing', 'Security', 'FAQ'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy', 'Terms', 'Compliance', 'Contact'],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <footer className="w-full bg-[#1a1a1a] border-t border-[#333333] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-2xl font-bold text-[#f4a426] mb-4">ZETU</h3>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              Send money home in your language, with your voice.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-[#242424] border border-[#333333] rounded-lg flex items-center justify-center hover:border-[#f4a426] transition"
              >
                <span className="text-[#f4a426] text-lg">𝕏</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#242424] border border-[#333333] rounded-lg flex items-center justify-center hover:border-[#f4a426] transition"
              >
                <span className="text-[#f4a426]">f</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#242424] border border-[#333333] rounded-lg flex items-center justify-center hover:border-[#f4a426] transition"
              >
                <span className="text-[#f4a426]">in</span>
              </a>
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={itemVariants} className="col-span-1">
              <h4 className="text-[#fafaf6] font-semibold mb-4 text-sm uppercase tracking-widest">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#6b7280] hover:text-[#f4a426] transition text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: '-50px' }}
          className="border-t border-[#333333] pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-[#6b7280] text-sm">
            © {currentYear} Zetu. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[#6b7280] text-sm">
              Made with intention for the diaspora.
            </p>
          </div>
        </motion.div>

        {/* Floating Element */}
        <motion.div
          className="fixed bottom-8 right-8 hidden lg:block"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-16 h-16 bg-[#f4a426] rounded-full flex items-center justify-center shadow-lg shadow-[#f4a426]/50">
            <svg
              className="w-8 h-8 text-[#1a1a1a]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
