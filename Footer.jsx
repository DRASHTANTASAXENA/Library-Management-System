export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          © 2026 Library Management System
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">System Online</span>
        </div>
      </div>
    </footer>
  );
}