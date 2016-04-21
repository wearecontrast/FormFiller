var formfiller = new FormFiller();
formfiller.loadForm();

/**
 * FormFiller
 * 
 * Main FormFiller class, which handles all requests
 * @returns {FormFiller}
 */
function FormFiller() {

    /**
     * The version number
     * @type {string}
     * @private
     */ 
    var _version = '0.1.12';
    
    /**
     * Current Context
     * @type {FormFiller}
     * @private
     */
    var _context = this;
    
    /**
     * The form data
     * @type {Object}
     * @private
     */
    var _formData = {};
    
    /**
     * Initial Bookmarklet Code
     * @type {string}
     */
    this.jsCode = 'javascript:/* FormFiller v' + _version + ' */var d=document;function i(a){return d.getElementById(a)}function n(a){return d.getElementsByName(a)[0]}function e(a){t=\'change\';if(window.navigator.userAgent.match(/Trident|MSIE\s/g)!=null){x=d.createEvent(\'Events\');x.initEvent(t,1,0);}else{x=new Event(t);}a.dispatchEvent(x);}function v(a,v){a.value=v;e(a)}function c(a){a.checked=true;e(a)}function r(l){return (Math.random()+1).toString(36).substring(l)}';
    
    /**
     * Load Form
     * @returns {void}
     */
    this.loadForm = function () {
        _loadJQuery();
    };

    /**
     * Load jQuery (if not already loaded), then loads the form
     * @returns {void}
     * @private
     */
    var _loadJQuery = function () {
        if (typeof jQuery === 'undefined') {
            new FormFiller_Loader().script('//code.jquery.com/jquery-1.11.1.min.js', function (context) {
                context.doLoadForm();
            }, _context);
        } else {
            _context.doLoadForm();
        }
    };

    /**
     * Appends the modal html into the body if it does not already exist
     * @returns {void}
     */
    this.doLoadForm = function () {
        if (jQuery('div#formfiller').length === 0) {
            var html = '<div id="formfiller"> <section style="position:fixed;top:20%;left:0;right:0;z-index:9999;width:40%;margin:0 auto;padding:40px;background-color:#fff;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif"> <h1 style="margin:0 0 18px;font-size:32px">Form Filler v' + _version + '</h1> <div id="formfiller-formwrapper"><input id="formfiller-bookmarkletname" style="margin-bottom:18px" value="' + document.title + '"> <input type="button" value="Save" onclick="javascript:formfiller.save();return false;"></div> <p style="margin:0;display:none"> Click and drag this link to the bookmarks bar: <a id="bookmarklet">My bookmarklet</a> </p><a href="javascript:$(\'#formfiller\').remove();void(0);" style=position:absolute;top:0;right:0;font-size:32px;padding:10px;line-height:.55;color:#aaa;text-decoration:none>&times;</a> </section> <div style=position:fixed;top:0;right:0;bottom:0;left:0;z-index:9998;background-color:rgba(0,0,0,.25)></div></div>';
            jQuery('body').append(html);
        }
    };

    /**
     * Saves the form and creates the bookmarklet link
     * @returns void
     */
    this.save = function () {
        jQuery('form input:not(:hidden,:radio,:checkbox,:submit,:file), form textarea, form select, form input[type="radio"]:checked, form input[type="checkbox"]:checked').each(function () {
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
    
    /**
     * Checks if the element is visible
     * @param {Object} element
     * @returns {boolean}
     * @private
     */
    var _isVisible = function(element) {
        return jQuery(element).is(':visible');
    };

    /**
     * Checks if the element has a name attribute
     * @param {Object} element
     * @returns {boolean}
     * @private
     */
    var _hasName = function (element) {
        return (_getName(element) !== undefined);
    };

    /**
     * Returns the value of the element's name attribute
     * @param {Object} element
     * @returns {string}
     * @private
     */
    var _getName = function (element) {
        return jQuery(element).attr('name');
    };

    /**
     * Checks if the element has an ID attribute
     * @param {Object} element
     * @returns {boolean}
     * @private
     */
    var _hasId = function (element) {
        return (_getId(element) !== undefined);
    };

    /**
     * Returns the value of the element's ID attribute
     * @param {Object} element
     * @returns {string}
     * @private
     */
    var _getId = function (element) {
        return jQuery(element).attr('id');
    };

    /**
     * Checks if element type is radio or checkbox
     * @param {Object} element
     * @returns {boolean}
     * @private
     */
    var _isRadioOrCheckbox = function (element) {
        return ((_nameHasArray(element)) || (_isType(element, ['radio', 'checkbox'])))
    };

    /**
     * Checks if an element is part of an array
     * @param {Object} element
     * @returns {boolean}
     * @private
     */
    var _nameHasArray = function (element) {
        return (_getName(element).indexOf('[]') >= 0)
    };

    /**
     * Checks if element's type attribute is on of the passed in types
     * @param {Object} element
     * @param {array} types
     * @returns {boolean}
     * @private
     */
    var _isType = function (element, types) {
        return (jQuery.inArray(jQuery(element).attr('type'), types) >= 0);
    };

    /**
     * Get Value from element and escapes
     * @param {Object} element
     * @returns {string}
     * @private
     */
    var _getValue = function (element) {
        var value = jQuery(element).val();
        return (value === null) ? '' : value.replace(/"/g, '\\"');
    };

}

/**
 * FormFiller_Loader
 * 
 * Class for loading external files
 * Supported tags:
 *   - script
 * @returns {FormFiller_Loader}
 */
function FormFiller_Loader() {

    /**
     * The supported element types
     * @type {Object}
     * @private
     */
    var TYPE = {
        SCRIPT: 'script'
    };

    /**
     * If the file has been loaded
     * @type {boolean}
     * @private
     */
    var _fileLoaded = false;
    
    /**
     * The callback to run after loading the file
     * @type {function}
     * @private
     */
    var _callback = null;
    
    /**
     * The context to pass into the callback
     * @type {string}
     * @private
     */
    var _context = null;

    /**
     * Load a file of type script
     * @param {string} url
     * @param {function} callback
     * @param {Object} context
     * @returns {void}
     */
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

    /**
     * Appends new element to the body
     * @param {string} type
     * @param {object} attrs
     * @returns {void}
     * @private
     */
    var _appendNewElementToBody = function (type, attrs) {
        _getFirstElementByTagName('body').appendChild(_createElement(type, attrs));
    };

    /**
     * Gets element by name and returns the first one
     * @param {string} name
     * @returns {Object}
     * @private
     */
    var _getFirstElementByTagName = function (name) {
        return document.getElementsByTagName(name)[0];
    };

    /**
     * Creates the element, and setups the callback to be called after the file has loaded
     * @param {string} type
     * @param {Object} attrs
     * @returns {Object}
     * @private
     */
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

    /**
     * Cleans up
     * @returns {void}
     * @private
     */
    var _cleanup = function () {
        _fileLoaded = false;
    };

}

function FormFiller_Field() {
    var name = null;
    var value = null;
    var children = [];
    var modifier = null;
    
    this.setName = function(n){
        name = n;
        return this;
    };
    
    this.setValue = function(v){
        value = v;
        return this;
    };
    
    this.addChild = function(c){
        children.push(c);
        return this;
    };
    
    this.addChildren = function(c){
        for(var i = 0; i < c.length; i++){
            this.addChild(c[i]);
        }
        return this;
    }
    
    this.getName = function(){
        return name;
    };
    
    this.getValue = function(){
        if(hasModifier()){
            return modifier;
        } else {
            return value;
        }
    };
    
    this.hasModifier = function(){
        return (modifier != null);
    };
    
    this.getChildren = function(){
        return children;
    };
    
    this.hasChildren = function(){
        return (children.length > 0);
    };
    
}

function FormFiller_Field_Modifier(type, options) {
    this.value = null;
    
    var init = function(type, options){
        switch(type){
            case 'RandomString': this.value = 'r('+options.length+')'; break;
        }
    };
    
    init(type, options);
}
