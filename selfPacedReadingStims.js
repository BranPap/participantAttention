function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  
  function getNominative(pronoun) {
    if (pronoun === "they/them") return "They";
    if (pronoun === "she/her") return "She";
    if (pronoun === "he/him") return "He"; 
    return "They";
  }
  
  const professions = shuffleArray([
    "doctor", "engineer", "nurse", "teacher",
    "mechanic", "scientist"
  ]);
  
  const countries = shuffleArray([
    "America", "Canada", "France", "Lithuania",
    "Japan", "Brazil", "Australia", "Egypt"
  ]);
  
  const places = shuffleArray([
    "park", "museum", "beach",
    "mountains", "zoo", "theater", "mall"
  ]);
  
  function generateSelfPacedReadingTrials(stimuli = { array: [
    { name: "Jessica", pronouns: "she/her" },
    { name: "Michael", pronouns: "he/him" }
  ] }) {
    let trials = [];
  
    stimuli.array.forEach(element => {
      const place = places[Math.floor(Math.random() * places.length)];
      const profession = professions[Math.floor(Math.random() * professions.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const randomPlace = places[Math.floor(Math.random() * places.length)];
  
      trials.push({
        type: jsPsychSelfPacedReading,
        stimulus: `${capitalizeFirstLetter(element.name.toLowerCase())} is a ${profession} from ${country}. ${getNominative(element.pronouns)} ${element.pronouns === 'they/them' ? 'enjoy' : 'enjoys'} going to the ${place} on weekends.`,
        question: `Does ${element.name} like to go to the ${randomPlace} on weekends?`,
        correct_answer: place === randomPlace, 
        data: {
          category: "spr",
          isCorrect: function() {
            if (this.response === this.correct_answer) {
                return true;
            } else {
                return false;
            }
          }
        },
        on_finish: function(data) {
          console.log("Response:", data.response, "Correct:", data.correct_answer);
        }
      });
    });
  
    return trials;
  }
  