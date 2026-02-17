import { create } from "zustand";
import { persist } from "zustand/middleware";
import OpenAI from "openai";

export const useEditorStore = create(
  persist(
    (set, get) => ({
      input: "",
      guidance: "",
      language: "fi", // Language selector: "en" or "fi"
      suggestion: null,
      history: [],
      isProcessing: false,
      apiKey: "",
      error: null,
      showSettings: false,
      autoProcessEnabled: true,
      lastProcessedInput: "",
      lastFailedApiKey: null, // Track the API key that failed to prevent retries
      hasApiError: false, // Track if there's an API error to stop auto-processing

      // Get default guidance based on selected language
      getDefaultGuidance: () => {
        const { language } = get();
        const defaultGuidance = {
          fi: "Korjaa kieliasu ja paranna tekstin sujuvuutta pitäen alkuperäinen sävy",
          en: "Fix grammar and improve text fluency while maintaining the original tone",
        };
        return defaultGuidance[language] || defaultGuidance.fi;
      },

      setInput: (text) => {
        const { hasApiError } = get();
        // Clear API error when input changes (user is typing new text)
        if (hasApiError) {
          set({ input: text, hasApiError: false, error: null });
        } else {
          set({ input: text });
        }
      },
      setGuidance: (text) => set({ guidance: text }),
      setLanguage: (lang) => set({ language: lang }),
      setApiKey: (key) => {
        const trimmedKey = key.trim();
        const { lastFailedApiKey, error } = get();
        // Clear error if API key changed and there was a previous API key error
        if (trimmedKey !== lastFailedApiKey && error) {
          set({
            apiKey: trimmedKey,
            error: null,
            lastFailedApiKey: null,
            hasApiError: false,
          });
        } else {
          set({ apiKey: trimmedKey });
        }
      },
      setShowSettings: (show) => set({ showSettings: show }),
      setError: (error) => {
        // Clear hasApiError when error is cleared (user dismissed it)
        if (error === null) {
          set({ error: null, hasApiError: false });
        } else {
          set({ error });
        }
      },
      toggleAutoProcess: () =>
        set((state) => ({ autoProcessEnabled: !state.autoProcessEnabled })),

      generateSuggestion: async () => {
        const {
          input,
          guidance,
          apiKey,
          lastProcessedInput,
          lastFailedApiKey,
        } = get();

        // Check if we're in mock mode (for testing)
        const useMockAI = import.meta.env.VITE_USE_MOCK_AI === "true";

        if (!useMockAI && !apiKey) {
          set({ showSettings: true });
          return;
        }

        // Prevent retries if there's a failed API key and it hasn't changed
        if (!useMockAI && lastFailedApiKey && lastFailedApiKey === apiKey) {
          return;
        }

        if (!input.trim() || input === lastProcessedInput) return;

        // Clear API error flag when user manually triggers processing (they're retrying)
        set({ isProcessing: true, error: null, hasApiError: false });

        try {
          let processedText;

          if (useMockAI) {
            // Mock AI service for testing - just uppercase the text
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
            processedText = input.toUpperCase();
          } else {
            // Real OpenAI API
            const openai = new OpenAI({
              apiKey: apiKey,
              dangerouslyAllowBrowser: true, // Required for client-side usage
            });

            const completion = await openai.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful writing assistant. Your task is to rewrite the user's text based on their specific guidance. Return ONLY the rewritten text, no explanations or quotes. IMPORTANT: You must output the text in the SAME LANGUAGE as the original input text, regardless of the language of the guidance.",
                },
                {
                  role: "user",
                  content: `Original text: ${input}\n\nGuidance: ${
                    guidance || get().getDefaultGuidance()
                  }`,
                },
              ],
              model: "gpt-5.2",
            });

            processedText = completion.choices[0]?.message?.content;

            // Remove quotes from the beginning and end if present
            if (processedText) {
              processedText = processedText.trim();
              // Remove leading and trailing quotes (single or double)
              if (
                (processedText.startsWith('"') &&
                  processedText.endsWith('"')) ||
                (processedText.startsWith("'") && processedText.endsWith("'"))
              ) {
                processedText = processedText.slice(1, -1);
              }
            }
          }

          if (processedText) {
            set({
              suggestion: processedText.trim(),
              isProcessing: false,
              lastProcessedInput: input,
            });
          } else {
            throw new Error("No response from AI");
          }
        } catch (err) {
          console.error("AI Processing Error:", err);
          console.log("Full error object:", JSON.stringify(err, null, 2));

          // Check if this is an API key authentication error
          const isApiKeyError =
            err.status === 401 ||
            err.statusCode === 401 ||
            err.message?.toLowerCase().includes("incorrect api key") ||
            err.message?.toLowerCase().includes("invalid api key") ||
            err.message?.toLowerCase().includes("authentication") ||
            err.error?.code === "invalid_api_key" ||
            err.error?.message?.toLowerCase().includes("api key");

          // Check if this is a model access error (403)
          const isModelAccessError =
            err.status === 403 ||
            err.statusCode === 403 ||
            err.message
              ?.toLowerCase()
              .includes("does not have access to model") ||
            err.error?.code === "model_not_found" ||
            err.error?.message?.toLowerCase().includes("does not have access");

          const errorMessage = err.message || "Failed to process text";

          if (isApiKeyError && !useMockAI) {
            // Track the failed API key to prevent retries
            set({
              error: `API key error: ${errorMessage}. Please update your API key in settings.`,
              isProcessing: false,
              lastFailedApiKey: apiKey,
              hasApiError: true, // Stop auto-processing
              showSettings: true, // Open settings dialog to update API key
            });
          } else if (isModelAccessError && !useMockAI) {
            // Model access error - provide helpful guidance
            const modelName = "gpt-5.2"; // Extract from error message if available
            set({
              error: `Model access error: Your OpenAI project doesn't have access to ${modelName}. Go to https://platform.openai.com/settings/project to enable model access, or change the model in the code to "gpt-4o-mini" or "gpt-4o".`,
              isProcessing: false,
              hasApiError: true, // Stop auto-processing
            });
          } else {
            set({
              error: errorMessage,
              isProcessing: false,
              hasApiError: true, // Stop auto-processing for any API error
            });
          }
        }
      },

      promoteSuggestion: () => {
        const { input, suggestion, history } = get();
        if (!suggestion) return;

        const newHistoryItem = {
          id: Date.now(),
          text: input,
          timestamp: new Date().toISOString(),
        };

        set({
          input: suggestion,
          suggestion: null,
          history: [newHistoryItem, ...history],
          lastProcessedInput: suggestion, // Prevent immediate re-processing of the promoted text
        });
      },

      discardSuggestion: () => {
        set({ suggestion: null });
      },

      restoreHistoryItem: (item) => {
        const { input, history } = get();

        // Move current input to history (if not empty)
        let newHistory = [...history];
        if (input.trim()) {
          newHistory.unshift({
            id: Date.now(),
            text: input,
            timestamp: new Date().toISOString(),
          });
        }

        // Remove the restored item from history and set as input
        newHistory = newHistory.filter((h) => h.id !== item.id);

        set({
          input: item.text,
          suggestion: null, // Clear any pending suggestion
          history: newHistory,
          lastProcessedInput: item.text, // Prevent immediate re-processing
        });
      },

      resetState: () => {
        set({
          input: "",
          guidance: "",
          language: "fi",
          suggestion: null,
          history: [],
          error: null,
          lastProcessedInput: "",
          isProcessing: false,
          lastFailedApiKey: null,
          hasApiError: false,
        });
      },
    }),
    {
      name: "editor-storage",
      partialize: (state) => ({
        apiKey: state.apiKey,
        history: state.history,
        language: state.language,
      }), // Persist API key, history, and language
    },
  ),
);
