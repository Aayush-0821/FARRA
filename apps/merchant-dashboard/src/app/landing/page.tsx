import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/landing-page.png')",
      }}
    >
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Content */}
      <div className="relative z-10 mx-auto min-h-screen max-w-350 px-6 md:px-10">
        {/* Navbar */}
        <nav className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-medium tracking-[-0.08em]"
          >
            F
          </Link>

          {/* Navigation */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm text-white/90 md:flex">
            <Link
              href="#product"
              className="transition-opacity hover:opacity-70"
            >
              Product
            </Link>

            <Link
              href="#pricing"
              className="transition-opacity hover:opacity-70"
            >
              Pricing
            </Link>

            <Link
              href="#blog"
              className="transition-opacity hover:opacity-70"
            >
              Blog
            </Link>
          </div>

          {/* Get Started */}
          <Link
            href="/signup"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black shadow-sm transition-transform hover:scale-105"
          >
            Get started
          </Link>
        </nav>

        {/* Hero */}
        <section className="flex min-h-[calc(100vh-80px)] flex-col items-center pt-20 text-center md:pt-24">
          <h1 className="max-w-4xl text-[clamp(4rem,8vw,7rem)] font-light leading-[0.9] tracking-[-0.07em]">
            Recover revenue.
            <br />
            Automatically.
          </h1>

          {/* Prompt */}
          <div className="mt-10 flex w-full max-w-xl items-center rounded-full bg-white/20 p-1.5 backdrop-blur-md">
            <div className="flex-1 px-5 text-left text-sm text-white/80">
              How much revenue can FARRA recover?
            </div>

            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-lg text-black transition-transform hover:scale-105"
              aria-label="Submit"
            >
              ↑
            </button>
          </div>

          {/* Description */}
          <p className="mt-7 max-w-xl text-base leading-6 text-white/80 md:text-lg">
            FARRA helps merchants identify revenue at risk and recover lost
            payments automatically with intelligent recovery workflows.
          </p>

          {/* CTA */}
          <div className="mt-7">
            <Link
              href="/signup"
              className="inline-flex rounded-full bg-white px-7 py-3 text-sm font-medium text-black shadow-sm transition-transform hover:scale-105"
            >
              Get started
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}