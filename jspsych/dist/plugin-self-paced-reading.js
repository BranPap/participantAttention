var jsPsychSelfPacedReading = (function (jspsych) {
    "use strict";
  
    const info = {
        name: 'self-paced-reading',
        parameters: {
            stimulus: {
                type: jspsych.ParameterType.STRING,
                default: undefined,
                description: 'The text to be displayed word by word'
            },
            question: {
                type: jspsych.ParameterType.STRING,
                default: undefined,
                description: 'The attention check question'
            },
            correct_answer: {
                type: jspsych.ParameterType.BOOL,
                default: undefined,
                description: 'The correct answer (true/false) to the attention check'
            },
            font_size: {
                type: jspsych.ParameterType.INT,
                default: 24,
                description: 'Font size of the text'
            }
        }
    };

    class SelfPacedReadingPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            // Add custom CSS
            const customStyles = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Special+Elite&display=swap');
                    
                    .newspaper-container {
                        background-color: #f4f1ea;
                        border: 8px double #2c2c2c;
                        padding: 20px;
                        max-width: 800px;
                        margin: 20px auto;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }

                    .word-display {
                        font-family: 'Playfair Display', serif;
                        background: white;
                        padding: 30px;
                        border: 1px solid #2c2c2c;
                        margin: 20px 0;
                        min-height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 3px 3px 0 #2c2c2c;
                    }

                    .instruction-text {
                        font-family: 'Special Elite', cursive;
                        color: #2c2c2c;
                        text-align: center;
                        margin: 15px 0;
                        font-size: 16px;
                    }

                    .game-btn {
                        font-family: 'Special Elite', cursive;
                        background: #2c2c2c;
                        color: #f4f1ea;
                        border: none;
                        padding: 12px 30px;
                        margin: 10px;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 3px 3px 0 #8b0000;
                    }

                    .game-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 5px 5px 0 #8b0000;
                    }

                    .game-btn:active {
                        transform: translateY(0);
                        box-shadow: 1px 1px 0 #8b0000;
                    }

                    .question-container {
                        background: white;
                        padding: 20px;
                        border: 1px solid #2c2c2c;
                        margin-bottom: 20px;
                        font-family: 'Special Elite', cursive;
                        box-shadow: 3px 3px 0 #2c2c2c;
                    }

                    .headline {
                        font-family: 'Playfair Display', serif;
                        font-size: 28px;
                        text-align: center;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #2c2c2c;
                        padding-bottom: 10px;
                    }
                </style>
            `;

            const words = trial.stimulus.split(' ');
            let currentWordIndex = -1;
            let startTime = null;
            let readingTimes = [];
            let inQuestionPhase = false;
            let questionStartTime = null;

            const showQuestion = () => {
                inQuestionPhase = true;
                questionStartTime = performance.now();
                display_element.innerHTML = customStyles + `
                    <div class="newspaper-container">
                        <div class="headline">PROFANITY CHECK REQUIRED!</div>
                        <div class="question-container">
                            ${trial.question}
                        </div>
                        <div style="display: flex; justify-content: center; gap: 20px;">
                            <button class="game-btn" data-response="true">
                                TRUE
                            </button>
                            <button class="game-btn" data-response="false">
                                FALSE
                            </button>
                        </div>
                    </div>
                `;

                const buttons = display_element.querySelectorAll('.game-btn');
                buttons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        const response = e.target.dataset.response === 'true';
                        const rt = performance.now() - questionStartTime;
                        
                        this.jsPsych.finishTrial({
                            reading_times: readingTimes,
                            reading_rt: readingTimes.reduce((sum, item) => sum + item.reading_time, 0),
                            stimulus: trial.stimulus,
                            question: trial.question,
                            response: response,
                            correct: response === trial.correct_answer,
                            question_rt: rt
                        });
                    });
                });
            };

            // Initial display setup
            display_element.innerHTML = customStyles + `
                <div class="newspaper-container">
                    <div class="headline">QUOTES FROM THE STREETS</div>
                    <div class="word-display" id="word-display">
                        Press SPACEBAR to begin
                    </div>
                    <div class="instruction-text">
                        Press SPACEBAR to continue reading
                    </div>
                </div>
            `;

            const handleKeyPress = (e) => {
                if (!inQuestionPhase && e.code === 'Space') {
                    e.preventDefault();
                    
                    if (startTime !== null) {
                        readingTimes.push({
                            word: words[currentWordIndex],
                            reading_time: performance.now() - startTime
                        });
                    }

                    currentWordIndex++;
                    startTime = performance.now();

                    if (currentWordIndex < words.length) {
                        document.getElementById('word-display').innerHTML = words[currentWordIndex];
                    } else {
                        document.removeEventListener('keydown', handleKeyPress);
                        showQuestion();
                    }
                }
            };

            document.addEventListener('keydown', handleKeyPress);
        }
    }

    SelfPacedReadingPlugin.info = info;

    return SelfPacedReadingPlugin;
})(jsPsychModule);