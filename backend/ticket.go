package main

import (
	"database/sql"
	// "errors"
	// "fmt"
	// "time"
)

type Ticket struct {
	Id        int       `json:"id"`
	FoodId    int       `json:"food_id"`
	Date      string    `json:"date"` // Assuming date is stored in a string format otherwise use time.Time for actual date handling
	Status    string    `json:"status"`
	Owner     string    `json:"owner"`
}

// func (t *Ticket) getTicket(db *sql.DB) error {
// 	query := fmt.Sprintf("SELECT name , meal, detail, stock, price, picture , date FROM Food where id=%v", f.Id)
// 	row := db.QueryRow(query)
// 	err := row.Scan(&f.Name , &f.Meal, &f.Detail, &f.Stock, &f.Price, &f.Picture , &f.Date)

// 	if err !=  nil{
// 		return err
// 	}
// 	return nil
// }

// func (t *Ticket) getTicketold(db *sql.DB) error {
//     query := "SELECT FoodId, Date, Status ,Owner FROM Ticket WHERE Id = ?"
//     return db.QueryRow(query, t.Id).Scan(&t.FoodId, &t.Date, &t.Status, &t.Owner)
// }

// func (t *Ticket) getTicket(db *sql.DB) error {
//     var query string
//     var args []interface{}

//     // If the Owner is "Admin", retrieve tickets for all owners
//     if t.Owner == "Admin" {
//         query = "SELECT Id, Date, Owner FROM Ticket WHERE FoodId = ? AND Status = ?"
//         args = append(args, t.FoodId, t.Status)
//     } else {
//         // For other owners, filter by the specific owner
//         query = "SELECT Id, Date FROM Ticket WHERE FoodId = ? AND Owner = ? AND Status = ?"
//         args = append(args, t.FoodId, t.Owner, t.Status)
//     }

//     // Execute the query with the appropriate arguments
//     row := db.QueryRow(query, args...)

//     // For "Admin", also scan the Owner field from the result set
//     if t.Owner == "Admin" {
//         return row.Scan(&t.Id, &t.Date, &t.Owner)
//     } else {
//         return row.Scan(&t.Id, &t.Date)
//     }
// }

func (t *Ticket) getTicket(db *sql.DB) ([]Ticket, error) {
	var tickets []Ticket // Slice to hold the resulting tickets

	var query string
	var args []interface{}

	// If the Owner is "Admin", retrieve tickets for all owners
	if t.Owner == "Admin" {
		query = "SELECT Id, FoodId, Date, Status, Owner FROM Ticket WHERE FoodId = ? AND Status = ?"
		args = append(args, t.FoodId, t.Status)
	} else {
		// For other owners, filter by the specific owner
		query = "SELECT Id, FoodId, Date, Status, Owner FROM Ticket WHERE FoodId = ? AND Owner = ? AND Status = ?"
		args = append(args, t.FoodId, t.Owner, t.Status)
	}

	// Execute the query
	rows, err := db.Query(query, args...)
	if err != nil {
		return nil, err // Return the error to the caller
	}
	defer rows.Close() // Ensure the rows are closed after the function returns

	// Iterate over the rows
	for rows.Next() {
		var ticket Ticket
		// Scan the result into a new Ticket struct
		if err := rows.Scan(&ticket.Id, &ticket.FoodId, &ticket.Date, &ticket.Status, &ticket.Owner); err != nil {
			return nil, err // Return the error to the caller
		}
		// Append the new Ticket to the slice
		tickets = append(tickets, ticket)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tickets, nil // Return the slice of tickets
}


func (t *Ticket) createTicket(db *sql.DB) error {
    // Prepare the insert statement with placeholders for values
    stmt, err := db.Prepare("INSERT INTO Ticket(FoodId, Date, Status, Owner) VALUES(?, NOW(), 'Useable', ?)")
    if err != nil {
        return err
    }
    defer stmt.Close()

    // Execute the statement with the actual values from the Ticket struct
    result, err := stmt.Exec(t.FoodId, t.Owner)
    if err != nil {
        return err
    }

    // Get the last inserted ID
    id, err := result.LastInsertId()
    if err != nil {
        return err
    }

    t.Id = int(id) // Update the Ticket struct with the new ID
    return nil
}

func (t *Ticket) updateTicket(db *sql.DB) error {
    query := "UPDATE Ticket SET Status = ? WHERE Id = ?"
    _, err := db.Exec(query, t.Status, t.Id)
    return err
}

func (t *Ticket) deleteTicket(db *sql.DB) error {
    query := "DELETE FROM Ticket WHERE Id = ?"
    _, err := db.Exec(query, t.Id)
    return err
}






// func (f *Food) updateTicket(db *sql.DB) error {
// 	query := fmt.Sprintf("update Food set name='%v' , meal='%v', detail='%v', stock=%v, price=%v, picture='%v' where id=%v", f.Name , f.Meal, f.Detail, f.Stock, f.Price, f.Picture, f.Id )
// 	result, err := db.Exec(query)
// 	// log.Println(result.RowsAffected())
// 	rowsAffected,err := result.RowsAffected()
// 	if rowsAffected == 0{
// 			return errors.New("No such row exists")
// 	}
	
// 	return err

// }

// func (f *Food) deleteTicket(db *sql.DB) error {
// 	query := fmt.Sprintf("delete from Food where id=%v", f.Id )
// 	_, err := db.Exec(query)
// 	return err
// }