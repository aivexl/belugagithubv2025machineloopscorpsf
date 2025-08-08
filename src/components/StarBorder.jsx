import "./StarBorder.css";

const StarBorder = ({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  section = "default",
  direction = "center",
  children,
  ...rest
}) => {
  const isSection1 = section === "level";
  
  return (
    <Component 
      className={`star-border-container ${isSection1 ? 'section-1-border' : ''} star-border-${direction} ${className}`} 
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
      {...rest}
    >
      {isSection1 ? (
        // Section 1: Modern border sweep effect
        direction === 'left' ? (
          <div
            className="border-gradient-sweep sweep-cw"
            style={{
              background: `radial-gradient(circle, ${color}, transparent 10%)`,
              animationDuration: speed,
              '--star-color': color,
              '--star-speed': speed,
            }}
          ></div>
        ) : direction === 'right' ? (
          <div
            className="border-gradient-sweep sweep-ccw"
            style={{
              background: `radial-gradient(circle, ${color}, transparent 10%)`,
              animationDuration: speed,
              '--star-color': color,
              '--star-speed': speed,
            }}
          ></div>
        ) : (
          // fallback: old effect
          <>
            <div
              className="border-gradient-top"
              style={{
                background: `radial-gradient(circle, ${color}, transparent 10%)`,
                animationDuration: speed,
              }}
            ></div>
            <div
              className="border-gradient-bottom"
              style={{
                background: `radial-gradient(circle, ${color}, transparent 10%)`,
                animationDuration: speed,
              }}
            ></div>
          </>
        )
      ) : (
        // Default: Horizontal border animation
        <>
          <div
            className="border-gradient-bottom"
            style={{
              background: `radial-gradient(circle, ${color}, transparent 10%)`,
              animationDuration: speed,
            }}
          ></div>
          <div
            className="border-gradient-top"
            style={{
              background: `radial-gradient(circle, ${color}, transparent 10%)`,
              animationDuration: speed,
            }}
          ></div>
        </>
      )}
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder; 