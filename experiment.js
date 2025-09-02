// Utils //
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Preliminary Calls //
const jsPsych = initJsPsych({
  auto_update_progress_bar: false,
  on_finish: function(data) {
    proliferate.submit({ trials: data.values() });
    // jsPsych.data.displayData('csv');
  }
});

let timeline = [];
const characterNumber = 1;

// EXPERIMENT CODE //
const conditions_list = shuffleArray(['MadLibs', 'Standard']);
const condition = conditions_list[0]; // Random assignment
console.log("Assigned condition: " + condition);

// IRB Consent
const irb = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div style="max-width: 1000px; margin: 0 auto; text-align: left;">
    <h2 style="text-align: center;">Consent to Participate</h2>
    <p>By completing this study, you are participating in research being performed by cognitive scientists in the Stanford University and University of Southern California Departments of Linguistics. ...</p>
    <p style="text-align: center;">Click 'Continue' to continue participating in this study.</p>
  </div>`,
  choices: ['Continue'],
  on_finish: function(data) {
    data.category = "irb";
  }
};
timeline.push(irb);

// Step 1: Collect names and pronouns
timeline.push({
  type: jsPsychMadlibs,
  prompt: 'Please enter the names of three people you know and their pronouns.',
  button_label: 'Continue',
  n_names: characterNumber,
  collect_pronouns: true,
  on_finish: function(data) {
    data.category = "gameData";
    console.log("Collected names and pronouns: ", data);
  }
});

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

// Self-Paced Reading Instructions
const spr_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="max-width: 800px; margin: 0 auto; text-align: left;">
      <h2 style="text-align: center;">Self-Paced Reading Instructions</h2>
      <p>In the next part of the experiment, you will read several short passages one word at a time...</p>
      <p>Press the button below when you are ready to begin.</p>
    </div>
  `,
  choices: ['Begin'],
  on_finish: function(data) {
    data.category = "instructions";
    // Generate SPR trials only now, after names exist
    const sprTrials = generateSelfPacedReadingTrials({ array: getGameData() });
    jsPsych.addNodeToCurrentLocation({ timeline: sprTrials });
  }
};
timeline.push(spr_instructions);

// Demographics 

const demographics = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: "What is your age?", name: 'age', required: true, type: 'number', min: 18, max: 100 },
    { prompt: "What is your gender?", name: 'gender', required: true, type: 'text' },
    { prompt: "What is your native language?", name: 'native_language', required: true, type: 'text' }
  ],
  button_label: 'Submit',
  on_finish: function(data) {
    data.category = "demographics";
  }
};
timeline.push(demographics);


// FINAL FUNCTION CALL //
jsPsych.run(timeline);
