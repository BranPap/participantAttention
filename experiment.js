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
const characterNumber = 2;

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

// Step 0: Collect names and pronouns - only in Madlibs Condition

if (condition === `MadLibs`) {
  timeline.push({
    type: jsPsychMadlibs,
    prompt: `Please enter the names of ${characterNumber} people you know and their pronouns.`,
    button_label: 'Continue',
    n_names: characterNumber,
    collect_pronouns: true,
    on_finish: function(data) {
      data.category = "gameData";
      console.log("Collected names and pronouns: ", data);
    }
  });
}


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
    if (condition === "MadLibs") {
      const sprTrials = generateSelfPacedReadingTrials({ array: getGameData() });
      jsPsych.addNodeToCurrentLocation({ timeline: sprTrials });
    }

  }
};
timeline.push(spr_instructions);


if (condition === 'Standard') {
  const sprTrialsStandard = generateSelfPacedReadingTrials()
  timeline.push(...sprTrialsStandard);
}

// Demographics 

const demoSurvey = {
  type: jsPsychSurveyHtmlForm,
  html: `
  <style>
    #survey-container {
      font-family: 'Arial', sans-serif; 
      line-height: 1.6; 
      background-color: #ffffff; 
      color: #333; 
      margin: 0; 
      padding: 20px;
    }
    #survey-container div {
      margin-bottom: 20px; 
      padding: 15px; 
      background: #fff; 
      border-radius: 8px; 
    }
    #survey-container p {
      font-size: 16px; 
      font-weight: bold; 
      margin-bottom: 10px;
    }
    #survey-container label {
      margin-right: 15px; 
      font-size: 14px; 
    }
    #survey-container input[type='text'], 
    #survey-container select, 
    #survey-container textarea {
      font-size: 14px; 
      padding: 10px; 
      border: 1px solid #ccc; 
      border-radius: 5px; 
      width: 100%; 
      box-sizing: border-box;
    }
    #survey-container textarea { resize: vertical; }
    .likert-scale {
      display: flex; 
      justify-content: space-between; 
      margin-top: 10px;
    }
    .likert-scale label {
      flex: 1; 
      text-align: center; 
      font-size: 13px;
    }
    .likert-scale input {
      display: block; 
      margin: 0 auto 5px auto;
    }
  </style>

  <div id='survey-container'>

    <div>
      <p>Did you read the instructions and do you think you did the task correctly?</p>
      <label><input type='radio' name='correct' value='Yes'> Yes</label>
      <label><input type='radio' name='correct' value='No'> No</label>
      <label><input type='radio' name='correct' value='I was confused'> I was confused</label>
    </div>

    <div>
      <p>Gender:</p>
      <select name='gender'>
        <option value='null'> </option>
        <option value='Female'>Female</option>
        <option value='Male'>Male</option>
        <option value='Non-binary/Non-conforming'>Non-binary/Non-conforming</option>
        <option value='Other'>Other</option>
      </select>
    </div>

    <div>
      <p>Age:</p>
      <input type='text' name='age' size='10'>
    </div>

    <div>
      <p>Level of education:</p>
      <select name='education'>
        <option value='null'> </option>
        <option value='Some high school'>Some high school</option>
        <option value='Graduated high school'>Graduated high school</option>
        <option value='Some college'>Some college</option>
        <option value='Graduated college'>Graduated college</option>
        <option value='Hold a higher degree'>Hold a higher degree</option>
      </select>
    </div>

    <div>
      <p>How fair was the payment for this experiment?</p>
      <div class='likert-scale'>
        <label><input type='radio' name='payment' value='1'>Very underpaid</label>
        <label><input type='radio' name='payment' value='2'>2</label>
        <label><input type='radio' name='payment' value='3'>3</label>
        <label><input type='radio' name='payment' value='4'>4</label>
        <label><input type='radio' name='payment' value='5'>5</label>
        <label><input type='radio' name='payment' value='6'>6</label>
        <label><input type='radio' name='payment' value='7'>Very well paid</label>
      </div>
    </div>

    <div>
      <p>How much did you enjoy the experiment?</p>
      <div class='likert-scale'>
        <label><input type='radio' name='enjoy' value='1'>Not at all</label>
        <label><input type='radio' name='enjoy' value='2'>2</label>
        <label><input type='radio' name='enjoy' value='3'>3</label>
        <label><input type='radio' name='enjoy' value='4'>4</label>
        <label><input type='radio' name='enjoy' value='5'>5</label>
        <label><input type='radio' name='enjoy' value='6'>6</label>
        <label><input type='radio' name='enjoy' value='7'>Very much</label>
      </div>
    </div>

    <div>
      <p>Do you have any other comments about this experiment?</p>
      <textarea name='comments' cols='30' rows='4'></textarea>
    </div>

  </div>
  `,
  on_finish: function(data) {
    data.category = "demoSurvey";
  }
};


timeline.push(demoSurvey);


// FINAL FUNCTION CALL //
jsPsych.run(timeline);
