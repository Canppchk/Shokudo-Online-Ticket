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
// 	myRouter.HandleFunc("/menu", returnAllMenu)
// 	myRouter.HandleFunc("/menu/{id}", getMenu)
// 	myRouter.HandleFunc("/", homepage)
// 	http.ListenAndServe("localhost:10000", myRouter)
// }

// func checkError(e error){
// 	if e!=nil{
// 		log.Fatalln(e)
// 	}
// }

func main(){
	app := App{}
	app.Initialise()
	app.Run("localhost:10000")
}