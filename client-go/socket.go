package main

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

func socket() {
	for {
		c, _, err := websocket.DefaultDialer.Dial(GlobalConfiguration.Remote+"/api/v1/upload", nil)

		if err != nil {
			log.Printf("Reconnecting to %v ...\n", GlobalConfiguration.Remote+"/api/v1/upload")
			time.Sleep(5 * time.Second)
			continue
		}
		defer c.Close()

		// transmitter
		ticker := time.NewTicker(time.Duration(float64(GlobalConfiguration.UpdInterval) * float64(time.Second)))
		defer ticker.Stop()

		for range ticker.C {
			data := collect_data()
			report := uberEatStruct{
				Data: data,
				Key:  GlobalConfiguration.Key,
			}
			jsonString, err := json.Marshal(report)
			if err != nil {
				log.Println("Error:", err)
				return
			}
			if GlobalConfiguration.Verbose {
				println(string(jsonString))
			}
			err = c.WriteMessage(websocket.TextMessage, jsonString)
			if err != nil {
				log.Println("Error sending message:", err)
				break
			}
		}
	}
}
