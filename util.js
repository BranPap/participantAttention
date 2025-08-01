function evaluate_response(data, leftValue, rightValue) {
    if (data.response == 'f' & leftValue == data.status) {
        data.statusCheck = "correct"
    } else if (data.response == 'j' & rightValue == data.status) {
        data.statusCheck = "correct"
    } else {
        data.statusCheck = "incorrect"
    }
}

// Define Function Using the Fisher-Yates (Knuth) Shuffle Algorithm to randomize stimulus selection //
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

// Gender arrays
let masc = ['Transgender Man', 'Trans Man', 'Biological Female'];
let fem = ['Transgender Woman', 'Trans Woman', 'Biological Male'];

function create_tv_array(json_object) {
    let tv_array = [];
    for (let i = 0; i < json_object.length; i++) {
        obj = {};
        obj.text = json_object[i].text;
        obj.data = {};
        obj.data.item = json_object[i].id;
        obj.data.source = json_object[i].source;
        obj.data.dataType = json_object[i].dataType;
        obj.data.correct = json_object[i].correct;
        obj.data.refExp = json_object[i].refExp;
        if (masc.includes(json_object[i].refExp)) {
            obj.data.refGender = "masc"
        } else if (fem.includes(json_object[i].refExp)) {
            obj.data.refGender = "fem"
        };
        tv_array.push(obj)
    }
    return tv_array;
}

function check_dupes(tv_array) {
    let tv_array_modded = shuffleArray(tv_array);
    let final_array = [];
    let unique_list = [];
    let criticalCounter = 0;
    for (let i = 0; i < tv_array_modded.length; i++) {
        if (!unique_list.includes(tv_array_modded[i].data.item)) {
            if (tv_array_modded[i].data.dataType == "Critical" && criticalCounter <= 12) {
                criticalCounter++;
                final_array.push(tv_array_modded[i]);
                unique_list.push(tv_array_modded[i].data.item)
            }
            else if (tv_array_modded[i].data.dataType != "Critical") {
                final_array.push(tv_array_modded[i]);
                unique_list.push(tv_array_modded[i].data.item);
            }
        }
    }
    // console.log(final_array.length)
    return final_array;
}

function record_response(data, ChoiceArray) {
    if (data.response == "0") {
        data.result = ChoiceArray[0]
    } else if (data.response == "1") {
        data.result = ChoiceArray[1]
    } else if (data.response == "2") {
        data.result = ChoiceArray[2]
    }
}

let stimChoices = ['drugs','martialArts','privacy', 'tattoos']
let fillerChoices = ['DnD','trumpBible','SillyBandz','luigi']

let brokenPairs = {
    'drugs':['Thumaze','Wenlure'],
    'martialArts':['Domari','Churako'],
    'privacy':['crowdcloaking','herdblurring'],
    'tattoos':['interforme','tessamorph']
}

function randomizeStimChoices(stimChoices) {
    var stimsRandomized = shuffleArray(stimChoices);
    var stim1Choice = stimsRandomized.shift();
    var stim2Choice = stimsRandomized.shift();

    let returnList = [];
    returnList.push(stim1Choice,stim2Choice)

    return(returnList)
}

function randomizedFillerChoices(fillerChoices) {
    var fillersRandomized = shuffleArray(fillerChoices);
    var filler1Choice = fillersRandomized.shift();
    var filler2Choice = fillersRandomized.shift();

    let returnList = [];
    returnList.push(filler1Choice,filler2Choice);

    return(returnList)
}

