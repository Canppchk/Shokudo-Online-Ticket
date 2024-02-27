package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/mythrnr/paypayopa-sdk-go"
	"github.com/rs/cors"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func (app *App) Initialise() error {
	connectionString := fmt.Sprintf("%v:%v@tcp(163.221.29.107:3306)/%v", DbUser, DbPassword, DBName)
	// connectionString := fmt.Sprintf("%v:%v@tcp(163.221.29.107:3306)/%v?parseTime=true&charset=utf8", DbUser, DbPassword, DBName)

	var err error
	app.DB, err = sql.Open("mysql", connectionString)
	if err != nil {
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
		AllowedHeaders:   []string{"X-Requested-With", "Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true, // Consider setting this to false in production
	})

	// Wrap the router with CORS middleware
	handler := c.Handler(app.Router)

	// Start the server with the CORS-wrapped router
	log.Fatal(http.ListenAndServe(addr, handler))
}

func sendResponse(w http.ResponseWriter, statusCode int, payload interface{}) {
	//Marshal is to convert payload into json
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(response)

}

// this func is to handle non-okay and non 200 responses.
func sendError(w http.ResponseWriter, statusCode int, err string) {
	error_message := map[string]string{"error": err}
	sendResponse(w, statusCode, error_message)

}

func (app *App) getFoodNow(w http.ResponseWriter, r *http.Request) {
	foods, err := getFoodNow(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOK, foods)
}

func (app *App) getFood(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key, err := strconv.Atoi(vars["id"])
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
	sendResponse(w, http.StatusOK, f)
}

func (app *App) createFood(w http.ResponseWriter, r *http.Request) {
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
	sendResponse(w, http.StatusOK, f)
}

func (app *App) updateFood(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key, err := strconv.Atoi(vars["id"])
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
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOK, f)
}

func (app *App) deleteFood(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key, err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Invalid food ID")
		return
	}
	f := Food{Id: key}
	err = f.deleteFood(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOK, map[string]string{"result": "successful deletion"})
}

// -------------------------------------------------------------
func (app *App) createTicket(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["owner"]
	// Fetch the current available foods
	foods, err := getFoodNow(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to fetch current food")
		return
	}
	// fmt.Println(foods[0].Id)
	// Check if there are available foods
	if len(foods) == 0 || foods[0].Id == 0 { // Assuming an Id of 0 indicates no available food
		sendError(w, http.StatusNotFound, "No food available at the moment")
		return
	}

	// Select the first available food item for the ticket
	f := foods[0]

	// Create a new ticket using the selected food's Id
	t := Ticket{
		FoodId: f.Id,
		Owner:  key,
		// Set other fields like Date, Expire, Status as per your requirement
	}

	// Insert the new ticket into the database
	err = t.createTicket(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	err = f.DecrementStock(app.DB, f.Id)
	if err != nil {
		// Handle the error appropriately, maybe roll back the ticket creation or log the error
		sendError(w, http.StatusInternalServerError, "Failed to decrement food stock")
		return
	}

	sendResponse(w, http.StatusCreated, t)

}

// func (app *App) getTicket(w http.ResponseWriter, r *http.Request) {
//     vars := mux.Vars(r)
//     id, err := strconv.Atoi(vars["id"])
//     if err != nil {
//         sendError(w, http.StatusBadRequest, "Invalid ticket ID")
//         return
//     }

//     t := Ticket{Id: id}
//     err = t.getTicket(app.DB)
//     if err != nil {
//         if err == sql.ErrNoRows {
//             sendError(w, http.StatusNotFound, "Ticket not found")
//         } else {
//             sendError(w, http.StatusInternalServerError, err.Error())
//         }
//         return
//     }

//     sendResponse(w, http.StatusOK, t)
// }

func (app *App) getTicket(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["owner"]

	foods, err := getFoodNow(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to fetch current food")
		return
	}
	// fmt.Println(foods[0].Id)
	// Check if there are available foods
	if len(foods) == 0 || foods[0].Id == 0 { // Assuming an Id of 0 indicates no available food
		sendResponse(w, http.StatusOK, nil)
		return
	}

	// Select the first available food item for the ticket
	f := foods[0]
	//fmt.Println(key == "Admin")

	if key == "Admin" {
		t := Ticket{
			FoodId: f.Id,
			Owner:  key,
			Status: "Pending",
		}
		tickets, err := t.getTicket(app.DB)
		if err != nil {
			switch err {
			case sql.ErrNoRows:
				sendError(w, http.StatusNotFound, "Ticket not found")
			default:
				sendError(w, http.StatusInternalServerError, err.Error())
			}
			return
		}
		sendResponse(w, http.StatusOK, tickets)
	} else {
		t := Ticket{
			FoodId: f.Id,
			Owner:  key,
			Status: "Useable",
		}
		tickets, err := t.getTicket(app.DB)
		if err != nil {
			switch err {
			case sql.ErrNoRows:
				sendError(w, http.StatusNotFound, "Ticket not found")
			default:
				sendError(w, http.StatusInternalServerError, err.Error())
			}
			return
		}
		sendResponse(w, http.StatusOK, tickets)
	}
}

func (app *App) updateTicket(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid ticket ID")
		return
	}

	var t Ticket
	err = json.NewDecoder(r.Body).Decode(&t)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	t.Id = id

	err = t.updateTicket(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	sendResponse(w, http.StatusOK, t)
}

func (app *App) deleteTicket(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid ticket ID")
		return
	}

	t := Ticket{Id: id}
	err = t.deleteTicket(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	sendResponse(w, http.StatusOK, map[string]string{"result": "success"})
}

func (app *App) createUser(w http.ResponseWriter, r *http.Request) {
	var u User
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	err = u.checkDuplicateEmail(app.DB);
	if err != nil {
		sendError(w, http.StatusBadRequest, "Email already registered")
		return
	}

	err = u.createUser(app.DB)
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	sendResponse(w, http.StatusOK, u)
}

func (app *App) getUserById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	u := User{Id: id}
	err = u.getUserById(app.DB)
	if err != nil {
		if err == sql.ErrNoRows {
			sendError(w, http.StatusNotFound, "User not found")
		} else {
			sendError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	sendResponse(w, http.StatusOK, u)
}

// func (app *App) authenticateUser(w http.ResponseWriter, r *http.Request) {
// 	var u User
// 	err := json.NewDecoder(r.Body).Decode(&u)
// 	requestPass := u.Password
// 	if err != nil {
// 		sendError(w, http.StatusBadRequest, "Invalid request payload")
// 		return
// 	}

// 	err = u.getUserByEmail(app.DB)
// 	if err != nil {
// 		sendError(w, http.StatusInternalServerError, err.Error())
// 		return
// 	}

// 	if requestPass != u.Password {
// 		sendError(w, http.StatusUnauthorized, "Account authentication failed")
// 		return
// 	}

// 	// sendResponse(w, http.StatusOK, map[string]string{"result": "Account successfully authenticated"})
// 	sendResponse(w, http.StatusOK, map[string]bool{"role": u.Role})
// }

func (app *App) authenticateUser(w http.ResponseWriter, r *http.Request) {
    var u User
    err := json.NewDecoder(r.Body).Decode(&u)
    requestPass := u.Password
    if err != nil {
        sendError(w, http.StatusBadRequest, "Invalid request payload")
        return
    }

    err = u.getUserByEmail(app.DB)
    if err != nil {
        sendError(w, http.StatusInternalServerError, err.Error())
        return
    }

    if requestPass != u.Password {
        sendError(w, http.StatusUnauthorized, "Account authentication failed")
        return
    }

    // Adjusted the response payload to include both Role and Name
    sendResponse(w, http.StatusOK, map[string]interface{}{
        "role": u.Role,
        "name": u.Name, // Assuming 'Name' is the correct field you want to send
    })
}


func setHeader(w http.ResponseWriter) {
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func createQR(wp *paypayopa.WebPayment) func(http.ResponseWriter, *http.Request) {
	type request struct {
		OrderItems []struct {
			Name      string `json:"name"`
			Category  string `json:"category"`
			Quantity  uint   `json:"quantity"`
			ProductID uint   `json:"productId"`
			UnitPrice struct {
				Amount   uint   `json:"amount"`
				Currency string `json:"currency"`
			} `json:"unitPrice"`
		} `json:"orderItems"`
		Amount struct {
			Amount   uint   `json:"amount"`
			Currency string `json:"currency"`
		} `json:"amount"`
		UserName string `json:"userName"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		setHeader(w)

		body := &request{}
		b, _ := io.ReadAll(r.Body)

		if err := json.Unmarshal(b, body); err != nil {
			fmt.Fprint(w, `{ "errors": [{
				"code": 400,
				"message": "Bad Request"
			}] }`)

			w.WriteHeader(http.StatusBadRequest)

			return
		}

		merchantPaymentID := uuid.NewString()
		orders := make([]*paypayopa.MerchantOrderItem, 0)

		for _, o := range body.OrderItems {
			orders = append(orders, &paypayopa.MerchantOrderItem{
				Name:      o.Name,
				Category:  o.Category,
				Quantity:  int(o.Quantity),
				ProductID: strconv.FormatUint(uint64(o.ProductID), 10),
				UnitPrice: &paypayopa.MoneyAmount{
					Amount:   int(o.UnitPrice.Amount),
					Currency: paypayopa.CurrencyJPY,
				},
			})
		}

		payload := &paypayopa.CreateQRCodePayload{
			MerchantPaymentID: merchantPaymentID,
			Amount: &paypayopa.MoneyAmount{
				Amount:   int(body.Amount.Amount),
				Currency: paypayopa.CurrencyJPY,
			},
			OrderItems:   orders,
			CodeType:     paypayopa.CodeTypeOrderQR,
			RequestedAt:  time.Now().Unix(),
			RedirectType: paypayopa.RedirectTypeWebLink,
			RedirectURL:  "http://localhost:3000/ticket?name=" + body.UserName,
			// RedirectURL:  "http://localhost:10000/orderpayment/" + merchantPaymentID,
		}

		qrcode, info, err := wp.CreateQRCode(r.Context(), payload)
		if err != nil {
			fmt.Fprint(w, `{ "errors": [{
				"code": 500,
				"message": "Internal Server Error"
			}] }`)

			w.WriteHeader(http.StatusInternalServerError)

			return
		}

		if !info.Success() {
			b, _ := json.Marshal(info)
			log.Println(string(b))
			fmt.Fprint(w, `{"resultInfo": `+string(b)+`}`)
			w.WriteHeader(info.StatusCode)

			return
		}

		b, _ = json.Marshal(qrcode)
		log.Println(string(b))
		fmt.Fprint(w, `{"data": `+string(b)+`}`)
		w.WriteHeader(http.StatusOK)
	}
}

func orderStatus(wp *paypayopa.WebPayment) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		setHeader(w)

		// Using mux.Vars to retrieve route variables with Gorilla Mux
		vars := mux.Vars(r)
		merchantPaymentId := vars["merchantPaymentId"] // Accessing the parameter by name

		payment, info, err := wp.GetPaymentDetails(
			r.Context(),
			merchantPaymentId, // Use the variable directly
		)

		if err != nil {
			fmt.Fprint(w, `{ "errors": [{
				"code": 500,
				"message": "Internal Server Error"
			}] }`)

			w.WriteHeader(http.StatusInternalServerError)

			return
		}

		if !info.Success() {
			b, _ := json.Marshal(info)
			log.Println(string(b))
			fmt.Fprint(w, `{"resultInfo": `+string(b)+`}`)
			w.WriteHeader(info.StatusCode)

			return
		}

		b, _ := json.Marshal(payment)
		log.Println(string(b))
		fmt.Fprint(w, `{"data": `+string(b)+`}`)
		w.WriteHeader(http.StatusOK)
	}
}

func (app *App) handleRoutes() {
	wp := paypayopa.NewWebPayment(
		paypayopa.NewCredentials(
			paypayopa.EnvSandbox,
			"a_5tW30Yqslc_4Jhe",
			"y/Rp41c5AvLy6XjwqukUY0N30b8XDUcxYB9QUDieYSY=",
			"735282888246697984",
		),
	)

	app.Router.HandleFunc("/food/now", app.getFoodNow).Methods("GET")
	app.Router.HandleFunc("/food/{id}", app.getFood).Methods("GET")
	app.Router.HandleFunc("/food", app.createFood).Methods("POST")
	app.Router.HandleFunc("/food/{id}", app.updateFood).Methods("PUT")
	app.Router.HandleFunc("/food/{id}", app.deleteFood).Methods("DELETE")
	app.Router.HandleFunc("/ticket/{owner}", app.createTicket).Methods("POST")
	app.Router.HandleFunc("/ticket/{owner}", app.getTicket).Methods("GET")
	app.Router.HandleFunc("/ticket/{id}", app.updateTicket).Methods("PUT")
	app.Router.HandleFunc("/ticket/{id}", app.deleteTicket).Methods("DELETE")
	app.Router.HandleFunc("/register", app.createUser).Methods("POST")
	app.Router.HandleFunc("/user/{id}", app.getUserById).Methods("GET")
	app.Router.HandleFunc("/authenticate", app.authenticateUser).Methods("POST")
    app.Router.HandleFunc("/create-qr", createQR(wp)).Methods("POST")
    app.Router.HandleFunc("/order-status/{merchantPaymentId}", orderStatus(wp)).Methods("GET")
}
