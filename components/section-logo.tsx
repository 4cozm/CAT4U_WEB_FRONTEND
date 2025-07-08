interface SectionLogoProps {
  section: "home" | "doctrine" | "fitting"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export default function SectionLogo({ section, size = "md", className = "" }: SectionLogoProps) {
  const logos = {
    home: "/images/logo-cat.png",
    doctrine: "/images/logo-eye.png",
    fitting: "/images/logo-skull.png",
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }

  const borderColors = {
    home: "border-orange-500/50",
    doctrine: "border-red-500/50",
    fitting: "border-purple-500/50",
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 ${borderColors[section]} ${className}`}>
      <img src={logos[section] || "/placeholder.svg"} alt={`${section} 로고`} className="h-full w-full object-cover" />
    </div>
  )
}
