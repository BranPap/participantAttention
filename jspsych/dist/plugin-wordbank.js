var jsPsychWordBank = (function (jspsych) {
  'use strict';

  const info = {
    name: 'word-bank',
    parameters: {
      /** The text prompt to display. Use "__BLANK__" where the selected word should appear */
      prompt: {
        type: jspsych.ParameterType.STRING,
        default: 'Select a word: __BLANK__',
        description: 'The text prompt with a __BLANK__ placeholder where the selected word will appear'
      },
      /** Array of words to display in the word bank */
      words: {
        type: jspsych.ParameterType.STRING,
        array: true,
        default: ['word1', 'word2', 'word3'],
        description: 'Words to display in the word bank'
      },
      /** Optional target words that are considered "correct" */
      target_words: {
        type: jspsych.ParameterType.STRING,
        array: true,
        default: null,
        description: 'Target words that will be marked as correct in the data'
      },
      /** Label for the submit button */
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: 'Continue',
        description: 'Label for the submit button'
      },
      /** Text for the quoted content, if any */
      quote_text: {
        type: jspsych.ParameterType.STRING,
        default: null,
        description: 'Text to display in a quoted block'
      },
      /** Source name for the quoted content */
      quote_source: {
        type: jspsych.ParameterType.STRING,
        default: null,
        description: 'Source name for the quoted content'
      },
      /** Title for the quoted content */
      quote_title: {
        type: jspsych.ParameterType.STRING,
        default: null,
        description: 'Title for the quoted content'
      },
      /** Display name for the tweet */
      display_name: {
        type: jspsych.ParameterType.STRING,
        default: 'You',
        description: 'Display name for the tweet'
      },
      /** Username for the tweet */
      username: {
        type: jspsych.ParameterType.STRING,
        default: '@participant',
        description: 'Username for the tweet'
      },
      /** Custom CSS for the component */
      custom_css: {
        type: jspsych.ParameterType.STRING,
        default: '',
        description: 'Custom CSS to add to the component'
      },
      /** Tweet layout format ('tweet' or 'simple') */
      layout: {
        type: jspsych.ParameterType.STRING,
        default: 'tweet',
        description: 'Layout format: "tweet" for Twitter-like UI or "simple" for basic layout'
      },
      //** Profile Pic for the User */
      profile_pic: {
        type: jspsych.ParameterType.STRING,
        default: null,
        descript: 'URL or path to profile picture image.'
      }
    }
  };

  class WordBankPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

      trial.words = this.jsPsych.randomization.shuffle([...trial.words]);
      // Define the base CSS
      const baseCSS = `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Special+Elite&display=swap');
        
        .word-bank-container {
          max-width: 600px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        
        .tweet-container {
          max-width: 500px;
          border: 1px solid #e1e8ed;
          border-radius: 12px;
          padding: 12px;
          margin: 20px auto;
          background: white;
        }
  
        .user-info {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
        }
  
        .profile-pic {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 10px;
          background: #1DA1F2;
        }
  
        .name-handle {
          display: flex;
          flex-direction: column;
        }
  
        .display-name {
          font-weight: bold;
          color: #0f1419;
          margin-bottom: 2px;
          text-align: left;
        }
  
        .handle {
          color: #536471;
          margin-bottom: 4px;
          text-align: left;
        }
  
        .content-area {
          color: #0f1419;
          font-size: 15px;
          line-height: 1.4;
          margin: 12px 0;
          text-align: left;
        }
  
        .quoted-content {
          border: 1px solid #e1e8ed;
          border-radius: 12px;
          padding: 12px;
          margin: 10px 0;
          background: #f7f9fa;
        }
  
        .source-info {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
  
        .source-logo {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          margin-right: 8px;
          background: #1DA1F2;
        }
  
        .source-name {
          font-weight: bold;
          color: #0f1419;
        }
  
        .quote-title {
          font-size: 15px;
          line-height: 1.4;
          color: #0f1419;
          margin-bottom: 8px;
          text-align: left;
          font-weight: bold;
        }
  
        .word-select {
          padding: 5px 10px;
          border-radius: 20px;
          border: 1px solid #1DA1F2;
          background: white;
          color: #1DA1F2;
          font-weight: bold;
          cursor: pointer;
          margin: 0 4px 4px 0;
          transition: all 0.2s ease;
        }
        
        .word-select:hover {
          background: #e8f5fe;
        }
        
        .word-bank {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 15px;
        }
        
        .text-display {
          margin-bottom: 15px;
        }
        
        .selected {
          background: #1DA1F2;
          color: white;
        }
        
        .selected-word {
          color: #1DA1F2; 
          font-weight: bold;
        }
        
        .submit-btn {
          background-color: #1DA1F2;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 16px;
          font-weight: bold;
          margin-top: 15px;
          cursor: pointer;
        }
        
        .submit-btn:hover {
          background-color: #1a8cd8;
        }
        
        .submit-btn:disabled {
          background-color: #9bd1f9;
          cursor: not-allowed;
        }
        
        .simple-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
        }
      `;

      // Add custom CSS if provided
      const cssContent = baseCSS + (trial.custom_css || '');

      // Create HTML based on layout type
      let html;
      if (trial.layout === 'tweet') {
        html = this.createTweetLayout(trial);
      } else {
        html = this.createSimpleLayout(trial);
      }

      // Add CSS and render HTML
      display_element.innerHTML = `<style>${cssContent}</style>${html}`;

      // Add event listeners to word buttons
      this.addWordButtonListeners(display_element, trial);

       // Start timing
       trial.start_time = performance.now();

      // Add event listener to submit button
      const submitButton = display_element.querySelector('#submit-button');
      submitButton.disabled = true; // Disable submit button initially
      submitButton.addEventListener('click', () => this.endTrial(display_element, trial));

       
    }

    createTweetLayout(trial) {
      // Create the text display with placeholder
      const textWithPlaceholder = trial.prompt.replace('__BLANK__', 
        `<span id="selected-word" class="selected-word">________</span>`);

      // Create profile picture element
      let profilePicHtml;
      if (trial.profile_pic) {
        profilePicHtml = `<img src="${trial.profile_pic}" class="profile-pic has-image" alt="Profile picture">`;
      } else {
        profilePicHtml = `<div class="profile-pic"></div>`;
      }

      // Create the quoted content if provided
      let quotedHtml = '';
      if (trial.quote_text || trial.quote_title) {
        quotedHtml = `
          <div class="quoted-content">
            ${trial.quote_source ? `
              <div class="source-info">
                <div class="source-logo"></div>
                <span class="source-name">${trial.quote_source}</span>
              </div>
            ` : ''}
            ${trial.quote_title ? `<div class="quote-title">${trial.quote_title}</div>` : ''}
            ${trial.quote_text ? `<p style="text-align: left">${trial.quote_text}</p>` : ''}
          </div>
        `;
      }

      // Create the word bank
      const wordButtons = trial.words.map(word => 
        `<button class="word-select" data-word="${word}">${word}</button>`
      ).join('');

      // Assemble the complete tweet layout
      return `
        <div class="word-bank-container">
          <div class="tweet-container">
            <div class="user-info">
                ${profilePicHtml}
              <div class="name-handle">
                <span class="display-name">${trial.display_name}</span>
                <span class="handle">${trial.username}</span>
              </div>
            </div>
            
            <div class="content-area">
              <div class="text-display" id="text-display">
                ${textWithPlaceholder}
              </div>
              
              <div class="word-bank" id="word-bank">
                ${wordButtons}
              </div>
            </div>
            
            ${quotedHtml}
          </div>
          
          <button id="submit-button" class="submit-btn" disabled>${trial.button_label}</button>
        </div>
      `;
    }

    createSimpleLayout(trial) {
      // Create the text display with placeholder
      const textWithPlaceholder = trial.prompt.replace('__BLANK__', 
        `<span id="selected-word" class="selected-word">________</span>`);

      // Create the word bank
      const wordButtons = trial.words.map(word => 
        `<button class="word-select" data-word="${word}">${word}</button>`
      ).join('');

      // Assemble the simple layout
      return `
        <div class="word-bank-container">
          <div class="simple-container">
            <div class="text-display" id="text-display">
              ${textWithPlaceholder}
            </div>
            
            <div class="word-bank" id="word-bank">
              ${wordButtons}
            </div>
            
            ${trial.quote_text ? `<p>${trial.quote_text}</p>` : ''}
          </div>
          
          <button id="submit-button" class="submit-btn" disabled>${trial.button_label}</button>
        </div>
      `;
    }

    addWordButtonListeners(display_element, trial) {
      // Get all word selection buttons
      const wordButtons = display_element.querySelectorAll('.word-select');
      const selectedWordDisplay = display_element.querySelector('#selected-word');
      const submitButton = display_element.querySelector('#submit-button');
      
      // Set up event listeners for each word button
      wordButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Clear all previous selections
          wordButtons.forEach(btn => btn.classList.remove('selected'));
          
          // Select this button
          this.classList.add('selected');
          
          // Update the displayed word
          const word = this.getAttribute('data-word');
          selectedWordDisplay.textContent = word;
          
          // Enable the submit button
          submitButton.disabled = false;
          
          // Store the selection in the trial
          trial.selected_word = word;
        });
      });
    }

    endTrial(display_element, trial) {
      // Ensure a word has been selected
      if (!trial.selected_word) {
        return;
      }

      // Measure response time
      const response_time = performance.now() - trial.start_time;
      
      // Gather the data to store
      const selectedWord = trial.selected_word;
      
      // Check if the selected word is a target word (if specified)
      const isTarget = trial.target_words ? 
        trial.target_words.includes(selectedWord) : null;
      
      // Create the data object to save
      const trialData = {
        selected_word: selectedWord,
        is_target: isTarget,
        rt: response_time,
        available_words: trial.words
      };
      
      // Add any additional specific checks
      if (trial.target_words) {
        trial.target_words.forEach(target => {
          trialData[`selected_${target}`] = (selectedWord === target);
        });
      }
      
      // End the trial
      display_element.innerHTML = '';
      this.jsPsych.finishTrial(trialData);
    };
  }

  WordBankPlugin.info = info;

  return WordBankPlugin;
})(jsPsychModule);