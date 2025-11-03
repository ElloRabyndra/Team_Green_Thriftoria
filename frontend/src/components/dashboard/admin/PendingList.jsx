import { useEffect, useState } from "react";
import { Eye, Trash2, Search, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router";
import { useAdmin } from "@/hooks/useAdmin";
import Loading from "@/components/ui/loading";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SlideIn } from "@/components/animations/SlideIn";

// Badge component untuk status
function StatusBadge({ status_admin }) {
  const isAccept = status_admin === "approve";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
        isAccept
          ? "bg-primary/10 text-primary"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {status_admin}
    </span>
  );
}

// Buyer List Component
const PendingList = () => {
  const { requestShopList, loading, fetchRequestShopList, acceptRequest } =
    useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch Shop List
  useEffect(() => {
    fetchRequestShopList();
  }, []);

  //  Set filtered shops
  useEffect(() => {
    setFilteredShops(requestShopList);
  }, [requestShopList]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    if (searchQuery.trim() === "") {
      setFilteredShops(requestShopList);
    } else {
      const filtered = requestShopList.filter((shop) =>
        shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredShops(filtered);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Reset to all shops if search is cleared
    if (value.trim() === "") {
      setFilteredShops(requestShopList);
      setIsSearching(false);
    }
  };

  const handleApprove = async (shop_id) => {
    await acceptRequest(shop_id, true);
    await fetchRequestShopList();
  };

  const handleReject = async (shop_id) => {
    await acceptRequest(shop_id, false);
    await fetchRequestShopList();
  };

  // Loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <SlideIn direction="left">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Shop
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Accept Shop */}
              <Link
                to="/dashboard/shops"
                className="text-sm text-foreground bg-card hover:bg-secondary hover:text-primary px-4 py-2 rounded-xl cursor-pointer"
              >
                Accept Shop
              </Link>
              {/* Pending Shop */}
              <Link
                to="/dashboard/shops/pending"
                className="text-sm bg-secondary text-primary px-4 py-2 rounded-xl cursor-pointer"
              >
                Pending Shop
              </Link>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Shops..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </form>
            </div>
          </div>

          {/* Table Card */}
          <Card className="overflow-hidden p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* ShopName - Always visible */}
                    <TableHead className="w-[140px] sm:w-[180px]">
                      Shop Name
                    </TableHead>

                    {/* Email - Hidden below sm */}
                    <TableHead className="hidden lg:table-cell lg:w-[200px]">
                      Email
                    </TableHead>

                    {/* Telephone - Hidden below md */}
                    <TableHead className="hidden md:table-cell md:w-[130px]">
                      Telephone
                    </TableHead>

                    {/* Address - Hidden below lg */}
                    <TableHead className="hidden xl:table-cell xl:min-w-[220px]">
                      Address
                    </TableHead>

                    {/* Status - Always visible */}
                    <TableHead className="w-[80px] sm:w-[100px]">
                      Status
                    </TableHead>

                    {/* Action - Always visible */}
                    <TableHead className="w-[100px] text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShops.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search className="h-8 w-8 opacity-50" />
                          <p className="font-medium">Shop not found</p>
                          <p className="text-sm">
                            {isSearching
                              ? `No Shops found matching "${searchQuery}"`
                              : "No Shops available"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredShops.map((shop) => (
                      <TableRow key={shop.id}>
                        {/* ShopName - Always visible */}
                        <TableCell className="font-medium">
                          <div className="truncate max-w-[130px] sm:max-w-[170px]">
                            {shop.shop_name}
                          </div>
                        </TableCell>

                        {/* Email - Hidden below sm */}
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          <div className="truncate max-w-[190px]">
                            {shop.email}
                          </div>
                        </TableCell>

                        {/* Telephone - Hidden below md */}
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {shop.shop_telephone}
                        </TableCell>

                        {/* Address - Hidden below lg */}
                        <TableCell className="hidden xl:table-cell text-muted-foreground">
                          <div className="truncate max-w-[210px]">
                            {shop.shop_address}
                          </div>
                        </TableCell>

                        {/* Status - Always visible */}
                        <TableCell>
                          <StatusBadge status_admin={shop.status_admin} />
                        </TableCell>

                        {/* Action - Always visible */}
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <ConfirmDialog
                              onConfirm={() => handleApprove(shop.id)}
                            >
                              <button
                                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </ConfirmDialog>
                            <ConfirmDialog
                              onConfirm={() => handleReject(shop.id)}
                            >
                              <button
                                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </ConfirmDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Footer Info */}
          {filteredShops.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground">
              <p>
                Showing {filteredShops.length}{" "}
                {isSearching ? "result(s)" : "Shop(s)"}
              </p>
              <p>Total Shop: {filteredShops.length}</p>
            </div>
          )}
        </div>
      </SlideIn>
    </div>
  );
};

export default PendingList;
