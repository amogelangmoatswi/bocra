"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function PageBreadcrumbs() {
  const pathname = usePathname();

  // Don't render breadcrumbs on the home page
  if (pathname === "/") return null;

  // Split pathname into segments and remove empty strings
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Format segment for display (capitalize and replace dashes with spaces)
  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-muted/30 border-b border-border/50 py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center text-sm">
        <ol className="flex items-center gap-2 flex-wrap">
          {/* Home Link */}
          <li>
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-bocra-blue flex items-center transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>

          {/* Dynamic Segments */}
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

            return (
               <li key={href} className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                {isLast ? (
                  <span className="font-semibold text-foreground" aria-current="page">
                    {formatSegment(segment)}
                  </span>
                ) : (
                  <Link 
                    href={href} 
                    className="text-muted-foreground hover:text-bocra-blue transition-colors"
                  >
                    {formatSegment(segment)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
