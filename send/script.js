'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.rate=4;
  utterance.text = text;
  synth.speak(utterance);
}

// function loadVoices() {
//   // Fetch the available voices.
//   var voices = speechSynthesis.getVoices();
  
//   // Loop through each of the voices.
//   voices.forEach(function(voice, i) {
//     // Create a new option element.
//     var option = document.createElement('option');
    
//     // Set the options value and text.
//     option.value = voice.name;
//     option.innerHTML = voice.name;
      
//     // Add the option to the voice selector.
//     voiceSelect.appendChild(option);
//   });
// }

// function synthVoice(text){
//  // Execute loadVoices.
// loadVoices();

// // Chrome loads voices asynchronously.
// window.speechSynthesis.onvoiceschanged = function(e) {
//   loadVoices();
// };

// var utterance= new SpeechSynthesisUtterance();
// utterance.text =text;
// utterance.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google हिन्दी"; })[0];
// window.speechSynthesis.speak(utterance);
// }


socket.on('bot reply', function(replyText) {
 

  if(replyText == '') replyText = '(No answer...)';
  outputBot.innerHTML = replyText;
});

//Bot Speech Reply
socket.on('replySpeech', function(replySpeech) {
 synthVoice(replySpeech);

  
});

 
