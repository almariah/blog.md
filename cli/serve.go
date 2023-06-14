package main

import (
	"log"
	"net/http"
)

type intercept404 struct {
	http.ResponseWriter
	statusCode int
}

func (w *intercept404) Write(b []byte) (int, error) {
	if w.statusCode == http.StatusNotFound {
		return len(b), nil
	}
	if w.statusCode != 0 {
		w.WriteHeader(w.statusCode)
	}
	return w.ResponseWriter.Write(b)
}

func (w *intercept404) WriteHeader(statusCode int) {
	if statusCode >= 300 && statusCode < 400 {
		w.ResponseWriter.WriteHeader(statusCode)
		return
	}
	w.statusCode = statusCode
}

func spaFileServeFunc() func(http.ResponseWriter, *http.Request) {
	fileServer := http.FileServer(http.Dir("./"))
	return func(w http.ResponseWriter, r *http.Request) {
		wt := &intercept404{ResponseWriter: w}
		fileServer.ServeHTTP(wt, r)
		if wt.statusCode == http.StatusNotFound {
			r.URL.Path = "/"
			w.Header().Set("Content-Type", "text/html")
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
			fileServer.ServeHTTP(w, r)
		}
	}
}

func serve(addr string) error {
	http.HandleFunc("/", spaFileServeFunc())
	log.Printf("Listening on %s ...", addr)
	return http.ListenAndServe(addr, nil)
}
