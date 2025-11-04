import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Mail, User, Phone, MapPin, PackageSearch } from "lucide-react";
import { SlideIn } from "../../animations/SlideIn";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import Loading from "../../ui/loading";
import { useNavigate, useParams } from "react-router";

export default function ViewProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, isLoading } = useAuth();
  const { userDetail, loading, fetchUserDetail } = useAdmin();

  // Get profile image source
  const getProfileImageSrc = () => {
    if (
      userDetail?.profile_picture &&
      userDetail.profile_picture !== "https://i.pravatar.cc/150"
    )
      return userDetail.profile_picture;
    return "https://i.pinimg.com/1200x/77/00/70/7700709ac1285b907c498a70fbccea5e.jpg";
  };

  // Redirect jika bukan admin
  useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [isLoading, user, navigate]);

  // Fetch Detail Shop
  useEffect(() => {
    fetchUserDetail(Number(userId));
  }, [userId]);

  // Loading state
  if (loading || isLoading) {
    return <Loading />;
  }

  if (!userDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]">
        <User className="w-20 h-20 text-primary" />
        <p className="mt-4 text-xl font-semibold text-primary">
          User not found
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4 md:ml-4">
      {/* My Profile */}
      <h1 className="text-lg md:text-2xl font-semibold">My Profile</h1>

      {/* View Profile */}
      <SlideIn direction="left">
        <Card className="w-full min-w-80 md:min-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              {/* Profile Picture & Basic Info */}
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-18 h-18 border-4 border-primary/20">
                    <AvatarImage
                      src={getProfileImageSrc()}
                      alt="Profile Picture"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </Avatar>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-lg">{userDetail.username}</p>
                  <p className="text-sm font-medium text-gray-500">
                    {userDetail.email}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Email & Username */}
              <div className="space-y-4 lg:flex lg:gap-4 lg:space-y-0">
                {/* Email */}
                <div className="flex flex-col gap-2 w-full p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 ml-6">
                    {userDetail.email || "-"}
                  </p>
                </div>

                {/* Username */}
                <div className="flex flex-col gap-2 w-full p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Username</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 ml-6">
                    {userDetail.username || "-"}
                  </p>
                </div>
              </div>

              {/* Telephone & Address */}
              <div className="space-y-4 lg:flex lg:gap-4 lg:space-y-0">
                {/* Telephone */}
                <div className="flex flex-col gap-2 w-full p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Phone Number</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 ml-6">
                    {userDetail.telephone || "-"}
                  </p>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-2 w-full p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Address</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 ml-6">
                    {userDetail.address || "-"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideIn>
    </section>
  );
}
