package main

import (
	"os"
	"strings"
	"testing"
)

func TestValidateRealDataset(t *testing.T) {
	data, err := os.ReadFile("../../src/data/phrases.json")
	if err != nil {
		t.Fatalf("Failed to read phrases.json: %v", err)
	}

	dataset, errors := ValidateDataset(data)
	if len(errors) > 0 {
		t.Errorf("Expected 0 errors on real dataset, got %d:", len(errors))
		for _, err := range errors {
			t.Errorf("  - %s", err)
		}
	}

	if len(dataset.Situations) != 6 {
		t.Errorf("Expected 6 situations, got %d", len(dataset.Situations))
	}
	if len(dataset.Phrases) < 60 {
		t.Errorf("Expected at least 60 phrases, got %d", len(dataset.Phrases))
	}
	if len(dataset.Roleplays) < 12 {
		t.Errorf("Expected at least 12 roleplays, got %d", len(dataset.Roleplays))
	}
}

func TestValidateInvalidJSON(t *testing.T) {
	_, errors := ValidateDataset([]byte(`{ invalid json `))
	if len(errors) == 0 {
		t.Fatal("Expected error on invalid JSON, got none")
	}
	if !strings.Contains(errors[0].Message, "invalid JSON") {
		t.Errorf("Expected 'invalid JSON' message, got: %s", errors[0].Message)
	}
}

func TestValidateKannadaScriptDetection(t *testing.T) {
	if !containsKannadaScript("ನಮಸ್ಕಾರ") {
		t.Error("Expected containsKannadaScript('ನಮಸ್ಕಾರ') to be true")
	}
	if containsKannadaScript("Hello World") {
		t.Error("Expected containsKannadaScript('Hello World') to be false")
	}
}

func TestValidateDuplicatePhraseID(t *testing.T) {
	sample := []byte(`{
		"version": "1.0.0",
		"situations": [{"id": "travel", "title": "Travel", "titleKannada": "ಪ್ರವಾಸ", "description": "d", "phraseCount": 1, "accentColor": "#000"}],
		"phrases": [
			{"id": "p1", "situationId": "travel", "kannada": "ಬಸ್", "romanization": "bus", "english": "bus", "note": "", "formality": "polite", "tags": [], "reviewed": false},
			{"id": "p1", "situationId": "travel", "kannada": "ಬಸ್", "romanization": "bus", "english": "bus", "note": "", "formality": "polite", "tags": [], "reviewed": false}
		],
		"roleplays": []
	}`)

	_, errors := ValidateDataset(sample)
	foundDuplicateErr := false
	for _, e := range errors {
		if strings.Contains(e.Message, "duplicate phrase id: p1") {
			foundDuplicateErr = true
			break
		}
	}
	if !foundDuplicateErr {
		t.Errorf("Expected duplicate phrase error, got: %v", errors)
	}
}

func TestValidateMissingKannadaScript(t *testing.T) {
	sample := []byte(`{
		"version": "1.0.0",
		"situations": [{"id": "travel", "title": "Travel", "titleKannada": "ಪ್ರವಾಸ", "description": "d", "phraseCount": 1, "accentColor": "#000"}],
		"phrases": [
			{"id": "p1", "situationId": "travel", "kannada": "English Only", "romanization": "bus", "english": "bus", "note": "", "formality": "polite", "tags": [], "reviewed": false}
		],
		"roleplays": []
	}`)

	_, errors := ValidateDataset(sample)
	foundScriptErr := false
	for _, e := range errors {
		if strings.Contains(e.Message, "must contain Kannada Unicode characters") {
			foundScriptErr = true
			break
		}
	}
	if !foundScriptErr {
		t.Errorf("Expected missing Kannada script error, got: %v", errors)
	}
}

func TestValidateRoleplayInvalidPhraseRef(t *testing.T) {
	sample := []byte(`{
		"version": "1.0.0",
		"situations": [{"id": "travel", "title": "Travel", "titleKannada": "ಪ್ರವಾಸ", "description": "d", "phraseCount": 1, "accentColor": "#000"}],
		"phrases": [
			{"id": "p1", "situationId": "travel", "kannada": "ಬಸ್", "romanization": "bus", "english": "bus", "note": "", "formality": "polite", "tags": [], "reviewed": false}
		],
		"roleplays": [
			{
				"id": "r1",
				"situationId": "travel",
				"title": "Title",
				"titleKannada": "ಪ್ರವಾಸ",
				"description": "d",
				"partnerRole": "p",
				"userRole": "u",
				"initialStepId": "s1",
				"steps": {
					"s1": {
						"id": "s1",
						"speaker": "partner",
						"speakerName": "P",
						"kannada": "ಬಸ್",
						"romanization": "bus",
						"english": "bus",
						"options": [
							{"id": "o1", "kannada": "ಬಸ್", "romanization": "bus", "english": "bus", "phraseId": "nonexistent-id", "nextStepId": "s1"}
						]
					}
				}
			}
		]
	}`)

	_, errors := ValidateDataset(sample)
	foundRefErr := false
	for _, e := range errors {
		if strings.Contains(e.Message, "non-existent phraseId: nonexistent-id") {
			foundRefErr = true
			break
		}
	}
	if !foundRefErr {
		t.Errorf("Expected invalid phraseId reference error, got: %v", errors)
	}
}
