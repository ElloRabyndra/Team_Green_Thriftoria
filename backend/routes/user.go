package routes

import (
	"finpro/controllers"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(api fiber.Router){
	user := api.Group("/user")
	user.Get("/profile", controllers.GetProfile)
	user.Patch("/", controllers.UpdateProfile)
	user.Delete("/:id", controllers.DeleteUser)
}