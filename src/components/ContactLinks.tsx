const LINKS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:hello@example.com" },
];

export function ContactLinks() {
  return (
    <nav className="contact-links" aria-label="contact">
      {LINKS.map((link) => (
        <a key={link.label} href={link.href} className="contact-links__item">
          {link.label}
        </a>
      ))}
    </nav>
  );
}
