// message input element
var messageInput = document.getElementById('message');
messageInput.focus(); // focus to input element on page load
// submit button element
var submitBtn = document.getElementById('submitBtn');
// chat container element
var chatContainer = document.getElementById('chatContainer');

// Execute a function when the user presses a key on the keyboard
messageInput.addEventListener("keydown", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        submitBtn.click();
    }
});

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

const getVegList = async () => {
    var options = {
        method: 'GET',
        redirect: 'follow'
    }
    const response = await fetch("./reqVeg", options);
    const data = await response.json();
    console.log('getVegList func data: ', data)
    console.log('getVegList type data: ', typeof (data))
    return data;
}

const getFruitList = async () => {
    var options = {
        method: 'GET',
        redirect: 'follow'
    }
    const response = await fetch("./reqFruit", options);
    const data = await response.json();
    console.log('getFruitList func data: ', data)
    console.log('getFruitList type data: ', typeof (data))
    return data;
}

var prevVegetableMatchedNames = [];
var prevVegetablesExactMatchedNames = [];
var prevFruitMatchedNames = [];
var prevFruitExactMatchedNames = [];

var requestVegetable = async () => {
    // Get the message from the input element
    var message = messageInput.value;
    message = message.trim();
    // If the message is not empty
    if (message) {
        const vegetablesList = await getVegList().then(data => data);
        const vegetablesListNames = [];
        const vegetablesExactMatchedNames = [];
        const vegetableMatchedNames = [];
        for (let i = 0; i < vegetablesList.length; i++) {
            vegetablesListNames.push(vegetablesList[i].name);
            if (vegetablesList[i].name.toLowerCase() === message.toLowerCase()) {
                vegetablesExactMatchedNames.push([vegetablesList[i].name, vegetablesList[i]]);
            }
            if (vegetablesList[i].name.toLowerCase().includes(message.toLowerCase())) {
                vegetableMatchedNames.push([vegetablesList[i].name, vegetablesList[i]]);
            }
        }
        // Create a div element with the message
        var inputDiv = document.createElement('div');
        var inputMsgContainer = document.createElement('div');
        var inputMsg = document.createElement('div');
        var inputMsgTimeStamp = document.createElement('div');
        inputMsg.innerHTML = message;
        inputMsg.classList.add('input-msg');
        inputMsgContainer.appendChild(inputMsg);
        inputMsgTimeStamp.innerHTML = new Date().toLocaleTimeString();
        inputMsgTimeStamp.classList.add('input-msg-timestamp');
        inputMsgContainer.appendChild(inputMsgTimeStamp);
        inputDiv.appendChild(inputMsgContainer);
        inputMsgContainer.classList.add('input-msg-container');
        inputDiv.classList.add('input-div');
        // Append the div element to the chat container
        chatContainer.appendChild(inputDiv);
        // Clear the input element
        messageInput.value = '';
        // automatically scroll to the bottom of the chat container
        var shouldScroll = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;
        if (!shouldScroll) {
            scrollToBottom();
        }
        console.log('vegetableMatchedNames: ', vegetableMatchedNames);
        console.log('vegetablesExactMatchedNames: ', vegetablesExactMatchedNames);
        if (message.toLowerCase() === 'yes' && prevVegetableMatchedNames.length === 1) {
            vegetableResponseObj(prevVegetableMatchedNames[0][1])
        } else if (message.toLowerCase() === 'no' && prevVegetableMatchedNames.length === 1) {
            response('Sorry about that 😅<br>Enter <b>"list"</b> to get the list of vegetables 📃,<br>Enter <b>"clear"</b> to clear the chat ✨');
        } else if (vegetablesExactMatchedNames.length === 1) {
            vegetableResponseObj(vegetablesExactMatchedNames[0][1])
        } else if (vegetableMatchedNames.length >= 1) {
            let responseMsg = 'Did you mean: ';
            if (vegetableMatchedNames.length === 1) {
                responseMsg += '<b>' + vegetableMatchedNames[0][0] + '</b>?<br>Enter <b>"yes"</b> or <b>"no"</b>';
                response(responseMsg);
            } else {
                for (let i = 0; i < vegetableMatchedNames.length; i++) {
                    if (i == vegetableMatchedNames.length - 1)
                        responseMsg += 'or ' + vegetableMatchedNames[i][0] + '?';
                    else
                        responseMsg += vegetableMatchedNames[i][0] + ', ';
                }
                response(responseMsg);
            }
        } else {
            if (message.toLowerCase() === 'help') {
                response('Enter <b>"list"</b> to get the list of vegetables 📃,<br>Enter <b>"clear"</b> to clear the chat ✨');
            } else if (message.toLowerCase() === 'list') {
                vegetableResponseList(vegetablesListNames);
            } else if (message.toLowerCase() === 'clear') {
                chatContainer.innerHTML = '';
            } else {
                response('No Vegetable Found 🥕,<br>Enter <b>"help"</b> to get suggestions');
            }
        }
        prevVegetableMatchedNames = vegetableMatchedNames;
        prevVegetablesExactMatchedNames = vegetablesExactMatchedNames;
        console.log('prevVegetableMatchedNames: ', prevVegetableMatchedNames);
        console.log('prevVegetablesExactMatchedNames: ', prevVegetablesExactMatchedNames);
    } else {
        // Focus on the input element
        messageInput.focus();
    }
};

var requestFruit = async () => {
    // Get the message from the input element
    var message = messageInput.value;
    message = message.trim();
    // If the message is not empty
    if (message) {
        const fruitsList = await getFruitList().then(data => data);
        const fruitsListNames = [];
        const fruitsExactMatchedNames = [];
        const fruitsMatchedNames = [];
        for (let i = 0; i < fruitsList.length; i++) {
            fruitsListNames.push(fruitsList[i].name);
            if (fruitsList[i].name.toLowerCase() === message.toLowerCase()) {
                fruitsExactMatchedNames.push([fruitsList[i].name, fruitsList[i]]);
            }
            if (fruitsList[i].name.toLowerCase().includes(message.toLowerCase())) {
                fruitsMatchedNames.push([fruitsList[i].name, fruitsList[i]]);
            }
        }
        // Create a div element with the message
        var inputDiv = document.createElement('div');
        var inputMsgContainer = document.createElement('div');
        var inputMsg = document.createElement('div');
        var inputMsgTimeStamp = document.createElement('div');
        inputMsg.innerHTML = message;
        inputMsg.classList.add('input-msg');
        inputMsgContainer.appendChild(inputMsg);
        inputMsgTimeStamp.innerHTML = new Date().toLocaleTimeString();
        inputMsgTimeStamp.classList.add('input-msg-timestamp');
        inputMsgContainer.appendChild(inputMsgTimeStamp);
        inputDiv.appendChild(inputMsgContainer);
        inputMsgContainer.classList.add('input-msg-container');
        inputDiv.classList.add('input-div');
        // Append the div element to the chat container
        chatContainer.appendChild(inputDiv);
        // Clear the input element
        messageInput.value = '';
        // automatically scroll to the bottom of the chat container
        var shouldScroll = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;
        if (!shouldScroll) {
            scrollToBottom();
        }
        console.log('fruitsMatchedNames: ', fruitsMatchedNames);
        console.log('fruitsExactMatchedNames: ', fruitsExactMatchedNames);
        if (message.toLowerCase() === 'yes' && prevFruitMatchedNames.length === 1) {
            fruitResponseObj(prevFruitMatchedNames[0][1])
        } else if (message.toLowerCase() === 'no' && prevFruitMatchedNames.length === 1) {
            response('Sorry about that 😅<br>Enter <b>"list"</b> to get the list of fruits 📃,<br>Enter <b>"clear"</b> to clear the chat ✨');
        } else if (fruitsExactMatchedNames.length === 1) {
            fruitResponseObj(fruitsExactMatchedNames[0][1])
        } else if (fruitsMatchedNames.length >= 1) {
            let responseMsg = 'Did you mean: ';
            if (fruitsMatchedNames.length === 1) {
                responseMsg += '<b>' + fruitsMatchedNames[0][0] + '</b>?<br>Enter <b>"yes"</b> or <b>"no"</b>';
                response(responseMsg);
            } else {
                for (let i = 0; i < fruitsMatchedNames.length; i++) {
                    if (i == fruitsMatchedNames.length - 1)
                        responseMsg += 'or ' + fruitsMatchedNames[i][0] + '?';
                    else
                        responseMsg += fruitsMatchedNames[i][0] + ', ';
                }
                response(responseMsg);
            }
        } else {
            if (message.toLowerCase() === 'help') {
                response('Enter <b>"list"</b> to get the list of fruits 📃,<br>Enter <b>"clear"</b> to clear the chat ✨');
            } else if (message.toLowerCase() === 'list') {
                fruitResponseList(fruitsListNames);
            } else if (message.toLowerCase() === 'clear') {
                chatContainer.innerHTML = '';
            } else {
                response('No Fruit Found 🍊,<br>Enter <b>"help"</b> to get suggestions');
            }
        }
        prevFruitMatchedNames = fruitsMatchedNames;
        prevFruitExactMatchedNames = fruitsExactMatchedNames;
        console.log('prevFruitMatchedNames: ', prevFruitMatchedNames);
        console.log('prevFruitExactMatchedNames: ', prevFruitExactMatchedNames);
    } else {
        // Focus on the input element
        messageInput.focus();
    }
};

var response = (message) => {
    // Create a div element with the message
    var outputDiv = document.createElement('div');
    var outputMsgContainer = document.createElement('div');
    var outputMsg = document.createElement('div');
    var outputMsgTimeStamp = document.createElement('div');
    outputMsg.innerHTML = message;
    outputMsg.classList.add('output-msg');
    outputMsgContainer.appendChild(outputMsg);
    outputMsgContainer.classList.add('output-msg-container');
    outputMsgTimeStamp.innerHTML = new Date().toLocaleTimeString();
    outputMsgTimeStamp.classList.add('output-msg-timestamp');
    outputMsgContainer.appendChild(outputMsgTimeStamp);
    outputDiv.appendChild(outputMsgContainer);
    outputDiv.classList.add('output-div');
    // Append the div element to the chat container
    chatContainer.appendChild(outputDiv);
    // automatically scroll to the bottom of the chat container
    var shouldScroll = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;
    if (!shouldScroll) {
        scrollToBottom();
    }
};

var vegetableResponseObj = (obj) => {
    const { mallPriceRange, marketPrice, name, retailPriceRange, unit } = obj;
    const message = `Vegetable Name: <b>${name}</b>,<br>Unit: <b>${unit}</b>,<br>Market Price: <b>${marketPrice}</b>,<br>Retail Price Range: <b>${retailPriceRange}</b>,<br>Mall Price Range: <b>${mallPriceRange}</b>`;
    // Create a div element with the message
    var outputDiv = document.createElement('div');
    var outputMsgContainer = document.createElement('div');
    var outputMsg = document.createElement('div');
    var outputMsgTimeStamp = document.createElement('div');
    outputMsg.innerHTML = message;
    outputMsg.classList.add('output-msg');
    outputMsgContainer.appendChild(outputMsg);
    outputMsgContainer.classList.add('output-msg-container');
    outputMsgTimeStamp.innerHTML = new Date().toLocaleTimeString();
    outputMsgTimeStamp.classList.add('output-msg-timestamp');
    outputMsgContainer.appendChild(outputMsgTimeStamp);
    outputDiv.appendChild(outputMsgContainer);
    outputDiv.classList.add('output-div');
    // Append the div element to the chat container
    chatContainer.appendChild(outputDiv);
    // automatically scroll to the bottom of the chat container
    var shouldScroll = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;
    if (!shouldScroll) {
        scrollToBottom();
    }
}

var fruitResponseObj = (obj) => {
    const { mallPriceRange, marketPrice, name, retailPriceRange, unit } = obj;
    const message = `Fruit Name: <b>${name}</b>,<br>Unit: <b>${unit}</b>,<br>Market Price: <b>${marketPrice}</b>,<br>Retail Price Range: <b>${retailPriceRange}</b>,<br>Mall Price Range: <b>${mallPriceRange}</b>`;
    // Create a div element with the message
    var outputDiv = document.createElement('div');
    var outputMsgContainer = document.createElement('div');
    var outputMsg = document.createElement('div');
    var outputMsgTimeStamp = document.createElement('div');
    outputMsg.innerHTML = message;
    outputMsg.classList.add('output-msg');
    outputMsgContainer.appendChild(outputMsg);
    outputMsgContainer.classList.add('output-msg-container');
    outputMsgTimeStamp.innerHTML = new Date().toLocaleTimeString();
    outputMsgTimeStamp.classList.add('output-msg-timestamp');
    outputMsgContainer.appendChild(outputMsgTimeStamp);
    outputDiv.appendChild(outputMsgContainer);
    outputDiv.classList.add('output-div');
    // Append the div element to the chat container
    chatContainer.appendChild(outputDiv);
    // automatically scroll to the bottom of the chat container
    var shouldScroll = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;
    if (!shouldScroll) {
        scrollToBottom();
    }
}

var vegetableResponseList = (list) => {
    var message = 'Here is the list 📃 of Vegetables available:<br>';
    for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1) {
            message += i + 1 + `. ${list[i]}`;
        } else {
            message += i + 1 + `. ${list[i]},<br>`;
        }
    }
    // Create a div element with the message
    var outputDiv = document.createElement('div');
    var outputMsgContainer = document.createElement('div');
    var outputMsg = document.createElement('div');
    var outputMsgTimeStamp = document.createElement('div');
    outputMsg.innerHTML = message;
    outputMsg.classList.add('output-msg');
    outputMsgContainer.appendChild(outputMsg);
    outputMsgContainer.classList.add('output-msg-container');
    outputMsgTimeStamp.innerHTML = new Date().toLocaleTimeString();
    outputMsgTimeStamp.classList.add('output-msg-timestamp');
    outputMsgContainer.appendChild(outputMsgTimeStamp);
    outputDiv.appendChild(outputMsgContainer);
    outputDiv.classList.add('output-div');
    // Append the div element to the chat container
    chatContainer.appendChild(outputDiv);
    // automatically scroll to the bottom of the chat container
    var shouldScroll = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;
    if (!shouldScroll) {
        scrollToBottom();
    }
}

var fruitResponseList = (list) => {
    var message = 'Here is the list 📃 of Fruits available:<br>';
    for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1) {
            message += i + 1 + `. ${list[i]}`;
        } else {
            message += i + 1 + `. ${list[i]},<br>`;
        }
    }
    // Create a div element with the message
    var outputDiv = document.createElement('div');
    var outputMsgContainer = document.createElement('div');
    var outputMsg = document.createElement('div');
    var outputMsgTimeStamp = document.createElement('div');
    outputMsg.innerHTML = message;
    outputMsg.classList.add('output-msg');
    outputMsgContainer.appendChild(outputMsg);
    outputMsgContainer.classList.add('output-msg-container');
    outputMsgTimeStamp.innerHTML = new Date().toLocaleTimeString();
    outputMsgTimeStamp.classList.add('output-msg-timestamp');
    outputMsgContainer.appendChild(outputMsgTimeStamp);
    outputDiv.appendChild(outputMsgContainer);
    outputDiv.classList.add('output-div');
    // Append the div element to the chat container
    chatContainer.appendChild(outputDiv);
    // automatically scroll to the bottom of the chat container
    var shouldScroll = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;
    if (!shouldScroll) {
        scrollToBottom();
    }
}

// head tag title element
var headTitle = document.getElementById('headTitle');
// project title heading element
var projectTitle = document.getElementById('projectTitle');

// Vegetable ChatBot container
var vegChatBot = document.getElementById('vegChatBot');
// Vegetable ChatBot radio button
var radioVegChatBot = document.getElementById('radioVegChatBot');
// Vegetable Image Element
var vegImg = document.getElementById('vegImg');

// Fruit ChatBot container
var fruitChatBot = document.getElementById('fruitChatBot');
// Fruit ChatBot radio button
var radioFruitChatBot = document.getElementById('radioFruitChatBot');
// Fruit Image Element
var fruitImg = document.getElementById('fruitImg');

vegChatBot.addEventListener('click', () => {
    vegImg.classList.add('active');
    fruitImg.classList.remove('active');
    projectTitle.innerHTML = 'Vegetable Pricing ChatBot';
    headTitle.innerHTML = 'Vegetable Pricing ChatBot';
    radioVegChatBot.checked = true;
    messageInput.placeholder = 'Enter a vegetable name ...';
    localStorage.setItem('chatBot', 'vegetable');
    submitBtn.setAttribute("onClick", "javascript: requestVegetable();");
    chatContainer.innerHTML = '';
    response('Hi, I am Vegetable ChatBot,<br>I can help you with the pricing of vegetables,<br>Enter a vegetable name to get started.')
    messageInput.focus();
});

fruitChatBot.addEventListener('click', () => {
    fruitImg.classList.add('active');
    vegImg.classList.remove('active');
    projectTitle.innerHTML = 'Fruit Pricing ChatBot';
    headTitle.innerHTML = 'Fruit Pricing ChatBot';
    radioFruitChatBot.checked = true;
    messageInput.placeholder = 'Enter a fruit name ...';
    localStorage.setItem('chatBot', 'fruit');
    submitBtn.setAttribute("onClick", "javascript: requestFruit();");
    chatContainer.innerHTML = '';
    response('Hi, I am Fruit ChatBot,<br>I can help you with the pricing of fruits,<br>Enter a fruit name to get started.');
    messageInput.focus();
});

// setting the vegetable chatbot as default
if (localStorage.getItem('chatBot') === null) {
    localStorage.setItem('chatBot', 'vegetable');
    // click the vegChatBot element
    vegChatBot.click();
} else {
    localStorage.getItem('chatBot') === 'vegetable' ? vegChatBot.click() : fruitChatBot.click();
}