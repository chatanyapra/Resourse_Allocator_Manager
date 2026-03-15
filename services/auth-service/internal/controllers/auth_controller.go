package controllers

import (
	"auth-service/internal/middleware"
	"auth-service/internal/service"

	"github.com/gofiber/fiber/v2"
)

type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c *fiber.Ctx) error {
	req := new(AuthRequest)
	if err := c.BodyParser(req); err != nil {
		return err
	}
	err := service.Register(req.Email, req.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Registration failed",
		})
	}
	return c.JSON(fiber.Map{
		"message": "User created successfully",
	})
}
func Login(c *fiber.Ctx) error {
	req := new(AuthRequest)
	if err := c.BodyParser(req); err != nil {
		return err
	}
	user, err := service.Login(req.Email, req.Password)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}
	token, _ := middleware.GenerateToken(user.ID)
	return c.JSON(fiber.Map{
		token: token,
	})
}
