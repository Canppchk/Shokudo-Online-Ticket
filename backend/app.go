package main 

import (
	"log"
	"net/http"
	"fmt"
	"encoding/json"
	"github.com/gorilla/mux"
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

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

// var Menu []Food_set

// func homepage( w http.ResponseWriter, r *http.Request){
// 	log.Println("Endpoint Hit: Homepage")
// 	fmt.Fprintf(w, "Hello from can")
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

// func checkError(e error){
// 	if e!=nil{
// 		log.Fatalln(e)
// 	}
// }

func (app *App) Initialise() error {
	connectionString := fmt.Sprintf("%v:%v@tcp(163.221.29.107:3306)/%v",DbUser,DbPassword,DBName)
	var err error
	app.DB,err = sql.Open("mysql",connectionString)
	if err != nil{
		return err
	}
	app.Router = mux.NewRouter().StrictSlash(true)
	return nil

}

func (app *App) Run(address string){
	log.Fatal(http.ListenAndServe(address, app.Router))
}

func getFoods( w http.ResponseWriter, r *http.Request){
	log.Println("Endpoint Hit: return all menu")
	json.NewEncoder(w).Encode(Menu)
}

func (app *App) handleRoutes(){
	app.Router.HandleFunc("/foods", getFoods).Methods("GET")
	app.Router.HandleFunc("/menu/{id}", getMenu)
	app.Router.HandleFunc("/", homepage)
	
}