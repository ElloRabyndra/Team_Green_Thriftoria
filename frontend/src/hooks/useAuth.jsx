import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Context untuk Authentication
const AuthContext = createContext();

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users dan check authentication saat aplikasi dimuat
  useEffect(() => {
    try {
      // Load users dari localStorage
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      setUsers(storedUsers);

      // Cek apakah user sudah login sebelumnya
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error loading data from localStorage", error);
      setUsers([]);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function untuk register user baru
  const registerUser = (userData) => {
    try {
      const { email, username, password } = userData;
      const newUser = {
        id: Date.now(),
        username,
        email: email.toLowerCase(),
        telephone: "",
        address: "",
        password,
        role: "buyer", // Default role sebagai buyer
      };

      // Update users list
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      // Save ke localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      return { success: true, message: "Registration successful!" };
    } catch (error) {
      return { success: false, message: "Registration failed!" };
    }
  };

  // Function untuk login
  // Function untuk login
  const login = (credentials) => {
    try {
      const { email, password } = credentials;

      // Cari user berdasarkan email dan password
      const foundUser = users.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === password
      );

      if (foundUser) {
        // Create a new object that includes all user data except the password.
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          telephone: foundUser.telephone,
          address: foundUser.address,
          role: foundUser.role,
        };

        setUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        return { success: true, message: "Login successful!", user: userData };
      } else {
        return { success: false, message: "Invalid credentials!" };
      }
    } catch (error) {
      return { success: false, message: "Login failed!" };
    }
  };

  // Function untuk logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // Function untuk check apakah email sudah terdaftar
  const isEmailRegistered = (email) => {
    return users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  };

  // Function untuk validasi password
  const validatePassword = (email, password) => {
    const foundUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    return foundUser && foundUser.password === password;
  };

  // Function untuk update profile
  const updateProfile = (profileData) => {
    try {
      const { email, username, telephone, address, old_password, new_password } =
        profileData;

      // Cari user saat ini
      const currentUserIndex = users.findIndex((u) => u.id === user.id);
      if (currentUserIndex === -1) {
        return { success: false, message: "User not found!" };
      }

      const currentUserData = users[currentUserIndex];

      // Validasi password lama hanya jika user isi new_password
      if (new_password && new_password.trim() !== "") {
        if (currentUserData.password !== old_password) {
          return { success: false, message: "Incorrect old password!" };
        }
      }

      // Cek email unik
      if (email.toLowerCase() !== currentUserData.email.toLowerCase()) {
        const emailExists = users.some(
          (u) =>
            u.id !== user.id && u.email.toLowerCase() === email.toLowerCase()
        );
        if (emailExists) {
          return { success: false, message: "Email already in use!" };
        }
      }

      const updatedUser = {
        ...currentUserData,
        email: email.toLowerCase(),
        username: username, 
        telephone: telephone, 
        address: address, 
        password:
          new_password && new_password.trim() !== ""
            ? new_password
            : currentUserData.password,
      };

      // Update users array
      const updatedUsers = [...users];
      updatedUsers[currentUserIndex] = updatedUser;
      setUsers(updatedUsers);

      const updatedUserData = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        telephone: updatedUser.telephone,
        address: updatedUser.address,
        role: updatedUser.role,
      };

      // Debug logging
      console.log("Profile Data:", profileData);
      console.log("Updated User:", updatedUser);
      console.log("Updated User Data (for session):", updatedUserData);

      setUser(updatedUserData);

      // Save ke localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));

      return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, message: "Profile update failed!" };
    }
  };

  const value = {
    user,
    users,
    isLoading,
    isAuthenticated: !!user,
    registerUser,
    login,
    logout,
    isEmailRegistered,
    validatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
