interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Card({ children, onClick, className = "" }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`card ${onClick ? "cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
