let stims = generateStimuli();
console.log(stims);


// Preliminary Calls //
const jsPsych = initJsPsych({
    auto_update_progress_bar: false,
    on_start: function() {
      console.log("Experiment started");
    },
    on_finish: function(data) {
      // jsPsych.data.displayData('csv');
      proliferate.submit({ trials: data.values() });
      console.log("Experiment finished");

    }
  });
  
let timeline = [];
let nameList = [];
const characterNumber = 12;

// Helper: extract characters
function getGameData() {
    let characters = [];
    const gameData = jsPsych.data.get().filter({ category: 'gameData' }).values()[0];
    for (let i = 0; i < characterNumber; i++) {
      characters.push({
        name: gameData.names[i].toLowerCase().replace(/\b\w/g, c => c.toUpperCase()), // Convert to lower case, then capitalize first letter
        pronouns: gameData.pronouns[i]
      });
    }
    return characters;
  }

// EXPERIMENT CODE //

// IRB FORM //

const irb = {
  // Which plugin to use
  type: jsPsychHtmlButtonResponse,
  // What should be displayed on the screen
  stimulus: '<div style="max-width: 1000px; margin: 0 auto; text-align: left;"><h2 style="text-align: center;">Consent to Participate</h2><p>By completing this study, you are participating in research being performed by cognitive scientists in the Stanford University Department of Linguistics and the University of Southern California Department of Linguistics. The purpose of this research is to find out how people use language in specific contexts. You must be at least 18 years old to participate. There are neither specific benefits nor anticipated risks associated with participation in this study. Your participation in this study is completely voluntary and you can withdraw at any time by simply exiting the study. You may decline to answer any or all of the questions following the study. Choosing not to participate or withdrawing will result in no penalty. Your anonymity is assured; the researchers who have requested your participation will not receive any personal information about you, and any information you provide will not be shared in association with any personally identifying information.</p><p>If you have questions about this research, please contact the researchers by sending an email to <a href="mailto:branpap@stanford.edu" style="color: blue;">branpap@stanford.edu</a>. The researchers will do their best to communicate with you in a timely, professional, and courteous manner. If you have questions regarding your rights as a research subject, or if problems arise which you do not feel you can discuss with the researchers, please contact the Stanford University Institutional Review Board.</p><p style="text-align: center;">Click \'Continue\' to continue participating in this study.</p></div>',
  // What should the button(s) say
  choices: ['Continue'],
  on_finish: function(data) {
      data.category = "irb";
      // jsPsych.setProgressBar((data.trial_index + 1) / (timeline.length + jsPsychStimuli.length))
  }
};

timeline.push(irb)

var enter_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true
};
timeline.push(enter_fullscreen);

// MADLIBS //

exclusion_list = ['Miguel',
  'Chase',
  'Adrian',
  'Seth',
  'Cassidy',
  'Karina',
  'Bethany',
  'Dominique',
  'Brett',
  'Shane',
  'Jake',
  'Alejandro',
  'Carly',
  'Bianca',
  'Desiree',
  'Kendra',
  'Brenda',
  'Gabriela',
  'Casey',
  'Daisy',
  'Angel',
  'Colton',
  'Spencer',
  'Devon',
  'Kara',
  'Ricardo',
  'Alec',
  'Jorge',
  'Vincent',
  'Summer',
  'Grant',
  'Joel',
  'Eduardo',
  'Oscar',
  'Nancy',
  'Adriana',
  'Francisco',
  'Marisa',
  'Malik']

timeline.push({
    type: jsPsychMadlibs,
    prompt: `In this experiment, you will be reading sentences about a variety of characters; some of these characters are listed in the panel on the left. Please enter ${characterNumber} more names to be used in the experiment. <br><br> Please note that these should not be the same names as those in the panel on the left; if you enter a name that is already listed, you will be asked to enter a different name. <br><br> When you are finished, press 'Continue' to proceed to the experiment.`,
    button_label: 'Continue',
    n_names: characterNumber,
    collect_pronouns: false,
    name_list: shuffleArray(exclusion_list),
    on_finish: function(data) {
        data.category = "gameData";
        console.log("Collected names and pronouns: ", data);
        characterData = getGameData();
        nameList = characterData.map(d => d.name);
        pronounList = characterData.map(d => d.pronouns);

        pronounsNominative = pronounList.map(p => {
            if (p === 'they/them') return 'they';
            if (p === 'she/her') return 'she';
            if (p === 'he/him') return 'he';
            return 'they'; // default
        });
    }
});



// STIMULI PRESENTATION //
shuffleArray(nameList);
console.log(nameList);

var rsvpInstructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div style="max-width: 1000px; margin: 0 auto; text-align: left;">
    <h2 style="text-align: center;">Instructions</h2>
    <p>In this experiment, you will read a series of 48 sentences that appear one word at a time in the center of the screen. Each trial will begin with a black '+' in the middle. Focus on this '+' and continue watching as the words replace it. The words are presented quickly, and you will not be able to review the sentence after it has passed.</p>
    <p>After each sentence, you will be asked to fill in a missing word that best completes the sentence. Please read carefully and do your best to understand the meaning of each sentence.</p>
    <p>The experiment will take about 10-15 minutes to complete.</p>
    <p>When you are ready, press 'Begin' to start.</p>
  </div>`,
  choices: ['Begin'],
  on_finish: function(data) {
    data.category = "instructions";
  }
}

timeline.push(rsvpInstructions);

var trainingTrial = {
    type: jsPsychRsvp,
    sentence: 'This is a practice sentence to help you get used to the task.',
    blank_location: 4,
    prompt: "This is a practice trial. Read the sentence one word at a time as the words appear on the screen. After the sentence, fill in the blank with the word that completes the sentence.",
    on_finish: function(data) {
      data.category = "practice";
    }
}

timeline.push(trainingTrial);

var rsvpInstructions2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div style="max-width: 1000px; margin: 0 auto; text-align: left;">
    <h2 style="text-align: center;">End of Practice</h2>
    <p>You have completed the practice trial. The main experiment will now begin. Remember to read each sentence carefully and fill in the missing word after each sentence.</p>
    <p>When you are ready, press 'Continue' to start the main experiment.</p>
  </div>`,
  choices: ['Continue'],
  on_finish: function(data) {
    data.category = "instructions";
  }
}

timeline.push(rsvpInstructions2);

var criticalTrials = {
    timeline: [
      {
        type: jsPsychRsvp,
        prompt: "Read the following sentence one word at a time. After the sentence, fill in the blank with the word that completes the sentence.",
        sentence: function() {
          if (jsPsych.timelineVariable('nameType') === 'weName') {
            return jsPsych.timelineVariable('sentence_wename')
          } else if (jsPsych.timelineVariable('nameType') === 'youName') {
            var name = nameList.pop();
            return jsPsych.timelineVariable('sentence_youname').replace('[name]', name);
          } else if (jsPsych.timelineVariable('nameType') === 'filler') {
            return jsPsych.timelineVariable('Sentence')
          }
        },
        blank_location: jsPsych.timelineVariable('blank_index'),
        on_finish: function(data) {
            data.stimID = jsPsych.timelineVariable('ID');
            data.word_count = jsPsych.timelineVariable('word_count');
            data.stimType = jsPsych.timelineVariable('type');
            data.nameType = jsPsych.timelineVariable('nameType');
        }
      }
    ],
    timeline_variables: stims,
    randomize_order: true
}

timeline.push(criticalTrials);

 // QUESTIONNAIRE //

 const demoSurvey = {
  type: jsPsychSurveyHtmlForm,
  html: "<style>#survey-container { font-family: 'Arial', sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333; margin: 0; padding: 20px; } #survey-container div { margin-bottom: 20px; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); } #survey-container p { font-size: 16px; font-weight: bold; margin-bottom: 10px; } #survey-container input[type='radio'] { margin-right: 10px; } #survey-container select, #survey-container input[type='text'], #survey-container textarea { font-size: 14px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; width: 100%; box-sizing: border-box; } #survey-container textarea { resize: vertical; } #survey-container label { display: block; margin-bottom: 5px; font-size: 14px; } #survey-container select { background: #fff; } #survey-container input[type='radio'] + label, #survey-container input[type='radio']:last-of-type { margin-right: 15px; }</style><h2>All following questions are optional</h2><div id='survey-container'><div><p>Did you read the instructions and do you think you did the task correctly?</p><label><input type='radio' name='correct' value='Yes'> Yes</label><label><input type='radio' name='correct' value='No'> No</label><label><input type='radio' name='correct' value='I was confused'> I was confused</label></div><div><p>Gender:</p><select name='gender'><option value='null'> </option><option value='Female'>Female</option><option value='Male'>Male</option><option value='Non-binary/Non-conforming'>Non-binary/Non-conforming</option><option value='Other'>Other</option></select></div><div><p>Age:</p><input type='text' name='age' size='10'></div><div><p>Level of education:</p><select name='education'><option value='null'> </option><option value='Some high school'>Some high school</option><option value='Graduated high school'>Graduated high school</option><option value='Some college'>Some college</option><option value='Graduated college'>Graduated college</option><option value='Hold a higher degree'>Hold a higher degree</option></select></div><div><p>Do you think the payment was fair?</p><select name='payment'><option value='null'> </option><option value='The payment was too low'>The payment was too low</option><option value='The payment was fair'>The payment was fair</option></select></div><div><p>Did you enjoy the experiment?</p><select name='enjoy'><option value='null'> </option><option value='Worse than the average experiment'>Worse than the average experiment</option><option value='An average experiment'>An average experiment</option><option value='Better than the average experiment'>Better than the average experiment</option></select></div><div><p>Do you have any other comments about this experiment?</p><textarea name='comments' cols='30' rows='4'></textarea></div></div>",
  on_finish: function(data) {
    data.category = "demoSurvey";
  }
}

timeline.push(demoSurvey);

const exit_fullscreen = {
type: jsPsychFullscreen,
fullscreen_mode: false,
delay_after: 0
}

timeline.push(exit_fullscreen);

// THANKS //

const thanks = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Continue'],
  stimulus: "Thank you for your time! Please click 'Continue' and then wait a moment until you're directed back to Prolific.<br><br>",
  on_finish: function(data) {
      data.category = "thanks"
  }
}
  
timeline.push(thanks);
// Start the experiment
jsPsych.run(timeline);