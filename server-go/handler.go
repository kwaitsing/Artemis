package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Handler struct{}

var upgrader = websocket.Upgrader{}

func (h *Handler) GetServers(c *gin.Context) {
	result, err := getServers()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.String(http.StatusOK, result)
}

func getServers() (string, error) {
	returnObj := struct {
		Status string `json:"status"`
		Data   struct {
			Servers   []Server `json:"servers"`
			Timestamp int64    `json:"timestamp"`
		} `json:"data"`
	}{
		Status: "ok",
		Data: struct {
			Servers   []Server `json:"servers"`
			Timestamp int64    `json:"timestamp"`
		}{
			Servers:   uploadedData,
			Timestamp: time.Now().Unix(),
		},
	}
	jsonData, err := json.Marshal(returnObj)
	if err != nil {
		return "", err
	}
	return string(jsonData), nil
}

func (h *Handler) HandleReport(ctx *gin.Context) {
	w, r := ctx.Writer, ctx.Request
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WS: Failed when upgrading connection: ", err)
		return
	}
	defer c.Close()

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			log.Println("WS: Failed when reading msg: ", err)
			break
		}
		var thisServer InboundServer

		if err := json.Unmarshal(msg, &thisServer); err != nil {
			log.Println("WS: Failed when trying to unmarsh the msg: ", err)
			continue
		}
		if thisServer.Key == igniteObj.Key {
			thisServer.Data.Timestamp = time.Now().Unix()
			alreadyInStore := false
			for i, server := range uploadedData {
				if server.Name == thisServer.Data.Name {
					var latestServer Server = thisServer.Data
					uploadedData[i] = latestServer
					alreadyInStore = true
					break
				}
			}
			if !alreadyInStore {
				uploadedData = append(uploadedData, thisServer.Data)
			}
		}
	}
}
