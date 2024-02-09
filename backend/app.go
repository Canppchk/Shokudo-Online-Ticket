package main 

import (
	"log"
	"net/http"
	"fmt"
	"encoding/json"
	"github.com/gorilla/mux"
	_ "github.com/go-sql-driver/mysql"
	"database/sql"
	"strconv"
	"github.com/rs/cors"
	)
		
type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func (app *App) Initialise() error {
	connectionString := fmt.Sprintf("%v:%v@tcp(163.221.29.107:3306)/%v",DbUser,DbPassword,DBName)
	// connectionString := fmt.Sprintf("%v:%v@tcp(163.221.29.107:3306)/%v?parseTime=true&charset=utf8", DbUser, DbPassword, DBName)

	var err error
	app.DB,err = sql.Open("mysql",connectionString)
	if err != nil{
		return err
	}

	app.Router = mux.NewRouter().StrictSlash(true)
	app.handleRoutes()
	return nil

}

// func (app *App) Run(address string){
// 	log.Fatal(http.ListenAndServe(address, app.Router))
// }

func (app *App) Run(addr string) {
    // Setup the CORS middleware with desired options
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"*"}, // Adjust according to your needs
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
        AllowedHeaders:   []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
        Debug:            true, // Consider setting this to false in production
    })

    // Wrap the router with CORS middleware
    handler := c.Handler(app.Router)

    // Start the server with the CORS-wrapped router
    log.Fatal(hhttp.ListenAndServe(addr, handler))
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

func (app *App) getFoodNow( w http.ResponseWriter, r *http.Request){
	foods , err := getFoodNow(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOK , foods)
}

func (app *App) getFood( w http.ResponseWriter, r *http.Request){
	vars := mux.Vars(r)
	key,err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Invalid food ID")
		return
	}

	f := Food{Id: key}
	err = f.getFood(app.DB)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			sendError(w, http.StatusNotFound, "Food not found")
		default:
			sendError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	sendResponse(w, http.StatusOK , f)
}

func (app *App) createFood( w http.ResponseWriter, r *http.Request){
	var f Food
	err := json.NewDecoder(r.Body).Decode(&f)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	err = f.createFood(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOK , f)
}

func (app *App) updateFood( w http.ResponseWriter, r *http.Request){
	vars := mux.Vars(r)
	key,err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Invalid food ID")
		return
	}

	var f Food
	err = json.NewDecoder(r.Body).Decode(&f)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	f.Id = key
	err = f.updateFood(app.DB)
	if err!=nil{
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOK , f)
}

func (app *App) deleteFood( w http.ResponseWriter, r *http.Request){
	vars := mux.Vars(r)
	key,err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Invalid food ID")
		return
	}
	f := Food{Id:key}
	err = f.deleteFood(app.DB)
	if err != nil{
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOK , map[string]string{"result": "successful deletion"})
}

// func (app *App) getTicket( w http.ResponseWriter, r *http.Request){
// 	vars := mux.Vars(r)
// 	key,err := strconv.Atoi(vars["id"])
// 	if err != nil {
// 		sendError(w, http.StatusInternalServerError, "Invalid ticket ID")
// 		return
// 	}

// 	f := Ticket{Id: key}
// 	err = f.getTicket(app.DB)
// 	if err != nil {
// 		switch err {
// 		case sql.ErrNoRows:
// 			sendError(w, http.StatusNotFound, "Ticket not found")
// 		default:
// 			sendError(w, http.StatusInternalServerError, err.Error())
// 		}
// 		return
// 	}
// 	sendResponse(w, http.StatusOK , f)
// }

func (app *App) handleRoutes(){
	app.Router.HandleFunc("/food/now", app.getFoodNow).Methods("GET")
	app.Router.HandleFunc("/food/{id}", app.getFood).Methods("GET")
	app.Router.HandleFunc("/food", app.createFood).Methods("POST")
	app.Router.HandleFunc("/food/{id}", app.updateFood).Methods("PUT")
	app.Router.HandleFunc("/food/{id}", app.deleteFood).Methods("DELETE")
	// app.Router.HandleFunc("/ticket/{id}", app.getTicket).Methods("GET")
}