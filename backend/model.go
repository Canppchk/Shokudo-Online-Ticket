package main

import (
	"fmt"
	"database/sql"
	)

type Food struct {
    Id      int      `json:"id"`
    Name    string   `json:"name"`
    Meal    string   `json:"meal"`
    Detail  string   `json:"detail"`
    Stock   int      `json:"stock"`
    Price   float64  `json:"price"`
    Picture string   `json:"picture"` // Store Base64 encoded image
}

func getFoods(db *sql.DB) ([]Food, error){
	query := "SELECT id, name , meal, detail, stock, price, picture from Food"
	rows, err := db.Query(query)

	if err !=  nil{
		return nil,err
	}

	foods := []Food{}
	for rows.Next(){
		var f Food
		err := rows.Scan(&f.Id, &f.Name , &f.Meal, &f.Detail, &f.Stock, &f.Price, &f.Picture )
		if err != nil {
			return nil,err
		}
		foods = append(foods,f)
	}
	return foods, nil
}

func (f *Food) getFood(db *sql.DB) error {
	query := fmt.Sprintf("SELECT name , meal, detail, stock, price, picture from Food where id=%v", f.Id)
	row := db.QueryRow(query)
	err := row.Scan(&f.Name , &f.Meal, &f.Detail, &f.Stock, &f.Price, &f.Picture)

	if err !=  nil{
		return err
	}
	return nil
}


