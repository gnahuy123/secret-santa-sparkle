export class SoundManager {
    private static context: AudioContext | null = null;

    private static getContext(): AudioContext {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.context;
    }

    static playScratch() {
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            // White noise-ish sound
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = Math.random() * 500 + 200;

            filter.type = 'highpass';
            filter.frequency.value = 1000;

            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error('Audio play failed', e);
        }
    }

    static playSpin() {
        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error('Audio play failed', e);
        }
    }

    static playWin() {
        try {
            const ctx = this.getContext();

            [440, 554, 659, 880].forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.value = freq;

                gainNode.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.5);

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.start(ctx.currentTime + i * 0.1);
                oscillator.stop(ctx.currentTime + i * 0.1 + 0.5);
            });
        } catch (e) {
            console.error('Audio play failed', e);
        }
    }
}
