import { Github } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {children}
            </main>

            <footer className="py-6 text-center text-sm text-muted-foreground bg-background/50 backdrop-blur-sm border-t border-border/50 relative z-10">
                <p className="flex items-center justify-center gap-1">
                    Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
                    <a
                        href="https://gnahuy123.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-christmas-gold transition-colors inline-flex items-center gap-1 hover:underline underline-offset-4"
                    >
                        gnahuy123
                        <Github className="w-3 h-3" />
                    </a>
                </p>
            </footer>
        </div>
    );
};
