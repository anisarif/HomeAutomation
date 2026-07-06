import { Home, SlidersHorizontal } from "lucide-react";

const Navbar = ({ handleClick }) => {
    return (
        <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/70 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 lg:px-12">
                <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/20">
                        <Home size={18} aria-hidden="true" />
                    </span>
                    <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                        Home<span className="text-accent">Automation</span>
                    </h1>
                </div>
                <button
                    type="button"
                    onClick={handleClick}
                    title="Toggle Admin Panel"
                    aria-label="Toggle Admin Panel"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-surface/50 text-muted transition-colors hover:text-foreground active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                    <SlidersHorizontal size={18} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
