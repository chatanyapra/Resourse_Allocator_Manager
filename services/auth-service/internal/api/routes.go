package api

import (
	"auth-service/internal/controllers"
	"auth-service/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetUpRoutes(app *fiber.App) {
	// Auth routes (public)
	app.Post("/register", controllers.Register)
	app.Post("/login", controllers.Login)

	// Token verification endpoint (public — used by other services)
	app.Post("/verify", controllers.VerifyToken)
	app.Get("/verify", controllers.VerifyToken) // GET support for simpler health-check style verification

	// Protected routes
	api := app.Group("/api", middleware.AuthRequired())

	// User routes
	api.Get("/profile", controllers.GetUserProfile)

	// Allocation routes
	api.Post("/allocations", controllers.CreateAllocation)
	api.Get("/allocations", controllers.GetUserAllocations)
	api.Put("/allocations/:appName/status", controllers.UpdateAllocationStatus)
	api.Get("/allocations/stats", controllers.GetAllocationStats)
}
