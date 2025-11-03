package controllers

import (
	"finpro/database"
	"finpro/models"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(c *fiber.Ctx) error {
	input:= new(models.RegisterInput)

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if input.Username == "" || input.Email == "" || input.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "username, email, and password are required",
		})
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "email already registered",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to hash password",
		})
	}

	user = models.User{
		Username:       input.Username,
		Email:          input.Email,
		Password:       string(hashedPassword),
		Role:           "buyer",
		ProfilePicture: "https://i.pravatar.cc/150",
		Address: "",
		Telephone: "",
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	user.Password = ""

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Register success",
		"user":    user,
	})
}

func Login(c *fiber.Ctx) error{
	input := new(models.LoginInput)

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if input.Email == "" || input.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "email and password are required",
		})
	}

	var existingUser models.User
	if err := database.DB.Preload("Shop").Where("email = ?", input.Email).First(&existingUser).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{"Message": "Email or Password not valid"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(input.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"Message": "Email or Password not validaa"})
	}

	claims := jwt.MapClaims{
		"id":   existingUser.ID,
		"username": existingUser.Username,
		"role": existingUser.Role,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not login"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    signed,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})

	return c.JSON(fiber.Map{
		"message": "Login success",
		"user": existingUser,
	})
}


func Logout(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})

	return c.JSON(fiber.Map{
		"message": "Logout success",
	})
}