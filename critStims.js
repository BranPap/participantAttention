const unprocessedCriticalStims = [
    {
        "ID": "targ_01",
        "word_count": "9",
        "type": "reverse_bias",
        "Name1": "Miguel",
        "sentence_wename": "Yesterday afternoon, the dog bit Miguel on the leg.",
        "sentence_youname": "Yesterday afternoon, the dog bit [name] on the leg."
    },
    {
        "ID": "targ_02",
        "word_count": "8",
        "type": "reverse_bias",
        "Name1": "Chase",
        "sentence_wename": "It was rumored that Chase ruined the food.",
        "sentence_youname": "It was rumored that [name] ruined the food."
    },
    {
        "ID": "targ_03",
        "word_count": "8",
        "type": "reverse_bias",
        "Name1": "Adrian",
        "sentence_wename": "To help with studying, Adrian quizzed the student.",
        "sentence_youname": "To help with studying, [name] quizzed the student."
    },
    {
        "ID": "targ_04",
        "word_count": "9",
        "type": "reverse_bias",
        "Name1": "Seth",
        "sentence_wename": "It was Seth who pursued the thief this morning.",
        "sentence_youname": "It was [name] who pursued the thief this morning."
    },
    {
        "ID": "targ_05",
        "word_count": "9",
        "type": "reverse_bias",
        "Name1": "Cassidy",
        "sentence_wename": "Feeling bad, Cassidy fed the tabby cat some food.",
        "sentence_youname": "Feeling bad, [name] fed the tabby cat some food."
    },
    {
        "ID": "targ_06",
        "word_count": "10",
        "type": "reverse_bias",
        "Name1": "Karina",
        "sentence_wename": "Earlier today, Karina treated the tall patient at the hospital.",
        "sentence_youname": "Earlier today, [name] treated the tall patient at the hospital."
    },
    {
        "ID": "targ_07",
        "word_count": "11",
        "type": "reverse_bias",
        "Name1": "Bethany",
        "sentence_wename": "Everyone knew Bethany hit the red ball that broke the window.",
        "sentence_youname": "Everyone knew [name] hit the red ball that broke the window."
    },
    {
        "ID": "targ_08",
        "word_count": "8",
        "type": "reverse_bias",
        "Name1": "Dominique",
        "sentence_wename": "No one was surprised Dominique caught the fish.",
        "sentence_youname": "No one was surprised [name] caught the fish."
    },
    {
        "ID": "targ_09",
        "word_count": "9",
        "type": "nonreverse",
        "Name1": "Brett",
        "sentence_wename": "To meet the deadline, Brett reviewed the paper quickly.",
        "sentence_youname": "To meet the deadline, [name] reviewed the paper quickly."
    },
    {
        "ID": "targ_10",
        "word_count": "8",
        "type": "nonreverse",
        "Name1": "Shane",
        "sentence_wename": "It was wild Shane won the race yesterday.",
        "sentence_youname": "It was wild [name] won the race yesterday."
    },
    {
        "ID": "targ_11",
        "word_count": "9",
        "type": "nonreverse",
        "Name1": "Jake",
        "sentence_wename": "Everyone laughed when Jake told the joke at recess.",
        "sentence_youname": "Everyone laughed when [name] told the joke at recess."
    },
    {
        "ID": "targ_12",
        "word_count": "9",
        "type": "nonreverse",
        "Name1": "Alejandro",
        "sentence_wename": "People are going to dance whenever Alejandro plays music.",
        "sentence_youname": "People are going to dance whenever [name] plays music."
    },
    {
        "ID": "targ_13",
        "word_count": "9",
        "type": "nonreverse",
        "Name1": "Carly",
        "sentence_wename": "It was revealed that Carly typed the mysterious letter.",
        "sentence_youname": "It was revealed that [name] typed the mysterious letter."
    },
    {
        "ID": "targ_14",
        "word_count": "9",
        "type": "nonreverse",
        "Name1": "Bianca",
        "sentence_wename": "This morning, Bianca flew the plane in an emergency.",
        "sentence_youname": "This morning, [name] flew the plane in an emergency."
    },
    {
        "ID": "targ_15",
        "word_count": "8",
        "type": "nonreverse",
        "Name1": "Desiree",
        "sentence_wename": "To hide the gold, Desiree buried the treasure.",
        "sentence_youname": "To hide the gold, [name] buried the treasure."
    },
    {
        "ID": "targ_16",
        "word_count": "8",
        "type": "nonreverse",
        "Name1": "Kendra",
        "sentence_wename": "Coming home last night, Kendra pulled the wagon.",
        "sentence_youname": "Coming home last night, [name] pulled the wagon."
    },
    {
        "ID": "targ_17",
        "word_count": "10",
        "type": "symm",
        "Name1": "Brenda",
        "sentence_wename": "Last week, Brenda kissed her boyfriend for the first time.",
        "sentence_youname": "Last week, [name] kissed her boyfriend for the first time."
    },
    {
        "ID": "targ_18",
        "word_count": "10",
        "type": "symm",
        "Name1": "Gabriela",
        "sentence_wename": "Reluctantly, Gabriela hugged her brother even though she was mad.",
        "sentence_youname": "Reluctantly, [name] hugged her brother even though she was mad."
    },
    {
        "ID": "targ_19",
        "word_count": "11",
        "type": "symm",
        "Name1": "Casey",
        "sentence_wename": "Even though it was dark, Casey saw the driver last night.",
        "sentence_youname": "Even though it was dark, [name] saw the driver last night."
    },
    {
        "ID": "targ_20",
        "word_count": "9",
        "type": "symm",
        "Name1": "Daisy",
        "sentence_wename": "No one knew Daisy loved the puppy so much.",
        "sentence_youname": "No one knew [name] loved the puppy so much."
    },
    {
        "ID": "targ_21",
        "word_count": "8",
        "type": "symm",
        "Name1": "Angel",
        "sentence_wename": "It was no secret Angel despised the baker.",
        "sentence_youname": "It was no secret [name] despised the baker."
    },
    {
        "ID": "targ_22",
        "word_count": "10",
        "type": "symm",
        "Name1": "Colton",
        "sentence_wename": "It was nice of Colton to thank the mean customer.",
        "sentence_youname": "It was nice of [name] to thank the mean customer."
    },
    {
        "ID": "targ_23",
        "word_count": "12",
        "type": "symm",
        "Name1": "Spencer",
        "sentence_wename": "To win the game, Spencer chose the player with the blue tee.",
        "sentence_youname": "To win the game, [name] chose the player with the blue tee."
    },
    {
        "ID": "targ_24",
        "word_count": "8",
        "type": "symm",
        "Name1": "Devon",
        "sentence_wename": "Wanting good photos, Devon met the photographer in-person.",
        "sentence_youname": "Wanting good photos, [name] met the photographer in-person."
    }
]

const fillerStims = [
    {
        "ID": "fill_01",
        "word_count": "6",
        "type": "garden_path",
        "Sentence": "While Kara bathed the baby cried.",
        "Fill-in-the-blank": "While Kara bathed the baby [blank].",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_02",
        "word_count": "7",
        "type": "garden_path",
        "Sentence": "While Ricardo hunted the deer ran away.",
        "Fill-in-the-blank": "While Ricardo hunted the [blank] ran away.",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_03",
        "word_count": "10",
        "type": "garden_path",
        "Sentence": "While the student read the notes blew off the desk.",
        "Fill-in-the-blank": "While the student read the notes blew off the [blank].",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_04",
        "word_count": "9",
        "type": "garden_path",
        "Sentence": "While Alec orders the fish cooks in a pot.",
        "Fill-in-the-blank": "While Alec orders the [blank] cooks in a pot.",
        "pos_of_blank": "mid"
    },
    {
        "ID": "fill_05",
        "word_count": "10",
        "type": "garden_path",
        "Sentence": "While Jorge drove the dusty car veered into a ditch.",
        "Fill-in-the-blank": "While Jorge drove the [blank] car veered into a ditch.",
        "pos_of_blank": "mid"
    },
    {
        "ID": "fill_06",
        "word_count": "11",
        "type": "garden_path",
        "Sentence": "While the mother calms down the children sit on the bed.",
        "Fill-in-the-blank": "While the [blank] calms down the children sit on the bed.",
        "pos_of_blank": "beg"
    },
    {
        "ID": "fill_07",
        "word_count": "11",
        "type": "vp_ellip",
        "Sentence": "The neighbor goes out with friends, and his sister does too.",
        "Fill-in-the-blank": "The neighbor goes out with friends, and his [blank] does too.",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_08",
        "word_count": "10",
        "type": "vp_ellip",
        "Sentence": "Vincent works on Tuesdays, and Summer does on Thursdays too.",
        "Fill-in-the-blank": "Vincent works on [blank], and Summer does on Thursdays too.",
        "pos_of_blank": "mid"
    },
    {
        "ID": "fill_09",
        "word_count": "10",
        "type": "vp_ellip",
        "Sentence": "Grant vacuums weekly, and Joel usually does so every month.",
        "Fill-in-the-blank": "Grant vacuums weekly, and Joel usually does so every [blank].",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_10",
        "word_count": "11",
        "type": "vp_ellip",
        "Sentence": "The girl bought two stuffed animals, and the boy did too.",
        "Fill-in-the-blank": "The girl bought [blank] stuffed animals, and the boy did too.",
        "pos_of_blank": "mid"
    },
    {
        "ID": "fill_11",
        "word_count": "13",
        "type": "vp_ellip",
        "Sentence": "The rumor about Eduardo spread quickly, and the one about Summer did too.",
        "Fill-in-the-blank": "The [blank] about Eduardo spread quickly, and the one about Summer did too.",
        "pos_of_blank": "beg"
    },
    {
        "ID": "fill_12",
        "word_count": "15",
        "type": "vp_ellip",
        "Sentence": "The scandal about the actor was leaked, and the one about the influencer was too.",
        "Fill-in-the-blank": "The scandal about the actor was, and the one about the [blank] was too.",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_13",
        "word_count": "10",
        "type": "center_embedding",
        "Sentence": "The greeting cards the kids made were covered in glitter.",
        "Fill-in-the-blank": "The [blank] cards the kids made were covered in glitter.",
        "pos_of_blank": "beg"
    },
    {
        "ID": "fill_14",
        "word_count": "9",
        "type": "center_embedding",
        "Sentence": "The rusty pipes the plumber tried to repair burst.",
        "Fill-in-the-blank": "The [blank] pipes the plumber tried to repair burst.",
        "pos_of_blank": "beg"
    },
    {
        "ID": "fill_15",
        "word_count": "8",
        "type": "center_embedding",
        "Sentence": "The squirrel the coyote chased found an acorn.",
        "Fill-in-the-blank": "The squirrel the [blank] chased found an acorn.",
        "pos_of_blank": "mid"
    },
    {
        "ID": "fill_16",
        "word_count": "10",
        "type": "center_embedding",
        "Sentence": "The assistant Oscar trained forgot the list of coffee orders. ",
        "Fill-in-the-blank": "The assistant Oscar trained [blank] the list of coffee orders. ",
        "pos_of_blank": "mid"
    },
    {
        "ID": "fill_17",
        "word_count": "9",
        "type": "center_embedding",
        "Sentence": "The message Nancy sent to her mom wasn't delivered.",
        "Fill-in-the-blank": "The [blank] Nancy sent to her mom wasn't delivered.",
        "pos_of_blank": "beg"
    },
    {
        "ID": "fill_18",
        "word_count": "13",
        "type": "center_embedding",
        "Sentence": "The laptop the officer pulled out of the bag had a green cover.",
        "Fill-in-the-blank": "The laptop the officer pulled out of the bag had a [blank] cover.",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_19",
        "word_count": "10",
        "type": "temporal_words",
        "Sentence": "Tomorrow afternoon, the soccer team will visit the history museum.",
        "Fill-in-the-blank": "Tomorrow [blank], the soccer team will visit the history museum.",
        "pos_of_blank": "beg"
    },
    {
        "ID": "fill_20",
        "word_count": "11",
        "type": "temporal_words",
        "Sentence": "Next month, the players will have two weeks of dress rehearsals.",
        "Fill-in-the-blank": "Next month, the players will have [blank] weeks of dress rehearsals.",
        "pos_of_blank": "mid"
    },
    {
        "ID": "fill_21",
        "word_count": "10",
        "type": "temporal_words",
        "Sentence": "After next Friday, Adriana will prepare for the poetry contest.",
        "Fill-in-the-blank": "After next Friday, Adriana will prepare for the [blank] contest.",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_22",
        "word_count": "10",
        "type": "temporal_words",
        "Sentence": "Before today, Francisco had never considered running this red light.",
        "Fill-in-the-blank": "Before [blank], Francisco had never considered running this red light.",
        "pos_of_blank": "beg"
    },
    {
        "ID": "fill_23",
        "word_count": "11",
        "type": "temporal_words",
        "Sentence": "After the weekend is over, Marisa can finally ride her motorcycle.",
        "Fill-in-the-blank": "After the weekend is over, Marisa can finally ride her [blank].",
        "pos_of_blank": "end"
    },
    {
        "ID": "fill_24",
        "word_count": "14",
        "type": "temporal_words",
        "Sentence": "Last month, people argued where to build the new post office in the town.",
        "Fill-in-the-blank": "Last [blank], people argued where to build the new post office in the town.",
        "pos_of_blank": "beg"
    }
]

function generateStimuli() {
    let symmSentences = shuffleArray(unprocessedCriticalStims.filter(stim => stim.type === "symm"));
    let nonreverseSentences = shuffleArray(unprocessedCriticalStims.filter(stim => stim.type === "nonreverse"));
    let reverseSentences = shuffleArray(unprocessedCriticalStims.filter(stim => stim.type === "reverse_bias"));

    let finalStims = [];

    for (let i = 0; i < 4; i++) {
        var symmStim = symmSentences.pop();
        symmStim.nameType = "weName";
        var nonreverseStim = nonreverseSentences.pop();
        nonreverseStim.nameType = "weName";
        var reverseStim = reverseSentences.pop();
        reverseStim.nameType = "weName";
        finalStims.push(symmStim);
        finalStims.push(nonreverseStim);
        finalStims.push(reverseStim);
    }

    for (let i = 0; i < 4; i++) {
        var symmStim = symmSentences.pop();
        symmStim.nameType = "youName";
        var nonreverseStim = nonreverseSentences.pop();
        nonreverseStim.nameType = "youName";
        var reverseStim = reverseSentences.pop();
        reverseStim.nameType = "youName";
        finalStims.push(symmStim);
        finalStims.push(nonreverseStim);
        finalStims.push(reverseStim);
    }

    for (let i = 0; i < fillerStims.length; i++) {
        stim = fillerStims[i];
        stim.nameType = "filler";
        finalStims.push(stim);
    }

    return finalStims;
}
