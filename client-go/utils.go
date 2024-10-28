package main

import (
	"fmt"
	"os/exec"
	"strings"
)

func ContainsStr(slice []string, str string) bool {
	if str != "" {
		for _, item := range slice {
			if strings.Contains(str, item) {
				return true
			}
		}
	}
	return false
}

func networkInterfaceDefault() (string, error) {
	cmd := exec.Command("sh", "-c", "LC_ALL=C ip route 2> /dev/null | grep default; ip -6 route 2> /dev/null | grep default")
	output, _ := cmd.Output()

	// Parse the output to get the interface name.
	lines := strings.Split(string(output), "\n")
	if len(lines) == 0 {
		return "", fmt.Errorf("no default route found")
	}

	fields := strings.Fields(lines[0])
	if len(fields) == 0 {
		return "", fmt.Errorf("invalid output format")
	}

	ifacename := ""
	if fields[0] == "none" && len(fields) >= 6 {
		ifacename = fields[5]
	} else if len(fields) >= 5 {
		ifacename = fields[4]
	}

	if strings.Contains(ifacename, ":") {
		parts := strings.Split(ifacename, ":")
		ifacename = strings.TrimSpace(parts[1])
	}

	return ifacename, nil
}
