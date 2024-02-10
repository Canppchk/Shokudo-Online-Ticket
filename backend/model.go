package main

import (
	"database/sql"
	"errors"
	"fmt"
	"time"
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

// type Ticket struct {
// 	Id        int       `json:"id"`
// 	FoodId    int       `json:"food_id"`
// 	Date      string    `json:"date"` // Assuming date is stored in a string format otherwise use time.Time for actual date handling
// 	Expire    time.Time `json:"expire"`
// 	Status    string    `json:"status"`
// }

// func getFoodNow(db *sql.DB) ([]Food, error){
// 	query := "SELECT id, name , meal, detail, stock, price, picture , date from Food"
// 	rows, err := db.Query(query)

// 	if err !=  nil{
// 		return nil,err
// 	}

// 	foods := []Food{}
// 	for rows.Next(){
// 		var f Food
// 		err := rows.Scan(&f.Id, &f.Name , &f.Meal, &f.Detail, &f.Stock, &f.Price, &f.Picture , &f.Date)
// 		if err != nil {
// 			return nil,err
// 		}
// 		foods = append(foods,f)
// 	}
// 	return foods, nil
// }
func getFoodNow(db *sql.DB) ([]Food, error) {
    // Set the location to Japan Standard Time (JST), UTC+9
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		fmt.Printf("Failed to load location for JST: %v\n", err)
	}

	// Get the current time in Japan
	currentTime := time.Now().In(loc)
	fmt.Println("Current time in Japan:", currentTime)

	// Extract the year, month, and day from the current time to use in lunch/dinner time ranges
	year, month, day := currentTime.Date()

	// Construct lunch and dinner time ranges using the current date
	lunchStart := time.Date(year, month, day, 11, 0, 0, 0, loc) // 11:00 AM
	lunchEnd := time.Date(year, month, day, 16, 0, 0, 0, loc)   // 4:00 PM
	dinnerEnd := time.Date(year, month, day, 22, 0, 0, 0, loc)  // 10:00 PM

	// Determine mealType based on the current time in Japan
	var mealType string
	if currentTime.After(lunchStart) && currentTime.Before(lunchEnd) {
		mealType = "Lunch"
	} else if currentTime.After(lunchEnd) && currentTime.Before(dinnerEnd) {
		mealType = "Dinner"
	} else {
        // Return a slice with one Food item indicating it's not meal time
        return []Food{{
            Detail: "It's not meal time currently",
        }}, nil
    }
	
	//fmt.Println("Meal type:", mealType)
	
	//mealType := "Dinner"
    // Use CURRENT_DATE to filter by today's date, which matches the 'YYYY-MM-DD' format of your Date field
    query := "SELECT id, name, meal, detail, stock, price, picture, date FROM Food WHERE meal = ? AND DATE(date) = CURRENT_DATE"

    rows, err := db.Query(query, mealType)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var foods []Food
    for rows.Next() {
        var f Food
        err := rows.Scan(&f.Id, &f.Name, &f.Meal, &f.Detail, &f.Stock, &f.Price, &f.Picture, &f.Date)
        if err != nil {
            return nil, err
        }
        foods = append(foods, f)
    }

    if err = rows.Err(); err != nil {
        return nil, err
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

