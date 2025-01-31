package initial

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
)

type HttpClient struct {
	H *http.Client
}

func (h HttpClient) DoPost(ctx context.Context, url string, jsonData interface{}, response interface{}) error {
	data, err := json.Marshal(jsonData)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(data))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := h.H.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return err
	}

	return nil
}
