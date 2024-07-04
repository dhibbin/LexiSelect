async function SendPrompt(prompt) {
    prompt = "<|user|>" + prompt + "<|end|>"
    
    let response = await fetch("http://127.0.0.1:8080/completion", {
        method: 'POST',
        body: JSON.stringify({
            prompt,
            n_predict: 50,
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
    for (let i = 0; i < response.completion_probabilities.length; i++) {
        let temp = document.getElementById("textButton");
        let clone = temp.content.cloneNode(true);   
        let button = clone.querySelector('button');
        document.getElementById("outputBoxList").appendChild(clone);
        await typeWriter(response.completion_probabilities[i].content, 10, button);

        tokenList.push(response.completion_probabilities[i])
        button.addEventListener("click", () => ShowProbabilities(response.completion_probabilities[i]) )
    }
}

function ShowProbabilities(tokenProbs) {
    console.log(tokenProbs);

    //document.getElementById("outputProbList").children.forEach(element => {
    //    element.remove()
    //});

    tokenProbs.probs.forEach(element => {
        let clone = document.getElementById("tokenOptionButton").content.cloneNode(true);
        let button = clone.querySelector("button");
        let label = clone.querySelector("span");
        label.innerHTML = element["prob"];
        button.innerHTML = element["tok_str"];
        if (element["tok_str"] == tokenProbs.content) {
            button.disabled = true;
        }
        document.getElementById("outputProbList").appendChild(clone);
    });
    
    
}

var tokenList = [];

document.addEventListener("DOMContentLoaded", function() {
    // Your code here will run once the DOM is fully loaded
    console.log("Document Object loaded");
});

document.getElementById("GenerateButton").addEventListener("click", async function() {
    var input = document.getElementById("TextPrompt").value;

    try {
        var output = await SendPrompt(input);
      } catch (error) {
        console.error('An error occurred:', error);
      }

    OutputPrompt(await output);
    //typeWriter((await output), 50, "output1")
});

