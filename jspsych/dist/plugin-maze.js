var jsPsychMaze = (function(jspsych) {
    'use strict';

    const info = {
        name: 'maze',
        parameters: {
            prompt: { type: jspsych.ParameterType.STRING, default: 'Select the word that best continues the sentence:' },
            sentence: { type: jspsych.ParameterType.STRING, default: 'Welcome to the maze.' },
            competitors: { type: jspsych.ParameterType.STRING, default: 'XXXX XXXX XXXX XXXX' },
            attention_check: { type: jspsych.ParameterType.STRING, default: null },
            attention_check_choices: { type: jspsych.ParameterType.ARRAY, default: [true, false] },
            attention_check_correct: { type: jspsych.ParameterType.BOOL, default: true },
            keys_to_press: { type: jspsych.ParameterType.ARRAY, default: ['F', 'J'] },
            start_key: { type: jspsych.ParameterType.STRING, default: 'Space' },
            font_size: { type: jspsych.ParameterType.INT, default: 24 },
            equality_index: { type: jspsych.ParameterType.INT, default: null },
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
            let current_step = 0;
            let trial_data = [];

            if (competitors.length !== sentence.length) {
                throw new Error(`Length mismatch: sentence has ${sentence.length} words, but competitors has ${competitors.length} words.`);
            }

            const show_start_screen = () => {
                display_element.innerHTML = customStyles + `
                    <div class="container">
                        <div class="headline">Maze Task</div>
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

                    document.removeEventListener('keydown', key_listener);

                    const word_container = display_element.querySelector('.maze-words');

                    if (is_correct || trial.equality_index !== null && current_step === trial.equality_index) {
                        current_step++;
                        show_step();
                    } else {
                        word_container.style.border = '2px solid red';
                        setTimeout(() => {
                            word_container.style.border = 'none';
                            show_step();
                        }, 500);
                    }
                }
            };

            const end_trial = () => {
                if (trial.attention_check) {
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
                            trial_data.push({
                                attention_check_response: choice,
                                attention_check_correct: choice === trial.attention_check_correct
                            });
                            this.jsPsych.finishTrial(trial_data);
                        });
                    });
                } else {
                    this.jsPsych.finishTrial(trial_data);
                }
            };

            show_start_screen();
        }
    }

    MazePlugin.info = info;
    return MazePlugin;

})(jsPsychModule);
