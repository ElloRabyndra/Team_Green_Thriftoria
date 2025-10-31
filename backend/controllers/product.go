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
)

func GetProducts(c *fiber.Ctx) error {
	var products []models.Product
	if err := database.DB.Find(&products).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(200).JSON(fiber.Map{
		"message":  "Success Get All Products",
		"count":    len(products),
        "products": products,
    })
}

func CreateProduct(c *fiber.Ctx) error {
	// userRole := c.Locals("role")

	// if userRole != "seller" {
	// 	return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
	// 		"error": "Hanya seller yang bisa menambahkan produk",
	// 	})
	// }

	name := c.FormValue("name")
	category := c.FormValue("category")
	priceStr := c.FormValue("price")
	stockStr := c.FormValue("stock")

	if name == "" || category == "" || priceStr == "" || stockStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Semua field wajib diisi",
		})
	}

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil || price <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Harga harus berupa angka lebih dari 0",
		})
	}

	stock, err := strconv.Atoi(stockStr)
	if err != nil || stock < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Stok harus berupa angka >= 0",
		})
	}

	file, err := c.FormFile("image")
	var imageURL string
	if err == nil && file != nil {
		if file.Size > 1*1024*1024 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Ukuran foto maksimal 1MB",
			})
		}

		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExt := map[string]bool{
			".png":  true,
			".jpg":  true,
			".jpeg": true,
		}
		if !allowedExt[ext] {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Foto harus berformat PNG, JPG, atau JPEG",
			})
		}

		filename := strconv.FormatInt(time.Now().UnixNano(), 10) + ext
		savePath := "./assets/" + filename

		if saveErr := c.SaveFile(file, savePath); saveErr != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal menyimpan foto",
			})
		}

		imageURL = "http://127.0.0.1:3000/assets/" + filename
	}

	product := models.Product{
		Name:     name,
		Category: category,
		Price:    price,
		Stock:    stock,
		Image:    imageURL,
	}

	if err := database.DB.Create(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal membuat produk: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Produk berhasil dibuat",
		"product": product,
	})
}

func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Produk tidak ditemukan",
		})
	}

	name := c.FormValue("name")
	category := c.FormValue("category")
	priceStr := c.FormValue("price")
	stockStr := c.FormValue("stock")

	if name != "" {
		product.Name = name
	}
	if category != "" {
		product.Category = category
	}
	if priceStr != "" {
		price, err := strconv.ParseFloat(priceStr, 64)
		if err != nil || price <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Harga harus berupa angka lebih dari 0",
			})
		}
		product.Price = price
	}
	if stockStr != "" {
		stock, err := strconv.Atoi(stockStr)
		if err != nil || stock < 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Stok harus berupa angka >= 0",
			})
		}
		product.Stock = stock
	}

	file, err := c.FormFile("image")
	if err == nil && file != nil {
		if file.Size > 1*1024*1024 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Ukuran foto maksimal 1MB",
			})
		}

		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExt := map[string]bool{
			".png":  true,
			".jpg":  true,
			".jpeg": true,
		}
		if !allowedExt[ext] {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Foto harus berformat PNG, JPG, atau JPEG",
			})
		}

		if product.Image != "" && !strings.Contains(product.Image, "pravatar.cc") {
			oldPath := "." + strings.TrimPrefix(product.Image, "http://127.0.0.1:3000")
			_ = os.Remove(oldPath)
		}

		filename := strconv.FormatInt(time.Now().UnixNano(), 10) + ext
		savePath := "./assets/" + filename
		if saveErr := c.SaveFile(file, savePath); saveErr != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal menyimpan foto",
			})
		}
		product.Image = "http://127.0.0.1:3000/assets/" + filename
	}

	if err := database.DB.Save(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal mengupdate produk: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Produk berhasil diperbarui",
		"product": product,
	})
}

func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Produk tidak ditemukan",
		})
	}

	if product.Image != "" && !strings.Contains(product.Image, "pravatar.cc") {
		oldPath := "." + strings.TrimPrefix(product.Image, "http://127.0.0.1:3000")
		_ = os.Remove(oldPath)
	}

	if err := database.DB.Delete(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal menghapus produk: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Produk berhasil dihapus",
	})
}

