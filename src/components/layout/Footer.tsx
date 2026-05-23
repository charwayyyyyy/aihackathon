import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <h3 className="text-2xl font-serif mb-6 tracking-tighter">MENSAH</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Crafting timeless elegance for the modern gentleman. 
              Our commitment to excellence is woven into every stitch.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 font-bold">Shopping</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-luxury transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=suits" className="hover:text-luxury transition-colors">Suits & Blazers</Link></li>
              <li><Link href="/shop?category=shirts" className="hover:text-luxury transition-colors">Formal Shirts</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-luxury transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 font-bold">Customer Care</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/contact" className="hover:text-luxury transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-luxury transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-luxury transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="hover:text-luxury transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 font-bold">Stay Connected</h4>
            <p className="text-sm text-white/50 mb-6">Join our newsletter for exclusive access to new collections and events.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent border-b border-white/20 py-2 flex-1 text-sm focus:border-luxury outline-none transition-colors"
              />
              <button className="border-b border-white/20 py-2 px-4 text-xs uppercase tracking-widest hover:text-luxury transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-white/30">
          <p>© 2024 Mensah. All Rights Reserved.</p>
          <div className="flex space-x-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
