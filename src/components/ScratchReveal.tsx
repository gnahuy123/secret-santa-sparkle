import { useRef, useEffect, useState } from 'react';
import { SoundManager } from '@/lib/SoundManager';
import { cn } from '@/lib/utils';

interface ScratchRevealProps {
    children: React.ReactNode;
    onReveal?: () => void;
    className?: string;
}

export const ScratchReveal = ({ children, onReveal, className }: ScratchRevealProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeObserver = new ResizeObserver(() => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            // Reset logic
            ctx.fillStyle = '#C0C0C0'; // Silver color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add festive pattern/text
            ctx.globalCompositeOperation = 'source-over';
            ctx.font = '20px serif';
            ctx.fillStyle = '#808080';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🎄 SCRATCH ME 🎄', canvas.width / 2, canvas.height / 2);
        });

        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, []);

    const getPos = (e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing || isRevealed) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pos = getPos(e);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.fill();

        // Play scratch sound occasionally
        if (Math.random() > 0.7) {
            SoundManager.playScratch();
        }

        checkReveal();
    };

    const checkReveal = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] < 128) {
                transparent++;
            }
        }

        const percent = transparent / (pixels.length / 4);
        if (percent > 0.5) {
            setIsRevealed(true);
            onReveal?.();
            SoundManager.playWin();
        }
    };

    return (
        <div ref={containerRef} className={cn("relative overflow-hidden rounded-lg select-none", className)}>
            <div>
                {children}
            </div>
            <canvas
                ref={canvasRef}
                className={cn(
                    "absolute inset-0 z-10 cursor-pointer touch-none transition-opacity duration-1000",
                    isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onMouseMove={(e) => scratch(e as unknown as MouseEvent)}
                onTouchStart={() => setIsDrawing(true)}
                onTouchEnd={() => setIsDrawing(false)}
                onTouchMove={(e) => scratch(e as unknown as TouchEvent)}
            />
        </div>
    );
};
