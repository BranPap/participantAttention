let stims = generateStimuli();
console.log(stims);


// Preliminary Calls //
const jsPsych = initJsPsych({
    auto_update_progress_bar: false,
    on_finish: function(data) {
      jsPsych.data.displayData('csv');
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
        name: gameData.names[i],
        pronouns: gameData.pronouns[i]
      });
    }
    return characters;
  }

// EXPERIMENT CODE //

// WELCOME PAGE //
const welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div style="max-width: 1000px; margin: 0 auto; text-align: left;">
      <h2 style="text-align: center;">Welcome!</h2>
      <p>Press 'Continue' to begin the experiment; this is for demonstration purposes only and does NOT collect any data submitted.</p>
    </div>`,
    choices: ['Continue'],
    on_finish: function(data) {
      data.category = "welcome";
    }
  };
  timeline.push(welcome);

// MADLIBS //

timeline.push({
    type: jsPsychMadlibs,
    prompt: `In this experiment, we want you to help create the characters you will be reading about. Please enter the names of ${characterNumber} characters.`,
    button_label: 'Continue',
    n_names: characterNumber,
    collect_pronouns: false,
    name_list: ['Bran', 'Haley'],
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
        blank_location: 4,
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

// DEBRIEF //
const debrief = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div style="max-width: 1000px; margin: 0 auto; text-align: left;">
      <h2 style="text-align: center;">Debrief</h2>
      <p>Thank you for participating in this demonstration! The purpose of this study was to investigate how people read sentences. If you have any questions about this research, please contact the researchers at branpap[at]stanford[dot]edu.</p>
      <p style="text-align: center;">Press 'Finish' to complete the experiment. The next page will show you what data would've been submitted in CSV format.</p>
    </div>`,
    choices: ['Finish'],
    on_finish: function(data) {
      data.category = "debrief";
    }
  };
  timeline.push(debrief);
  
// Start the experiment
jsPsych.run(timeline);