package main

import (
	"fmt"
	"database/sql"
	"time"
	"errors"
	)

type Food struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	Meal      string    `json:"meal"`  
	Detail    string    `json:"detail"`
	Stock     int       `json:"stock"`
	Price     float64   `json:"price"`
	Picture   string    `json:"picture"` // Store Base64 encoded image
	Date      string    `json:"date"` // Representing the DateAdded column
}

type Ticket struct {
	Id        int       `json:"id"`
	FoodId    int       `json:"food_id"`
	Date      string    `json:"date"` // Assuming date is stored in a string format otherwise use time.Time for actual date handling
	Expire    time.Time `json:"expire"`
	Status    string    `json:"status"`
}

func getFoodnow(db *sql.DB) ([]Food, error){
	query := "SELECT id, name , meal, detail, stock, price, picture , date from Food"
	rows, err := db.Query(query)

	if err !=  nil{
		return nil,err
	}

	foods := []Food{}
	for rows.Next(){
		var f Food
		err := rows.Scan(&f.Id, &f.Name , &f.Meal, &f.Detail, &f.Stock, &f.Price, &f.Picture , &f.Date)
		if err != nil {
			return nil,err
		}
		foods = append(foods,f)
	}
	return foods, nil
}

func (f *Food) getFood(db *sql.DB) error {
	query := fmt.Sprintf("SELECT name , meal, detail, stock, price, picture , date FROM Food where id=%v", f.Id)
	row := db.QueryRow(query)
	err := row.Scan(&f.Name , &f.Meal, &f.Detail, &f.Stock, &f.Price, &f.Picture , &f.Date)

	if err !=  nil{
		return err
	}
	return nil
}

func (f *Food) createFood(db *sql.DB) error {
	query := fmt.Sprintf("insert into Food(name , meal, detail, stock, price, picture , date) values('%v' , '%v', '%v', %v, %v, '%v' , DATE(NOW()) )", f.Name , f.Meal, f.Detail, f.Stock, f.Price, f.Picture )
	result, err := db.Exec(query)
	if err !=  nil{
		return err
	}

	id,err := result.LastInsertId()
	if err !=  nil{
		return err
	}
	f.Id = int(id)
	return nil
}


func (f *Food) updateFood(db *sql.DB) error {
	query := fmt.Sprintf("update Food set name='%v' , meal='%v', detail='%v', stock=%v, price=%v, picture='%v' where id=%v", f.Name , f.Meal, f.Detail, f.Stock, f.Price, f.Picture, f.Id )
	result, err := db.Exec(query)
	// log.Println(result.RowsAffected())
	rowsAffected,err := result.RowsAffected()
	if rowsAffected == 0{
			return errors.New("No such row exists")
	}
	
	return err

}

func (f *Food) deleteFood(db *sql.DB) error {
	query := fmt.Sprintf("delete from Food where id=%v", f.Id )
	_, err := db.Exec(query)
	return err
}

