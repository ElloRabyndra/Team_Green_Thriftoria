import { Card } from "../ui/card";
import { Link } from "react-router";
import {
  ShoppingBasket,
  History,
  Store,
  Package,
  FolderKanban,
  Users,
  Building2,
  Archive,
} from "lucide-react";

// DashboardCard Component
const DashboardCard = ({ title, description, route, iconName }) => {
  const iconMap = {
    ShoppingBasket,
    History,
    Store,
    Package,
    FolderKanban,
    Users,
    Building2,
    Archive,
  };

  const IconComponent = iconMap[iconName];

  return (
    <Link to={route}>
      <Card className="p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-2 hover:border-primary/20">
        <div className="flex items-start space-x-4">
          <div
            className={`p-3 rounded-lg bg-primary text-white transition-colors duration-200 group-hover:scale-110 transform`}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors duration-200">
          <span>Click to access</span>
          <svg
            className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
};

export default DashboardCard;
