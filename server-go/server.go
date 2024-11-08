package main

import (
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
)

var uploadedData = []Server{}

func igniteGin() {
	gin.SetMode(gin.ReleaseMode)
	ginObj := gin.Default()
	g := ginObj.Group("/api/v1")
	{
		g.GET("/servers", (&Handler{}).GetServers)
		g.GET("/upload", (&Handler{}).HandleReport)
	}
	err := ginObj.Run(":" + strconv.Itoa(int(igniteObj.Port)))
	if err != nil {
		log.Fatal(err)
	}
}
