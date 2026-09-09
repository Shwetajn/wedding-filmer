import paperBg from "../../assets/intro/paper-bg.png";

interface PaperBackgroundProps {
  dim?: boolean;
}

export function PaperBackground({ dim }: PaperBackgroundProps) {
  return (
    <div
      className="intro-paper-bg"
      style={{
        backgroundImage: `url(${paperBg})`,
        filter: dim ? "brightness(0.94)" : "brightness(1)",
      }}
    />
  );
}
