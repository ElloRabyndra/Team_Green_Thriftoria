package main

import (
	"finpro/config"
	"finpro/database"
	"finpro/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.ENVLoad()
	database.Init()
	database.Migrate()
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Static("/assets", "./assets")

	routes.Routes(app)

	app.Listen(":3000")
}