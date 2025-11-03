package routes

import (
	"finpro/controllers"
	"finpro/middleware"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(api fiber.Router){
	user := api.Group("/user")
	user.Get("/profile",middleware.Protected(), controllers.GetProfile)
	user.Patch("/profile",middleware.Protected(), controllers.UpdateProfile)
	user.Delete("/:id", controllers.DeleteUser)
	user.Get("/", middleware.Protected(), middleware.RequireRole("admin"), controllers.GetAllUser)
}