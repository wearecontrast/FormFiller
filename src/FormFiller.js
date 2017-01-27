var formfiller = new FormFiller();
formfiller.loadForm();

/**
 * FormFiller
 * 
 * Main FormFiller class, which handles all requests
 * @returns {FormFiller}
 */
function FormFiller() {

    var _version = '0.2.0';
    var _context = this;
    var _htmlTemplates = {};
    var _allFormElementsSelector = 'form input:not(:hidden,:radio,:checkbox,:submit,:file), form textarea, form select, form input[type="radio"]:checked, form input[type="checkbox"]:checked';
    this.jsCode = 'javascript:/* FormFiller v' + _version + ' */function i(a){return d.getElementById(a)}function n(a){return d.getElementsByName(a)[0]}function e(a){function b(a){var b=d.createEvent("Event");return b.initEvent(a,1,0),b}navigator.userAgent.match(/Trident|MSIE\s/g),a.dispatchEvent(new b("change"))}function v(a,b){a.value=b,e(a)}function c(a){a.checked=!0,e(a)}var d=document;';
    
    var _constructor = function(){
        _htmlTemplates.deletetr = '<a href="#" class="formfiller-deletetr" style="color: red">X</a>';
        _htmlTemplates.dateFields = '<tr> <td>##FIELDNAME##</td><td style="text-align:center;">'+_htmlTemplates.deletetr+'</td></tr>',
        _htmlTemplates.randomCharacters = '<tr data=> <td>##FIELDNAME##</td><td><input type="number" value="##LENGTH##" class="formfiller-randomcharacters-length" style="width:50px"/></td><td style="text-align:center;">'+_htmlTemplates.deletetr+'</td></tr>'
    };
    
    this.loadForm = function () {
        _loadJQuery();
    };
    
    var _loadJQuery = function () {
        if (typeof jQuery === 'undefined') {
            new Loader().script('//code.jquery.com/jquery-1.11.1.min.js', function (context) {
                context.doLoadForm();
            }, _context);
        } else {
            _context.doLoadForm();
        }
    };

    this.doLoadForm = function () {
        if (jQuery('div#formfiller').length === 0) {
            var dateFields = '<div class="formfiller-form-row"> <h3>Date Fields</h3> <table id="formfiller-datefield-list" style="width: 100%;"> <tr> <th style="text-align:left;">Field</th> <th width="15%">Delete</th> </tr></table> <a href="#" class="formfiller-datefield-add" style="color: green;">Select New Field</a> </div>';
            var randomCharacters = '<div class="formfiller-form-row"> <h3>Random Characters</h3> <table id="formfiller-randomcharacters-list" style="width: 100%;"> <tr> <th style="text-align:left;">Field</th> <th width="10%">Length</th> <th width="15%">Delete</th> </tr></table> <a href="#" class="formfiller-randomcharacters-add" style="color: green;">Select New Field</a> </div>';
            var html = '<div id="formfiller" style="display:none;"><style>.formfiller-form-row{margin-bottom:10px;}.formfiller-highlight{background-color:Yellow;}</style> <section style="position:fixed;top:20%;left:0;right:0;z-index:9999;width:40%;margin:0 auto;padding:40px;background-color:#fff;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif"> <h1 style="margin:0 0 18px;font-size:32px">Form Filler v' + _version + '</h1> <div id="formfiller-formwrapper"> <div class="formfiller-form-row"> <h3>Name:</h3> <input id="formfiller-bookmarkletname" style="width:100%;" value="' + document.title + '"/> </div>'+dateFields+randomCharacters+' <div class="formfiller-form-row" style="margin-top:10px;"> <input type="button" value="Save" onclick="javascript:formfiller.save();return false;"/> </div></div><p style="margin:0;display:none"> Click and drag this link to the bookmarks bar: <a id="bookmarklet">My bookmarklet</a> </p><a href="javascript:$(\'#formfiller\').remove();void(0);" style=position:absolute;top:0;right:0;font-size:32px;padding:10px;line-height:.55;color:#aaa;text-decoration:none>&times;</a> </section> <div style=position:fixed;top:0;right:0;bottom:0;left:0;z-index:9998;background-color:rgba(0,0,0,.25)></div></div>';
            jQuery('body').append(html);
            
            jQuery(_allFormElementsSelector).each(function () {
                var name = (jQuery(this).attr('name') === undefined) ? '' : jQuery(this).attr('name');
                var id = (jQuery(this).attr('id') === undefined) ? '' : jQuery(this).attr('id');
                
                if(name.toLowerCase().indexOf('date') > -1){
                    var template = _htmlTemplates.dateFields.replace('##FIELDNAME##', name);
                    jQuery('#formfiller-datefield-list').append(template);
                    console.log(name);
                } else if(id.toLowerCase().indexOf('date') > -1){
                    console.log(id);
                } else if(name.toLowerCase().indexOf('name') > -1){
                    var template = _htmlTemplates.randomCharacters
                        .replace('##FIELDNAME##', name)
                        .replace('##LENGTH##', jQuery(this).val().length);
                    jQuery('#formfiller-randomcharacters-list').append(template);
                    console.log(name);
                } else if(id.toLowerCase().indexOf('name') > -1){
                    console.log(id);
                }
              
            });
            
            jQuery('#formfiller').fadeIn(1000);
            
            jQuery('#formfiller').on('click', 'a.formfiller-deletetr', function(e){
                e.preventDefault();
                console.log('deleting row');
                jQuery(this).closest('tr').remove();
            });
            
            jQuery('#formfiller').on('click', 'a.formfiller-datefield-add', function(e){
                e.preventDefault();
                _attachFormElementHighlighter(_addDatefieldCallback);
                
                $('#formfiller').fadeOut(500);
            });
            
            jQuery('#formfiller').on('click', 'a.formfiller-randomcharacters-add', function(e){
                e.preventDefault();
                _attachFormElementHighlighter(_addRandomCharactersCallback);
                $('#formfiller').fadeOut(500);
            });
        }
    };
    
    var _addDatefieldCallback = function(event){
        console.log('DATEFIELD: ' + $(event.target).attr('name') + ' Clicked!');
        
        jQuery('#formfiller-datefield-list').append(_getTemplate('dateFields', {fieldname: $(event.target).attr('name')}));
        
        $('#formfiller').fadeIn(500);
        $(_allFormElementsSelector).off('click', '', _addDatefieldCallback);
    };
    
    var _getTemplate = function(template, replace){
        var temp = _htmlTemplates[template];
        jQuery.each(replace, function(index, value){
            temp = temp.replace('##'+index.toUpperCase()+'##', value);
        });
        return temp;
    };
    
    var _addRandomCharactersCallback = function(event){
        var element = $(event.target);
        console.log('RANDOMCHARACTERS: ' + element.attr('name') + ' Clicked!');
        
        jQuery('#formfiller-randomcharacters-list').append(
            _getTemplate(
                'randomCharacters',
                {
                    fieldname: element.attr('name'),
                    length: element.val().length
                }
            )
        );
                    
        $('#formfiller').fadeIn(500);
        $(_allFormElementsSelector).off('click', '', _addRandomCharactersCallback);
    };
    
    var _attachFormElementHighlighter = function(callback){
        $(_allFormElementsSelector)
          .mouseover(function(event){_addHighlight(event)})
          .mouseout(function(event){_removeHighlight(event)})
          .on('click', callback);
    };
    
    var _addHighlight = function(event){
        _getElementForHighlightFromEvent(event).addClass('formfiller-highlight');
    };
    
    var _getElementForHighlightFromEvent = function(event){
        var element = $(event.target);
        return (element.is('input:radio, input:checkbox')) ? element.parent() : element;
    };
    
    var _removeHighlight = function(event){
        _getElementForHighlightFromEvent(event).removeClass('formfiller-highlight');
    };

    this.save = function () {
        jQuery(_allFormElementsSelector).each(function () {
            if (_isVisible(this) && (_hasName(this) || _hasId(this))) {
                if (_hasName(this) && _hasId(this) && _isRadioOrCheckbox(this)) {
                    formfiller.jsCode += 'c(i("' + _getId(this) + '"));';
                } else if (_hasId(this)) {
                    formfiller.jsCode += 'v(i("' + _getId(this) + '"),"' + _getValue(this) + '");'
                } else {
                    formfiller.jsCode += 'v(n("' + _getName(this) + '"),"' + _getValue(this) + '");';
                }
            }
        });
        jQuery('#bookmarklet').attr('href', this.jsCode + 'void(0);').html(jQuery('#formfiller-bookmarkletname').val()).parent('p').show();
        jQuery('#formfiller-formwrapper').hide();
    };
    
    var _isVisible = function(element) {
        return jQuery(element).is(':visible');
    };

    var _hasName = function (element) {
        return (_getName(element) !== undefined);
    };

    var _getName = function (element) {
        return jQuery(element).attr('name');
    };

    var _hasId = function (element) {
        return (_getId(element) !== undefined);
    };

    var _getId = function (element) {
        return jQuery(element).attr('id');
    };

    var _isRadioOrCheckbox = function (element) {
        return ((_nameHasArray(element)) || (_isType(element, ['radio', 'checkbox'])))
    };

    var _nameHasArray = function (element) {
        return (_getName(element).indexOf('[]') >= 0)
    };

    var _isType = function (element, types) {
        return (jQuery.inArray(jQuery(element).attr('type'), types) >= 0);
    };

    var _getValue = function (element) {
        var value = jQuery(element).val();
        return (value === null) ? '' : value.replace(/"/g, '\\"');
    };

    _constructor();
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

    var _appendNewElementToBody = function (type, attrs) {
        _getFirstElementByTagName('body').appendChild(_createElement(type, attrs));
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
