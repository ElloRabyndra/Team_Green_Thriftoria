package controllers

import (
	"finpro/database"
	"finpro/models"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func parseUint(s string) uint {
	var n uint
	fmt.Sscanf(s, "%d", &n)
	return n
}

func CreateOrder(c *fiber.Ctx) error {
	userToken := c.Locals("user").(*jwt.Token)
	claims := userToken.Claims.(jwt.MapClaims)
	userID := uint(claims["id"].(float64))

	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid form data"})
	}

	shopID, _ := strconv.ParseUint(form.Value["shop_id"][0], 10, 64)
	recipient := form.Value["recipient"][0]
	telephone := form.Value["telephone"][0]
	address := form.Value["address"][0]
	note := form.Value["note"][0]

	file, err := c.FormFile("proof_payment")
	if file == nil || err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Proof of payment image is required"})
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

	os.MkdirAll("./assets/payments", os.ModePerm)

	filename := strconv.FormatInt(time.Now().UnixNano(), 10) + ext
	savePath := "./assets/payments/" + filename

	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save proof of payment image"})
	}

	proofPaymentURL := "http://127.0.0.1:3000/assets/payments/" + filename

	cartIDs := form.Value["cart_ids[]"]
	if len(cartIDs) == 0 {
		return c.Status(400).JSON(fiber.Map{"error": "No cart items selected"})
	}

	var cartItems []models.CartItem
	if err := database.DB.Preload("Product").Where("id IN ?", cartIDs).Find(&cartItems).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch selected cart items"})
	}

	if len(cartItems) == 0 {
		return c.Status(400).JSON(fiber.Map{"error": "No valid cart items found"})
	}

	var totalPrice float64
	for _, item := range cartItems {
		totalPrice += item.Price * float64(item.Quantity)
	}

	order := models.Order{
		UserID:         userID,
		ShopID:         uint(shopID),
		Recipient:      recipient,
		Telephone:      telephone,
		Address:        address,
		Note:           note,
		TotalPrice:     totalPrice,
		ProofPayment:   proofPaymentURL,
		StatusShipping: "awaitingPayment",
	}

	if err := database.DB.Create(&order).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create order"})
	}

	for _, item := range cartItems {
		orderItem := models.OrderItem{
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     item.Price,
			SubTotal:  item.Price * float64(item.Quantity),
		}

		var product models.Product
		if err := database.DB.First(&product, item.ProductID).Error; err == nil {
			product.Stock -= item.Quantity
			
			if product.Stock <= 0 {
				product.Stock = 0 
			}
			
			if err := database.DB.Save(&product).Error; err != nil {
				fmt.Println("Error saving product stock:", err)
			}
		}

		database.DB.Create(&orderItem)
	}

	database.DB.Where("id IN ?", cartIDs).Delete(&models.CartItem{})

	return c.Status(201).JSON(fiber.Map{
		"message":  "Order created successfully",
		"order_id": order.ID,
	})
}

func GetAllOrder(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := uint(claims["id"].(float64))

	var orders []struct {
		ID             uint      `json:"order_id"`
		ShopID         uint      `json:"shop_id"`
		ShopName       string    `json:"shop_name"`
		ShopTelephone  string    `json:"shop_phone"`
		CreatedAt      time.Time `json:"created_at"`
		TotalPrice     float64   `json:"total_price"`
		StatusShipping string    `json:"status_shipping"`
		ProductCount   int       `json:"product_count"`
	}

	query := "SELECT " +
	"o.id, o.shop_id, s.shop_name, s.shop_telephone, o.created_at, o.total_price, o.status_shipping, " +
	"COUNT(oi.id) AS product_count " +
	"FROM `order` o " +
	"JOIN shops s ON o.shop_id = s.id " +
	"JOIN orderitem oi ON o.id = oi.order_id " +
	"WHERE o.user_id = ? AND o.status_shipping NOT IN ('delivered', 'cancelled') " +
	"GROUP BY o.id, s.shop_name, s.shop_telephone, o.shop_id, o.created_at, o.total_price, o.status_shipping"


	if err := database.DB.Raw(query, userID).Scan(&orders).Error; err != nil {
		fmt.Println("DB Error:", err) 
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch orders"})
	}

	return c.JSON(orders)
}

func GetAllOrderHistory(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := uint(claims["id"].(float64))

	var orders []struct {
		ID             uint      `json:"order_id"`
		ShopID         uint      `json:"shop_id"`
		ShopName       string    `json:"shop_name"`
		ShopTelephone  string    `json:"shop_phone"`
		CreatedAt      time.Time `json:"created_at"`
		TotalPrice     float64   `json:"total_price"`
		StatusShipping string    `json:"status_shipping"`
		ProductCount   int       `json:"product_count"`
	}

	query := "SELECT " +
		"o.id, " +
		"o.shop_id, " +
		"s.shop_name, " +
		"s.shop_telephone, " +
		"o.created_at, " +
		"o.total_price, " +
		"o.status_shipping, " +
		"COUNT(oi.id) AS product_count " +
		"FROM `order` o " +
		"JOIN shops s ON o.shop_id = s.id " +
		"JOIN orderitem oi ON o.id = oi.order_id " +
		"WHERE o.user_id = ? AND o.status_shipping IN ('delivered', 'cancelled') " +
		"GROUP BY o.id, s.shop_name, s.shop_telephone, o.shop_id, o.created_at, o.total_price, o.status_shipping"

	if err := database.DB.Raw(query, userID).Scan(&orders).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch order history"})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"orders": orders,})
}


func GetOrderDetail(c *fiber.Ctx) error {
	orderID := c.Params("id")

	var order struct {
		ID             uint      `json:"order_id"`
		ShopID         uint      `json:"shop_id"`
		ShopName       string    `json:"shop_name"`
		ShopTelephone  string    `json:"shop_phone"`
		Recipient      string    `json:"recipient"`
		Telephone      string    `json:"telephone"`
		Address        string    `json:"address"`
		Note           string    `json:"note"`
		CreatedAt      time.Time `json:"created_at"`
		StatusShipping string    `json:"status_shipping"`
		CancelBy       *string   `json:"cancel_by"`
		TotalPrice     float64   `json:"total_price"`
		ProofPayment   string    `json:"proof_payment"`
	}

	query := "SELECT " +
	"o.id, " +
	"o.shop_id, " +
	"s.shop_name, " +
	"s.shop_telephone, " +
	"o.recipient, " +
	"o.telephone, " +
	"o.address, " +
	"o.note, " +
	"o.created_at, " +
	"o.status_shipping, " +
	"o.total_price, " +
	"o.proof_payment, " +
	"o.cancel_by " +
	"FROM `order` o " +
	"JOIN shops s ON o.shop_id = s.id " +
	"WHERE o.id = ?"

if err := database.DB.Raw(query, orderID).Scan(&order).Error; err != nil {
	return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
}

	var items []struct {
		Name     string  `json:"name"`
		Label    string  `json:"label"`
		Quantity int     `json:"quantity"`
		Price    float64 `json:"price"`
		Image    string  `json:"image"`
	}

	queryItems := "SELECT " +
	"p.name, " +
	"p.label, " +
	"oi.quantity, " +
	"oi.price, " +
	"p.image " +
	"FROM orderitem oi " +
	"JOIN products p ON oi.product_id = p.id " +
	"WHERE oi.order_id = ?"

if err := database.DB.Raw(queryItems, orderID).Scan(&items).Error; err != nil {
	return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch order items"})
}

	return c.JSON(fiber.Map{
		"order":       order,
		"order_items": items,
	})
}



func CancelOrder(c *fiber.Ctx) error {
	orderID := c.Params("id")
	var body struct {
		CancelRole string `json:"cancel_role"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
	}
	order.StatusShipping = "cancelPending"
	order.CancelBy = &body.CancelRole
	if err := database.DB.Save(&order).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to cancel order"})
	}
	return c.JSON(fiber.Map{"message": "Order cancellation requested"})
}

func RejectCancel(c *fiber.Ctx) error {
	orderID := c.Params("id")
	if err := database.DB.Model(&models.Order{}).
		Where("id = ? AND status_shipping = ?", orderID, "cancelPending").
		Updates(map[string]interface{}{"status_shipping": "prepared", "cancel_by": nil}).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to reject cancel"})
	}
	return c.JSON(fiber.Map{"message": "Order cancel rejected"})
}

func AcceptCancel(c *fiber.Ctx) error {
	orderID := c.Params("id")
	if err := database.DB.Model(&models.Order{}).
		Where("id = ?", orderID).
		Update("status_shipping", "cancelled").Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to accept cancel"})
	}
	return c.JSON(fiber.Map{"message": "Order cancelled"})
}

func GetAllSales(c *fiber.Ctx) error {
    shopID := c.Params("shop_id")

    shopIDInt, err := strconv.Atoi(shopID)
    if err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid shop_id"})
    }

    var sales []struct {
        ID             uint      `json:"order_id"`
        ShopID         uint      `json:"shop_id"`
        Recipient      string    `json:"recipient"`
        Telephone      string    `json:"telephone"`
        CreatedAt      time.Time `json:"created_at"`
        TotalPrice     float64   `json:"total_price"`
        StatusShipping string    `json:"status_shipping"`
        ProductCount   int       `json:"product_count"`
    }

    query := "SELECT " +
	"o.id, " +
	"o.shop_id, " +
	"o.recipient, " +
	"o.telephone, " +
	"o.created_at, " +
	"o.total_price, " +
	"o.status_shipping, " +
	"COUNT(oi.id) AS product_count " +
	"FROM `order` o " +
	"JOIN orderitem oi ON o.id = oi.order_id " +
	"WHERE o.shop_id = ? " +
	"GROUP BY o.id"


    if err := database.DB.Raw(query, shopIDInt).Scan(&sales).Error; err != nil {
        fmt.Println("Query error:", err)
        return c.Status(500).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(fiber.Map{
        "status": "success",
        "data":   sales,
    })
}


func AcceptPayment(c *fiber.Ctx) error {
	orderID := c.Params("id")
	var body struct {
		Status bool `json:"status"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	update := map[string]interface{}{}
	if body.Status {
		update["status_shipping"] = "prepared"
	} else {
		update["status_shipping"] = "cancelled"
		update["cancel_by"] = "seller"
	}
	if err := database.DB.Model(&models.Order{}).Where("id = ?", orderID).Updates(update).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update payment"})
	}
	return c.JSON(fiber.Map{"message": "Payment status updated"})
}

func ChangeStatusShipping(c *fiber.Ctx) error {
	orderID := c.Params("id")
	var body struct {
		StatusShipping string `json:"status_shipping"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	valid := map[string]bool{"prepared": true, "shipped": true, "delivered": true}
	if !valid[body.StatusShipping] {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid status"})
	}
	if err := database.DB.Model(&models.Order{}).
		Where("id = ?", orderID).
		Update("status_shipping", body.StatusShipping).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update shipping status"})
	}
	return c.JSON(fiber.Map{"message": "Status updated"})
}
