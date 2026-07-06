// Reusable glass card shell with an icon header and a staggered entrance.
// `index` drives the animation delay so cards cascade in on load.
const Card = ({ title, icon: Icon, index = 0, action, children, className = "" }) => {
  return (
    <section
      className={`glass-card p-5 animate-card-in ${className}`}
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      {(title || Icon || action) && (
        <header className="mb-5 flex items-center gap-3">
          {Icon && (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/20">
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
            </span>
          )}
          {title && (
            <h2 className="flex-1 text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
};

export default Card;
