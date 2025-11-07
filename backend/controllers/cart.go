package controllers

import (
	"finpro/database"
	"finpro/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"gorm.io/gorm"
)

func AddToCart(c *fiber.Ctx) error {
	type Request struct {
		ProductID uint `json:"product_id"`
	}

	var body Request
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	userTokenRaw := c.Locals("user")
	if userTokenRaw == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized - missing token"})
	}

	userToken, ok := userTokenRaw.(*jwt.Token)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims := userToken.Claims.(jwt.MapClaims)
	userID := uint(claims["id"].(float64))

	var product models.Product
	if err := database.DB.First(&product, body.ProductID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	var shop models.Shop
	if err := database.DB.First(&shop, product.ShopID).Error; err == nil {
		if shop.UserID == userID {
			return c.Status(400).JSON(fiber.Map{"error": "You cannot add your own product to cart"})
		}
	}
	var existingItem models.CartItem
	err := database.DB.Where("user_id = ? AND product_id = ?", userID, body.ProductID).First(&existingItem).Error
	if err == nil {
		existingItem.Quantity += 1
		if err := database.DB.Save(&existingItem).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to update cart item"})
		}
		return c.JSON(fiber.Map{"message": "Cart updated successfully"})
	}

	if err != gorm.ErrRecordNotFound {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	newCart := models.CartItem{
		UserID:    userID,
		ProductID: body.ProductID,
		Quantity:  1,
		Price:     product.Price,
	}

	if err := database.DB.Create(&newCart).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to add to cart"})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Product added to cart"})
}


func GetAllCart(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	userID := int(claims["id"].(float64))

	var cartItems []models.CartItem
	if err := database.DB.Preload("Product.Shop").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": "Failed to fetch cart items",
			"error":   err.Error(),
		})
	}

	if len(cartItems) == 0 {
		return c.Status(200).JSON(fiber.Map{
			"status":  "success",
			"message": "Your cart is empty",
			"data":    []interface{}{},
		})
	}

	shopMap := make(map[uint]fiber.Map)

	for _, item := range cartItems {
		shop := item.Product.Shop

		if _, exists := shopMap[shop.ID]; !exists {
			shopMap[shop.ID] = fiber.Map{
				"shop_id":   shop.ID,
				"shop_name": shop.ShopName,
				"cart_items": []fiber.Map{},
			}
		}

		cartArray := shopMap[shop.ID]["cart_items"].([]fiber.Map)
		cartArray = append(cartArray, fiber.Map{
			"id":         item.ID,
			"product_id": item.ProductID,
			"image":      item.Product.Image,
			"name":       item.Product.Name,
			"label":      item.Product.Label,
			"price":      item.Price,
			"quantity":   item.Quantity,
			"product_stock": item.Product.Stock, 
		})
		shopMap[shop.ID]["cart_items"] = cartArray
	}

	var result []fiber.Map
	for _, val := range shopMap {
		result = append(result, val)
	}

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"data":   result,
	})
}


func UpdateCartQuantity(c *fiber.Ctx) error {
	type Request struct {
		Quantity int `json:"quantity"`
	}

	cartID := c.Params("cart_id")
	var body Request
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var cartItem models.CartItem
	if err := database.DB.First(&cartItem, cartID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Cart item not found"})
	}

	if body.Quantity <= 0 {
		database.DB.Delete(&cartItem)
		return c.JSON(fiber.Map{"message": "Cart item deleted because quantity was 0"})
	}

	cartItem.Quantity = body.Quantity
	if err := database.DB.Save(&cartItem).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update cart item"})
	}

	return c.JSON(fiber.Map{"message": "Cart updated successfully"})
}

func DeleteCartItem(c *fiber.Ctx) error {
	cartID := c.Params("cart_id")

	var cartItem models.CartItem
	if err := database.DB.First(&cartItem, cartID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Cart item not found"})
	}

	if err := database.DB.Delete(&cartItem).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete cart item"})
	}

	return c.JSON(fiber.Map{"message": "Cart item deleted successfully"})
}
