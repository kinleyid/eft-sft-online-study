
/*
To do:

Write function that withdraw button runs
Pilot
Write R code to analyze data
*/

/*
Conditions:
1 = episodic specificity
2 = episodic control
*/

var pIDdigs = 100000000;
var participant_id = Math.floor(pIDdigs + Math.random() * (9 * pIDdigs - 1));
var condition = Math.floor(1 + Math.random() * 2); // 1 or 2
var slider_width = '300px'; // Slider width for visual analog scales

// Time between today and first week of classes:
var today = new Date();
var diffDays = 30*2;
var delayedDate = new Date();
delayedDate.setDate(delayedDate.getDate() + diffDays);

addWithdrawButton = function() { // Add this to the first timeline element
	withdrawButton = document.createElement('button');
	withdrawButton.textContent = 'withdraw';
	withdrawButton.position = 'absolute';
	withdrawButton.visibility = 'visible';
	document.getElementsByTagName("body")[0].appendChild(withdrawButton);
}

final_screen = function() {
	// Clear everything and add instructions for receiving credit
	// Make this function the callback for the withdraw button and the on_finish attribute of the experiment
}

var timeline = [];
/*
	Consent
*/
var save_email = function(elem) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'saveData.php', true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() { // Call a function when the state changes.
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		}
	}
	xhr.send("pID=zEmail&txt=" + document.getElementById('pEmail').value);
	return true;
};
timeline.push({
	type: 'external-html',
	url: "consent.html",
	cont_btn: "start",
	check_fn: save_email
});
/*
	Set fullscreen
*/
timeline.push({ // Set the user's screen to fullscreen
	type: 'fullscreen',
	fullscreen_mode: true
});
/*

	DEMOGRAPHICS

*/
var age = {
	type: 'survey-text',
	questions: [{prompt: 'What is your date of birth? (YYYY/MM/DD)'}]
};
var gender = {
	type: 'survey-multi-choice',
	questions: [{prompt: 'What is your gender?', options: ['Man', 'Woman', 'Other/prefer not to say'], horizontal: true}]
};
timeline.push(age, gender);
/*

	FIRST DELAY DISCOUNTING TASK

*/
var dd_instructions = {
	type: 'instructions',
	pages: [
		'Now you will make a series of monetary choices.',
		'You will be asked whether you would prefer some amount of money now or another amount later.',
		'Click the option that you would choose.'
	],
	show_clickable_nav: true,
	post_trial_gap: 1000
};
var dd_data = {
	immediate_value: 50,
	delayed_value: 100,
	delay_text: 'in ' + diffDays + ' days',
	immediate_text: 'now',
	div_pre: '<div style="height: 100px; width: 150px;">',
	trial_count: 0,
	max_trials: 5
};
var dd_trial = {
	type: 'html-button-response',
	stimulus: '',
	choices: ['', ''],
	post_trial_gap: 500,
	data: {},
	on_start: function(trial) {
		if (dd_data.trial_count > 0) {
			var last_data = jsPsych.data.getLastTimelineData().values()[0];
			var inc = dd_data.delayed_value/4*0.5**(dd_data.trial_count - 1);
			if (last_data.button_pressed == last_data.order) { // Immediate choice was made
				dd_data.immediate_value -= inc;
			} else { // Delayed choice was made
				dd_data.immediate_value += inc;
			}
		}
		trial.data = {
			immediate_value: Math.round(dd_data.immediate_value), // Dollar value of immediate reward
			delayed_value: Math.round(dd_data.delayed_value), // Dollar value of delayed reward
			delay_text: dd_data.delay_text, // Display text specifying delay
			immediate_text: dd_data.immediate_text, // Display text specifying delay
			order: Math.round(Math.random()) // Order in which buttons appear
		}
		var imm = dd_data.div_pre +
			'<p>$' + trial.data.immediate_value + '</p>' +
			'<p>' + trial.data.immediate_text + '</p>' +
			'</div>';
		var del = dd_data.div_pre +
			'<p>$' + trial.data.delayed_value + '</p>' +
			'<p>' + trial.data.delay_text + '</p>' +
			'</div>';
		if (trial.data.order == 0) {
			trial.choices = [imm, del];
		} else {
			trial.choices = [del, imm];
		}
		dd_data.trial_count++;
	}
};
var dd_loop = {
	timeline: [dd_trial],
	loop_function: function(data) {
		if (dd_data.trial_count == dd_data.max_trials) {
			return false;
		} else {
			return true;
		}
	}
};
timeline.push(dd_instructions, dd_loop);
/*

	EXPERIMENTAL MANIPULATION

*/
var EFT_instructions = {
	timeline: [
		{
			type: 'instructions',
			pages: [
				'Please think of an event that might happen to you on ' + delayedDate.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}),
				'This should be a single event that, if it happens, will happen at a specific time and place.',
				'The event should not be something that has already happened',
				'The event can last a few minutes or hours but not longer than a day.',
				'Examples of bad events:</br>1. Commuting to school (Has already happened many times)</br>2. Going to classes (Not specific and takes more than a day)</br>3. Friend starting classes at a different university (Not an event that happens to you)',
				'Examples of good events:</br>1. Running into an old friend</br>2. Moving into a new apartment</br>3. Meeting up with someone to buy a used textbook',
				'Once you have an event in mind that:</br></br>' +
				'1. Could realistically happen in the first week of the upcoming winter semester</br>' +
				'2. Would happen at a specific time</br>' +
				'3. Would happen at a specific place</br>' +
				'3. Would not last longer than a day</br>' +
				'4. Has not happened yet</br></br>Click "next"'
			],
			show_clickable_nav: true
		},
		{
			type: 'survey-text',
			questions: [{prompt: 'Please write a brief title for your event'}]
		}
	]
};
var EFT_specificity_prompts = [
	'Close your eyes and think about the location of the event. Think about how things look and how objects are arranged. Once you have a very good picture of the surroundings, write every detail you can (even details that do not seem important).',
	'Please write more about the objects in the location.',
	'Please write more about how objects in the location are arranged.',
	'Please close your eyes and think about the actions that take place in the event. Think about what happens and what people do and how they do these things. Once you have a really good mental picture of the actions, write them down IN ORDER.',
	'Please write more about the first action.',
	'Please write more about the second action.',
	'Please write more about the third action.'
];
var EFT_control_prompts = [
	'What are your general impressions of the event? Please write every thought you have (even ones that do not seem important).',
	'What adjectives would you use to describe the location?',
	'What do you think of the location of the event?',
	'Please describe the whole event in just 2 words.',
	'Do you like the event?',
	'Does the event remind you of anything?',
	'Are there any other thoughts you have about the event?'
];
var EFT_specificity_task = {
	timeline: [
		{
			type: 'instructions',
			pages: ['You will now be asked about details of your event. This is not a test. You are the expert on the event.'],
			show_clickable_nav: true
		}].concat(
			EFT_specificity_prompts.map(function(x) {
				return {
					type: 'survey-text',
					questions: [{prompt: x, rows: 10}]
				}
			})
		)
};
var EFT_control_task = {
	timeline: [
		{
			type: 'instructions',
			pages: ['You will now be asked some questions about the event.'],
			show_clickable_nav: true
		}].concat(
			EFT_specificity_prompts.map(function(x) {
				return {
					type: 'survey-text',
					questions: [{prompt: x, rows: 10}]
				}
			})
		)
};
timeline.push(EFT_instructions)
if (condition == 1) {
	timeline.push(EFT_specificity_task)
} else {
	timeline.push(EFT_control_task)
}
/*

	SECOND DELAY DISCOUNTING TASK

*/
var dd_instructions = {
	type: 'instructions',
	pages: [
		'Now you will make a series of monetary choices like before.',
		'This time, imagine the event while you make your decisions.',
		'Again, do not think too hard, just go with your gut.'
	],
	show_clickable_nav: true,
	post_trial_gap: 1000
};
timeline.push(
	dd_instructions,
	{ // Reset delay discounting data:
		type: 'call-function',
		func: function() {
			dd_data.trial_count = 0;
			dd_data.immediate_value = 100;
			dd_data.delayed_value = 200;
			dd_data.delay_text = 'during the event</br>you are imagining';
			dd_data.immediate_text = 'now';
		}
	},
	dd_loop
);
/*

	PHENOMENOLOGICAL QUERIES

*/
var vividness_adjectives = [
	['faint', 'vivid'],
	['vague', 'clear'],
	['fuzzy', 'sharp'],
	['dim', 'bright'],
	['dull', 'lively'],
	['simple', 'detailed']
];
var sensory_prompts = [
	'visual detail',
	'sound',
	'smell',
	'touch',
	'taste'
];
var phenomenological_instructions = {
	type: 'instructions',
	pages: [
		'Now you will be asked about what it was</br>like when you were just imagining the event.',
		'Move the slider to select your answers.',
		'Move the slider more to one side if you</br>agree more strongly with the answer on that side.',
		'Move the slider all the way to one side</br>if you agree 100% with the answer on that side.'
	],
	show_clickable_nav: true
};
var phenomenological_queries = {
	type: 'html-slider-response',
	post_trial_gap: 200,
	timeline: [
		{
			stimulus: '<p style="width: ' + slider_width + ';">We can see things in our minds from different points of view.</br>Sometimes the pictures in our minds are from the perspective of our own eyes (first-person). Other times we see things as if through a security camera (third-person). When I imagined the event, my visual perspective was</p>',
			labels: ['completely first-person', 'both equally', 'completely third-person'],
		},
		{
			stimulus: '<p style="width: ' + slider_width + ';">The general tone of the event was</p>',
			labels: ['negative', 'positive']
		},
		{
			stimulus: '<p style="width: ' + slider_width + ';">The emotions associated with the event were</p>',
			labels: ['not intense', 'very intense']
		},
		{
			stimulus: '<p style="width: ' + slider_width + ';">While I was imagining the event, it was</p>',
			timeline: vividness_adjectives.map(function(x) {
				return {labels: x}
			})
		},
		{
			labels: ['none', 'a lot'],
			timeline: sensory_prompts.map(function(x) {
				return {stimulus: '<p style="width: ' + slider_width + ';">My imagination of the event involved</br>' + x + '</p>'}
			})
		},
		{
			labels: ['like tomorrow', 'far away'],
			stimulus: '<p style="width: ' + slider_width + ';">Sometimes the future can feel like it is coming up very soon even when it is not.</br>Sometimes it can feel a long way off even when it is not.</br></br>When I imagined the event, it felt</p>'
		},
		{
			labels: ['disagree', 'agree'],
			stimulus: '<p style="width: ' + slider_width + ';">When I imagined the event, it felt like I was pre-experiencing it</p>'
		}
	]
};
timeline.push(phenomenological_instructions, phenomenological_queries);
/*

	DATA QUALITY CHECK

*/
var data_quality_instructions = {
	type: 'instructions',
	pages: [
		'Now you will be asked about your</br>experience with this study',
		'Please move the slider to indicate how much</br>you agree or disagree with the statements',
		'Please be honest. There will be NO PENALTY</br>based on your answers'
	],
	show_clickable_nav: true
};
data_quality_prompts = [
	'I read and understood all the instructions and questions',
	'I took the study seriously',
	'I found the task difficult',
	'I was in a quiet place',
	'Other people looked at my computer screen',
	'I have talked to other people who also did this study',
	'My data is good enough to be used in a scientific study'
];
var data_quality_check = {
	type: 'html-slider-response',
	labels: ['disagree', 'agree'],
	timeline: data_quality_prompts.map(function(x) {
		return {stimulus: '<p style="width: ' + slider_width + ';">' + x + '</p>'}
	})
};
timeline.push(data_quality_instructions, data_quality_check);

timeline.push({
  type: 'fullscreen',
  fullscreen_mode: false
});

timeline[0].on_load = addWithdrawButton;

jsPsych.init({
	timeline: timeline,
	on_finish: function() { // Save data
		var ifrm = document.createElement("iframe");
        ifrm.style.width = "0px";
        ifrm.style.height = "0px";
        ifrm.style.border = "0px";
		ifrm.name = 'curriframe';
        document.body.appendChild(ifrm);
		var form = document.createElement('form');
		document.body.appendChild(form);
		form.method = 'post';
		form.action = 'saveData.php';
		var data = {
			txt: jsPsych.data.get().csv(),
			pID: participant_id
		}
		var name;
		for (name in data) {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = name;
			input.value = data[name];
			form.appendChild(input);
		}
		form.submit();
	}
});