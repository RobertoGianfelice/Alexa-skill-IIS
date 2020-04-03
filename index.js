// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
// Get an instance of the persistence adapter
var persistenceAdapter = getPersistenceAdapter();
// Moments library will help us do all the birthday math
const moment = require('moment-timezone');
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');
// We import a language strings object containing all of our strings.
// The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG')
const languageStrings = require('./localisation');

function getPersistenceAdapter(tableName) {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET;
    }
    if (isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're using to run this lambda (via IAM policy)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({
            tableName: tableName || 'aosta_aquila',
            createTable: true
        });
    }
}


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
        const nomeUtente=handlerInput.requestEnvelope.request.intent.slots.nomeUtente.value;
        const speakOutput=handlerInput.t('HELLO_USER', {user : nomeUtente});
        const repromptspeakOutput=handlerInput.t('HELLO_USER', {user : nomeUtente});

        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();
        sessionAttributes['nomeUtente'] = nomeUtente;


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('')
            .getResponse();

    }
    /*
    .addDelegateDirective({
                name: 'descrizioneIstitutoIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            */
};
/*
*/



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
        let speakOutput="Problemi descriviScuole";
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

        if (intent.confirmationStatus === 'CONFIRMED'){
            const scuola = Alexa.getSlotValue(requestEnvelope, 'scuola');
            switch (scuola) {
                case "liceo":
                    speakOutput = nome + " " + handlerInput.t('DESC_LICEO_MSG');
                    break;
                case "tecnologico":
                    speakOutput = nome + " " + handlerInput.t('DESC_TECNOLOGICO_MSG');
                    break;
                case "economico":
                    speakOutput = nome + " " + handlerInput.t('DESC_ECONOMICO_MSG');
                    break;
            }

        } else {
            speakOutput = 'Mi dispiace ' + nome;
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
        const speakOutput = 'Puoi chiedermi Istituto per conoscere meglio IIS amedeo d\'aosta o scelte per scoprire la nsotra offerta';

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
        const speakOutput = 'Arrivederci!';
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
        const speakOutput = 'Arrivederci';

        // Any cleanup logic goes here.
        return handlerInput.responseBuilder
            .speak(speakOutput)
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

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};

/* *
 * Below we use async and await ( more info: javascript.info/async-await )
 * It's a way to wrap promises and waait for the result of an external async operation
 * Like getting and saving the persistent attributes
 * */
const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        if (Alexa.isNewSession(requestEnvelope)){ //is this a new session? this check is not enough if using auto-delegate (more on next module)
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            //copy persistent attribute to session attributes
            attributesManager.setSessionAttributes(persistentAttributes); // ALL persistent attributtes are now session attributes
        }
    }
};

// If you disable the skill and reenable it the userId might change and you loose the persistent attributes saved below as userId is the primary key
const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        if (!response) return; // avoid intercepting calls that have no outgoing response due to errors
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
        if (shouldEndSession || Alexa.getRequestType(requestEnvelope) === 'SessionEndedRequest') { // skill was stopped or timed out
            // we increment a persistent session counter here
            sessionAttributes['sessionCounter'] = sessionAttributes['sessionCounter'] ? sessionAttributes['sessionCounter'] + 1 : 1;
            // we make ALL session attributes persistent
            console.log('Saving to persistent storage:' + JSON.stringify(sessionAttributes));
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        descrizioneIstitutoIntentHandler,
        descriviScelteIntentHandler,
        descriviScuoleIntentHandler,
        nomeIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        NavigateHomeIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler,
    )
    .addRequestInterceptors(
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor,
        LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor,
        SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    .withCustomUserAgent('sample/happy-birthday/mod4')
    .lambda();
