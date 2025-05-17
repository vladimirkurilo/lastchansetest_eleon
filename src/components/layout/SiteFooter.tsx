
export function SiteFooter() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SmartStay. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <a href="#" className="text-sm hover:underline underline-offset-4 text-muted-foreground">
            Terms of Service
          </a>
          <a href="#" className="text-sm hover:underline underline-offset-4 text-muted-foreground">
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
