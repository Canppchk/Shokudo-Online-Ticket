package main

import (
	"database/sql"
	"errors"
	"fmt"
)

type User struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     bool   `json:"role"`
}

func (u *User) createUser(db *sql.DB) error {
	query := fmt.Sprintf("insert into User(name , email, password, role) values('%v', '%v', '%v', %v)", u.Name, u.Email, u.Password, u.Role)
	result, err := db.Exec(query)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	u.Id = int(id)
	return nil
}

func (u *User) getUserById(db *sql.DB) error {
	query := fmt.Sprintf("SELECT name, email, password, role FROM User where id=%v", u.Id)
	row := db.QueryRow(query)
	err := row.Scan(&u.Name , &u.Email, &u.Password, &u.Role)

	if err !=  nil{
		return err
	}
	return nil
}

func (u *User) getUserByEmail(db *sql.DB) error {
	query := fmt.Sprintf("SELECT password ,role FROM User where email='%s'", u.Email)
	row := db.QueryRow(query)
	err := row.Scan(&u.Password, &u.Role)
	if err !=  nil{
		return err
	}
	return nil
}
func (u *User) checkDuplicateEmail(db *sql.DB) error {
	query := fmt.Sprintf("SELECT COUNT(*) FROM User WHERE email = '%s'", u.Email)
	var count int
	err := db.QueryRow(query).Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		// No duplicates found, email is not in the database
		return nil
	} else {
		// Email is a duplicate
		return errors.New("email already exists in the database")
	}
}
