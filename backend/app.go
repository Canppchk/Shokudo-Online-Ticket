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
		
type App struct {
	Router *mux.Router
	DB     *sql.DB
}

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

func sendResponse( w http.ResponseWriter, statusCode int, payload interface{}){
	//Marshal is to convert payload into json
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(response)
	
}

//this func is to handle non-okay and non 200 responses.
func sendError( w http.ResponseWriter, statusCode int, err string){
	error_message := map[string]string{"error": err}
	sendResponse(w, statusCode, error_message)
	
}

func (app *App) getFoods( w http.ResponseWriter, r *http.Request){
	foods , err := getFoods(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOk , foods)
}

func (app *App) handleRoutes(){
	app.Router.HandleFunc("/foods", app.getFoods).Methods("GET")
	
}