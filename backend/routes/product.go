package routes

import (
	"finpro/controllers"

	"github.com/gofiber/fiber/v2"
)

func ProductsRoutes(api fiber.Router){
	event := api.Group("/products")
	event.Get("/", controllers.GetProducts)
	event.Post("/", controllers.CreateProduct)
	event.Patch("/:id", controllers.UpdateProduct)
	event.Delete("/:id", controllers.DeleteProduct)
}