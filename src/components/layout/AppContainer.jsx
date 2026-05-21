// src/components/layout/AppContainer.jsx
import React from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', sans-serif",
  background: "linear-gradient(165deg, #1a0a0a 0%, #2d1422 30%, #1a0f1e 60%, #0f0a14 100%)",
  color: "#e8ddd0",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap');
`;

export default function AppContainer({ children }) {
  return (
    <div style={baseStyle}>
      <style>{fonts}</style>
      {/* Include the decorative grain here too if you want it everywhere */}
      {children}
    </div>
  );
}