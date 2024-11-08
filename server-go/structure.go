package main

type ignite struct {
	Port uint16
	Key  string
}

type PrecObj struct {
	Used  uint64 `json:"used"`
	Total uint64 `json:"total"`
}

type MemObj struct {
	Onboard PrecObj `json:"onboard"`
	Swap    PrecObj `json:"swap"`
}

type NwPrecObj struct {
	Up   uint64 `json:"up"`
	Down uint64 `json:"down"`
}

type NetworkObj struct {
	Total   NwPrecObj `json:"total"`
	Current NwPrecObj `json:"current"`
}

type Server struct {
	Name      string     `json:"name"`
	Location  string     `json:"location"`
	Uptime    uint64     `json:"uptime"`
	LoadAVG   float64    `json:"loadAVG"`
	Cpu       float64    `json:"cpu"`
	Mem       MemObj     `json:"mem"`
	Storage   PrecObj    `json:"storage"`
	Network   NetworkObj `json:"network"`
	Timestamp int64      `json:"timestamp,omitempty"`
}

type InboundServer struct {
	Key  string `json:"key"`
	Data Server `json:"data"`
}
