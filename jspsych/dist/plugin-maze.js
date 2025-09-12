var jsPsychMaze = (function(jspsych) {
    'use strict';

    const info = {
        name: 'maze',
        parameters: {
            prompt: { type: jspsych.ParameterType.STRING, default: 'Select the word that best continues the sentence:' }, // Prompt to display above stimulus
            sentence: { type: jspsych.ParameterType.STRING, default: 'Welcome to the maze.' }, // Sentence to present in maze format; will be tokenized into words at white space
            competitors: { type: jspsych.ParameterType.STRING, default: 'XXXX XXXX XXXX XXXX' }, // Competitor words, separated by spaces; must have same number of words as sentence
            attention_check: { type: jspsych.ParameterType.STRING, default: null }, // Whether or not to include an attention check question at the end of the trial
            attention_check_choices: { type: jspsych.ParameterType.ARRAY, default: null }, // Choices for attention check question answers
            attention_check_correct_choice: { type: jspsych.ParameterType.BOOL, default: null }, // Correct answer for attention check question
            keys_to_press: { type: jspsych.ParameterType.ARRAY, default: ['F', 'J'] }, // Keys to press for left and right choices, respectively. By default, 'F' for left and 'J' for right
            start_key: { type: jspsych.ParameterType.STRING, default: 'Space' }, // Key to press to start the trial, 'Space' by default
            font_size: { type: jspsych.ParameterType.INT, default: 24 }, // Font size for stimulus words
            equality_index: { type: jspsych.ParameterType.INT, default: null }, // If specified, the index of the word (0-indexed) at which point both choices are equally acceptable; if the participant selects either word, they will advance to the next step without any feedback. Good for handling cases when you want to test sentences with multiple valid continuations.
            allow_redo: { type: jspsych.ParameterType.BOOL, default: true } // If true, participants can try again after an incorrect response; if false, the trial ends immediately after an incorrect response. If true, the border of the choice container will briefly flash red to indicate an incorrect response.
        }
    };

    class MazePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            const customStyles = `
                <style>
                    body { margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #ffffff; }
                    .container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        padding: 20px;
                        background: #ffffff;
                        text-align: center;
                    }
                    .headline {
                        font-size: 26px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        color: #333;
                    }
                    .maze-words {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        margin-top: 30px;
                    }
                    .maze-word {
                        padding: 20px 40px;
                        border: 2px solid #000;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: ${trial.font_size}px;
                        background: #ffffff;
                        transition: border 0.2s, background 0.2s;
                    }
                    .instruction-text {
                        color: #555;
                        font-size: 16px;
                        margin-top: 20px;
                    }
                    .btn {
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 10px 20px;
                        margin: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: background 0.2s;
                    }
                    .btn:hover {
                        background: #0056b3;
                    }
                </style>
            `;

            const sentence = trial.sentence.trim().split(' ');
            const competitors = trial.competitors.trim().split(' ');
            const global_time = performance.now();
            let current_step = 0;
            let trial_data = [];

            if (competitors.length !== sentence.length) {
                throw new Error(`Length mismatch: sentence has ${sentence.length} words, but competitors has ${competitors.length} words.`);
            }

            const show_start_screen = () => {
                display_element.innerHTML = customStyles + `
                    <div class="container">
                        <div class="headline">Ready?</div>
                        <div class="instruction-text">
                            Press <strong>${trial.start_key.toUpperCase()}</strong> to begin the task
                        </div>
                    </div>
                `;

                const start_listener = (e) => {
                    if (e.code === trial.start_key) {
                        document.removeEventListener('keydown', start_listener);
                        show_step();
                    }
                };
                document.addEventListener('keydown', start_listener);
            };

            const show_step = () => {
                if (current_step >= sentence.length) {
                    return end_trial();
                }

                const correct_word = sentence[current_step];
                const competitor_word = competitors[current_step];
                const correct_on_left = Math.random() < 0.5;
                const left_word = correct_on_left ? correct_word : competitor_word;
                const right_word = correct_on_left ? competitor_word : correct_word;

                display_element.innerHTML = customStyles + `
                    <div class="container">
                        <div class="headline">${trial.prompt}</div>
                        <div class="maze-words">
                            <div class="maze-word" id="left-word">${left_word}</div>
                            <div class="maze-word" id="right-word">${right_word}</div>
                        </div>
                        <div class="instruction-text">
                            Press <strong>${trial.keys_to_press[0]}</strong> for left or <strong>${trial.keys_to_press[1]}</strong> for right
                        </div>
                    </div>
                `;

                const start_time = performance.now();

                const key_listener = (e) => {
                    const key = e.key.toUpperCase();
                    if (key === trial.keys_to_press[0]) select_word(0);
                    else if (key === trial.keys_to_press[1]) select_word(1);
                };
                document.addEventListener('keydown', key_listener);

                display_element.querySelector('#left-word').addEventListener('click', () => select_word(0));
                display_element.querySelector('#right-word').addEventListener('click', () => select_word(1));

                function select_word(choice) {
                    const rt = performance.now() - start_time;
                    const selected_word = choice === 0 ? left_word : right_word;
                    const is_correct = selected_word === correct_word;

                    trial_data.push({
                        step: current_step + 1,
                        left_word,
                        right_word,
                        selected_word,
                        correct_word,
                        is_correct,
                        rt
                    });

                    

                    const word_container = display_element.querySelector('.maze-words');

                    if (is_correct || trial.equality_index !== null && current_step === trial.equality_index) {
                        current_step++;
                        document.removeEventListener('keydown', key_listener);
                        show_step();
                    } else if (trial.allow_redo) {
                        word_container.style.border = '2px solid red';
                        document.removeEventListener('keydown', key_listener);
                        setTimeout(() => {
                            word_container.style.border = 'none';
                            document.addEventListener('keydown', key_listener);
                            // show_step();
                        }, 500);
                    } else {
                        document.removeEventListener('keydown', key_listener);
                        end_trial(false, false);
                    }
                }
            };

            const end_trial = (show_attention_check = true, completed_successfully = true) => {
                const trial_result = {
                    response: JSON.stringify(trial_data),
                    rt: performance.now() - global_time,
                    stimulus: trial.sentence,
                    competitors: trial.competitors,
                    completed_trial_successfully: completed_successfully
                };
            
                if (trial.attention_check && show_attention_check) {
                    display_element.innerHTML = customStyles + `
                        <div class="container">
                            <div class="headline">Attention Check</div>
                            <div class="instruction-text">${trial.attention_check}</div>
                            <div>
                                ${trial.attention_check_choices.map((c,i) => `<button class="btn" data-choice="${c}">${c}</button>`).join('')}
                            </div>
                        </div>
                    `;
                    const buttons = display_element.querySelectorAll('.btn');
                    buttons.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const choice = e.target.dataset.choice === 'true';
                            trial_result.attention_check = trial.attention_check;
                            trial_result.attention_check_choices = trial.attention_check_choices;
                            trial_result.attention_check_correct_choice = trial.attention_check_correct_choice; 
                            trial_result.attention_check_response = choice;
                            trial_result.attention_check_is_correct = choice === trial.attention_check_correct_choice;
                            this.jsPsych.finishTrial(trial_result);
                        });
                    });
                } else {
                    this.jsPsych.finishTrial(trial_result);
                }
            };
            

            show_start_screen();
        }
    }

    MazePlugin.info = info;
    return MazePlugin;

})(jsPsychModule);
