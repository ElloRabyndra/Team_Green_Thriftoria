import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardCard from "./DashboardCard";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { SlideIn } from "../animations/SlideIn";

const Dashboard = () => {
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Dashboard menu configuration berdasarkan role
  const dashboardMenu = {
    buyer: [
      {
        id: 1,
        title: "My Shop",
        description: "Register your shop and start selling",
        route: "/dashboard/register-shop",
        iconName: "Store",
      },
      {
        id: 2,
        title: "Orders",
        description: "View and track your current orders",
        route: "/dashboard/orders",
        iconName: "ShoppingBasket",
      },
      {
        id: 3,
        title: "Order History",
        description: "View your past orders and purchases",
        route: "/dashboard/order-history",
        iconName: "History",
      },
    ],
    seller: [
      {
        id: 1,
        title: "My Shop",
        description: "Manage your shop",
        route: "/dashboard/my-shop",
        iconName: "Store",
      },
      {
        id: 2,
        title: "Products",
        description: "Manage your product listings",
        route: "/dashboard/my-products",
        iconName: "Package",
      },
      {
        id: 4,
        title: "Sales",
        description: "View and manage orders",
        route: "/dashboard/sales",
        iconName: "FolderKanban",
      },
      {
        id: 5,
        title: "Orders",
        description: "View and track your current orders",
        route: "/dashboard/orders",
        iconName: "ShoppingBasket",
      },
      {
        id: 6,
        title: "Order History",
        description: "View your past orders and purchases",
        route: "/dashboard/order-history",
        iconName: "History",
      },
    ],
    admin: [
      {
        id: 1,
        title: "Buyers",
        description: "Manage buyer accounts and data",
        route: "/dashboard/buyers",
        iconName: "Users",
      },
      {
        id: 2,
        title: "Shops",
        description: "Manage shops and seller accounts",
        route: "/dashboard/shops",
        iconName: "Building2",
      },
    ],
  };

  // Get current user's menu
  const currentMenu = dashboardMenu[user.role] || dashboardMenu.buyer;

  return (
    <section className="p-4 py-0 ">
      <div className="mb-6">
        <h1 className="text-lg md:text-2xl font-semibold mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what you can do today.
        </p>
      </div>

      <SlideIn direction="up">
        <Card
          className={
            "w-full -mt-4 min-w-80 md:min-w-md p-5 flex-row items-center gap-0 mb-6"
          }
        >
          <Avatar className="w-14 h-14 rounded-full overflow-hidden">
            <AvatarImage
              src={`${
                user?.profile_picture !== "https://i.pravatar.cc/150"
                  ? user.profile_picture
                  : "https://i.pinimg.com/1200x/77/00/70/7700709ac1285b907c498a70fbccea5e.jpg"
              }`}
            ></AvatarImage>
          </Avatar>
          <CardContent className="px-4">
            <h1 className="text-md font-semibold">{user.username}</h1>
            <p className="text-sm font-medium text-gray-500">{user?.email}</p>
          </CardContent>
        </Card>
      </SlideIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMenu.map((menu, index) => (
          <SlideIn key={menu.id} direction="up">
            <DashboardCard
              title={menu.title}
              description={menu.description}
              route={menu.route}
              iconName={menu.iconName}
              colorClass={menu.colorClass}
            />
          </SlideIn>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
