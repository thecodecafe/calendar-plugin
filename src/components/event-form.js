class CPEventFormModal
{
    /**
     * selectors used within this class
     */
    SELECTORS() {
        return {
            BODY        : 'body',
            FORM        : '.'+this.PREFIX+'-form',
            FIELDSET    : 'fieldset',
            MODAL       : '.'+this.PREFIX+'-modal',
            BUTTON      : '.'+this.PREFIX+'-button',
            TITLE       : 'input[name="event-title"]',
            END_TIME    : 'input[name="end-time"]',
            END_DATE    : 'input[name="end-date"]',
            START_DATE  : 'input[name="start-date"]',
            START_TIME  : 'input[name="start-time"]',
            ERROR_CONTAINER: '.'+this.PREFIX+'-error-container',
        }
    }

    /**
     * class names used within the component
     */
    CLASSNAMES() {
        return {
            SHOW    : 'show',
            CANCEL  : 'cancel',
            SAVE    : 'save',
            DELETE  : 'delete',
        };
    }

    constructor(uniqueID, options)
    {
        this.uniqueID = uniqueID;
        this.id = null;
        this.modal = null;
        this.PREFIX = 'cp-ef';
        this.options = $.extend({
            url: null,
            edit: false,
            onWillShow: null,
            onShown: null,
            onWillHide: null,
            onHidden: null,
            onDelete: null
        }, options);

        // bind methods
        this.html = this.html.bind(this);
        this.render = this.render.bind(this);
        this.SELECTORS = this.SELECTORS.bind(this);
        this.CLASSNAMES = this.CLASSNAMES.bind(this);
        this.componentDidRender = this.componentDidRender.bind(this);
    }

    componentDidRender()
    {
        // reset/set modal
        this.modal = $('#'+this.uniqueID);
        // reset/set listeners
        this.listeners();
        // initialize date pickers
        this.initializePickers();
    }

    render()
    {
        // required selectors
        var {MODAL, BODY} = this.SELECTORS();
        
        // select modal
        var modal = $('#'+this.uniqueID);
        
        // remove modal if exists
        if(modal.length > 0)
        { modal.remove(); }

        // render new form
        $(this.html()).attr('id', this.uniqueID).appendTo(BODY);

       // fire component did render
       this.componentDidRender();
    }

    html()
    {
        return ("<div class='"+this.PREFIX+"-modal'>"+
            "<div class='"+this.PREFIX+"-backdrop'>&nbsp;</div>"+
            "<div class='"+this.PREFIX+"-content'>"+
                "<div class='"+this.PREFIX+"-dialog'>"+
                    "<form action='javascript:;' class='"+this.PREFIX+"-form' method='POST'>"+
                        "<fieldset>"+
                            "<p class='"+this.PREFIX+"-error "+this.PREFIX+"-error-container'></p>"+
                            "<div class='"+this.PREFIX+"-group'>"+
                                "<div class='"+this.PREFIX+"-control'>"+
                                    "<input type='text' name='event-title' class='"+this.PREFIX+"-title' placeholder='Event title...' />"+
                                "</div>"+
                            "</div>"+
                            "<div class='"+this.PREFIX+"-group'>"+
                                "<div class='"+this.PREFIX+"-control'>"+
                                    "<label for='start-date'>Start Date</label>"+
                                    "<input type='text' name='start-date' placeholder='MM/DD/YYYY' autocomplete='off' />"+
                                "</div>"+
                                "<div class='"+this.PREFIX+"-control'>"+
                                    "<label for='end-date'>End Date</label>"+
                                    "<input type='text' name='end-date' placeholder='MM/DD/YYYY' autocomplete='off' />"+
                                "</div>"+
                            "</div>"+
                            "<div class='"+this.PREFIX+"-group'>"+
                                "<div class='"+this.PREFIX+"-control'>"+
                                    "<label for='start-time'>Start Time</label>"+
                                    "<input type='time' name='start-time' placeholder='hh:mm AM/PM' />"+
                                "</div>"+
                                "<div class='"+this.PREFIX+"-control'>"+
                                    "<label for='end-time'>End Time</label>"+
                                    "<input type='time' name='end-time' placeholder='hh:mm AM/PM' />"+
                                "</div>"+
                            "</div>"+
                            "<div class='"+this.PREFIX+"-actions'>"+
                                this.delete_button()+
                                "<button type='button' class='"+this.PREFIX+"-button cancel'>Cancel</button>"+
                                "<button type='submit' class='"+this.PREFIX+"-button save'>Save</button>"+
                            "</div>"+
                        "</fieldset>"+
                    "</form>"+
                "</div>"+
            "</div>"+
        "</div>");
    }

    listeners()
    {
        var {BUTTON, FORM} = this.SELECTORS();
        // listen for button clicks
        this.modal.find(BUTTON).off('click', this.handle_button_click.bind(this));
        this.modal.find(BUTTON).on('click', this.handle_button_click.bind(this));
        // listen for form submit
        this.modal.find(FORM).off('submit', this.handle_form_submit.bind(this));
        this.modal.find(FORM).on('submit', this.handle_form_submit.bind(this));
        // check for when for transition ends
        this.modal.find(FORM).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.handle_form_transition_end.bind(this));
        this.modal.find(FORM).on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.handle_form_transition_end.bind(this));
    }

    initializePickers()
    {
        var {START_DATE, END_DATE} = this.SELECTORS();
        // initialize start date picker
        this.modal.find(START_DATE).datepicker('destroy');
        this.modal.find(START_DATE).datepicker();

        // initialize end date picker
        this.modal.find(END_DATE).datepicker('destroy');
        this.modal.find(END_DATE).datepicker();
    }

    handle_button_click(ev)
    {
        var {CANCEL, SAVE, DELETE} = this.CLASSNAMES();
        var el = $(ev.currentTarget);
        if(el.hasClass(CANCEL))
        {
            this.hide();
        }
        if(el.hasClass(DELETE))
        {
            this.confirm_delete();
        }
    }

    handle_form_submit(ev)
    {
        ev.preventDefault();

        if(this.validate())
        {
            // show validation errors
            this.show_validation_error();
            return;
        }

        // hide validation error
        this.hide_validation_error();

        // save changes
        this.save();
    }

    delete_button()
    {
        if(this.options.editting)
        {
            return "<button type='button' class='"+this.PREFIX+"-button delete'>Delete</button>"
        }
        return '';
    }

    handle_form_transition_end(ev)
    {

    }

    show(data, id)
    {
        if(!this.has_rendered()) return;
        // setTimeout(this.reset.bind(this, data), 1000);
        this.reset(data);
        this.id = id ? id : null;
        var {SHOW} = this.CLASSNAMES();
        if(!this.modal.hasClass(SHOW))
        {
            this.modal.addClass(SHOW);
        }
    }

    confirm_delete()
    {
        if(confirm("Are you sure you want to delete, this event?"));
        {
            this.delete();
        }
    }

    hide()
    {
        if(!this.has_rendered()) return;
        var {SHOW} = this.CLASSNAMES();
        if(this.modal.hasClass(SHOW))
        {
            this.modal.removeClass(SHOW);
        }
    }

    has_rendered()
    {
        return this.modal != null && this.modal != undefined && this.modal.length > 0;
    }

    reset(data)
    {
        var {START_DATE, END_DATE, START_TIME, END_TIME, TITLE} = this.SELECTORS();
        // prep form data
        var startDate = data.startDate ? this.format_date(data.startDate) : '';
        var endDate = data.endDate ? this.format_date(data.endDate) : '';
        var startTime = data.startTime || '';
        var endTime = data.endTime || '';
        var title = data.title || '';
        // update form data
        this.modal.find(START_DATE).val(startDate);
        this.modal.find(END_DATE).val(endDate);
        this.modal.find(START_TIME).val(startTime);
        this.modal.find(END_TIME).val(endTime);
        this.modal.find(TITLE).val(title);
        // hode validation error
        this.hide_validation_error();
    }

    format_date(date)
    {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        return this.leading_zero(month)+'/'+this.leading_zero(day)+'/'+year;
    }

    leading_zero(data)
    {
        // return zero if data type is niether string nur number
        if(typeof data != 'string' && typeof data != 'number')  return "0";

        // convert data to string if data is a number
        if(typeof data == 'number') data = data.toString();

        // return data with zero prepended to it
        return data.length > 1 ? data : "0"+data;
    }

    validate()
    {
        if(!this.modal){ return 'An unknow error has occured.'; }
        var form_data = this.get_form_data();
        
        // validate title
        if(!form_data.title || form_data.title.length < 1) return 'Please enter and event title.';
        
        // validate start date
        if(!form_data.startDate || form_data.startDate.length < 1) return 'Please select a start date.';
        if( new Date(form_data.startDate) == 'Invalid Date' ) return 'Start date is not a valid date.';
        
        // validate end date
        if(!form_data.endDate || form_data.endDate.length < 1) return 'Please select an end date.';
        if( new Date(form_data.endDate) == 'Invalid Date' ) return 'End date is not a valid date.';
        
        // validate start time
        if(!form_data.startTime || form_data.startTime.length < 1) return 'Please specify a start time.';
        if( !this.time_regex(form_data.startTime) ) return 'Start time invalid. E.g hh:mm AM/PM.';

        // validate end time
        if(!form_data.endTime || form_data.endTime.length < 1) return 'Please specify a end time.';
        if( !this.time_regex(form_data.endTime) ) return 'End time invalid. E.g hh:mm AM/PM.';

        // default is false
        return false;
    }

    show_validation_error()
    {
        // get validation error
        var error = this.validate();
        
        // stop if there is no validation error
        if(!error) return;
        
        // get required selectors and class names
        var {FORM, ERROR_CONTAINER} = this.SELECTORS();
        var {SHOW} = this.CLASSNAMES();

        // get error container
        var error_container = this.modal.find(FORM).find(ERROR_CONTAINER);
        if(!error_container || error_container.length < 1) return;
        
        // change error text in view
        error_container.text(error);

        // make error container visible if not visible
        if(!error_container.hasClass(SHOW)) error_container.addClass(SHOW);
    }

    hide_validation_error()
    {
        // get required selectors and class names
        var {FORM, ERROR_CONTAINER} = this.SELECTORS();
        var {SHOW} = this.CLASSNAMES();

        // get error container
        var error_container = this.modal.find(FORM).find(ERROR_CONTAINER);
        if(!error_container || error_container.length < 1) return;

        // change error text in view
        error_container.text('');

        // make error container visible if not visible
        if(error_container.hasClass(SHOW)) error_container.removeClass(SHOW);
    }

    disable(state)
    {
        // get selectors
        var {FORM, FIELDSET, BUTTON} = this.SELECTORS();
        // convert state to proper type
        state = state ? true : false;
        // toggle editable state
        this.modal.find(FORM).find(FIELDSET).attr('disabled', state);    
        this.modal.find(FORM).find(BUTTON).attr('disabled', state);
    }

    time_regex(time)
    {
        if(typeof time != 'string') time = time+'';
        var regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    }

    get_form_data()
    {
        var {START_DATE, END_DATE, START_TIME, END_TIME, TITLE} = this.SELECTORS();
        // get form values
        return {
            title       : this.modal.find(TITLE).val(),
            startDate   : this.modal.find(START_DATE).val(),
            endDate     : this.modal.find(END_DATE).val(),
            startTime   : this.modal.find(START_TIME).val(),
            endTime     : this.modal.find(END_TIME).val()
        };
    }

    save()
    {
        // get post url
        var url = this.build_url();
        // stop if no url was specified
        if(url == null) return;
        // join default data and form data
        var data = $.extend({}, this.options.data, this.get_form_data());
        data = this.add_structs(data);
        // join default headers with custom headers
        var headers = $.extend({}, this.options.headers);
        // disable form
        this.disable(true);
        // make ajax post request and try to save new event
        $.ajax({
            url: this.options.url,
            data: data,
            headers: headers,
            method: this.options.editting ? 'PUT' : 'POST'
        }).done(this.save_done.bind(this)).fail(this.save_failed.bind(this));
    }

    save_done(response)
    {
        // fire onSave function if set
        if(typeof this.options.onSaved == 'function') this.options.onSaved();

        // create referenc for object instance
        var self = this;

        // delay modal hide and form enable action
        setTimeout(function(){
            // enable form
            self.disable(false);
            // hide modal
            self.hide();
        }, 800);
    }

    save_failed(err)
    {
        // enable form
        this.disable(false);
        // get and display error message
        var message = 'Failed to'+( this.options.editting ? ' save changes.' : ' save new event.' );
        var message = err.message && err.message.length > 0 ? err.message : message;
        alert(message);
    }

    add_structs(data)
    {
        if(this.options.requestStruct)
        {
            var structs = JSON.parse( JSON.stringify(this.options.requestStruct) );
            for(var i in structs)
            {
                if(typeof structs[i] != 'string') continue;
                if(typeof data[i] == 'undefined') continue;
                if(typeof data[structs[i]] != 'undefined') continue;
                data[structs[i]] = JSON.parse( JSON.stringify(data[i]) );
                delete data[i];
            } 
        }

        return data;
    }

    delete()
    {
        // get post url
        var url = this.build_url('delete');
        // stop if no url was specified
        if(url == null) return;
        // join default data and form data
        var data = $.extend({}, this.options.data);
        // join default headers with custom headers
        var headers = $.extend({}, this.options.headers);
        // disable form
        this.disable(true);
        // make ajax post request and try to delete new event
        $.ajax({
            url: this.options.url,
            data: data,
            headers: headers,
            method: 'DELETE'
        }).done(this.delete_done.bind(this)).fail(this.delete_failed.bind(this));
    }

    delete_done(response)
    {
        // fire onSave function if set
        if(typeof this.options.onDelete == 'function') this.options.onDelete();

        // create referenc for object instance
        var self = this;

        // delay modal hide and form enable action
        setTimeout(function(){
            // enable form
            self.disable(false);
            // hide modal
            self.hide();
        }, 800);
    }

    delete_failed(err)
    {
        // enable form
        this.disable(false);
        // get and display error message
        var message = 'Could not delete event, please try again in a moment.';
        var message = err.message && err.message.length > 0 ? err.message : message;
        alert(message);
    }

    build_url(deleteUrl)
    {
        deleteUrl = deleteUrl ? true : false;
        if((!deleteUrl && this.options.url == null) || (deleteUrl && this.options.deleteUrl == null)) return null;
        var url = deleteUrl ? JSON.parse( JSON.stringify(this.options.deleteUrl) ) : JSON.parse( JSON.stringify(this.options.url) );
        var regex = new RegExp(/^(:id)$/, 'ig');
        if(this.options.editting)
        {
            if(regex.test(url))
            {
                url = url.replace(regex, this.id);
            }
            else
            {
                this.options.data = $.extend({}, this.options.data, {id: this.id});
            }
        }
        else
        {
            url = url;
        }
        return url;
    }
}