///////////////////////////////////////////////////////////////////////////
//  Copyright (C) 2017 Wizardry and Steamworks - License: 3-clause BSD   //
///////////////////////////////////////////////////////////////////////////
//
// Uses Highlight JS to highlight showdown pre-code blocks.
// Needs highlight.js to be setup properly as per highlight.js docs.
//

(function() {
    // Regex matching pre-code tags used by showdown.
    const highlightRegex = 
        /(<pre>[^<]*?<code.*?class="([^"]*?)"[^>]*?>)([^<]*?)(<\/code>)/gim;
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    var highlight = function(converter) {
        const languages = hljs.listLanguages();
        return [{
            type: 'output',
            filter: function(source) {
                return source.replace(highlightRegex, function(match, left, lang, code, right) {
                    const foundLanguage = lang.split(' ').filter(function(language) {
                        return languages.includes(language); 
                    }).shift();
                    if(foundLanguage) {
                        return left + hljs.highlight(foundLanguage, code, true).value + right;
                    }
                    return left + hljs.highlightAuto(decodeHtml(code)).value + right;
                });
            }
        }];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
        window.Showdown.extensions.highlight = highlight;
    }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = highlight;

}());
