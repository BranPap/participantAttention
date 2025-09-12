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

// RSVP TRIALS //
const rsvp_trial = {
    type: jsPsychRsvp,
    prompt: "Read the following sentence one word at a time. After the sentence, fill in the blank with the word that best completes the sentence.",
    sentence: "The quick brown fox jumps over the lazy dog",
    blank_location: 4, // zero-indexed position of the word to be blanked
    word_duration: 100, // duration each word is displayed (in ms)
    fixation_duration: 2000, // duration of fixation cross (in ms)
  };

timeline.push(rsvp_trial);

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