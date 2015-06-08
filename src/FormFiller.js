var formfiller = new FormFiller();
formfiller.loadForm();

/**
 * FormFiller
 * 
 * Main FormFiller class, which handles all requests
 * @returns {FormFiller}
 */
function FormFiller() {

    var _version = '2.0.0';
    var _context = this;
    this.jsCode = 'javascript:var d=document;function i(a){return d.getElementById(a)}function n(a){return d.getElementsByName(a)}';
    
    this.loadForm = function () {
        _loadJQuery();
    };

    var _loadJQuery = function () {
        if (typeof jQuery === 'undefined') {
            new Loader().script('//code.jquery.com/jquery-1.11.1.min.js', function(context){context.doLoadForm();}, _context);
        } else {
            this.doLoadForm();
        }
    };

    this.doLoadForm = function () {
        console.log('doLoadForm!');
        var html = '<div id="formfiller"> <section style="position:fixed;top:20%;left:0;right:0;z-index:9999;width:75%;margin:0 auto;padding:40px;background-color:#fff;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif"> <h1 style="margin:0 0 18px;font-size:32px">Form Filler</h1> <input style="margin-bottom:18px"> <input type="button" value="Save" onclick="javascript:formfiller.save();return false;"> <p style="margin:0"> Click and drag this link to the bookmarks bar: <a id="bookmarklet">My bookmarklet</a> </p><a href="javascript:$(\'#formfiller\').remove()" style=position:absolute;top:0;right:0;font-size:32px;padding:10px;line-height:.55;color:#aaa;text-decoration:none>&times;</a> </section> <div style=position:absolute;top:0;right:0;bottom:0;left:0;z-index:9998;background-color:rgba(0,0,0,.25)></div></div>';
        $('body').append(html);
    };
    
    this.save = function() {
        $('form input:not(:hidden,:radio,:checkbox,:submit), form textarea, form select, form input[type="radio"]:checked, form input[type="checkbox"]:checked').each(function(){
            if($(this).attr('name') !== undefined){
                var attrName = $(this).attr('name');
                var attrId = $(this).attr('id');

                if((attrName.indexOf('[]') >= 0) || ($(this).attr('type') === 'radio')){
                    // Handle checkboxes and radio buttons
                    //formfiller.jsCode += '$("#' + attrId + '").prop("checked", true).change();';
                    formfiller.jsCode += 'i("'+attrId+'").checked=true;';
                } else {
                    // Set field value
                    //formfiller.jsCode += '$("*[name=' + attrName + ']").val("' + $(this).val() + '").change();';
                    formfiller.jsCode += 'n("'+attrName+'")[0].value="'+$(this).val()+'";';
                }
            }
        });
        $('#bookmarklet').attr('href', this.jsCode + 'void(0);');
    };

}

/**
 * Loader
 * 
 * Class for loading external files
 * Supported tags:
 *   - script
 *   - link
 * @returns {Loader}
 */
function Loader() {

    var TYPE = {
        SCRIPT: 'script'
        , STYLE: 'link'
    };

    var _fileLoaded = false;
    var _callback = null;
    var _context = null;

    this.script = function (url, callback, context) {
        _callback = callback;
        _context = context;
        _appendNewElementToBody(
                TYPE.SCRIPT
                , {
                    src: url
                    , type: 'text/javascript'
                }
        );
        _cleanup();
    };

    this.style = function (url) {
        _appendNewElementToHead(
                TYPE.STYLE
                , {
                    href: url
                    , rel: 'stylesheet'
                    , type: 'text/css'
                }
        );
        _cleanup();
    };

    var _appendNewElementToBody = function (type, attrs) {
        _appendToBody(_createElement(type, attrs));
    };

    var _appendToBody = function (element) {
        _getFirstElementByTagName('body').appendChild(element);
    };

    var _appendNewElementToHead = function (type, attrs) {
        _appendToHead(_createElement(type, attrs));
    };

    var _appendToHead = function (element) {
        _getFirstElementByTagName('head').appendChild(element);
    };

    var _getFirstElementByTagName = function (name) {
        return document.getElementsByTagName(name)[0];
    };

    var _createElement = function (type, attrs) {
        var element = document.createElement(type);

        for (var key in attrs) {
            element.setAttribute(key, attrs[key]);
        }

        element.onload = element.onreadystatechage = function () {
            if (!_fileLoaded && (!this.readyState || ['loaded', 'complete'].indexOf(this.readyState) !== -1)) {
                _fileLoaded = true;
                element.onload = element.onreadystatechange = null;
                _getFirstElementByTagName('body').removeChild(element);
                _callback(_context);
            }
        };

        return element;
    };

    var _cleanup = function () {
        _fileLoaded = false;
    };

}