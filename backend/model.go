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

	foods := []Food{}
	for rows.Next(){
		var f Food
		err := rows.Scan(&f.Id, &f.Name , &f.Meal, &f.Detail, &f.Stock, &f.Price, &f.Picture )
		if err != nil {
			return nil,err
		}
		foods = append(foods,f)
	}

	//defer db.Close()
}


