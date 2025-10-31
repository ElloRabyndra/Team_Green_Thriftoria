package controllers

import (
	"finpro/database"
	"finpro/models"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

func GetProfile(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)

	userID := c.Locals("id", claims["id"])

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data":   user,
	})
}


func UpdateProfile(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	userID := claims["id"]

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "User not found",
			"error":   err.Error(),
		})
	}

		username := c.FormValue("username")
		email := c.FormValue("email")
		address := c.FormValue("address")
		telephone := c.FormValue("telephone")
		oldPassword := c.FormValue("old_password")
		newPassword := c.FormValue("new_password") 

    // --- LOGIKA UPDATE DATA NON-PASSWORD ---
		if username != "" { user.Username = username }
		if email != "" { user.Email = email }
		if address != "" { user.Address = address }
		if telephone != "" { user.Telephone = telephone }

    // --- LOGIKA UPDATE PASSWORD DENGAN VALIDASI ---
		if newPassword != "" {
        // 1. Verifikasi oldPassword harus diisi
        if oldPassword == "" {
             return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                "status": "error",
                "message": "Old password is required to change password",
            })
        }
        
        // 2. Verifikasi oldPassword BENAR
        if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(oldPassword)); err != nil {
            return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
                "status": "error",
                "message": "Incorrect old password", // Pesan ini akan ditangkap oleh frontend
            })
        }
        
        // 3. Hash dan update newPassword
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
				if err != nil {
						return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
							"status": "error",
							"message": "Failed to hash password",
							"error": err.Error(),
  })
   }
   user.Password = string(hashedPassword)  
	}

	file, err := c.FormFile("profile_picture")
	if file != nil && err == nil {
		if file.Size > 1*1024*1024 {
			return c.Status(400).JSON(fiber.Map{"error": "Ukuran foto maksimal 1MB"})
		}

		ext := filepath.Ext(file.Filename)
		allowedExt := map[string]bool{
			".png": true,
			".jpg": true,
			".jpeg": true,
			".webp": true,
		}
		if !allowedExt[ext] {
			return c.Status(400).JSON(fiber.Map{"error": "Foto berformat harus PNG, JPG, JPEG atau WEBP"})
		}

		if user.ProfilePicture != "" && !strings.Contains(user.ProfilePicture, "pravatar.cc") {
			oldPath := "." + strings.TrimPrefix(user.ProfilePicture, "http://127.0.0.1:3000")
        if _, statErr := os.Stat(oldPath); statErr == nil {
            _ = os.Remove(oldPath) 
        }
		}
		
		filename := strconv.FormatInt(time.Now().UnixNano(), 10) + ext
		savePath := "./assets/" + filename
		if err := c.SaveFile(file, savePath); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to save photo"})
		}
		user.ProfilePicture = "http://127.0.0.1:3000/assets/" + filename
	}

	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Could not update user",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Profile updated successfully",
		"data":    user,
	})
}


func DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status": "error",
			"message": "User not found",
			"error": err.Error(),
		})
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"message": "Could not delete user",
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"message": "User deleted successfully",
	})
}