package controllers

import(
	"finpro/models"
	"finpro/database"

	"github.com/gofiber/fiber/v2"
)

func GetProfile(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": user,
	})
}

func UpdateProfile(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	
	var updateData struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"message": "Cannot parse JSON",
			"error": err.Error(),
		})
	}

	if updateData.Name != "" {
		user.Username = updateData.Name
	}
	if updateData.Email != "" {
		user.Email = updateData.Email
	}
	if updateData.Password != "" {
		user.Password = updateData.Password
	}

	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"message": "Could not update user",
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": user,
	})
}

func DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status": "error",
			"message": "User not found",
			"error": err.Error(),
		})
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"message": "Could not delete user",
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"message": "User deleted successfully",
	})
}