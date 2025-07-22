import Link from "next/link"

export function Header() {
  return (
    <>
      {/* Header para mobile con hamburger alineado a la derecha */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm sm:hidden">
        <Link href="/" className="text-2xl font-bold tracking-tighter font-serif">
          Portal Bosque <em>Lab</em>
        </Link>
        <div className="relative ml-auto">
          <input id="menu-toggle" type="checkbox" className="peer hidden" />
          <label htmlFor="menu-toggle" className="flex flex-col justify-center items-center w-9 h-9 cursor-pointer">
            <span className="block w-6 h-0.5 bg-black dark:bg-white mb-1 transition-all duration-300"></span>
            <span className="block w-6 h-0.5 bg-black dark:bg-white mb-1 transition-all duration-300"></span>
            <span className="block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300"></span>
          </label>
          <nav className="absolute right-0 mt-2 w-40 rounded-lg bg-background border shadow-lg flex-col items-start gap-2 p-4 opacity-0 pointer-events-none scale-95 transition-all duration-200 peer-checked:opacity-100 peer-checked:pointer-events-auto peer-checked:scale-100 z-50">
            <a href="https://www.portalbosque.com/agenda" target="_blank" rel="noopener noreferrer" className="block py-2 px-2 hover:underline">Agenda</a>
            <a href="https://www.portalbosque.com/conoce" target="_blank" rel="noopener noreferrer" className="block py-2 px-2 hover:underline">Conocé+</a>
            <a href="https://www.portalbosque.com/membresia" target="_blank" rel="noopener noreferrer" className="block py-2 px-2 hover:underline">Membresía</a>
          </nav>
        </div>
      </header>

      {/* Header desktop: título a la izq, links a la der, Inter, con márgenes */}
      <div className="hidden sm:flex items-center justify-between px-8 py-8 border-b bg-background/80 backdrop-blur-sm">
        <Link href="/" className="text-4xl font-bold tracking-tighter font-serif">
          Portal Bosque <em>Lab</em>
        </Link>
        <nav className="flex gap-6 font-sans text-base" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
          <a href="https://www.portalbosque.com/agenda" target="_blank" rel="noopener noreferrer" className="hover:underline">Agenda</a>
          <a href="https://www.portalbosque.com/conoce" target="_blank" rel="noopener noreferrer" className="hover:underline">Conocé+</a>
          <a href="https://www.portalbosque.com/membresia" target="_blank" rel="noopener noreferrer" className="hover:underline">Membresía</a>
        </nav>
      </div>
    </>
  )
} 