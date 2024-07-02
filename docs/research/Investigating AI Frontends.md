# Investigating AI Frontends

## Considerations
There are three main considerations that need to be made when deciding which front end to use.
1. The front end used needs to support some kind of plugin/extension framework that allows for the introduction of new UI elements. Ideally this would be in the form of custom HTML/CSS/JS. 
2. The front end needs to be user friendly, the aim for this project is for people who aren't particularly technical to be able to setup the project easily and have it working out-of-the-box. 
3. The front end needs to have a reasonable user base, there is no point developing a project that is feature rich but uses a weird tech stack and sits unused on GitHub

With this in mind, lets go over the potential options for front ends.
## [Open Web UI](https://github.com/open-webui/open-webui)
Open WebUI is a locally hosted UI interface that looks almost identical to ChatGPT. 
- It is relatively simple to set up using docker, although this could be better
- It has the second largest user base with 29.8k stars and 3.2k forks

Developers can add functionality to the front end using the [pipelines](https://github.com/open-webui/pipelines) system. However, this only seems to add non-UI functionality, only being able to filter content and pipe input/outputs to the AI to other programs. As far as I can tell there isn't any options for creating custom UI elements using this system. 

## [Text-Generation-WebUI](https://github.com/oobabooga/text-generation-webui)
Text-Generation-WebUI is an AI front end designed specifically for LLMs.
- Its reasonably simple to install, requiring the end user to clone a github repository and run a shell script
- It seems to have the largest user base of these five front ends, having 38.1k stars and 5.1k forks

Developers can add functionality to the front end using its [extensions](https://github.com/oobabooga/text-generation-webui/wiki/07-%E2%80%90-Extensions) system which has the most associated documentation out of all of these options. Extensions are written in python and use Gradio to create new UI elements. Custom CSS and JS can also be used. 

The extensions feature and the large user base and relatively easy setup make this front end an ideal candidate for this project. 
## [LocalAI](https://github.com/mudler/LocalAI)
LocalAI is a front end that provides and API for other programs to interface with many types of models (LLM, image/audio generation etc.). 
- I couldn't install it with the provided `install.sh` file returning permission denied
- It seems to have a very large user base with 21.6k stars and 1.6k forks

I would have tried to get it up and running locally however the lack of any extension/plugin system means that this isn't a viable option for this project regardless. 

## [Silly Tavern](https://github.com/SillyTavern/SillyTavern)
Silly Tavern is a UI primarily designed for interacting with text AI models that are meant to replicate characters from movies/cartoons/anime etc. 
- Its fairly easy to install with developers providing an installer that only requires a few lines in the terminal to use. This installs all dependencies and allows you to run the UI locally
	- Whilst easy for devs to use, this approach may be more difficult for less tech savvy users
- It has a fairly large user base with 6.7k stars and 2k forks

Developers can add functionality to Silly Tavern through its server plugins and UI extensions system. Custom HTML/CSS/JS can be used within these extensions. 

Whilst this does seem to fulfil the requirements I laid out earlier I don't think this is a good choice for the project. This front end is heavily catered towards AI roleplaying and the user interface is fairly too bloated for a project of this size. Additionally this UI is stated to be designed for power users, and an easier way of setting it up would be ideal for more casual users. 

## [Jan](https://github.com/janhq/jan)
Jan is essentially an offline ChatGPT interface, allowing you to interact with local (or remote) models through a chat system.
- It is easy to install, with the GitHub page offering prebuilt binaries that are ready to run out of the box
- It has a reasonably sized user base with 20.7k stars and 1.2k forks, so there are plenty of developers who are interested or personally modifying this front end. 

However its extension system isn't particularly well documented and it is unclear whether it supports custom UI elements. An [extension template](https://github.com/janhq/extension-template/tree/main) is given and it appears that it communicates with the [core module](https://github.com/janhq/jan/tree/main/core), however the functions and options for extensions aren't documented as far as I can tell. 

This means that Jan is likely a poor candidate for the LexiSelect project. 