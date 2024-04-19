package main


import (
	"os"
	"bufio"
	"log"

	cp "github.com/otiai10/copy"
)

func readVersionFile() ([]string, error) {
    file, err := os.Open(".version")
    if err != nil {
        return nil, err
    }
    defer file.Close()

    var lines []string
    scanner :=  bufio.NewScanner(file)
    for scanner.Scan() {
        lines = append(lines, scanner.Text())
    }
    return lines, scanner.Err()
}

func update() error {
	latest, err := fetchLatest()
	if err != nil {
		return err
	}

	_, err = os.Stat(versionFile)
	if os.IsNotExist(err) {
		// exit
	}

	versionFile, err := readVersionFile()

	if *latest == versionFile[0] {
		log.Printf("blog already updated to %s", *latest)
		return nil
	}

	versionFile = versionFile[1:]


	for _, f := range versionFile {
		err := os.Remove(f)
		if err != nil {
			if os.IsNotExist(err) {
				continue
			}
			return err
		}
	}

	log.Printf("download latest (%s) %s ...", *latest, distFile)
	err = downloadLatest(*latest, distURL, distFile)
	if err != nil {
		return err
	}

	log.Printf("extract latest (%s) %s ...", *latest, distFile)
	err = unzip(distFile, "./")
	if err != nil {
		return err
	}

	err = os.Remove(distFile)
	if err != nil {
		return err
	}

	err = cp.Copy("./build", "./")
	if err != nil {
		return err
	}

	err = os.RemoveAll("./build")
	if err != nil {
		return err
	}

	return gen()
}
