import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Logo } from "./logo";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { InstagramLogoIcon, TwitterLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

const socialIconMap: Record<string, React.ElementType> = {
  Instagram: InstagramLogoIcon,
  Twitter: TwitterLogoIcon,
  Facebook: LinkedInLogoIcon, // Fallback
  Youtube: LinkedInLogoIcon, // Fallback
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <Container className="section-padding">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Premium nutrition and training programs to fuel your fitness
              journey. Built for athletes who demand the best.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">
                Subscribe to our newsletter
              </p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 max-w-[220px]"
                  aria-label="Email for newsletter"
                />
                <Button size="icon" className="h-10 w-10 shrink-0" aria-label="Subscribe">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-brand hover:text-brand hover:scale-110"
                    aria-label={social.label}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gym Nation. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Powered by Next.js & Supabase
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
