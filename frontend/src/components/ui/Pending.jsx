import { Store } from "lucide-react";
export default function Pending() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] bg-white rounded-2xl shadow-xs">
      <Store className="w-20 h-20 text-primary" />
      <p className="mt-4 text-xl font-semibold text-primary max-w-lg text-center">
        Your store registration request is currently pending approval from the
        administrator.
      </p>
    </div>
  );
}
