package routes

import (
	"finpro/controllers"
	"finpro/middleware"

	"github.com/gofiber/fiber/v2"
)

func OrderRoutes(api fiber.Router) {
	order := api.Group("/orders", middleware.Protected())

	order.Post("/", controllers.CreateOrder)
	order.Get("/", controllers.GetAllOrder)
	order.Get("/history", controllers.GetAllOrderHistory)
	order.Get("/:id", controllers.GetOrderDetail)

	order.Patch("/:id/cancel", controllers.CancelOrder)
	order.Patch("/:id/reject-cancel", controllers.RejectCancel)
	order.Patch("/:id/accept-cancel", controllers.AcceptCancel)

	order.Get("/sales/:shop_id",middleware.RequireRole("seller"), controllers.GetAllSales)
	order.Patch("/:id/accept-payment",middleware.RequireRole("seller"), controllers.AcceptPayment)
	order.Patch("/:id/status",middleware.RequireRole("seller"), controllers.ChangeStatusShipping)
}
