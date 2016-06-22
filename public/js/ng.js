var app = angular.module('App', ['ngMaterial','ngMessages','ngCookies','flow','ngAnimate', 'toastr',
                                 'ngSanitize','pascalprecht.translate','textAngular'])

//Material Theme
.config(["$mdThemingProvider", function ($mdThemingProvider) {
    $mdThemingProvider.definePalette('slack', {
        '50': '5DB09D',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': '5DB09D',
        '500': '684666', // primary colour
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light', // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', // hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': 'dark' // could also specify this if default was 'dark'
    })
    $mdThemingProvider.theme('default')
        .primaryPalette('slack')
        .accentPalette('blue-grey')
        .warnPalette('orange');
}])


.config(function($provide) {
    // this demonstrates how to register a new tool and add it to the default toolbar
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
        taOptions.toolbar = [
            ['bold', 'italics', 'ul', 'ol','indent', 'outdent'],
            ['insertImage','insertLink', 'insertVideo']
        ];
        return taOptions;
    }]);
})

/* CONVERT ALL THE HTML TAG TO PLAIN TEXT */
.filter('htmlToPlaintext', function() {
    return function(text) {
        return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
})
