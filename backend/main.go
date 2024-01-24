package main

import ("net/http";"fmt")
		
func homepage( w http.ResponseWriter, r *http.Request){
	fmt.Fprintf(w, "Hello from can")
	fmt.Println("Homepage")
}

func main(){
	http.HandleFunc("/", homepage)
	http.ListenAndServe("localhost:10000",nil)
}