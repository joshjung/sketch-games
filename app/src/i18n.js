import ENGLISH_LANGUAGE_PACK from './assets/i18n/en/pack.json';
//import SWEDISH_LANGUAGE_PACK from './assets/i18n/sv/pack.json';

import EN_HOME_PAGE_CONTENT from './assets/i18n/en/home.md';
import EN_GAMES_PAGE_CONTENT from './assets/i18n/en/gamesPage.md';
import EN_API from './assets/i18n/en/api.md';
//import SV_HOME_PAGE_CONTENT from './assets/i18n/sv/home.md';

const EN = 'en';
const SV = 'sv';

/**
 * The primary I18NModel instance is created in DefaultApplicationRoot. ApplicationLayout extends this and then
 * calls our setup function below. Here we add all our keys to the language pack before the application is rendered
 * so that we can then display the values immediately.
 *
 * Note: in this template we are loading all of our language data directly into our final JS artifact. For large
 * applications this is a poor strategy since we would probably want to dynamically load our language data from a DB
 * or a file stored on the server.
 */
export function setup(i18NModel) {
  // Language packs are a JSON file of multiple keys
  i18NModel.mergeLanguagePack(EN, ENGLISH_LANGUAGE_PACK);
  //i18NModel.mergeLanguagePack(SV, SWEDISH_LANGUAGE_PACK);

  // addLanguageKey adds a single key at a time. This is useful if our content for the page is larger
  // than we would want in a single key in a JSON file.
  i18NModel.addLanguageKey(EN, 'home.content', EN_HOME_PAGE_CONTENT);
  i18NModel.addLanguageKey(EN, 'games.content', EN_GAMES_PAGE_CONTENT);
  i18NModel.addLanguageKey(EN, 'api', EN_API);
  //i18NModel.addLanguageKey(SV, 'home.content', SV_HOME_PAGE_CONTENT);
}