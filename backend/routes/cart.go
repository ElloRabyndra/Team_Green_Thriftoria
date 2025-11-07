package routes

import (
	"github.com/gofiber/fiber/v2"
	"finpro/controllers"
	"finpro/middleware"
)

func CartRoutes(api fiber.Router) {
	cart := api.Group("/cart")

	cart.Get("/",middleware.Protected(), controllers.GetAllCart)
	cart.Post("/",middleware.Protected(), controllers.AddToCart)
	cart.Patch("/:cart_id",middleware.Protected(), controllers.UpdateCartQuantity)
	cart.Delete("/:cart_id",middleware.Protected(), controllers.DeleteCartItem)
}
