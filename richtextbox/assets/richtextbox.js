;(function ($, window, document, undefined) {

    "use strict";

    var defaults = {
        options: ['Bold', 'Italics', 'Underline']
    }

	var methods = {

        init: function() 
        {
            var $this = this;
            
            $this.editor = $('<div class="richtextbox-editor"></div>').insertBefore($this.element);
            
            $this.box = $('<div class="richtextbox-box"></div>').insertAfter($this.editor);
            $this.editable = $('<p id="richtext_' + $this.element.attr("id") + '" class="form-control" spellcheck="false">'+$this.element.val() + '</p>').appendTo($this.box);
            
            $this.element.hide();

            $this.tags = [];

            $this.classes.forEach(element => {
                element.renderOn($this.editor);
                $this.tags.push(element.tag);
            });

            $this.tags = $.map($this.tags, function(n){
                return n;
            });

            $this.editable[0].addEventListener('click', function(e) {
                $this.editable[0].contentEditable = true;
                $this.editable[0].focus();
            });

            $this.editable[0].addEventListener('blur', function(e) {
                $this.editable[0].contentEditable = false;
            });
            
            $this.form.on("submit", function(e)
            {
                $($this.element).val($this.editable.html());
            });

            $this.editable.on("input", function(e)
            {
                onChange(e, $this);
            });

            $this.editable.on("keydown", function(e)
            {
                onChange(e);
            });

            function onChange(event)
            {
                switch (event.keyCode) 
                {
                    case 13:
                        event.preventDefault();
                        return false;
                }
            }
        }
    }

    var helpers = {
        getClass: function($this, className)
        {
            if(coreClasses[className] != null && className != 'Option')
            {
                return new coreClasses[className]($this);
            }
            return null;
        },
        getClasses: function($this)
        {
            var classes = [];
            $this.settings.options.forEach(element => {
                var $cls = helpers.getClass($this, element);
                if($cls != null) classes.push($cls);
            });
            return classes;
        },
        strip_tags: function(r, e) {
            function _phpCastString(r) {
                switch (typeof r) {
                    case "boolean":
                        return r ? "1" : "";
                    case "string":
                        return r;
                    case "number":
                        return isNaN(r) ? "NAN" : isFinite(r) ? r + "" : (r < 0 ? "-" : "") + "INF";
                    case "undefined":
                        return "";
                    case "object":
                        return Array.isArray(r) ? "Array" : null !== r ? "Object" : "";
                    case "function":
                    default:
                        throw new Error("Unsupported value type")
                }
            }
            e = (((e || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join("");
            var t = /<\/?([a-z0-9]*)\b[^>]*>?/gi,
                n = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi,
                a = _phpCastString(r);
            for (a = "<" === a.substring(a.length - 1) ? a.substring(0, a.length - 1) : a;;) {
                var s = a;
                if (a = s.replace(n, "").replace(t, function(r, t) {
                        return e.indexOf("<" + t.toLowerCase() + ">") > -1 ? r : ""
                    }), s === a) return a
            }
        }
    }
    
    class Option {

        constructor($this) 
        {
            if (this.constructor == Option)
            {
                throw new Error("Abstract classes can't be instantiated.");
            }

            this.$this = $this;
            this.optionName = this.constructor.name;
            this.optionText = this.constructor.name;
        }
      
        renderOn(editor) 
        {
            var $this = this;

            var elOption = '<div class="option" data-role="rtb-option" data-option="' + this.optionName + '">' + this.optionText + '</div>';

            elOption = $(elOption).appendTo(editor);

            $(elOption).click(function(e) 
            {
                $this.OnClick(this, e);
            });

            $(elOption).mousedown(function(e) 
            {
                e.preventDefault();
            });

            return elOption;
        }

        OnClick(element, event)
        {
            throw new Error("Method 'OnClick()' must be implemented.");
        }

        getInputSelection(el) 
        {
            var start = 0, end = 0, normalizedValue, range,
                textInputRange, len, endRange;
        
            if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                start = el.selectionStart;
                end = el.selectionEnd;
            } else {
                range = document.selection.createRange();
        
                if (range && range.parentElement() == el) {
                    len = el.value.length;
                    normalizedValue = el.value.replace(/\r\n/g, "\n");

                    textInputRange = el.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());
        
                    endRange = el.createTextRange();
                    endRange.collapse(false);
        
                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = end = len;
                    } else {
                        start = -textInputRange.moveStart("character", -len);
                        start += normalizedValue.slice(0, start).split("\n").length - 1;
        
                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd("character", -len);
                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                        }
                    }
                }
            }
        
            return {
                start: start,
                end: end
            };
        }
    }

    class Bold extends Option {

        constructor($this) 
        {
            super($this);
            this.optionText = 'B';
            this.tag = ['b', 'strong']
        }

        OnClick(element, event)
        {
            if(this.$this.editable.is(":focus")) this.$this.document[0].execCommand('bold');
        }

    }

    class Italics extends Option {

        constructor($this) 
        {
            super($this);
            this.optionText = 'I';
            this.tag = ['i', 'em']
        }

        OnClick(element, event)
        {
            if(this.$this.editable.is(":focus")) this.$this.document[0].execCommand('italic');
        }
    }

    class Underline extends Option {

        constructor($this) 
        {
            super($this);
            this.optionText = 'U';
            this.tag = ['u']
        }

        OnClick(element, event)
        {
            if(this.$this.editable.is(":focus")) this.$this.document[0].execCommand('underline');
        }
    }

    const coreClasses = {
        Option,
        Bold,
        Italics,
        Underline
    }

    function Plugin(element, params) 
    {
        this.document  = $(document);
        this.element = $(element);
        this.window = $(window);
        this.settings = $.extend({}, defaults, params);
        this.classes = helpers.getClasses(this);
        this.form = this.element.closest('form');
        this.init();
    }

    $.extend(Plugin.prototype, methods);

    $.fn["richtextbox"] = function ()
    {
		return this.each(function() {
            if (!$.data(this, "plugin_richtextbox")) 
            {
				$.data(this, "plugin_richtextbox", new Plugin(this));
			}
		});
	};

})(jQuery, window, document);