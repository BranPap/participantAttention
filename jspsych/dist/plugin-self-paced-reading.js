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
                    }
                    .word-display {
                        font-size: ${trial.font_size}px;
                        padding: 20px;
                        margin: 20px 0;
                        min-height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        background: #ffffff;
                    }
                    .instruction-text {
                        color: #555;
                        font-size: 16px;
                        text-align: center;
                        margin-top: 10px;
                    }
                    .question-container {
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        margin-bottom: 20px;
                        text-align: center;
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
                    .headline {
                        font-size: 26px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        text-align: center;
                        color: #333;
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
                    <div class="container">
                        <div class="headline"></div>
                        <div class="question-container">
                            ${trial.question}
                        </div>
                        <div>
                            <button class="btn" data-response="true">TRUE</button>
                            <button class="btn" data-response="false">FALSE</button>
                        </div>
                    </div>
                `;

                const buttons = display_element.querySelectorAll('.btn');
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

            // Initial display
            display_element.innerHTML = customStyles + `
                <div class="container">
                    <div class="headline"></div>
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
