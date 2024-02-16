package main

import (
	"database/sql"
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
	query := fmt.Sprintf("SELECT password FROM User where email='%s'", u.Email)
	row := db.QueryRow(query)
	err := row.Scan(&u.Password)

	if err !=  nil{
		return err
	}
	return nil
}
