const Alexa = require('ask-sdk-core');
const moment = require('moment-timezone');
const util = require('./util');
const interceptors = require('./interceptors');
const handlers = require('./handlers');

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        handlers.LaunchRequestHandler,
        handlers.descrizioneIstitutoIntentHandler,
        handlers.descriviScelteIntentHandler,
        handlers.descriviScuoleIntentHandler,
        handlers.descriviIndirizziIntentHandler,
        handlers.descriviSbocchiIntentHandler,
        handlers.nomeIntentHandler,
        handlers.HelpIntentHandler,
        handlers.CancelAndStopIntentHandler,
        handlers.NavigateHomeIntentHandler,
        handlers.SessionEndedRequestHandler,
        handlers.IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        handlers.ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(util.getPersistenceAdapter())
    .withCustomUserAgent('sample/happy-birthday/mod4')
    .lambda();
