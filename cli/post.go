package main

import (
	"strings"
	"time"
)

type Date struct {
	Time time.Time
}

func (t *Date) UnmarshalYAML(unmarshal func(interface{}) error) error {

	var buf string
	err := unmarshal(&buf)
	if err != nil {
		return nil
	}

	tt, err := time.Parse("2006-01-02", strings.TrimSpace(buf))
	if err != nil {
		return err
	}
	t.Time = tt
	return nil
}

func (t Date) MarshalYAML() (interface{}, error) {
	return t.Time.Format("2006-01-02"), nil
}

type Post struct {
	Skip    bool     `yaml:"skip"`
	Title   string   `yaml:"title"`
	Link    string   `yaml:"link"`
	Date    *Date    `yaml:"date"`
	Summary string   `yaml:"summary"`
	Tags    []string `yaml:"tags"`
}
