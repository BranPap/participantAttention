/**
 * jspsych-tweet-production
 * A jsPsych plugin for tweet production tasks with configurable prompts, article previews, and analysis
 * 
 * @author Bran Papineau
 */
var jsPsychTweetProduction = (function (jspsych) {
  'use strict';

  const info = {
    name: 'tweet-production',
    parameters: {
      /**
       * Instructions to display at the top of the page
       */
      instructions: {
        type: jspsych.ParameterType.HTML_STRING,
        default: ''
      },
      /**
       * Prompt information to provide context for the tweet task
       */
      prompt_text: {
        type: jspsych.ParameterType.HTML_STRING,
        default: 'You\'ve seen an interesting news article and want to share it with your followers.'
      },
      /**
       * News source name (e.g., "TechDaily")
       */
      news_source: {
        type: jspsych.ParameterType.STRING,
        default: 'NewsSource'
      },
      /**
       * URL for the news source logo (optional)
       */
      news_logo_url: {
        type: jspsych.ParameterType.STRING,
        default: null
      },
      /**
       * Article title to display
       */
      article_title: {
        type: jspsych.ParameterType.STRING,
        default: 'Article Title Goes Here'
      },
      /**
       * Article summary or excerpt
       */
      article_summary: {
        type: jspsych.ParameterType.STRING,
        default: 'A brief summary of the article content...'
      },
      /**
       * Additional context or task instructions after the article preview
       */
      task_description: {
        type: jspsych.ParameterType.HTML_STRING,
        default: '<p>Write a tweet sharing this article. <b>Your tweet must contain one of the words you have learned during the study</b>.</p>'
      },
      /**
       * Placeholder text for the tweet textarea
       */
      placeholder: {
        type: jspsych.ParameterType.STRING,
        default: 'Type your tweet here...'
      },
      /**
       * Character limit for the tweet (Twitter standard is 280)
       */
      char_limit: {
        type: jspsych.ParameterType.INT,
        default: 280
      },
      /**
       * Text for the button to submit the tweet
       */
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: 'Post Tweet'
      },
      /**
       * Maximum number of attempts allowed (set to 0 for unlimited)
       */
      max_attempts: {
        type: jspsych.ParameterType.INT,
        default: 0
      },
      /**
       * What to do when max attempts is reached: 'proceed' or 'end_experiment'
       */
      max_attempts_action: {
        type: jspsych.ParameterType.STRING,
        default: 'proceed'
      },
      /**
       * Message to show when max attempts is reached
       */
      max_attempts_message: {
        type: jspsych.ParameterType.STRING,
        default: 'You have reached the maximum number of attempts. The trial will now continue.'
      },
      /**
       * Array of words to check for in the tweet (e.g., ['love', 'hate', 'amazing'])
       */
      required_words: {
        type: jspsych.ParameterType.COMPLEX,
        default: []
      },
      /**
       * Whether to require at least one of the required words to be present
       */
      require_word_usage: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      /**
       * Error message to show when required words are not used
       */
      word_error_message: {
        type: jspsych.ParameterType.STRING,
        default: 'Your tweet does not contain one of the terms you\'ve learned. Please try composing the tweet again.'
      },
      /**
       * Terms to track in the tweet text for analysis purposes (legacy support)
       * Format: [{term: 'word1', key: 'data_key1'}, {term: 'word2', key: 'data_key2'}]
       */
      terms_to_track: {
        type: jspsych.ParameterType.COMPLEX,
        default: []
      },
      /**
       * Data key for storing if any of the tracked terms were used
       */
      any_term_used_key: {
        type: jspsych.ParameterType.STRING,
        default: 'used_target_term'
      },
      /**
       * Require a response before proceeding
       */
      require_response: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      /**
       * Minimum required response length (set to 0 to disable)
       */
      min_chars: {
        type: jspsych.ParameterType.INT,
        default: 0
      }
    }
  };

  /**
   * @constructor
   * @param {Object} jsPsych - The jsPsych instance
   */
  class TweetProductionPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      // Array to store all attempts
      let attempts = [];
      let attempt_timestamps = [];
      
      // Set up CSS styles
      const css = `
        <style>
          .jspsych-tweet-container {
            max-width: 550px;
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          }
          .tweet-prompt {
            background-color: #f8f9fa;
            border: 1px solid #e1e8ed;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .article-preview {
            background-color: #ffffff;
            border: 1px solid #e1e8ed;
            border-radius: 12px;
            padding: 16px;
            margin-top: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          }
          .article-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: left;
            line-height: 1.3;
            color: #0f1419;
          }
          .news-source {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          .news-logo {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-right: 8px;
            background-color: #1DA1F2;
            display: inline-block;
          }
          .news-name {
            font-size: 14px;
            font-weight: 500;
            color: #536471;
          }
          .tweet-composer {
            margin-top: 20px;
          }
          .tweet-textarea {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-family: sans-serif;
            margin-bottom: 10px;
            resize: none;
            box-sizing: border-box;
          }
          .char-counter {
            font-size: 0.9em;
            color: #657786;
            text-align: right;
            margin-bottom: 15px;
          }
          .char-counter.over-limit {
            color: red;
          }
          .jspsych-btn {
            padding: 10px 20px;
            background-color: #1DA1F2;
            color: white;
            border: none;
            border-radius: 30px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
          }
          .jspsych-btn:hover {
            background-color: #1a91da;
          }
          .jspsych-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
          .article-summary {
            font-size: 15px;
            text-align: left;
            color: #0f1419;
            line-height: 1.4;
          }
          .error-message {
            background-color: #ffebee;
            border: 1px solid #f44336;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 15px;
            color: #c62828;
            font-size: 14px;
            display: none;
          }
          .attempts-counter {
            font-size: 0.9em;
            color: #657786;
            text-align: right;
            margin-bottom: 10px;
          }
          .max-attempts-warning {
            background-color: #fff3e0;
            border: 1px solid #ff9800;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 15px;
            color: #ef6c00;
            font-size: 14px;
            display: none;
          }
        </style>
      `;

      // Create logo element based on URL or default
      let logoElement;
      if (trial.news_logo_url) {
        logoElement = `<img class="news-logo" src="${trial.news_logo_url}" alt="${trial.news_source} logo">`;
      } else {
        // Array of colors for random logo backgrounds
        const logoColors = [
          '#1DA1F2', // Twitter blue
          '#E60023', // Pinterest red
          '#FF6900', // Reddit orange
          '#0A66C2', // LinkedIn blue
          '#833AB4', // Instagram purple
          '#FF0050', // TikTok pink
          '#00B900', // Spotify green
          '#FFD400', // Snapchat yellow
          '#5865F2', // Discord blurple
          '#FF4500', // Reddit orange-red
          '#1877F2', // Facebook blue
          '#BD081C', // Pinterest dark red
        ];
        
        // Select a random color
        const randomColor = logoColors[Math.floor(Math.random() * logoColors.length)];
        logoElement = `<div class="news-logo" style="background-color: ${randomColor};"></div>`;
      }

      // Construct the HTML for the trial
      let html = css;
      html += `<div class="jspsych-tweet-container">`;
      
      // Instructions
      if (trial.instructions) {
        html += `<div class="jspsych-tweet-instructions">${trial.instructions}</div>`;
      }
      
      // Tweet prompt container
      html += `<div class="tweet-prompt">`;
      
      // Prompt text
      html += `<p>${trial.prompt_text}</p>`;
      
      // Article preview
      html += `
        <div class="article-preview">
          <div class="news-source">
            ${logoElement}
            <span class="news-name">${trial.news_source}</span>
          </div>
          <div class="article-title">
            ${trial.article_title}
          </div>
          <div class="article-summary">${trial.article_summary}</div>
        </div>
      `;
      
      // Task description
      html += trial.task_description;
      html += `</div>`; // Close tweet-prompt
      
      // Tweet composer
      html += `
        <div class="tweet-composer">
          <div id="jspsych-error-message" class="error-message"></div>
          <div id="jspsych-max-attempts-warning" class="max-attempts-warning"></div>`;
      
      // Add attempts counter if max_attempts is set
      if (trial.max_attempts > 0) {
        html += `<div id="jspsych-attempts-counter" class="attempts-counter">Attempts: <span id="jspsych-attempts-count">0</span>/${trial.max_attempts}</div>`;
      }
      
      html += `
          <textarea 
            id="jspsych-tweet-response" 
            class="tweet-textarea" 
            name="tweet_response" 
            rows="4" 
            placeholder="${trial.placeholder}"
            spellcheck=false
          ></textarea>
          <div class="char-counter"><span id="jspsych-char-count">0</span>/${trial.char_limit}</div>
          <button 
            id="jspsych-tweet-submit" 
            class="jspsych-btn"
            ${trial.require_response ? 'disabled' : ''}
          >${trial.button_label}</button>
        </div>
      </div>`;

      // Display the HTML
      display_element.innerHTML = html;

      // Set up the character counter
      const tweetTextarea = display_element.querySelector('#jspsych-tweet-response');
      const charCounter = display_element.querySelector('#jspsych-char-count');
      const submitButton = display_element.querySelector('#jspsych-tweet-submit');
      const errorMessage = display_element.querySelector('#jspsych-error-message');
      const maxAttemptsWarning = display_element.querySelector('#jspsych-max-attempts-warning');
      const attemptsCounter = display_element.querySelector('#jspsych-attempts-count');
      
      // Function to hide error message
      const hideError = () => {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
      };

      // Function to show error message
      const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      };

      // Function to hide max attempts warning
      const hideMaxAttemptsWarning = () => {
        if (maxAttemptsWarning) {
          maxAttemptsWarning.style.display = 'none';
          maxAttemptsWarning.textContent = '';
        }
      };

      // Function to show max attempts warning
      const showMaxAttemptsWarning = (message) => {
        if (maxAttemptsWarning) {
          maxAttemptsWarning.textContent = message;
          maxAttemptsWarning.style.display = 'block';
        }
      };

      // Function to update attempts counter
      const updateAttemptsCounter = () => {
        if (attemptsCounter) {
          attemptsCounter.textContent = attempts.length;
        }
      };

      tweetTextarea.addEventListener('input', function() {
        hideError(); // Hide error when user starts typing
        hideMaxAttemptsWarning(); // Hide max attempts warning when user starts typing
        
        const count = this.value.length;
        charCounter.textContent = count;
        
        // Set color based on character limit
        if (count > trial.char_limit) {
          charCounter.parentElement.classList.add('over-limit');
          submitButton.disabled = true;
        } else {
          charCounter.parentElement.classList.remove('over-limit');
          
          // Enable button if there's text and it's within limit
          if (trial.require_response) {
            submitButton.disabled = (count < trial.min_chars);
          } else {
            submitButton.disabled = false;
          }
        }
      });

      // Function to check if required words are present
      const checkRequiredWords = (text) => {
        if (!trial.require_word_usage || !trial.required_words || trial.required_words.length === 0) {
          return true;
        }
        
        const lowerText = text.toLowerCase();
        return trial.required_words.some(word => lowerText.includes(word.toLowerCase()));
      };

      // Function to end the trial when the submit button is clicked
      const end_trial = () => {
        // Get the tweet response
        const tweet_text = tweetTextarea.value;
        
        // Record this attempt
        const attempt_time = performance.now() - start_time;
        attempts.push(tweet_text);
        attempt_timestamps.push(attempt_time);
        updateAttemptsCounter();
        
        // Check if required words are present
        const wordsValid = checkRequiredWords(tweet_text);
        
        // Check if max attempts reached
        const maxAttemptsReached = trial.max_attempts > 0 && attempts.length >= trial.max_attempts;
        
        if (!wordsValid && !maxAttemptsReached) {
          showError(trial.word_error_message);
          return; // Don't proceed with trial completion
        }
        
        // If max attempts reached but words still not valid
        if (maxAttemptsReached && !wordsValid) {
          if (trial.max_attempts_action === 'end_experiment') {
            // End the entire experiment
            this.jsPsych.endExperiment(trial.max_attempts_message);
            return;
          } else {
            // Show warning but proceed with trial
            showMaxAttemptsWarning(trial.max_attempts_message);
          }
        }
        
        // Measure response time (final attempt)
        const response_time = attempt_time;
        
        // Process the tracked terms (legacy support)
        const track_results = {};
        let any_term_used = false;
        
        if (trial.terms_to_track && trial.terms_to_track.length > 0) {
          const lowerText = tweet_text.toLowerCase();
          
          trial.terms_to_track.forEach(item => {
            const termUsed = lowerText.includes(item.term.toLowerCase());
            track_results[item.key] = termUsed;
            if (termUsed) any_term_used = true;
          });
        }
        
        if (trial.any_term_used_key) {
          track_results[trial.any_term_used_key] = any_term_used;
        }
        
        // Process required words for data collection
        const required_word_results = {};
        let any_required_word_used = false;
        
        if (trial.required_words && trial.required_words.length > 0) {
          const lowerText = tweet_text.toLowerCase();
          
          trial.required_words.forEach((word, index) => {
            const wordUsed = lowerText.includes(word.toLowerCase());
            required_word_results[`required_word_${index + 1}_used`] = wordUsed;
            required_word_results[`required_word_${index + 1}`] = word;
            if (wordUsed) any_required_word_used = true;
          });
          
          required_word_results['any_required_word_used'] = any_required_word_used;
        }
        
        // Save data
        const trial_data = {
          rt: response_time,
          response: tweet_text,
          tweet_length: tweet_text.length,
          attempts: attempts,
          attempt_timestamps: attempt_timestamps,
          total_attempts: attempts.length,
          failed_attempts: Math.max(0, attempts.length - 1),
          max_attempts_reached: maxAttemptsReached,
          completed_successfully: wordsValid,
          ...track_results,
          ...required_word_results
        };
        
        // Clear the display and end trial
        display_element.innerHTML = '';
        this.jsPsych.finishTrial(trial_data);
      };

      // Start timing
      const start_time = performance.now();
      
      // Add event listener to the submit button
      display_element.querySelector('#jspsych-tweet-submit').addEventListener('click', end_trial);
    }
  }

  TweetProductionPlugin.info = info;

  return TweetProductionPlugin;
})(jsPsychModule);