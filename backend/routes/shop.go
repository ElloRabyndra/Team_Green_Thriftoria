package routes

import (
	"finpro/controllers"
	"finpro/middleware"

	"github.com/gofiber/fiber/v2"
)

func ShopRoutes(api fiber.Router) {
	shop := api.Group("/shop")

	shop.Post("/", middleware.Protected(), middleware.RequireRole("buyer"), controllers.CreateShop)

	shop.Get("/:id", middleware.Protected(), middleware.RequireRole("buyer", "seller", "admin"), controllers.GetDetailShop)

	shop.Patch("/:id", middleware.Protected(), middleware.RequireRole("seller", "admin"), controllers.EditShop)
}
