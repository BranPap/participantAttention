var jsPsychMadlibs = (function(jspsych) {
  'use strict';

  const info = {
    name: 'madlibs',
    parameters: {
      prompt: {
        type: jspsych.ParameterType.STRING,
        default: 'Enter names and (optionally) pronouns:',
        description: 'Prompt displayed above the input fields.'
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: 'Continue',
        description: 'Label for the submission button.'
      },
      n_names: {
        type: jspsych.ParameterType.INT,
        default: 5,
        description: 'Number of names to collect.'
      },
      collect_pronouns: {
        type: jspsych.ParameterType.BOOL,
        default: true,
        description: 'Whether to show pronoun dropdowns for each name.'
      },
      name_list: {
        type: jspsych.ParameterType.STRING,
        array: true,
        default: null,
        description: 'Optional array of disallowed names.'
      }
    }
  };

  class MadlibsPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      const exclusionPanel = trial.name_list && Array.isArray(trial.name_list) && trial.name_list.length > 0
      ? `
        <div class="exclusion-panel">
          <h4>Names already included:</h4>
          <ul>
            ${trial.name_list.map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>
      `
      : '';

      const css = `
  .madlibs-layout {
    display: flex;
    gap: 30px;
    max-width: 900px;
    margin: 40px auto;
    font-family: sans-serif;
  }
  .exclusion-panel {
    flex: 0 0 200px;
    background: #fff3f3;
    border: 1px solid #e0b4b4;
    border-radius: 8px;
    padding: 15px;
    font-size: 14px;
    color: #a33;
    height: fit-content;
    text-align: left;
  }
  .exclusion-panel h4 {
    margin-top: 0;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .exclusion-panel ul {
    padding-left: 18px;
    margin: 0;
  }
  .exclusion-panel li {
    list-style: disc;
    margin-bottom: 5px;
  }
  .madlibs-container {
    flex: 1;
    background: #f9f9f9;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .madlibs-container h3 {
    margin-bottom: 20px;
  }
  .name-row {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }
  .name-row input, .name-row select {
    padding: 8px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .name-row input {
    flex: 1.2;
    min-width: 140px;
  }
  .name-row select {
    flex: 1;
    min-width: 120px;
  }
  .name-row input.invalid {
    border-color: red;
    background-color: #ffe6e6;
  }
  .submit-btn {
    background-color: #1DA1F2;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .submit-btn:disabled {
    background-color: #9bd1f9;
    cursor: not-allowed;
  }
`;

      // Generate rows dynamically
      let formFields = '';
      for (let i = 0; i < trial.n_names; i++) {
        const inputField = trial.name_list && Array.isArray(trial.name_list)
          ? `<input type="text" list="namelist" name="name${i}" placeholder="Name ${i + 1}" required />`
          : `<input type="text" name="name${i}" placeholder="Name ${i + 1}" required />`;

        formFields += `
          <div class="name-row">
            ${inputField}
            ${trial.collect_pronouns ? `
              <select name="pronoun${i}" required>
                <option value="she/her">she/her</option>
                <option value="he/him">he/him</option>
              </select>
            ` : ''}
          </div>
        `;
      }

      const html = `
      <style>${css}</style>
      <div class="madlibs-layout">
        ${exclusionPanel}
        <div class="madlibs-container">
          <h3>${trial.prompt}</h3>
          <form id="madlibs-form">
            ${formFields}
            <button type="submit" class="submit-btn">${trial.button_label}</button>
          </form>
        </div>
      </div>
    `;

      display_element.innerHTML = html;

      // Form handling
      const form = display_element.querySelector('#madlibs-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const responses = [];
        const namesSubmitted = [];
        const disallowedNames = [];
        var canProceed = true;

        form.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));

        for (let i = 0; i < trial.n_names; i++) {
          const input = form.querySelector(`input[name="name${i}"]`);
          const name = formData.get(`name${i}`).trim();
          if (!name) return; // fail early
          if (namesSubmitted.includes(name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()))) {
            input.classList.add('invalid');
            alert(`The name "${name}" has been entered more than once. Please enter a different name.`);
            return;
          }; 
          if (trial.name_list && trial.name_list.includes(name)) {
            input.classList.add('invalid');
            disallowedNames.push(name);
            canProceed = false;
          }

          let pronoun = null;
          if (trial.collect_pronouns) {
            pronoun = formData.get(`pronoun${i}`);
            if (!pronoun) return;
          }
          namesSubmitted.push(name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()));
          responses.push(trial.collect_pronouns ? { name, pronoun } : { name });
        }

        if (!canProceed) {
          alert(`The name(s) "${disallowedNames.join(", ")}" is/are not allowed. Please choose (a) different name(s).`);
          return;
        }

        display_element.innerHTML = '';
        const names = responses.map(r => r.name);
        const pronouns = responses.map(r => r.pronoun || null);
        this.jsPsych.finishTrial({ names, pronouns });
      });
    }
  }

  MadlibsPlugin.info = info;
  return MadlibsPlugin;
})(jsPsychModule);
