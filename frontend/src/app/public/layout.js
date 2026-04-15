import Link from 'next/link'
import Image from 'next/image'

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border/50 bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 md:px-8">
          <Link
            href="/"
            className="text-foreground hover:text-foreground/90 flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image
              src="/file.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
              unoptimized
            />
            <span className="text-base font-semibold tracking-tight md:text-lg">
              Gerenciador de torneio
            </span>
          </Link>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
