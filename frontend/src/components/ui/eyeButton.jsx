import { Eye, EyeOff } from "lucide-react";

export default function EyeButton({ isSubmitting, showPassword, setShowPassword }) {
  return (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      disabled={isSubmitting}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );
}