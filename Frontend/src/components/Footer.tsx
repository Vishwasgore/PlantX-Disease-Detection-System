import { Leaf, Github, Heart, ExternalLink } from "lucide-react";

const Footer = () => {
  const links = [
    { label: "Home", href: "#home" },
    { label: "Analyze", href: "#upload" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-foreground" />
      
      {/* Organic shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2" />
      
      <div className="relative pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Main footer content */}
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            
            {/* Brand section */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-leaf flex items-center justify-center shadow-soft">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-xl text-foreground">PlantX</p>
                  <p className="text-sm text-muted-foreground">AI for Smart Agriculture</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                PlantX uses cutting-edge AI to help farmers, students, and researchers 
                identify plant diseases quickly and accurately.
              </p>
              
              <div className="flex items-center gap-3">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-secondary/80 hover:bg-secondary flex items-center justify-center transition-colors hover-lift"
                >
                  <Github className="w-4 h-4 text-foreground" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-3 md:col-start-8">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Navigation
              </h4>
              <nav className="space-y-2">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Project info */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Project
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>College Project 2024</p>
                <p>Academic Showcase</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              PlantX – AI-Powered Plant Disease Detection & Advisory System
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 text-destructive fill-destructive" /> for Farmers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
