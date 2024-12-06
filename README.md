# gl02_qev



## Installation

$ npm install

## Utilisation 

$ node giftCli.js <command>


## Parser ###

<command> : check <fileToParse> [-hts]

-h or --help 	:	 display the program help
-t or --showTokenize :	 display the tokenization result 
-s or --showSymbols :	 display each step of the analysis

Optional parameters have to be before the mandatory file parameter.


<command> : search <fileToParse> <text_to_search>

    Search in the questions if <text_to_search> appear in the header or in the body.


### Exam management ###

<command> : create

    Create a new exam, if the exam contain questions, all the questions will be removed.


<command> : append <fileToParse> <text_to_search>

    Add the selected question by searching <text_to_search> on the header of the question.


<command> : ln <fileToParse> <text_to_search>

    Verify if a question is in the exam.


<command> : remove

    Remove last question of the exam.


<command> : read

    Display all question of the exam.


<command> : length

    Return the quantity of question in the exam.


<command> : compliant

    Verify if the exam is correct, if the number of question is betwin 15 and 20.


<command> : export

    Export the current exam in Gift format in the export folder.

<command> : startSimulation

    Start the exam as a student.


### Vcard ###

<command> : createProfVCARD <firstName> <lastName> <email> <phoneNumber>

    Create a Vcard file for a Proffesor, from info : (firstname, lastname, email, phone number).


### Graphs ###

<command> : stats

    Create a .png graph in folder export, of actual exam types distribution.


<command> : compare

    Create a .png graph in folder export, compare actual exam questions types propotion from official exam proportions.


### Exemple Creation Exam + Simulation ###

node src/giftCli.js create
node src/giftCli.js append SujetB_data\EM-U5-p34-Voc.gift 1.1
node src/giftCli.js append SujetB_data\U6-p65-Voc-Expressions_with_get.gift 1.2
node src/giftCli.js append SujetB_data\U2-p22-Gra-Ing_or_inf.gift 6.2a
node src/giftCli.js append SujetB_data\EM-U5-p34-Gra-Expressions_of_quantity.gift 2.4
node src/giftCli.js append SujetB_data\U7-p79-Review-3.gift 3.1 
node src/giftCli.js append SujetB_data\U2-p22-Gra-Ing_or_inf.gift 6.3b
node src/giftCli.js append SujetB_data\EM-U5-p34-Gra-Expressions_of_quantity.gift 1.2
node src/giftCli.js append SujetB_data\EM-U5-p34-Voc.gift 1.2
node src/giftCli.js append SujetB_data\U6-p65-Voc-Expressions_with_get.gift 1.4
node src/giftCli.js append SujetB_data\EM-U5-p34-Voc.gift 1.4
node src/giftCli.js append SujetB_data\EM-U5-p34-Gra-Expressions_of_quantity.gift 1.5
node src/giftCli.js append SujetB_data\U2-p22-Gra-Ing_or_inf.gift 6.1a
node src/giftCli.js append SujetB_data\U7-p79-Review-3.gift 3.3
node src/giftCli.js append SujetB_data\U2-p22-Gra-Ing_or_inf.gift 6.4b
node src/giftCli.js append SujetB_data\EM-U5-p34-Voc.gift 1.5
node src/giftCli.js startSimulation