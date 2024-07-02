# Tuesday July 2

Drew up more potential UI mockups in Keynote 
- Took roughly 1.5 hours
- Consulted other AI front ends to consider how a front end with a tree graph should be designed
- Used screenshots from Text-Generation-WebUI to help prototype these mockups
- Considering that this is a product meant to be used by creative writers, it should stray away from a traditional chat-bot style UI

Fixed links in markdown files
- Took roughly 20 mins total
- I want this repository to be fully functional when viewed in the browser or opened as an Obsidian Vault (my preferred way to edit `.md` files)
- Normal Obsidian links to other markdown files don't work in the browser and I was trying to figure out a way to use GitHubs relative links and Obsidians links at the same time
- I couldn't find a way to do this so I just used absolute links using the `.md` file's webpage in the repository. This seemed to be the easiest way to get both ways working fully. 

Investigated recommended AI front ends 
- Took roughly 3.5 hours
- I installed all of the front ends to investigate how their plugin/extension system worked to see if they would be worthwhile using for this project
- In terms of user friendly-ness, Jan seemed to be the best since it supported local AI, from start to finish (downloading model to running it) all within one client that had prebuilt binaries ready to run on all major OS's. However its plugin system was poorly documented and it was unclear whether I could actually create new UI elements using it.
- LocalAI's install shell script just didn't work and I attempted to fix it until I realised that it didn't have support for plugins/extensions
- Text-generation-WebUI certainly seems like the best, being fairly easy to install and having a reasonably well documented extension framework. 
