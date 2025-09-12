var jsPsychRsvp = (function (jspsych) {
    'use strict';

    const info = {
        name: "rsvp",
        parameters: {
            sentence: { type: jspsych.ParameterType.STRING, default: 'Read this sentence one word at a time.'},
            word_duration: { type: jspsych.ParameterType.INT, default: 100 },
            fixation_duration: { type: jspsych.ParameterType.INT, default: 500 },
            prompt: { type: jspsych.ParameterType.STRING, default: 'On the next screen, you will see a \'+\' in the center of the screen. Focus on the \'+\' until the sentence appears, one word at a time. After the sentence, you will be asked to fill in a blank in the sentence.'},
            start_key: { type: jspsych.ParameterType.STRING, default: 'Space' },
            blank_location: { type: jspsych.ParameterType.INT, default: 3 }
        }
    };

    class RsvpPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            // set up variables
            var words = trial.sentence.split(" ");
            var word_count = words.length;
            var words_with_blank = [...words];
            words_with_blank[trial.blank_location] = "_____";
            var current_word = 0;
            

            const showPrompt = () => {
                display_element.innerHTML = `<div style="max-width: 800px; margin: 0 auto; text-align: center;">
                    <p>${trial.prompt}</p>
                    <p>Press <strong>${trial.start_key}</strong> to begin.</p>
                </div>`;

                const start_listener = (e) => {
                    if (e.code === trial.start_key) {
                        document.removeEventListener('keydown', start_listener);
                        showFixation();
                    }
                };
                document.addEventListener('keydown', start_listener);
            };

            const showFixation = () => {
                display_element.innerHTML = '<div style="font-size: 48px; text-align: center;">+</div>';
                setTimeout(() => {
                    showWord();
                }, trial.fixation_duration);
            };

            const showWord = () => {
                if (current_word < word_count) {
                    display_element.innerHTML = `<div style="font-size: 32px; text-align: center;">${words[current_word]}</div>`;
                    current_word++;
                    setTimeout(showWord, trial.word_duration)
                } else {
                    showBlankedQuestion();
                }
            };
            
            const showBlankedQuestion = () => {
                display_element.innerHTML = `<div style="max-width: 800px; margin: 0 auto; text-align: left;">
                    <p>What word best completes the sentence?</p>
                    <p><strong>${words_with_blank.join(" ")}</strong></p>
                    <input type="text" id="rsvp-response" style="width: 100%; font-size: 24px;" autofocus>
                    <button id="rsvp-submit" style="font-size: 24px; margin-top: 10px;">Submit</button>
                </div>`;

                const start_time = performance.now();

                const inputAF = document.getElementById('rsvp-response');
                inputAF.focus();
                inputAF.select();

                document.getElementById('rsvp-submit').addEventListener('click', () => {
                    const response = inputAF.value;
                    const rt = Math.round(performance.now() - start_time);
                    endTrial(response, rt);
                });
            };

            const endTrial = (response, rt) => {
                const trial_data = {
                    sentence: trial.sentence,
                    blank_location: trial.blank_location,
                    response: response,
                    rt: rt
                };
                display_element.innerHTML = '';
                this.jsPsych.finishTrial(trial_data);
            };

            // start the trial
            showPrompt();
        }
    }

    RsvpPlugin.info = info;
    
    return RsvpPlugin;
})(jsPsychModule)