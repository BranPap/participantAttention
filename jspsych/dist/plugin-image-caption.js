var jsPsychImageCaption = (function (jspsych) {
    'use strict';

    const info = {
        name: 'image-caption',
        parameters: {
            /** The image to be displayed */
            image: {
                type: jspsych.ParameterType.IMAGE,
                pretty_name: 'Image',
                default: undefined,
                description: 'The image to be captioned'
            },
            /** Caption text before the blank */
            caption_prefix: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Caption prefix',
                default: undefined,
                description: 'Text that appears before the blank in the caption'
            },
            /** Caption text after the blank */
            caption_suffix: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Caption suffix',
                default: '',
                description: 'Text that appears after the blank in the caption'
            },
            /** Width of text response box */
            response_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Response width',
                default: 200,
                description: 'Width of the text response box in pixels'
            },
            /** Label of the button to submit response */
            button_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Button label',
                default: 'Continue',
                description: 'Label of the button to submit response'
            }
        }
    };

    class ImageCaptionPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            // Add newspaper styling
            const html = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Special+Elite&display=swap');
                    
                    .newspaper-caption-container {
                        background-color: #f4f1ea;
                        border: 8px double #2c2c2c;
                        padding: 25px;
                        max-width: 600px;
                        margin: 20px auto;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        text-align: center;
                    }

                    .newspaper-image-container {
                        background: white;
                        padding: 10px;
                        border: 1px solid #2c2c2c;
                        margin: 0 auto 20px;
                        display: inline-block;
                        box-shadow: 3px 3px 0 #2c2c2c;
                    }

                    .newspaper-image {
                        max-width: 400px;
                        max-height: 300px;
                        display: block;
                    }

                    .caption-container {
                        font-family: 'Special Elite', serif;
                        color: #2c2c2c;
                        line-height: 1.6;
                        margin-top: 15px;
                        padding: 10px;
                        text-align: center;
                    }

                    .caption-input {
                        font-family: 'Special Elite', serif;
                        font-size: 16px;
                        padding: 5px 10px;
                        border: 2px solid #2c2c2c;
                        background-color: white;
                        margin: 0 5px;
                        width: ${trial.response_width}px;
                    }

                    .submit-btn {
                        font-family: 'Special Elite', serif;
                        background: #2c2c2c;
                        color: #f4f1ea;
                        border: none;
                        padding: 12px 30px;
                        margin-top: 20px;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 3px 3px 0 #8b0000;
                    }

                    .submit-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 5px 5px 0 #8b0000;
                    }

                    .submit-btn:active {
                        transform: translateY(0);
                        box-shadow: 1px 1px 0 #8b0000;
                    }
                </style>
                <div class="newspaper-caption-container">
                    <div class="newspaper-image-container">
                        <img class="newspaper-image" src="${trial.image}" alt="Image for captioning">
                        <div class="caption-container">
                            ${trial.caption_prefix}
                            <input type="text" class="caption-input" id="caption-response" required>
                            ${trial.caption_suffix}
                        </div>
                    </div>
                    <button class="submit-btn" id="submit-button">${trial.button_label}</button>
                </div>
            `;

            display_element.innerHTML = html;

            // Start time
            const startTime = performance.now();

            // Add event listener to the submit button
            const submitButton = display_element.querySelector('#submit-button');
            const captionInput = display_element.querySelector('#caption-response');

            submitButton.addEventListener('click', () => {
                const response = captionInput.value.trim();
                if (response !== '') {
                    // Measure response time
                    const endTime = performance.now();
                    const rt = Math.round(endTime - startTime);

                    // Save data
                    const trialData = {
                        rt: rt,
                        response: response,
                        caption_prefix: trial.caption_prefix,
                        caption_suffix: trial.caption_suffix
                    };

                    // Clear display and finish trial
                    display_element.innerHTML = '';
                    this.jsPsych.finishTrial(trialData);
                }
            });

            // Focus on input box
            captionInput.focus();
        }
    }
    ImageCaptionPlugin.info = info;

    return ImageCaptionPlugin;
})(jsPsychModule);