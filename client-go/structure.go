package main

type GlobalConfigure struct {
	Remote      string  `json:"remote"`
	Key         string  `json:"key"`
	Name        string  `json:"name"`
	UpdInterval float32 `json:"upd_interval"`
	Verbose     bool    `json:"verbose"`
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

type ServerObj struct {
	Name     string     `json:"name"`
	Location string     `json:"location"`
	Uptime   uint64     `json:"uptime"`
	LoadAVG  float64    `json:"loadAVG"`
	Cpu      float64    `json:"cpu"`
	Mem      MemObj     `json:"mem"`
	Storage  PrecObj    `json:"storage"`
	Network  NetworkObj `json:"network"`
}

type uberEatStruct struct {
	Key  string    `json:"key"`
	Data ServerObj `json:"data"`
}
