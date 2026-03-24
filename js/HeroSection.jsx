const { useState, useEffect, useRef } = React;
const { motion, useMotionValue, useTransform, useSpring } = FramerMotion;

const HeroSection = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const sectionRef = useRef(null);

    // Mouse tilt values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
        setMousePos({ x: mouseX, y: mouseY });
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section
            ref={sectionRef}
            className="hero"
            style={{
                minHeight: '100vh',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                paddingTop: '160px',
                paddingBottom: '160px'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Canvas (remains for effect) */}
            <canvas id="hero-canvas" style={{ position: 'absolute', pointerEvents: 'none' }}></canvas>

            {/* Background Orbs */}
            <div className="bg-orb bg-orb-1" style={{ opacity: 0.1 }}></div>
            <div className="bg-orb bg-orb-2" style={{ opacity: 0.15 }}></div>
            <div className="bg-orb bg-orb-3" style={{ opacity: 0.1 }}></div>

            <div className="container" style={{ zIndex: 10, position: 'relative' }}>
                <div className="hero-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 class="hero-title" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 6rem)', lineHeight: 1, fontWeight: 900, marginBottom: '2rem' }}>
                            Connecting <br />
                            Every <br />
                            <span className="gradient-text">Community</span> <br />
                            <span className="gradient-text">Digitally</span>
                        </h1>
                        <p className="hero-desc" style={{ maxWidth: '500px', margin: '1.5rem 0', color: '#4A4A4A', fontSize: '1.1rem', fontWeight: 500 }}>
                            Apartment Connect unifies residents, staff, owners, and management in one intelligent
                            digital ecosystem — powering convenience, security, and community life.
                        </p>
                        <div className="hero-cta" style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem' }}>
                            <a href="contact.html" className="btn btn-primary">
                                Get Started
                            </a>
                            <a href="about.html" className="btn btn-secondary">
                                Learn More
                            </a>
                        </div>
                    </motion.div>

                    <div className="hero-visual">
                        <motion.div
                            className="hero-visual-container"
                            style={{
                                perspective: '1200px',
                                rotateX,
                                rotateY,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <div className="hero-card-cluster">
                                {/* Main Dashboard Card */}
                                <motion.div
                                    className="floating-card card-main"
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ transform: 'translate(-50%, -50%) translateZ(50px)' }}
                                >
                                    <div className="glass-glow" style={{ background: `radial-gradient(circle at ${mousePos.x % 100}% ${mousePos.y % 100}%, rgba(255,255,255,0.1), transparent)` }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span className="material-symbols-outlined" style={{ color: 'var(--neon-blue)' }}>dashboard</span>
                                        <span className="tag tag-blue">Live Feed</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <div className="progress-bar" style={{ height: '4px' }}><div className="progress-fill" style={{ width: '80%' }}></div></div>
                                        <div className="progress-bar" style={{ height: '4px' }}><div className="progress-fill" style={{ width: '40%', background: 'var(--accent)' }}></div></div>
                                        <div className="progress-bar" style={{ height: '4px' }}><div className="progress-fill" style={{ width: '95%', background: 'var(--mint-green)' }}></div></div>
                                    </div>
                                </motion.div>

                                {/* Accent Card 1 */}
                                <motion.div
                                    className="floating-card card-accent-1"
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    style={{ transform: 'translateZ(100px)' }}
                                >
                                    <h4 style={{ fontSize: '0.8rem' }}>Residents</h4>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--neon-blue)' }}>12.8k</div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--mint-green)' }}>↑ Active Now</div>
                                </motion.div>

                                {/* Accent Card 2 */}
                                <motion.div
                                    className="floating-card card-accent-2"
                                    animate={{ y: [0, -25, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    style={{ transform: 'translateZ(20px)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className="material-symbols-outlined" style={{ color: 'var(--soft-coral)', fontSize: '1rem' }}>verified_user</span>
                                        <span style={{ fontSize: '0.7rem' }}>Security On</span>
                                    </div>
                                </motion.div>

                                {/* Accent Card 3 */}
                                <motion.div
                                    className="floating-card card-accent-3"
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                    style={{ transform: 'translateZ(150px)' }}
                                >
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--gradient-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1rem' }}>event</span>
                                    </div>
                                    <div style={{ fontSize: '0.7rem' }}>Summer Fest</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="hero-wave-container">
                <svg className="hero-wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path className="hero-wave-layer-1" d="M0,160 C320,300 640,20 960,150 C1280,280 1440,160 V320 H0 Z"></path>
                    <path className="hero-wave-layer-2" d="M0,200 C480,380 960,20 1440,200 V320 H0 Z"></path>
                    <path className="hero-wave-layer-3" d="M0,240 C320,380 720,100 1120,300 C1440,460 1440,240 1440,240 V320 H0 Z"></path>
                </svg>
            </div>
        </section>
    );
};

const root = ReactDOM.createRoot(document.getElementById('hero-mount'));
root.render(<HeroSection />);
