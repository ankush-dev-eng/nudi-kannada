package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"unicode"
)

// Dataset represents the root structure of phrases.json
type Dataset struct {
	Version    string             `json:"version"`
	Situations []Situation        `json:"situations"`
	Phrases    []Phrase           `json:"phrases"`
	Roleplays  []RoleplayScenario `json:"roleplays"`
}

type Situation struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	TitleKannada string `json:"titleKannada"`
	Description  string `json:"description"`
	PhraseCount  int    `json:"phraseCount"`
	AccentColor  string `json:"accentColor"`
}

type Phrase struct {
	ID           string   `json:"id"`
	SituationID  string   `json:"situationId"`
	Kannada      string   `json:"kannada"`
	Romanization string   `json:"romanization"`
	English      string   `json:"english"`
	Note         string   `json:"note"`
	Formality    string   `json:"formality"`
	Tags         []string `json:"tags"`
	Reviewed     bool     `json:"reviewed"`
}

type RoleplayOption struct {
	ID           string `json:"id"`
	Kannada      string `json:"kannada"`
	Romanization string `json:"romanization"`
	English      string `json:"english"`
	PhraseID     string `json:"phraseId"`
	NextStepID   string `json:"nextStepId"`
}

type RoleplayStep struct {
	ID           string           `json:"id"`
	Speaker      string           `json:"speaker"`
	SpeakerName  string           `json:"speakerName"`
	Kannada      string           `json:"kannada"`
	Romanization string           `json:"romanization"`
	English      string           `json:"english"`
	PhraseID     string           `json:"phraseId,omitempty"`
	Options      []RoleplayOption `json:"options,omitempty"`
	NextStepID   string           `json:"nextStepId,omitempty"`
}

type RoleplayScenario struct {
	ID            string                  `json:"id"`
	SituationID   string                  `json:"situationId"`
	Title         string                  `json:"title"`
	TitleKannada  string                  `json:"titleKannada"`
	Description   string                  `json:"description"`
	PartnerRole   string                  `json:"partnerRole"`
	UserRole      string                  `json:"userRole"`
	InitialStepID string                  `json:"initialStepId"`
	Steps         map[string]RoleplayStep `json:"steps"`
}

// ValidationError records a specific validation fault
type ValidationError struct {
	Context string
	Message string
}

func (e ValidationError) String() string {
	return fmt.Sprintf("[%s] %s", e.Context, e.Message)
}

// containsKannadaScript checks if a string contains any Unicode Kannada character (\u0C80-\u0CFF)
func containsKannadaScript(s string) bool {
	for _, r := range s {
		if unicode.In(r, unicode.Kannada) || (r >= 0x0C80 && r <= 0x0CFF) {
			return true
		}
	}
	return false
}

// ValidateDataset validates a raw byte slice of phrases.json and returns a slice of errors
func ValidateDataset(data []byte) (*Dataset, []ValidationError) {
	var errors []ValidationError
	var dataset Dataset

	if err := json.Unmarshal(data, &dataset); err != nil {
		return nil, []ValidationError{{Context: "JSON", Message: fmt.Sprintf("invalid JSON syntax: %v", err)}}
	}

	if dataset.Version == "" {
		errors = append(errors, ValidationError{Context: "Root", Message: "dataset version is required"})
	}

	if len(dataset.Situations) == 0 {
		errors = append(errors, ValidationError{Context: "Root", Message: "at least one situation is required"})
	}

	situationIDs := make(map[string]bool)
	for idx, sit := range dataset.Situations {
		ctx := fmt.Sprintf("Situation[%d]", idx)
		if sit.ID == "" {
			errors = append(errors, ValidationError{Context: ctx, Message: "id is required"})
		} else if situationIDs[sit.ID] {
			errors = append(errors, ValidationError{Context: ctx, Message: fmt.Sprintf("duplicate situation id: %s", sit.ID)})
		} else {
			situationIDs[sit.ID] = true
		}
		if sit.Title == "" {
			errors = append(errors, ValidationError{Context: ctx, Message: "title is required"})
		}
		if sit.TitleKannada == "" {
			errors = append(errors, ValidationError{Context: ctx, Message: "titleKannada is required"})
		} else if !containsKannadaScript(sit.TitleKannada) {
			errors = append(errors, ValidationError{Context: ctx, Message: "titleKannada must contain Kannada script"})
		}
	}

	phraseIDs := make(map[string]bool)
	phrasesPerSituation := make(map[string]int)

	for idx, p := range dataset.Phrases {
		ctx := fmt.Sprintf("Phrase[%d - %s]", idx, p.ID)

		if p.ID == "" {
			errors = append(errors, ValidationError{Context: ctx, Message: "id is required"})
		} else if phraseIDs[p.ID] {
			errors = append(errors, ValidationError{Context: ctx, Message: fmt.Sprintf("duplicate phrase id: %s", p.ID)})
		} else {
			phraseIDs[p.ID] = true
		}

		if p.SituationID == "" {
			errors = append(errors, ValidationError{Context: ctx, Message: "situationId is required"})
		} else if !situationIDs[p.SituationID] {
			errors = append(errors, ValidationError{Context: ctx, Message: fmt.Sprintf("unknown situationId: %s", p.SituationID)})
		} else {
			phrasesPerSituation[p.SituationID]++
		}

		if strings.TrimSpace(p.Kannada) == "" {
			errors = append(errors, ValidationError{Context: ctx, Message: "kannada text is required"})
		} else if !containsKannadaScript(p.Kannada) {
			errors = append(errors, ValidationError{Context: ctx, Message: "kannada field must contain Kannada Unicode characters"})
		}

		if strings.TrimSpace(p.Romanization) == "" {
			errors = append(errors, ValidationError{Context: ctx, Message: "romanization is required"})
		}

		if strings.TrimSpace(p.English) == "" {
			errors = append(errors, ValidationError{Context: ctx, Message: "english translation is required"})
		}

		if p.Formality != "casual" && p.Formality != "polite" {
			errors = append(errors, ValidationError{Context: ctx, Message: fmt.Sprintf("formality must be 'casual' or 'polite', got '%s'", p.Formality)})
		}

		if len([]rune(p.Kannada)) > 200 {
			errors = append(errors, ValidationError{Context: ctx, Message: "kannada text exceeds max length of 200 characters"})
		}

		if len([]rune(p.Romanization)) > 250 {
			errors = append(errors, ValidationError{Context: ctx, Message: "romanization text exceeds max length of 250 characters"})
		}

		if len([]rune(p.English)) > 250 {
			errors = append(errors, ValidationError{Context: ctx, Message: "english text exceeds max length of 250 characters"})
		}
	}

	// Rule: Every situation must have at least 8 phrases
	for sitID := range situationIDs {
		count := phrasesPerSituation[sitID]
		if count < 8 {
			errors = append(errors, ValidationError{
				Context: fmt.Sprintf("Situation[%s]", sitID),
				Message: fmt.Sprintf("expected at least 8 phrases, got %d", count),
			})
		}
	}

	// Validate Roleplays
	roleplayIDs := make(map[string]bool)
	for rIdx, r := range dataset.Roleplays {
		rCtx := fmt.Sprintf("Roleplay[%d - %s]", rIdx, r.ID)

		if r.ID == "" {
			errors = append(errors, ValidationError{Context: rCtx, Message: "id is required"})
		} else if roleplayIDs[r.ID] {
			errors = append(errors, ValidationError{Context: rCtx, Message: fmt.Sprintf("duplicate roleplay id: %s", r.ID)})
		} else {
			roleplayIDs[r.ID] = true
		}

		if !situationIDs[r.SituationID] {
			errors = append(errors, ValidationError{Context: rCtx, Message: fmt.Sprintf("unknown situationId: %s", r.SituationID)})
		}

		if len(r.Steps) == 0 {
			errors = append(errors, ValidationError{Context: rCtx, Message: "roleplay must have at least one step"})
		}

		if r.InitialStepID == "" || r.Steps[r.InitialStepID].ID == "" {
			errors = append(errors, ValidationError{Context: rCtx, Message: fmt.Sprintf("initialStepId '%s' does not exist in steps", r.InitialStepID)})
		}

		for stepKey, step := range r.Steps {
			sCtx := fmt.Sprintf("%s.Step[%s]", rCtx, stepKey)

			if step.PhraseID != "" && !phraseIDs[step.PhraseID] {
				errors = append(errors, ValidationError{Context: sCtx, Message: fmt.Sprintf("references non-existent phraseId: %s", step.PhraseID)})
			}

			for optIdx, opt := range step.Options {
				oCtx := fmt.Sprintf("%s.Option[%d]", sCtx, optIdx)
				if opt.PhraseID == "" {
					errors = append(errors, ValidationError{Context: oCtx, Message: "phraseId is required on roleplay option"})
				} else if !phraseIDs[opt.PhraseID] {
					errors = append(errors, ValidationError{Context: oCtx, Message: fmt.Sprintf("references non-existent phraseId: %s", opt.PhraseID)})
				}
				if opt.NextStepID != "" && r.Steps[opt.NextStepID].ID == "" {
					errors = append(errors, ValidationError{Context: oCtx, Message: fmt.Sprintf("nextStepId '%s' does not exist in steps", opt.NextStepID)})
				}
			}
		}
	}

	return &dataset, errors
}

func main() {
	filePath := flag.String("file", "src/data/phrases.json", "path to phrases.json file")
	flag.Parse()

	absPath, err := filepath.Abs(*filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error resolving path %s: %v\n", *filePath, err)
		os.Exit(1)
	}

	data, err := os.ReadFile(absPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file %s: %v\n", absPath, err)
		os.Exit(1)
	}

	dataset, errors := ValidateDataset(data)
	if len(errors) > 0 {
		fmt.Fprintf(os.Stderr, "Dataset validation failed with %d error(s):\n", len(errors))
		for _, vErr := range errors {
			fmt.Fprintf(os.Stderr, "  ✖ %s\n", vErr)
		}
		os.Exit(1)
	}

	fmt.Println("✓ Nudi Dataset Validation Passed!")
	fmt.Printf("  • Dataset Version:     %s\n", dataset.Version)
	fmt.Printf("  • Situations Checked:  %d\n", len(dataset.Situations))
	fmt.Printf("  • Total Phrases:       %d\n", len(dataset.Phrases))
	fmt.Printf("  • Roleplay Scenarios:  %d\n", len(dataset.Roleplays))
	fmt.Println("  • Unicode Script:      Kannada block (\\u0C80-\\u0CFF) verified on all phrases")
	fmt.Println("  • Integrity:           All roleplay step phrase references point to valid IDs")
}
