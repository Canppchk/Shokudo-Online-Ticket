package main 

import (
	"log"
	"net/http"
	"fmt"
	"encoding/json"
	)
		

type Food_set struct{
	Id string
	Name string
	Meal string
	Stock int
	Price float64
}

var Menu []Food_set

func homepage( w http.ResponseWriter, r *http.Request){
	log.Println("Endpoint Hit: Homepage")
	fmt.Fprintf(w, "Hello from can")
}

func returnAllMenu( w http.ResponseWriter, r *http.Request){
	log.Println("Endpoint Hit: return all menu")
	json.NewEncoder(w).Encode(Menu)
}

func getMenu( w http.ResponseWriter, r *http.Request){
	log.Println(r.URL.Path)
	key := r.URL.Path[len("/menu/"):]
	for _,food := range Menu{
		if food.Id == key{
			json.NewEncoder(w).Encode(food)
		}
	}

}

func handleRequests(){
	http.HandleFunc("/menu", returnAllMenu)
	http.HandleFunc("/menu/", getMenu)
	http.HandleFunc("/", homepage)
	http.ListenAndServe("localhost:10000",nil)
}

func main(){
	Menu = []Food_set{
		Food_set{Id:"1",Name:"Steak Salmon",Meal:"lunch",Stock:20,Price:100.00},
		Food_set{Id:"2",Name:"Grill Pork",Meal:"dinner",Stock:20,Price:100.00},
	}
	handleRequests()
}