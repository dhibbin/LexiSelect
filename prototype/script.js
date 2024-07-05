async function SendPrompt(prompt) {
    prompt = "<|user|>" + prompt + "<|end|>"
    
    let response = await fetch("http://127.0.0.1:8080/completion", {
        method: 'POST',
        body: JSON.stringify({
            prompt,
            n_predict: 500,
            n_probs : 10
        })
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json())
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

async function OutputPrompt(response) {
    console.log(response);

    currentPrompt += response.content.replace("<|assistant|>", "");

    var newList = document.getElementById("textOutputList").content.cloneNode(true);
    var currentList = newList.querySelector("ul");
    document.getElementById("outputBox").appendChild(newList);
    //newList = newList.querySelector("ul");

    for (let i = 0; i < response.completion_probabilities.length; i++) {
        if (response.completion_probabilities[i].content == "<|assistant|>") {
            continue;
        }
        
        let temp = document.getElementById("textButton");
        let clone = temp.content.cloneNode(true);   
        let button = clone.querySelector('button');
        currentList.appendChild(clone);
        await typeWriter(response.completion_probabilities[i].content, 10, button);

        tokenList.push(response.completion_probabilities[i]);
        button.addEventListener("click", () => ShowProbabilities(response.completion_probabilities[i]) );
    }
}

function ShowProbabilities(tokenProbs) {
    console.log(tokenProbs);

    document.getElementById("outputProbList").innerHTML = "";

    tokenProbs.probs.sort((a, b) => b.prob - a.prob);

    tokenProbs.probs.forEach(element => {
        let clone = document.getElementById("tokenOptionButton").content.cloneNode(true);
        let button = clone.querySelector("button");
        let label = clone.querySelector("span");
        label.innerHTML = element["prob"].toString().substring(0, 5);
        button.innerHTML = element["tok_str"];
        if (element["tok_str"] == tokenProbs.content) {
            button.disabled = true;
        }
        document.getElementById("outputProbList").appendChild(clone);
        button.addEventListener("click", () => GenerateWithNewToken(element["tok_str"], tokenProbs.content))
    }); 
}

function GenerateWithNewToken(newToken, oldToken) {

}

var tokenList = [];
var currentPrompt = "";
var outputLists = [];


document.getElementById("GenerateButton").addEventListener("click", function() {
    var input = document.getElementById("TextPrompt").value;
    GenerateOutput(input);
});

async function GenerateOutput(input) {
    //prompt = "<|user|>" + prompt + "<|end|>"

    
    console.log(input + currentPrompt);
    try {
        var output = await SendPrompt(input + currentPrompt);
    } catch (error) {
        console.error('An error occurred:', error);
    }

    OutputPrompt(await output);
}

