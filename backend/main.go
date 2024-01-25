package main 

import (
	"log"
	// "net/http"
	"fmt"
	// "encoding/json"
	// "github.com/gorilla/mux"
	_ "github.com/go-sql-driver/mysql"
	"database/sql"
	)
		

type Food struct {
    Id      string
    Name    string
    Meal    string
    Detail  string
    Stock   int
    Price   float64
    Picture string  // Store Base64 encoded image
}

// var Menu []Food_set

// func homepage( w http.ResponseWriter, r *http.Request){
// 	log.Println("Endpoint Hit: Homepage")
// 	fmt.Fprintf(w, "Hello from can")
// }

// func returnAllMenu( w http.ResponseWriter, r *http.Request){
// 	log.Println("Endpoint Hit: return all menu")
// 	json.NewEncoder(w).Encode(Menu)
// }

// func getMenu( w http.ResponseWriter, r *http.Request){
// 	// log.Println(r.URL.Path)
// 	// key := r.URL.Path[len("/menu/"):]

// 	vars := mux.Vars(r)
// 	key := vars["id"]
	
// 	for _,food := range Menu{
// 		if food.Id == key{
// 			json.NewEncoder(w).Encode(food)
// 		}
// 	}

// }

// func handleRequests(){
// 	myRouter := mux.NewRouter().StrictSlash(true)
// 	myRouter.HandleFunc("/menu", returnAllMenu)
// 	myRouter.HandleFunc("/menu/{id}", getMenu)
// 	myRouter.HandleFunc("/", homepage)
// 	http.ListenAndServe("localhost:10000", myRouter)
// }

func checkError(e error){
	if e!=nil{
		log.Fatalln(e)
	}
}

func main(){
	connectionString := fmt.Sprintf("%v:%v@tcp(163.221.29.107:3306)/%v",DbUser,DbPassword,DBName)
	db,err := sql.Open("mysql",connectionString)
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
	// Menu = []Food_set{
	// 	Food_set{Id:"1",Name:"Steak Salmon",Meal:"lunch",Stock:20,Price:100.00},
	// 	Food_set{Id:"2",Name:"Grill Pork",Meal:"dinner",Stock:20,Price:100.00},
	// }
	// handleRequests()
}