#Code Standards

##Variable Naming Conventions

general javascript variables camel cased : `var likeThisExample = value`  
jQuery : `var $likeThis = $(‘likethis’)`  

HTML attribute names: all lower-case, hyphenated multi words
    `<tag class="like-this">`  
    NOT  
    `<tag class="likeThis OR likethis OR LikeThis OR like_this">`  

function declaration:  
    `function name () {}`  
    NOT  
    `var name = function() {}`  

constructor functions title cased :  
    `function LikeThis () {}`  
    NOT  
    `function likeThis(){}`  

very explicit argument names:  
    no abbreviations that aren’t useful or necessary  
    `function server ( clientRequest, serverResponse ) {}`  
    NOT  
    `function server ( req, res ){}`  

##Spacing Conventions / General Formatting

group functions and variables in readable ways: routes grouped together not methods grouped together  
    `app.get('/')
    app.post('/')
    app.delete('/')
    `  
    NOT  
    `app.get('/')
    app.get('/user')
    app.get('/login')
    `

spaces not tabs:  
    2 spaces indents, rather than 4  

##Comment Conventions

`// expected result type`  

block comments outside of or before a function, not inline comments all  over the function  

`// TO DO COMMENTS IN ALL CAPS LIKE THIS`  

in Trello tasks include line number of to do comment  



##File Name Convention

no spaces, no hyphens :   
    NOT like this.html   
    NOT like-this.html  

separate multiple words with underscores: like_this_example.html  

plural directory names, singular table names  

make directory and filenames as semantic as possible   
    main_server.js  
    NOT  
    app.js  

##HTML Structure Conventions

type attr for links and scripts should be ommitted  
    NOT ```<script type=”text/javascript”>```  
    THIS ```<script>```  
    NOT ```<link rel=”stylesheet”>```  
    THIS ```<link>```  

ALWAYS include alt=”” on img tags  
    should be minimally descriptive  

semantic tag names  
    `<section>`  
    NOT  
    `<div>`  
    `<footer>`  
    NOT   
    `<div id=”footer”>`  

id should only be used when necessary  
class names   

cdn scripts go last in the head
scripts involving the dom go last in the body
 include all major meta tags in html docs
no inline styles
modular javascript files ( no scripts in html if avoidable )

##Git Circle Convention

1. pull from working master to your local master  
2. create a new local working branch (should now match local master)  
4. to be sure, you can merge from local master to local working  
5. make changes to local working, making frequent commits  
6. when ready to push, first make a pull request from working master to local master and fix any merge conflicts, then switch to local working and merge with local master, fix any merge conflicts  
7. when an issue is finished, or reach a stopping point(finished for the day), and merge conflicts are completed, push a copy of local working branch to the branch of the same name on GitHub ** NOT MASTER **   
8. pull request from working branch on GitHub to “working master” or “fake master”  
9. if you make a pull request, delete branch you made pull request from *unless issue isn’t finished  
10. pull from working master to local master  
11. merge local master into new local working branch   
12. repeat  
** At set intervals, pull request from working master to Papa Master **

##Git Commit Message Convention

should be present tense
    “includes css styles”
    NOT
    “included css styles”

short, direct, and describe the general change made. least possible information to communicate the issue you dealt with
    “includes css styles”
    NOT
    “styles”
    NOT
    “adds background colors to footer and ………………..”

##Git Branch Name Convention

named after the issue you are solving
    
no spaces, no hyphens : 
NOT like this.html 
NOT like-this.html
