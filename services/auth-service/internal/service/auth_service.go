package service

import (
	"auth-service/internal/models"
	"auth-service/internal/repository"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Register(email string, password string) error {
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), 10)
	user := models.User{
		ID:        uuid.New().String(),
		Email:     email,
		Password:  string(hash),
		CreatedAt: time.Now(),
	}
	return repository.CreateUser(user)
}
func Login(email string, password string) (*models.User, error) {
	user, err := repository.FindUserByEmail(email)
	if err != nil {
		return nil, err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, err
	}
	return user, nil
}
