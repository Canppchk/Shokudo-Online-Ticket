package main

type Food struct {
    Id      string   `json:"id"`
    Name    string   `json:"name"`
    Meal    string   `json:"meal"`
    Detail  string   `json:"detail"`
    Stock   int      `json:"stock"`
    Price   float64  `json:"price"`
    Picture string   `json:"picture"` // Store Base64 encoded image
}

func getFoods(db *sql.DB) ([]Food, err){
	query := "SELECT id, name , meal, detail, stock, price, picture from Food"
	rows, err := db.Query(query)

	if err !=  nil{
		return nil,err
	}

	foods := []food
	//----
	checkError(err)

	defer db.Close()

	rows, err := db.Query("SELECT * from Food")
	checkError(err)

	for rows.Next(){
		var food Food
		err := rows.Scan(&food.Id, &food.Name , &food.Meal, &food.Detail, &food.Stock, &food.Price, &food.Picture )
		checkError(err)
		fmt.Println(food)
	}
	
}


