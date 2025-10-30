package routes

import (
	"finpro/controllers"

	"github.com/gofiber/fiber/v2"
)

func ProductsRoutes(api fiber.Router){
	product := api.Group("/products")
	product.Get("/", controllers.GetProducts)
	product.Post("/", controllers.CreateProduct)
	product.Patch("/:id", controllers.UpdateProduct)
	product.Delete("/:id", controllers.DeleteProduct)
}