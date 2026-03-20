package repository

import (
	"auth-service/internal/database"
	"auth-service/internal/models"
)

func CreateUser(user models.User) error {
	result := database.DB.Create(&user)
	return result.Error
}

func FindUserByEmail(email string) (*models.User, error) {
	var user models.User
	result := database.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}
