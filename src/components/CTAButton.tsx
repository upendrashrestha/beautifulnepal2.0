// Add this import at the top of your Header file
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { FaCompass } from "react-icons/fa";

// Update the CTAButton component to accept href prop
export function CTAButton({ 
  label, 
  onClick, 
  href, 
  className 
}: { 
  label: string; 
  onClick?: () => void; 
  href?: string;
  className?: string;
}) {
  const router = useRouter();
  
  const handleClick = () => {
    if (href) {
      router.push(href);
    }
    onClick?.();
  };
  
  return (
    <button
      onClick={handleClick}
      className={clsx(
        "group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
        "bg-gradient-to-r from-[#bc1c2b] to-[#d93344] text-white",
        "hover:shadow-lg hover:shadow-[#bc1c2b]/30 hover:scale-[1.02]",
        "active:scale-98",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        {label}
        <FaCompass className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
      </span>
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-white/20 to-transparent" />
    </button>
  );
}
