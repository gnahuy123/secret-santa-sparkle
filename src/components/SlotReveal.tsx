import { useEffect, useState } from 'react';
import { SoundManager } from '@/lib/SoundManager';
import { Button } from './ui/button';
import { Gamepad2 } from 'lucide-react';

interface SlotRevealProps {
    target: string;
    onReveal?: () => void;
    candidates?: string[];
}

export const SlotReveal = ({ target, onReveal, candidates }: SlotRevealProps) => {
    const [currentName, setCurrentName] = useState('?');
    const [isSpinning, setIsSpinning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Names to cycle through
    const defaultNames = [
        'Santa Claus', 'Rudolph', 'Elf #1', 'Frosty',
        'The Grinch', 'Mrs. Claus', 'Buddy the Elf',
        'Scrooge', 'Jack Skellington'
    ];

    const pool = (candidates && candidates.length > 0) ? candidates : defaultNames;

    const startSpin = () => {
        if (isSpinning || isFinished) return;
        setIsSpinning(true);

        let spins = 0;
        const maxSpins = 30; // Number of name changes before stopping
        const initialDelay = 50;

        const spin = (delay: number) => {
            if (spins >= maxSpins) {
                // Stop on target
                setCurrentName(target);
                setIsSpinning(false);
                setIsFinished(true);
                onReveal?.();
                SoundManager.playWin();
                return;
            }

            SoundManager.playSpin();
            setCurrentName(pool[Math.floor(Math.random() * pool.length)]);
            spins++;

            // Slow down effect
            const nextDelay = delay + (spins > 20 ? 20 : 0) + (spins > 25 ? 50 : 0);
            setTimeout(() => spin(nextDelay), delay);
        };

        spin(initialDelay);
    };

    return (
        <div className="text-center">
            <div className="bg-background border-4 border-christmas-gold rounded-xl p-8 mb-6 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <div className="text-4xl md:text-6xl font-display font-bold text-christmas-red animate-pulse">
                    {currentName}
                </div>
            </div>

            {!isSpinning && !isFinished && (
                <Button
                    size="lg"
                    onClick={startSpin}
                    className="w-full text-lg h-16 bg-christmas-red hover:bg-christmas-red/90 glow-animation"
                >
                    <Gamepad2 className="w-6 h-6 mr-2" />
                    SPIN TO REVEAL!
                </Button>
            )}

            {isSpinning && (
                <p className="text-muted-foreground animate-bounce">
                    Finding your match...
                </p>
            )}
        </div>
    );
};
