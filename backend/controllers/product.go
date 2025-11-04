package controllers

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"finpro/database"
	"finpro/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func GetAllProducts(c *fiber.Ctx) error {
	var products []models.Product
	if err := database.DB.Find(&products).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}

	if len(products) == 0 {
		return c.Status(200).JSON(fiber.Map{"status": "success", "message": "No products found", "data": []models.Product{}})
	}

	return c.JSON(fiber.Map{"status": "success", "data": products})
}

func GetProductByCategory(c *fiber.Ctx) error {
	category := strings.Title(strings.ToLower(c.Params("category")))

	if category != "Fashion" && category != "Others" {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid category. Allowed: Fashion, Others",
		})
	}

	var products []models.Product
	if err := database.DB.Where("category = ?", category).Find(&products).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}

	if len(products) == 0 {
		return c.Status(200).JSON(fiber.Map{"status": "success", "message": "No products in this category", "data": []models.Product{}})
	}

	return c.JSON(fiber.Map{"status": "success", "data": products})
}

func SearchProduct(c *fiber.Ctx) error {
	query := c.Query("q")
	if strings.TrimSpace(query) == "" {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "Search query cannot be empty",
		})
	}

	var products []models.Product
	if err := database.DB.Where("name LIKE ?", "%"+query+"%").Find(&products).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}

	return c.JSON(fiber.Map{"status": "success", "data": products})
}

func AddProduct(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	userID := int(claims["id"].(float64))

	var shop models.Shop
	if err := database.DB.Where("user_id = ?", userID).First(&shop).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Seller belum memiliki toko, buat toko terlebih dahulu",
		})
	}

	price, err := strconv.ParseFloat(c.FormValue("price"), 64)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid price"})
	}

	stock, err := strconv.Atoi(c.FormValue("stock"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid stock"})
	}

	name := c.FormValue("name")
	if name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Product name is required"})
	}

	category := c.FormValue("category")
	if category != "Fashion" && category != "Others" {
		return c.Status(400).JSON(fiber.Map{"error": "Category must be 'Fashion' or 'Others'"})
	}

	label := c.FormValue("label")
	description := c.FormValue("description")

	file, err := c.FormFile("image")
	if file == nil || err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Product image is required"})
	}

	if file.Size > 1*1024*1024 {
		return c.Status(400).JSON(fiber.Map{"error": "Image size must be less than 1MB"})
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExt := map[string]bool{
		".png":  true,
		".jpg":  true,
		".jpeg": true,
		".webp": true,
	}
	if !allowedExt[ext] {
		return c.Status(400).JSON(fiber.Map{"error": "Image must be PNG, JPG, JPEG, or WEBP format"})
	}

	os.MkdirAll("./assets/products", os.ModePerm)

	filename := strconv.FormatInt(time.Now().UnixNano(), 10) + ext
	savePath := "./assets/products/" + filename
	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save product image"})
	}

	imageURL := "http://127.0.0.1:3000/assets/products/" + filename

	product := models.Product{
		ShopID:      shop.ID,
		Name:        name,
		Category:    category,
		Label:       label,
		Description: description,
		Image:       imageURL,
		Price:       price,
		Stock:       stock,
	}

	if err := database.DB.Create(&product).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"status":  "success",
		"message": "Product added successfully",
		"data":    product,
	})
}


func DeleteProduct(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	role := claims["role"].(string)

	if role != "seller" {
		return c.Status(403).JSON(fiber.Map{"error": "Only sellers can delete products"})
	}

	id := c.Params("id")
	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	if product.Image != "" && !strings.Contains(product.Image, "pravatar.cc") {
		oldPath := "." + strings.TrimPrefix(product.Image, "http://127.0.0.1:3000")
		if err := os.Remove(oldPath); err != nil {
			fmt.Printf("⚠️ Failed to delete image file: %v\n", err)
		}
	}


	if err := database.DB.Delete(&product).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete product"})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Product deleted successfully"})
}

func GetDetailProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if _, err := strconv.Atoi(id); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	return c.JSON(fiber.Map{"status": "success", "data": product})
}

func EditProduct(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	userID := int(claims["id"].(float64))

	productID := c.Params("id")
	if productID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Product ID is required"})
	}

	var shop models.Shop
	if err := database.DB.Where("user_id = ?", userID).First(&shop).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Seller belum memiliki toko, buat toko terlebih dahulu",
		})
	}

	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	if product.ShopID != shop.ID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Kamu tidak memiliki izin untuk mengedit produk ini",
		})
	}

	name := c.FormValue("name")
	category := c.FormValue("category")
	label := c.FormValue("label")
	description := c.FormValue("description")

	priceStr := c.FormValue("price")
	stockStr := c.FormValue("stock")

	if priceStr != "" {
		price, err := strconv.ParseFloat(priceStr, 64)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid price format"})
		}
		product.Price = price
	}

	if stockStr != "" {
		stock, err := strconv.Atoi(stockStr)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid stock format"})
		}
		product.Stock = stock
	}

	if name != "" {
		product.Name = name
	}
	if category != "" {
		if category != "Fashion" && category != "Others" {
			return c.Status(400).JSON(fiber.Map{"error": "Category must be 'Fashion' or 'Others'"})
		}
		product.Category = category
	}
	if label != "" {
		product.Label = label
	}
	if description != "" {
		product.Description = description
	}

	file, err := c.FormFile("image")
	if file != nil && err == nil {
		if file.Size > 1*1024*1024 {
			return c.Status(400).JSON(fiber.Map{"error": "Image size must be less than 1MB"})
		}

		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExt := map[string]bool{
			".png":  true,
			".jpg":  true,
			".jpeg": true,
			".webp": true,
		}
		if !allowedExt[ext] {
			return c.Status(400).JSON(fiber.Map{"error": "Image must be PNG, JPG, JPEG, WEBP format"})
		}

		if product.Image != "" && !strings.Contains(product.Image, "pravatar.cc") {
			oldPath := "." + strings.TrimPrefix(product.Image, "http://127.0.0.1:3000")
			_ = os.Remove(oldPath)
		}

		os.MkdirAll("./assets/products", os.ModePerm)
		filename := fmt.Sprintf("%d_%d%s", userID, time.Now().UnixNano(), ext)
		savePath := "./assets/products/" + filename

		if err := c.SaveFile(file, savePath); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to save product image"})
		}

		product.Image = "http://127.0.0.1:3000/assets/products/" + filename
	}

	if err := database.DB.Save(&product).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update product", "details": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Product updated successfully",
		"data":    product,
	})
}