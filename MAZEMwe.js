// Preliminary Calls //
const jsPsych = initJsPsych({
    auto_update_progress_bar: false,
    on_finish: function(data) {
      jsPsych.data.displayData('csv');
    }
  });
  
let timeline = [];

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

// MAZE INSTRUCTIONS //
const maze_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div style="max-width: 1000px; margin: 0 auto; text-align: left;">
      <h2 style="text-align: center;">Instructions</h2>
      <p>In this experiment, you will read a series of sentences, one word at a time. After each word, you will see two words on the screen. Your task is to choose the word that best continues the sentence you are reading - press <strong>f</strong> to select the left-hand word, and <strong>j</strong> to select the right-hand word. You should try to read as quickly as possible while still understanding the sentences. If you do not understand a sentence, please do your best to choose the word that seems most appropriate.</p>
      <p>Press 'Continue' to begin.</p>
    </div>`,
    choices: ['Continue'],
    on_finish: function(data) {
      data.category = "maze_instructions";
    }
  };
  timeline.push(maze_instructions);

const mazeTrial = {
    type: jsPsychMaze,
    prompt: "Select the word that best continues the sentence.",
    sentence: `The horse raced past the barn fell.`,
    competitors: `x-x-x and green wish but cry blue.`,
    attention_check: `The horse fell down.`,
    attention_check_choices: [true, false],
    attention_check_correct_choice: true,
    allow_redo: true,
  }
  
  timeline.push(mazeTrial);

const mazeTrial2 = {
    type: jsPsychMaze,
    prompt: "Select the word that best continues the sentence.",
    sentence: `Ben is going to have tea with his favorite octopus.`,
    competitors: `x-x-x to swam be blue cry fear run pedaled began.`,
    allow_redo: false,
  }
  
timeline.push(mazeTrial2);

const mazeTrial3 = {
  type: jsPsychMaze,
  prompt: "Select the word that best continues the sentence.",
  sentence: `Bran and Haley are building an experiment.`,
  competitors: `x-x-x but balks was constructing be determined.`,
  allow_redo: true,
  equality_index: 4
}

timeline.push(mazeTrial3);


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