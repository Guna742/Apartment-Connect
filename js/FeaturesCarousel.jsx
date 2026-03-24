const { useState, useEffect } = React;
const { motion, AnimatePresence } = window.Motion;

// Define distinct colored gradients for each card forming a bright rainbow sequence
const featuresData = [
    {
        id: 1,
        title: "Community Feed",
        desc: "Stay updated with complex news, security alerts, and neighborly discussions tailored to your specific residential block.",
        icon: "newspaper",
        background: "linear-gradient(135deg, #FF3366 0%, #FF9933 100%)", // Red-Orange
        iconColor: "#FFFFFF"
    },
    {
        id: 2,
        title: "Maintenance Desk",
        desc: "Raise service requests, track plumbing or electrical fixes, and provide feedback directly to the maintenance team.",
        icon: "engineering",
        background: "linear-gradient(135deg, #FF9933 0%, #FFD633 100%)", // Orange-Yellow
        iconColor: "#FFFFFF"
    },
    {
        id: 3,
        title: "Billing & Payments",
        desc: "Pay maintenance fees, electricity bills, and amenity charges securely through an integrated payment gateway.",
        icon: "account_balance_wallet",
        background: "linear-gradient(135deg, #FFD633 0%, #33CC99 100%)", // Yellow-Green
        iconColor: "#FFFFFF"
    },
    {
        id: 4,
        title: "Resident Groups",
        desc: "Join hobby clubs, carpool groups, and interest communities within your complex—all in a single networked space.",
        icon: "groups",
        background: "linear-gradient(135deg, #33CC99 0%, #3399FF 100%)", // Green-Blue
        iconColor: "#FFFFFF"
    },
    {
        id: 5,
        title: "Amenities Booking",
        desc: "Discover and book clubhouses, gyms, swimming pools, and party halls with real-time availability tracking.",
        icon: "calendar_today",
        background: "linear-gradient(135deg, #3399FF 0%, #9933FF 100%)", // Blue-Purple
        iconColor: "#FFFFFF"
    },
    {
        id: 6,
        title: "Visitor Management",
        desc: "Pre-approve guests, track delivery staff, and ensure a secure environment for your family with digital gate passes.",
        icon: "verified_user",
        background: "linear-gradient(135deg, #9933FF 0%, #FF3366 100%)", // Purple-Red (closing loop)
        iconColor: "#FFFFFF"
    }
];

const FeaturesCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-advance mechanism
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuresData.length);
        }, 3000); // Transitions every 3 seconds for continuous flow
        return () => clearInterval(interval);
    }, [isHovered]);

    // Calculate circular relative offset (-2, -1, 0, 1, 2)
    const getOffset = (index) => {
        let offset = index - currentIndex;
        const half = Math.floor(featuresData.length / 2);
        // Normalize offset to range [-2, 3] for 6 items
        if (offset > half) offset -= featuresData.length;
        if (offset < -half) offset += featuresData.length;
        return offset;
    };

    return (
        <div 
            style={{ position: "relative", height: "480px", width: "100%", overflow: "hidden", perspective: "1200px", padding: "40px 0" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ position: "absolute", top: "50%", left: "50%", width: "320px", height: "360px", transform: "translate(-50%, -50%)", transformStyle: "preserve-3d" }}>
                <AnimatePresence>
                    {featuresData.map((feature, idx) => {
                        const offset = getOffset(idx);
                        const isCenter = offset === 0;

                        // Calculate curved 3D transforms based on the offset
                        const x = offset * 220; // Spread apart
                        const rotateY = offset * -25; // Curve inwards
                        const scale = 1 - Math.abs(offset) * 0.15; // Smaller behind
                        const z = Math.abs(offset) * -100; // Push back continuously
                        
                        const opacity = Math.abs(offset) >= 3 ? 0 : (1 - Math.abs(offset) * 0.3);
                        // zIndex handling: center is highest, edges are lowest
                        const zIndex = 10 - Math.abs(offset);

                        return (
                            <motion.div
                                key={feature.id}
                                initial={false}
                                animate={{
                                    x: `${x}px`,
                                    rotateY: `${rotateY}deg`,
                                    scale: scale,
                                    z: `${z}px`,
                                    opacity: opacity,
                                    zIndex: zIndex
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.25, 0.1, 0.25, 1], // Smooth morph easing
                                }}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "24px",
                                    background: feature.background,
                                    padding: "2.5rem 2rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center", // Centered contents
                                    textAlign: "center", // Centered text
                                    boxShadow: isCenter ? "0 20px 50px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.1) inset" : "0 10px 30px rgba(0,0,0,0.2)",
                                    transition: "filter 0.3s",
                                    filter: isCenter ? "brightness(1.1)" : "brightness(0.7)",
                                    cursor: "pointer"
                                }}
                                onClick={() => setCurrentIndex(idx)}
                            >
                                <div style={{
                                    width: "72px",
                                    height: "72px",
                                    borderRadius: "20px",
                                    background: "rgba(255, 255, 255, 0.2)",
                                    border: "1px solid rgba(255, 255, 255, 0.4)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "1.5rem",
                                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                                }}>
                                    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: "2.2rem", color: feature.iconColor }}>
                                        {feature.icon}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: "0.95rem", color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.6", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
                                    {feature.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            
            {/* Pagination Indicators */}
            <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px" }}>
                {featuresData.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: currentIndex === idx ? "#FFFFFF" : "rgba(255,255,255,0.3)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s"
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// Render to DOM
const featuresMountElement = document.getElementById("features-carousel-mount");
if (featuresMountElement) {
    const root = ReactDOM.createRoot(featuresMountElement);
    root.render(<FeaturesCarousel />);
}
