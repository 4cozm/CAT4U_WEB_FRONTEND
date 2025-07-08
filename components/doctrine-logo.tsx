interface DoctrineLogoProps {
  category: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function DoctrineLogo({ category, size = "md", className = "" }: DoctrineLogoProps) {
  const logos: { [key: string]: string } = {
    캣포유: "/images/catpoyu-logo.png",
    물고기: "/images/fish-logo.png",
    대구: "/images/daegu-logo.png",
  }

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const logoSrc = logos[category]

  if (!logoSrc) return null

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <img src={logoSrc || "/placeholder.svg"} alt={`${category} 로고`} className="h-full w-full object-cover" />
    </div>
  )
}
