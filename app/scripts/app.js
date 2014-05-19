/*global angular: true*/
'use strict';
var angular = require('angular');

angular.module('volusionApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'seo',
    'pascalprecht.translate',
    require('./services/config').name,
    require('../bower_components/vn-bem').name
  ])
  .provider('api', require('./services/api-provider'))
  .provider('translate', require('./services/translate-provider'));

angular.module('volusionApp')
  .config(function(
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $windowProvider,
    apiProvider,
    translateProvider,
    config) {

    var env = config.ENV;

    apiProvider.setBaseRoute(env.API_URL);

    $locationProvider.html5Mode(true);

    var translateOptions = {
      urlPrefix: env.URL_PREFIX || '',
      region: env.REGION,
      lang: env.LANG,
      country: env.COUNTRY,
      disableTranslations: env.DISABLE_TRANSLATIONS
    };
    translateProvider.configure(translateOptions);

    $urlRouterProvider.when('/', ['$state', function($state) {
      $state.go('i18n.home', translateOptions, { location: 'replace' });
    }]);

    $urlRouterProvider.otherwise(function() {
      $windowProvider.$get().location.replace('/404.html');
    });

    $stateProvider
      .state('i18n', {
        url: translateOptions.urlPrefix,
        templateUrl: 'views/i18n.html',
        resolve: {
          translations: ['translate', function(translate) {
            return translate.addParts('index');
          }]
        }
      })
      .state('i18n.home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        resolve: {
          translations: ['translate', function(translate) {
            return translate.addParts('home');
          }]
        }
      })
      .state('i18n.style-guide', {
        url: '/style-guide',
        templateUrl: 'views/style-guide.html',
        controller: 'StyleGuideCtrl',
        resolve: {
          translations: ['translate', function(translate) {
            return translate.addParts('style-guide');
          }]
        }
      })
      .state('i18n.about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        resolve: {
          translations: ['translate', function(translate) {
            return translate.addParts('about');
          }]
        }
      })
      .state('i18n.contact', {
        url: '/contact',
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        resolve: {
          translations: ['translate', function(translate) {
            return translate.addParts('contact');
          }]
        }
      });
  })
  .run(function($templateCache) {
    $templateCache.put('views/i18n.html', require('./views/i18n.html'));
    $templateCache.put('views/home.html', require('./views/home.html'));
    $templateCache.put('views/style-guide.html', require('./views/style-guide.html'));
    $templateCache.put('views/about.html', require('./views/about.html'));
    $templateCache.put('views/contact.html', require('./views/contact.html'));
  })
  .factory('storage', require('./services/storage'))
  .directive('legacyLink', require('./directives/legacy-link'))
  .filter('seoFriendly', require('./filters/seoFriendly'))
  .controller('IndexCtrl', require('./controllers/index'))
  .controller('HomeCtrl', require('./controllers/home'))
  .controller('StyleGuideCtrl', require('./controllers/style-guide'))
  .controller('AboutCtrl', require('./controllers/about'))
  .controller('ContactCtrl', require('./controllers/contact'));
