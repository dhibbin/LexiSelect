async function SendPrompt(userPrompt, systemPrompt, currentOutput) {
    userPrompt = "<|user|>" + userPrompt + "<|end|>";
    systemPrompt = "<|system|>" + systemPrompt + "<|end|>";
    const prompt = systemPrompt + userPrompt + currentOutput;
    
    console.log(prompt);

    let response = await fetch("http://127.0.0.1:8080/completion", {
        method: 'POST',
        body: JSON.stringify({
            prompt,
            n_predict: 50,
            n_probs : 5,
            seed : document.getElementById("seed").value
        })
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json());
}

async function typeWriter(text, speed, element) {
    var i = 0;

    return new Promise((resolve) => {
        function helper() {
            if (i < text.length) {
                if (text.charAt(i) == " ") {
                    element.innerHTML += '&nbsp';
                }
                else { 
                    element.innerHTML += text.charAt(i);
                }
                i++;
                setTimeout(helper, speed);
            }
            else {
                resolve();
            }
        }
        helper();
    });
}


async function UpdateContent(response, newPath = false) {
    //console.log(response);
    currentPrompt += response.content.replace("<|assistant|>", "");

    var currentList;

    if (newPath || outputLists.length == 0) {
        newList = document.getElementById("textOutputList").content.cloneNode(true);
        currentList = newList.querySelector("ul");
        outputLists.push(currentList);
        document.getElementById("outputBox").appendChild(newList);
        
        if (tokenLists.length == 0) {
            tokenLists.push(response.completion_probabilities)
        }
        else {
            tokenLists[currentIndex] = tokenLists[currentIndex].concat(response.completion_probabilities);
        }
        OutputPrompt(tokenLists[tokenLists.length - 1], currentList);
    }
    else {
        tokenLists[currentIndex].concat(response.completion_probabilities);
        currentList = outputLists[currentIndex];
        OutputPrompt(response.completion_probabilities, currentList);
    }
    //console.log(tokenLists)
}

async function OutputPrompt(probTokens, currentList) {

    for (let i = 0; i < probTokens.length; i++) {
        if (probTokens[i].content == "<|assistant|>") {
            continue;
        }
        
        let temp = document.getElementById("textButton");
        let clone = temp.content.cloneNode(true);   
        let button = clone.querySelector('button');
        currentList.appendChild(clone);
        await typeWriter(probTokens[i].content, 10, button);

        //tokenLists.push(response.completion_probabilities[i]);
        button.addEventListener("click", () => ShowProbabilities(probTokens[i], currentIndex, i) );
    }
}

function ShowProbabilities(tokenProbs, tokenListIndex, currentTokenIndex) {
    //console.log(tokenProbs);

    document.getElementById("outputProbList").innerHTML = "";

    tokenProbs.probs.sort((a, b) => b.prob - a.prob);

    for (let index = 0; index < tokenProbs.probs.length; index++) {
        const element = tokenProbs.probs[index];
        if (element["prob"] <= 0.0) {
            continue;
        }

        let clone = document.getElementById("tokenOptionButton").content.cloneNode(true);
        let button = clone.querySelector("button");
        let label = clone.querySelector("span");
        label.innerHTML = element["prob"].toString().substring(0, 5);
        button.innerHTML = element["tok_str"];
        if (element["tok_str"] == tokenProbs.content) {
            button.disabled = true;
        }
        document.getElementById("outputProbList").appendChild(clone);
        button.addEventListener("click", () => GenerateWithNewToken(element["tok_str"], tokenListIndex, currentTokenIndex));
    }
}

async function GenerateWithNewToken(newToken, listIndex, tokenIndex) {
    //TODO: Empty current prompt and add all tokens up until this token to the string add newtoken
    var newPrompt = "";
    
    var currentTokens = [];

    for (let index = 0; index < tokenIndex + 1; index++) {
        currentTokens.push(tokenLists[listIndex][index]);
        if (index == tokenIndex) {
            currentTokens[tokenIndex].content = newToken;
        }
    }

    for (let index = 0; index < currentTokens.length; index++) {
        newPrompt += currentTokens[index].content;
    }

    currentPrompt = newPrompt;

    var input = document.getElementById("UserPrompt").value;
    tokenLists.push(currentTokens);
    currentIndex = tokenLists.length - 1;
    UpdateContent(await GenerateOutput(input), true);
}

var currentIndex = 0;
var tokenLists = [];
var currentPrompt = "";
var outputLists = [];


document.getElementById("GenerateButton").addEventListener("click", async function() {
    var input = document.getElementById("UserPrompt").value;
    UpdateContent(await GenerateOutput(input));
});

async function GenerateOutput(input) {
    let sysPrompt = document.getElementById("SystemPrompt").value;

    try {
        var output = await SendPrompt(input, sysPrompt, currentPrompt);
    } catch (error) {
        console.error('An error occurred:', error);
    }
    
    return (await output);
}

