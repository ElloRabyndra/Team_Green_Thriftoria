package controllers

import (
	"finpro/database"
	"finpro/models"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func CreateShop(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	userID := int(claims["id"].(float64))

	var existingShop models.Shop
	if err := database.DB.Where("user_id = ?", userID).First(&existingShop).Error; err == nil {
		return c.Status(400).JSON(fiber.Map{"error": "You already have a shop"})
	}

	shopName := c.FormValue("shop_name")
	shopTelephone := c.FormValue("shop_telephone")
	shopAddress := c.FormValue("shop_address")
	accountNumber := c.FormValue("account_number")

	if shopName == "" || shopAddress == "" {
		return c.Status(400).JSON(fiber.Map{"error": "shop name and shop address must be required"})
	}

	file, err := c.FormFile("qris_picture")
	var qrisURL string

	if file != nil && err == nil {
		if file.Size > 1*1024*1024 {
			return c.Status(400).JSON(fiber.Map{"error": "QRIS size must be < 1MB"})
		}

		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExt := map[string]bool{
			".png": true, 
			".jpg": true, 
			".jpeg": true, 
			".webp": true}
		if !allowedExt[ext] {
			return c.Status(400).JSON(fiber.Map{"error": "QRIS must be PNG, JPG, JPEG, WEBP format"})
		}

		os.MkdirAll("./assets/qris", os.ModePerm)
		filename := fmt.Sprintf("%d_%d%s", userID, time.Now().UnixNano(), ext)
		savePath := "./assets/qris/" + filename

		if err := c.SaveFile(file, savePath); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to upload QRIS"})
		}
		qrisURL = "http://127.0.0.1:3000/assets/qris/" + filename
	}

	shop := models.Shop{
		UserID:        uint(userID),
		ShopName:      shopName,
		ShopTelephone: shopTelephone,
		ShopAddress:   shopAddress,
		AccountNumber: accountNumber,
		QrisPicture:   qrisURL,
		StatusAdmin:   "pending",
	}

	if err := database.DB.Create(&shop).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create shop", "details": err.Error()})
	}

	// if err := database.DB.Model(&models.User{}).Where("id = ?", userID).Update("role", "seller").Error; err != nil {
	// 	return c.Status(500).JSON(fiber.Map{"error": "Gagal memperbarui role user"})
	// }

	
	shopResponse := models.ShopResponse{
		ID:            shop.ID,
		UserID:        shop.UserID,
		ShopName:      shop.ShopName,
		ShopTelephone: shop.ShopTelephone,
		ShopAddress:   shop.ShopAddress,
		AccountNumber: shop.AccountNumber,
		QrisPicture:   shop.QrisPicture,
		StatusAdmin:   shop.StatusAdmin,
		CreatedAt:     shop.CreatedAt,
	}	

	return c.Status(201).JSON(fiber.Map{
		"status":  "success",
		"message": "Shop created successfully, waiting for admin approval",
		"data":    shopResponse,
	})
}

func GetDetailShop(c *fiber.Ctx) error {
	shopID := c.Params("id")

	var shop models.Shop
	if err := database.DB.Preload("User").First(&shop, shopID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Shop not found"})
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Shop details retrieved successfully",
		"data": fiber.Map{
			"id":             shop.ID,
			"user_id":        shop.UserID,
			"username":       shop.User.Username,
			"email":          shop.User.Email,
			"shop_name":      shop.ShopName,
			"shop_telephone": shop.ShopTelephone,
			"shop_address":   shop.ShopAddress,
			"account_number": shop.AccountNumber,
			"qris_picture":   shop.QrisPicture,
			"created_at":     shop.CreatedAt,
			"status_admin":   shop.StatusAdmin,
		},
	})
}


func EditShop(c *fiber.Ctx) error {
	shopID := c.Params("id")

	var shop models.Shop
	if err := database.DB.First(&shop, shopID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Shop not found"})
	}

	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	userID := int(claims["id"].(float64))

	if shop.UserID != uint(userID) {
		return c.Status(403).JSON(fiber.Map{"error": "Cant edit other user's shop"})
	}

	shopName := c.FormValue("shop_name")
	shopTelephone := c.FormValue("shop_telephone")
	shopAddress := c.FormValue("shop_address")
	accountNumber := c.FormValue("account_number")

	if shopName != "" {
		shop.ShopName = shopName
	}
	if shopTelephone != "" {
		shop.ShopTelephone = shopTelephone
	}
	if shopAddress != "" {
		shop.ShopAddress = shopAddress
	}
	if accountNumber != "" {
		shop.AccountNumber = accountNumber
	}

	file, err := c.FormFile("qris_picture")
	if file != nil && err == nil {
		if file.Size > 1*1024*1024 {
			return c.Status(400).JSON(fiber.Map{"error": "QRIS size must be < 1MB"})
		}

		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExt := map[string]bool{
			".png": true, 
			".jpg": true, 
			".jpeg": true, 
			".webp": true}
		if !allowedExt[ext] {
			return c.Status(400).JSON(fiber.Map{"error": "QRIS must be PNG, JPG, JPEG, WEBP format"})
		}

		if shop.QrisPicture != "" {
			oldPath := "." + strings.TrimPrefix(shop.QrisPicture, "http://127.0.0.1:3000")
			_ = os.Remove(oldPath)
		}

		os.MkdirAll("./assets/qris", os.ModePerm)
		filename := fmt.Sprintf("%d_%d%s", userID, time.Now().UnixNano(), ext)
		savePath := "./assets/qris/" + filename
		if err := c.SaveFile(file, savePath); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to save new QRIS"})
		}

		shop.QrisPicture = "http://127.0.0.1:3000/assets/qris/" + filename
	}

	if err := database.DB.Save(&shop).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update shop", "details": err.Error()})
	}

	shopResponse := models.ShopResponse{
		ID:            shop.ID,
		UserID:        shop.UserID,
		ShopName:      shop.ShopName,
		ShopTelephone: shop.ShopTelephone,
		ShopAddress:   shop.ShopAddress,
		AccountNumber: shop.AccountNumber,
		QrisPicture:   shop.QrisPicture,
		StatusAdmin:   shop.StatusAdmin,
		CreatedAt:     shop.CreatedAt,
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Shop updated successfully",
		"data":    shopResponse,
	})
}
