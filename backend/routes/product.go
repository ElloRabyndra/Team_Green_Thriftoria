package routes

import (
	"finpro/controllers"
	"finpro/middleware"

	"github.com/gofiber/fiber/v2"
)

func ProductsRoutes(api fiber.Router) {
	product := api.Group("/products")

	product.Get("/", controllers.GetAllProducts)
	product.Get("/category/:category", controllers.GetProductByCategory)
	product.Get("/search", controllers.SearchProduct)
	product.Get("/:id", controllers.GetDetailProduct)
	product.Patch("/:id", middleware.Protected(), middleware.RequireRole("seller"), controllers.EditProduct) 
	product.Post("/", middleware.Protected(), middleware.RequireRole("seller"), controllers.AddProduct)
	product.Delete("/:id", middleware.Protected(), middleware.RequireRole("seller"), controllers.DeleteProduct)
}
