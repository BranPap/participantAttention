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
        description: 'Optional array of allowable names for the datalist. If null, free input is allowed.'
      }
    }
  };

  class MadlibsPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      const css = `
        .madlibs-container {
          max-width: 700px;
          margin: 40px auto;
          padding: 20px;
          font-family: sans-serif;
          background: #f9f9f9;
          border-radius: 10px;
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

      // Construct datalist if name_list is provided
      let datalistHTML = '';
      if (trial.name_list && Array.isArray(trial.name_list)) {
        datalistHTML += `<datalist id="namelist">`;
        trial.name_list.forEach(n => {
          datalistHTML += `<option value="${n}"></option>`;
        });
        datalistHTML += `</datalist>`;
      }

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
        <div class="madlibs-container">
          <h3>${trial.prompt}</h3>
          <form id="madlibs-form">
            ${formFields}
            ${datalistHTML}
            <button type="submit" class="submit-btn">${trial.button_label}</button>
          </form>
        </div>
      `;

      display_element.innerHTML = html;

      // Form handling
      const form = display_element.querySelector('#madlibs-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const responses = [];

        for (let i = 0; i < trial.n_names; i++) {
          const name = formData.get(`name${i}`).trim();
          if (!name) return; // fail early

          let pronoun = null;
          if (trial.collect_pronouns) {
            pronoun = formData.get(`pronoun${i}`);
            if (!pronoun) return;
          }

          responses.push(trial.collect_pronouns ? { name, pronoun } : { name });
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
