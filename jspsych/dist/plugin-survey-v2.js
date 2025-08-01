var jsPsychSurveyV2 = (function (jspsych) {
    'use strict';
    
    const info = {
        name: "Survey-V2",
        parameters: {
            /** Array containing one or more objects with parameters for the question(s) that should be shown on the page */
            questions: {
                type: jspsych.ParameterType.COMPLEX,
                array: true,
                pretty_name: "Questions",
                nested: {
                    /** Question prompt */
                    prompt: {
                        type: jspsych.ParameterType.HTML_STRING,
                        pretty_name: "Prompt"
                    }
                }

            }
        }
    }
    
    SurveyV2Plugin.info = info;

    return SurveyV2Plugin;

})(jsPsychModule);