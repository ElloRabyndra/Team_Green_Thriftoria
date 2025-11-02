package routes

import (
	"github.com/gofiber/fiber/v2"
)

func Routes(app *fiber.App) {
	api := app.Group("/api/v1") 

	ProductsRoutes(api)
	AuthRoutes(api)
	UserRoutes(api)
	ShopRoutes(api)
}