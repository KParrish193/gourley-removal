"use client";

export default function InstagramFeed() {
  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <iframe
        src="https://snapwidget.com/embed/123456" // replace with your link
        className="snapwidget-widget"
        allowTransparency={true}
        style={{
          border: "none",
          overflow: "hidden",
          width: "100%",
          height: "400px",
        }}
      ></iframe>
    </div>
  );
}
