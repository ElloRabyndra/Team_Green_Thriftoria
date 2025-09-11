import { PackageSearch } from "lucide-react";
export default function Empty({ children }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]">
      <PackageSearch className="w-20 h-20 text-primary" />
      <p className="mt-4 text-xl font-semibold text-primary">{children}</p>
    </div>
  );
}
