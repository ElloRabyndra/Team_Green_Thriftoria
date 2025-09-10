package routes

import (
	"github.com/gofiber/fiber/v2"
)

func ProductsRoutes(api fiber.Router){
	event := api.Group("/products")
	event.Get("/", func (c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
}