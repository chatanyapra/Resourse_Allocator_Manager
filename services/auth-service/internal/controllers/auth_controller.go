package controllers

import (
	"auth-service/internal/middleware"
	"auth-service/internal/models"
	"auth-service/internal/service"

	"github.com/gofiber/fiber/v2"
)

type AuthRequest struct {
	Email string `json:"email"`
}

type RegisterRequest struct {
	Email string `json:"email"`
}

func Register(c *fiber.Ctx) error {
	req := new(RegisterRequest)
	if err := c.BodyParser(req); err != nil {
		return err
	}
	user, err := service.Register(req.Email)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Registration failed",
			"details": err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"message": "User created successfully",
		"user": user,
	})
}

func Login(c *fiber.Ctx) error {
	req := new(AuthRequest)
	if err := c.BodyParser(req); err != nil {
		return err
	}
	user, err := service.FindOrCreateUser(req.Email)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}
	token, _ := middleware.GenerateToken(user.ID)
	return c.JSON(fiber.Map{
		"token": token,
		"user":  user,
	})
}

// VerifyToken validates a JWT token and returns the decoded user info.
// Other microservices can call this endpoint to verify tokens.
func VerifyToken(c *fiber.Ctx) error {
	var tokenString string

	// Try Authorization header first
	authHeader := c.Get("Authorization")
	if authHeader != "" {
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			tokenString = authHeader[7:]
		} else {
			tokenString = authHeader
		}
	}

	// Fall back to request body
	if tokenString == "" {
		var body struct {
			Token string `json:"token"`
		}
		if err := c.BodyParser(&body); err == nil && body.Token != "" {
			tokenString = body.Token
		}
	}

	if tokenString == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Token is required (via Authorization header or body)",
			"code":  "TOKEN_MISSING",
		})
	}

	claims, err := middleware.VerifyToken(tokenString)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"valid": false,
			"error": "Invalid or expired token",
			"code":  "TOKEN_INVALID",
		})
	}

	userID, _ := claims["user_id"].(string)

	// Optionally fetch user details
	user, userErr := service.GetUserByID(userID)

	response := fiber.Map{
		"valid":   true,
		"user_id": userID,
	}

	if userErr == nil && user != nil {
		response["user"] = user
	}

	return c.JSON(response)
}

func GetUserProfile(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	user, err := service.GetUserByID(userID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}
	return c.JSON(user)
}

// Allocation management endpoints
func CreateAllocation(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	var allocation models.Allocation
	if err := c.BodyParser(&allocation); err != nil {
		return err
	}
	
	// Set user ID
	allocation.UserID = userID
	
	result, err := service.CreateAllocation(&allocation)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create allocation",
			"details": err.Error(),
		})
	}
	
	return c.JSON(fiber.Map{
		"success": true,
		"allocation": result,
	})
}

func GetUserAllocations(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	allocations, err := service.GetUserAllocations(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get allocations",
			"details": err.Error(),
		})
	}
	
	return c.JSON(fiber.Map{
		"success": true,
		"allocations": allocations,
		"total": len(allocations),
	})
}

func UpdateAllocationStatus(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	appName := c.Params("appName")
	
	var updateData struct {
		Status string `json:"status"`
		URL    string `json:"url,omitempty"`
	}
	
	if err := c.BodyParser(&updateData); err != nil {
		return err
	}
	
	allocation, err := service.UpdateAllocationStatus(userID, appName, updateData.Status, updateData.URL)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to update allocation",
			"details": err.Error(),
		})
	}
	
	return c.JSON(fiber.Map{
		"success": true,
		"allocation": allocation,
	})
}

func GetAllocationStats(c *fiber.Ctx) error {
	stats, err := service.GetAllocationStats()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get stats",
			"details": err.Error(),
		})
	}
	
	return c.JSON(fiber.Map{
		"success": true,
		"stats": stats,
	})
}
