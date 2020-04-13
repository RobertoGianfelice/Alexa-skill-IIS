const Alexa = require('ask-sdk-core');
const util = require('./util'); // utility functions
const languageStrings = require('./localisation');



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('WELCOME_MSG');
        const repromptspeakOutput = handlerInput.t('WELCOME_BACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'nomeIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};



const nomeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'nomeIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope,responseBuilder} = handlerInput;
        const {intent}= requestEnvelope.request;
        let utente="nome di prova";
        let speakOutput="prova";
        let repromptspeakOutput="";
        if (intent.confirmationStatus === 'CONFIRMED'){
            utente=handlerInput.requestEnvelope.request.intent.slots.nomeUtente.value;
            speakOutput=handlerInput.t('HELLO_USER', {user : utente});
            repromptspeakOutput=handlerInput.t('HELLO_USER', {user : utente});
        } else {
            speakOutput=handlerInput.t('HELLO_USER', {user : utente});
            repromptspeakOutput=handlerInput.t('HELLO_USER', {user : utente});
        }
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();
        sessionAttributes['nomeUtente'] = utente;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('')
            .getResponse();

    }
};

const descrizioneIstitutoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'descrizioneIstitutoIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope,responseBuilder} = handlerInput;
        const {intent}= requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();


        let speakOutput = 'Problemi descrizioneIstituto';
        const repromptText = 'Abbiamo Problemi';

        let nome="";

        //if (sessionAttributes.indexOf('nomeUtente') != -1) {
        nome = sessionAttributes['nomeUtente'];
        //}

        if (intent.confirmationStatus === 'CONFIRMED'){
            speakOutput = nome + handlerInput.t('SCHOOL_MSG');
        } else {
            speakOutput = 'Mi dispiace ' + nome;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'descriviScelteIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};

const descriviScelteIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'descriviScelteIntent';
    },
    handle(handlerInput) {
        let speakOutput="Problemi descriviScelte";
        const repromptText='Abbiamo Problemi';

        speakOutput = handlerInput.t('DESC_SCELTE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'descriviScuoleIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};


const descriviScuoleIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'descriviScuoleIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope,responseBuilder} = handlerInput;
        const {intent}= requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let speakOutput="Problemi descriviScuole";
        const repromptText='Abbiamo Problemi';
        let nome="";

        nome = sessionAttributes['nomeUtente'];
        let scelta="";

        if (intent.confirmationStatus === 'CONFIRMED'){
            const scuola = Alexa.getSlotValue(requestEnvelope, 'scuola');
            scelta=scuola;
            switch (scuola) {
                case "liceo":
                    speakOutput = nome + " " + handlerInput.t('DESC_LICEO_MSG');
                    break;
                case "tecnologico":
                    speakOutput = nome + " " + handlerInput.t('DESC_TECNOLOGICO_MSG') ;
                    break;
                case "economico":
                    speakOutput = nome + " " + handlerInput.t('DESC_ECONOMICO_MSG');
                    break;
            }

        } else {
            speakOutput = 'Mi dispiace ' + nome;
        }
        if (scelta === "tecnologico" ||  scelta === "economico" ) {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addDelegateDirective({
                    name: 'descriviIndirizziIntent',
                    confirmationStatus: 'NONE',
                    slots: {}
                })
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('')
                .getResponse();
        }
    }
};

const descriviIndirizziIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'descriviIndirizziIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope,responseBuilder} = handlerInput;
        const {intent}= requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let speakOutput="Problemi descriviIndirizzi";
        const repromptText='Abbiamo Problemi';
        let nome="";

        nome = sessionAttributes['nomeUtente'];

        if (intent.confirmationStatus === 'CONFIRMED'){
            const indirizzo = Alexa.getSlotValue(requestEnvelope, 'indirizzo');
            switch (indirizzo) {
                case "chimica":
                    speakOutput = nome + " " + handlerInput.t('DESC_TECNOLOGICO_CHIMICA_MSG');
                    break;
                case "informatica":
                    speakOutput = nome + " " + handlerInput.t('DESC_TECNOLOGICO_INFORMATICA_MSG');
                    break;
                case "elettronica":
                    speakOutput = nome + " " + handlerInput.t('DESC_TECNOLOGICO_ELETTRONICA_MSG');
                    break;
                case "meccanica":
                    speakOutput = nome + " " + handlerInput.t('DESC_TECNOLOGICO_MECCANICA_MSG');
                    break;
                case "turismo":
                    speakOutput = nome + " " + handlerInput.t('DESC_ECONOMICO_TURISMO_MSG');
                    break;
                case "afm":
                    speakOutput = nome + " " + handlerInput.t('DESC_ECONOMICO_SIA_MSG');
                    break;
                default:
                    speakOutput = nome + " " + handlerInput.t('NO_SPECIALIZATION');
                    break;

            }
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addDelegateDirective({
                    name: 'descriviSbocchiIntent',
                    confirmationStatus: 'NONE',
                    slots: {}
                })
                .getResponse();


        } else {
            speakOutput = 'Mi dispiace ' + nome;
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("")
            .getResponse();
    }
};


const descriviSbocchiIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'descriviSbocchiIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope,responseBuilder} = handlerInput;
        const {intent}= requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let speakOutput="Problemi sbocchi";
        const repromptText='Abbiamo Problemi';
        let nome="";

        nome = sessionAttributes['nomeUtente'];

        if (intent.confirmationStatus === 'CONFIRMED'){
            const indirizzo = Alexa.getSlotValue(requestEnvelope, 'sbocchi');
            switch (indirizzo) {
                case "chimica":
                    speakOutput = nome + " " + handlerInput.t('DESC_CHIMICA_COMPETENZE_MSG');
                    break;
                case "informatica":
                    speakOutput = nome + " " + handlerInput.t('DESC_INFORMATICA_COMPETENZE_MSG');
                    break;
                case "elettronica":
                    speakOutput = nome + " " + handlerInput.t('DESC_ELETTRONICA_COMPETENZE_MSG');
                    break;
                case "meccanica":
                    speakOutput = nome + " " + handlerInput.t('DESC_MECCANICA_COMPETENZE_MSG');
                    break;
                case "turismo":
                    speakOutput = nome + " " + handlerInput.t('DESC_TURISMO_COMPETENZE_MSG');
                    break;
                case "afm":
                    speakOutput = nome + " " + handlerInput.t('DESC_ECONOMICO_SIA_COMPETENZE_MSG');
                    break;
                default:
                    speakOutput = nome + " " + handlerInput.t('NO_SPECIALIZATION');
                    break;


            }

        } else {
            speakOutput = 'Mi dispiace Descrivi scuole ' + nome;
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("")
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {

        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {

        const speakOutput = handlerInput.t('GOODBYE_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        // Any cleanup logic goes here.
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const NavigateHomeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NavigateHomeIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Torniamo a casa';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('')
            .getResponse();
    }
};


// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};




// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

module.exports = {
    LaunchRequestHandler,
    nomeIntentHandler,
    descrizioneIstitutoIntentHandler,
    descriviScelteIntentHandler,
    descriviScuoleIntentHandler,
    descriviIndirizziIntentHandler,
    descriviSbocchiIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    NavigateHomeIntentHandler,
    IntentReflectorHandler,
    ErrorHandler
}
