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

// WELCOME PAGE //
const welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div style="max-width: 1000px; margin: 0 auto; text-align: left;">
      <h2 style="text-align: center;">Welcome!</h2>
      <p>Press 'Continue' to begin the experiment; this is for demonstration purposes only and while the experiment will collect data, NO PART OF THIS DATA WILL BE USED IN ANY PUBLICATION OR THE LIKE.</p>
    </div>`,
    choices: ['Continue'],
    on_finish: function(data) {
      data.category = "welcome";
    }
  };
  timeline.push(welcome);

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

// DEBRIEF //
const debrief = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div style="max-width: 1000px; margin: 0 auto; text-align: left;">
      <h2 style="text-align: center;">Debrief</h2>
      <p>Thank you for participating in this demonstration! The purpose of this study was to investigate how people read sentences. If you have any questions about this research, please contact the researchers at branpap[at]stanford[dot]edu.</p>
      <p style="text-align: center;">Press 'Finish' to complete the experiment. You will be redirected back to google.com.</p>
    </div>`,
    choices: ['Finish'],
    on_finish: function(data) {
      data.category = "debrief";
    }
  };
  timeline.push(debrief);
  
// Start the experiment
jsPsych.run(timeline);