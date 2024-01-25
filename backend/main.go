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

func main(){
	app := App{}
	app.Initialise()
	app.Run("localhost:10000")
}