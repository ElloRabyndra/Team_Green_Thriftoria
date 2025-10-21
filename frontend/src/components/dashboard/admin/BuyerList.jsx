import { useState } from "react";
import { Eye, Trash2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { allUsers } from "@/database/dummy";

// Badge component untuk role
function RoleBadge({ role }) {
  const isSeller = role === "Seller";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
        isSeller
          ? "bg-primary/10 text-primary"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {role}
    </span>
  );
}

// Buyer List Component
const BuyerList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    if (searchQuery.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Reset to all users if search is cleared
    if (value.trim() === "") {
      setFilteredUsers(allUsers);
      setIsSearching(false);
    }
  };

  const handleView = (user) => {
    console.log("View user:", user);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      console.log("Delete user:", user);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Buyers
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </form>
        </div>

        {/* Table Card */}
        <Card className="overflow-hidden p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Username - Always visible */}
                  <TableHead className="w-[140px] sm:w-[180px]">
                    Username
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

                  {/* Role - Always visible */}
                  <TableHead className="w-[80px] sm:w-[100px]">Role</TableHead>

                  {/* Action - Always visible */}
                  <TableHead className="w-[100px] text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-8 w-8 opacity-50" />
                        <p className="font-medium">User not found</p>
                        <p className="text-sm">
                          {isSearching
                            ? `No users found matching "${searchQuery}"`
                            : "No users available"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      {/* Username - Always visible */}
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[130px] sm:max-w-[170px]">
                          {user.username}
                        </div>
                      </TableCell>

                      {/* Email - Hidden below sm */}
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        <div className="truncate max-w-[190px]">
                          {user.email}
                        </div>
                      </TableCell>

                      {/* Telephone - Hidden below md */}
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {user.telephone}
                      </TableCell>

                      {/* Address - Hidden below lg */}
                      <TableCell className="hidden xl:table-cell text-muted-foreground">
                        <div className="truncate max-w-[210px]">
                          {user.address}
                        </div>
                      </TableCell>

                      {/* Role - Always visible */}
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>

                      {/* Action - Always visible */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(user)}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
        {filteredUsers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>
              Showing {filteredUsers.length}{" "}
              {isSearching ? "result(s)" : "user(s)"}
            </p>
            <p>Total Users: {allUsers.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerList;
