// Preliminary Calls //

const jsPsych = initJsPsych({
    // show_progress_bar: true,
    auto_update_progress_bar: false,
    on_finish: function(data) {
        proliferate.submit({"trials": data.values()}); // This onfinish function calls the proliferate pipeline to collect data
        // jsPsych.data.displayData('csv'); // Uncomment to see the sumbitted csv at the end of the experiment
    }
});

var timeline = [];

// Step 1: Collect names and pronouns
timeline.push({
  type: jsPsychMadlibs,
  prompt: 'Please enter the names of three people you know and their pronouns.',
  button_label: 'Continue',
  n_names: 3,
  collect_pronouns: true
});

// Step 2: Cloze task using names and pronouns
timeline.push({
  type: jsPsychSurveyText,
  questions: function() {
    const people = jsPsych.data.get().last(1).values()[0].names;

    // Helper function to convert pronoun to possessive
    function getPossessive(pronoun) {
      if (pronoun === "they/them") return "their";
      if (pronoun === "she/her") return "her";
      if (pronoun === "he/him") return "his";
      return "their"; // fallback for 'other' or missing
    }

    // Create 3 cloze prompts, one per person
    return people.map((p, i) => ({
      prompt: `${p.name} really enjoys eating; ${getPossessive(p.pronoun)} favorite food is:`,
      name: `food_for_${p.name.toLowerCase()}`
    }));
  },
  preamble: "<p>Please complete the following sentences based on the people you listed:</p>"
});

// Step 3: Show what was entered
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    const foods = jsPsych.data.get().last(1).values()[0];
    const names = jsPsych.data.get().filter({trial_type: 'madlibs'}).last(1).values()[0].names;

    return names.map(p => {
      const food = foods[`food_for_${p.name.toLowerCase()}`];
      return `<p>${p.name}'s favorite food is: <strong>${food}</strong></p>`;
    }).join('');
  },
  choices: ['Finish']
});





// FINAL FUNCTION CALL //

jsPsych.run(timeline)