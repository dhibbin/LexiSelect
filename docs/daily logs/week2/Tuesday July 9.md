# Tuesday July 9

Researched which UI component library to use
- Took roughly 1 hour
- Unfortunately Bootstrap-Vue is only designed to be compatible with Bootstrap v4 and Vue 2, however it does work with Vue 3 using a compatibility mode. Ultimately I decided it would be best to try out a different UI component library.  
- Watched videos overviewing how both Vuetify and Quasar handle and read articles comparing commonly used UI frameworks for VueJS 
- Concluded that Quasar would a good first choice and too see how it works out initially. 

Setup VueJS and learn the very basics
- Took 2.5 hours
- Followed the VueJS quickstart and read up on the differences between the Options/Composition API. Decided that the composition API would be a better choice since it would allow me to better section my code and better define my own objects. Additionally the composition API doesn't require putting `this` before every reactice variable which would get frustrating
- Immediate U-turn on using Quasar, going to use Vuetify since Quasar is very insistent on using their CLI to setup a project, whereas Vuetify is very happy for you to using Vue's CLI to add Vuetify as a plugin and add some import statements. 

Used Veutify to setup a new main page
- Took roughly 2 hours
- I had to fight with Veutify to justify content to the bottom of the page and then to fill the page when the side bar was collapsed
- The documentation for Veutify is not so great, might need to revisit this tomorrow and reconsider which UI library to use