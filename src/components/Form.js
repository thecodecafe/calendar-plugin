class CPEventFormModal {
    /**
     * selectors used within this class
     */
    SELECTORS = () => ({
        BODY: 'body',
        FORM: '.' + this.PREFIX + '-form',
        FIELDSET: 'fieldset',
        MODAL: '.' + this.PREFIX + '-modal',
        BUTTON: '.' + this.PREFIX + '-button',
        TITLE: 'input[name="event-title"]',
        END_TIME: 'input[name="end-time"]',
        END_DATE: 'input[name="end-date"]',
        START_DATE: 'input[name="start-date"]',
        START_TIME: 'input[name="start-time"]',
        ERROR_CONTAINER: '.' + this.PREFIX + '-error-container',
    })

    /**
     * class names used within the component
     */
    CLASSNAMES = () => ({
        SHOW: 'show',
        CANCEL: 'cancel',
        SAVE: 'save',
        DELETE: 'delete',
    })

    PREFIX = 'cp-ef';
    fields = [];
    dateTimeFields = [];
    flatpickrs = null;

    constructor(uniqueID, options) {
        this.uniqueID = uniqueID;
        this.id = null;
        this.modal = null;
        this.options = Object.assign({
            url: null,
            edit: false,
            onWillShow: null,
            onShown: null,
            onWillHide: null,
            onHidden: null,
            onDelete: null,
            fieldsList: []
        }, options);

        // bind methods
        this.html = this.html.bind(this);
        this.render = this.render.bind(this);
        this.componentDidRender = this.componentDidRender.bind(this);
    }

    componentDidRender() {
        // reset/set modal
        this.modal = $(`#${this.uniqueID}`);
        // reset/set listeners
        this.listeners();
        // enable datetime fields
        this.enableDatetieFields();
    }

    render() {
        // required selectors
        var { BODY } = this.SELECTORS();

        // select modal
        var modal = $(`#${this.uniqueID}`);

        // remove modal if exists
        if (modal.length > 0) { modal.remove(); }

        // render new form
        $(this.html().trim())
            .attr('id', this.uniqueID)
            .appendTo(BODY)
            .call(() => this.renderFields())
            .call(() => this.componentDidRender());
    }

    html() {
        return `
            <div class="${this.PREFIX}-modal">
                <div class="${this.PREFIX}-backdrop">&nbsp;</div>
                <div class="${this.PREFIX}-content">
                    <div class="${this.PREFIX}-dialog">
                        <form action="javascript:;" class="${this.PREFIX}-form" method="POST">
                            <fieldset>
                            ${ this.options.fieldsList.constructor == Array
                ? this.options.fieldsList.map((group, index) => this.renderFieldsList(group, index)).join('')
                : null
            }
                                <div class="${this.PREFIX}-actions">
                                    ${this.options.editting
                ? `<button type="button" 
                                            class="${this.PREFIX}-button delete"
                                        > Delete </button>`
                : ""
            }
                                    <button type="button" class="${this.PREFIX}-button ${this.CLASSNAMES().CANCEL}">Cancel</button>
                                    <button type="submit" class="${this.PREFIX}-button ${this.CLASSNAMES().SAVE}">Save</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        `.trim();
    }

    renderFieldsList(group, index) {
        if (group.constructor != Array) return null;
        let parent = `${this.uniqueID}${this.PREFIX}-group${index}`
        return `
            <div
                class="${this.PREFIX}-group"
            >
                ${group.map((field, index) => this.makeField(field, parent, index)).join("")}
            </div>
        `.trim();
    }

    makeField(field, parent, index) {
        let id = `${parent}${this.PREFIX}-group-item${index}`;
        let container = `#${id}`;
        let composition = null;
        if (field && typeof field == 'object' && field.constructor == Object && Object.keys(field)) {
            // create field based on type
            switch (field.type) {
                case 'text':
                    composition = new CPFText(container, { ...field });
                    break;
                case 'date':
                    composition = new CPFDate(container, { ...field });
                    break;
                case 'datetime':
                    composition = new CPFDatetime(container, { ...field });
                    this.dateTimeFields.push(composition);
                    break;
                case 'select':
                    composition = new CPFSelect(container, { ...field });
                    break;
                case 'radio':
                    composition = new CPFRadioGroup(container, { ...field });
                    break;
                case 'time':
                    composition = new CPFTime(container, { ...field });
                    break;
            }
        }

        if (composition) {
            this.fields.push(composition);
        }

        return `<div class="${this.PREFIX}-group-item" id="${id}"></div>`;
    }

    fieldHtmlType(type) {
        switch (type) {
            case 'select':
                return 'select';
            case 'long-text':
                return 'textarea';
            default:
                return 'input';
        }
    }

    renderFields() {
        if (!this.fields || this.fields.constructor != Array) {
            return;
        }
        for (var i = 0; i < this.fields.length; i++) {
            this.fields[i].render();
        }
    }

    listeners() {
        var { BUTTON, FORM } = this.SELECTORS();
        // listen for button clicks
        this.modal.find(BUTTON).off('click', this.handleButtonClick.bind(this));
        this.modal.find(BUTTON).on('click', this.handleButtonClick.bind(this));
        // listen for form submit
        this.modal.find(FORM).off('submit', this.handleFormSubmit.bind(this));
        this.modal.find(FORM).on('submit', this.handleFormSubmit.bind(this));
        // check for when for transition ends
        this.modal.find(FORM).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.handleFormTransitionEnd.bind(this));
        this.modal.find(FORM).on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.handleFormTransitionEnd.bind(this));
    }

    enableDatetieFields(){
        if(this.dateTimeFields.length > 0 && flatpickr !== undefined){
            this.flatpickrs = {};
            for(var i = 0; i < this.dateTimeFields.length; i++){
                let field = this.dateTimeFields[i];
                this.flatpickrs[field.name] = $(field.containerSelector).find(field.fieldSelector).flatpickr({
                    enableTime: true,
                    altFormat: "F J, Y \\a\\t h:i K",
                    altInput: true,
                    dateFormat: "Y-m-d h:iK",
                });
            }
                
        }
    }

    handleButtonClick(ev) {
        var { CANCEL, SAVE, DELETE } = this.CLASSNAMES();
        var el = $(ev.currentTarget);
        if (el.hasClass(CANCEL)) {
            this.hide();
        }
        if (el.hasClass(DELETE)) {
            this.confirmDelete();
        }
    }

    handleFormSubmit(ev) {
        ev.preventDefault();

        if (this.validate()) {
            // show validation errors
            this.showValidationError();
            return;
        }

        // hide validation error
        this.hideValidationError();

        // save changes
        this.save();
    }

    handleFormTransitionEnd(ev) {
    }

    show(data, id) {
        if (!this.hasRendered()) return;
        // setTimeout(this.reset.bind(this, data), 1000);
        this.reset(data);
        this.id = id ? id : null;
        var { SHOW } = this.CLASSNAMES();
        if (!this.modal.hasClass(SHOW)) {
            this.modal.addClass(SHOW);
        }
    }

    confirmDelete() {
        if (confirm("Are you sure you want to delete, this event?"));
        {
            this.delete();
        }
    }

    hide() {
        if (!this.hasRendered()) return;
        var { SHOW } = this.CLASSNAMES();
        if (this.modal.hasClass(SHOW)) {
            this.modal.removeClass(SHOW);
        }
    }

    hasRendered() {
        return this.modal != null && this.modal != undefined && this.modal.length > 0;
    }

    reset(data) {
        // 
        let field;

        // hide validation error
        this.hideValidationError();

        // set the field values
        for (var i = 0; i < this.fields.length; i++) {
            field = this.fields[i];
            if( field['type'] == 'datetime' && 
                this.flatpickrs && 
                this.flatpickrs.constructor == Object && 
                this.flatpickrs[field['name']]
            ){
                this.flatpickrs[field['name']].setDate(data[field.name], true);
                continue;
            }
            if (data.hasOwnProperty(field.name)) {
                field.setValue(data[field.name]);
            }
        }
    }

    formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        return this.leadingZero(month) + '/' + this.leadingZero(day) + '/' + year;
    }

    leadingZero(data) {
        // return zero if data type is niether string nur number
        if (typeof data != 'string' && typeof data != 'number') return "0";

        // convert data to string if data is a number
        if (typeof data == 'number') data = data.toString();

        // return data with zero prepended to it
        return data.length > 1 ? data : "0" + data;
    }

    validate() {
        if (!this.modal) { return 'An unknow error has occured.'; }
        var formData = this.getFormData();

        // // validate title
        // if (!formData.title || formData.title.length < 1) return 'Please enter and event title.';

        // // validate start date
        // if (!formData.startDate || formData.startDate.length < 1) return 'Please select a start date.';
        // if (new Date(formData.startDate) == 'Invalid Date') return 'Start date is not a valid date.';

        // // validate end date
        // if (!formData.endDate || formData.endDate.length < 1) return 'Please select an end date.';
        // if (new Date(formData.endDate) == 'Invalid Date') return 'End date is not a valid date.';

        // // validate start time
        // if (!formData.startTime || formData.startTime.length < 1) return 'Please specify a start time.';
        // if (!this.timeRegex(formData.startTime)) return 'Start time invalid. E.g hh:mm AM/PM.';

        // // validate end time
        // if (!formData.endTime || formData.endTime.length < 1) return 'Please specify a end time.';
        // if (!this.timeRegex(formData.endTime)) return 'End time invalid. E.g hh:mm AM/PM.';

        // default is false
        return false;
    }

    showValidationError() {
        // get validation error
        var error = this.validate();

        // stop if there is no validation error
        if (!error) return;

        // get required selectors and class names
        var { FORM, ERROR_CONTAINER } = this.SELECTORS();
        var { SHOW } = this.CLASSNAMES();

        // get error container
        var errorContainer = this.modal.find(FORM).find(ERROR_CONTAINER);
        if (!errorContainer || errorContainer.length < 1) return;

        // change error text in view
        errorContainer.text(error);

        // make error container visible if not visible
        if (!errorContainer.hasClass(SHOW)) {
            errorContainer.addClass(SHOW);
        }
    }

    hideValidationError() {
        // get required selectors and class names
        var { FORM, ERROR_CONTAINER } = this.SELECTORS();
        var { SHOW } = this.CLASSNAMES();

        // get error container
        var errorContainer = this.modal.find(FORM).find(ERROR_CONTAINER);
        if (!errorContainer || errorContainer.length < 1) return;

        // change error text in view
        errorContainer.text('');

        // make error container visible if not visible
        if (errorContainer.hasClass(SHOW)) errorContainer.removeClass(SHOW);
    }

    disable(state) {
        // get selectors
        var { FORM, FIELDSET, BUTTON } = this.SELECTORS();
        // convert state to proper type
        state = state ? true : false;
        // toggle editable state
        this.modal.find(FORM).find(FIELDSET).attr('disabled', state);
        this.modal.find(FORM).find(BUTTON).attr('disabled', state);
    }

    timeRegex(time) {
        if (typeof time != 'string') time = time + '';
        var regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    }

    getFormData() {
        let data = {};
        for (var i = 0; i < this.fields.length; i++) {
            data[this.fields[i].name] = this.fields[i].getValue();
        }
        // get form values
        return data;
    }

    save() {
        // get post url
        var url = this.buildUrl();
        // stop if no url was specified
        if (url == null) return;
        // join default data and form data
        var data = Object.assign({}, this.options.data, this.getFormData());
        data = this.addStructs(data);
        // join default headers with custom headers
        var headers = Object.assign({}, this.options.headers);
        // disable form
        this.disable(true);
        // make ajax post request and try to save new event
        $.ajax({
            url: this.options.url,
            data: data,
            headers: headers,
            method: this.options.editting ? 'PUT' : 'POST'
        }).done(this.saveDone.bind(this)).fail(this.saveFailed.bind(this));
    }

    saveDone(response) {
        // fire onSave function if set
        if (typeof this.options.onSaved == 'function') this.options.onSaved();

        // create referenc for object instance
        var self = this;

        // delay modal hide and form enable action
        setTimeout(function () {
            // enable form
            self.disable(false);
            // hide modal
            self.hide();
        }, 800);
    }

    saveFailed(err) {
        // enable form
        this.disable(false);
        // get and display error message
        var message = 'Failed to' + (this.options.editting ? ' save changes.' : ' save new event.');
        var message = err.message && err.message.length > 0 ? err.message : message;
        alert(message);
    }

    addStructs(data) {
        if (this.options.requestStruct) {
            var structs = JSON.parse(JSON.stringify(this.options.requestStruct));
            for (var i in structs) {
                if (typeof structs[i] != 'string') continue;
                if (typeof data[i] == 'undefined') continue;
                if (typeof data[structs[i]] != 'undefined') continue;
                data[structs[i]] = JSON.parse(JSON.stringify(data[i]));
                delete data[i];
            }
        }

        return data;
    }

    delete() {
        // get post url
        var url = this.buildUrl('delete');
        // stop if no url was specified
        if (url == null) return;
        // join default data and form data
        var data = Object.assign({}, this.options.data);
        // join default headers with custom headers
        var headers = Object.assign({}, this.options.headers);
        // disable form
        this.disable(true);
        // make ajax post request and try to delete new event
        $.ajax({
            url: this.options.url,
            data: data,
            headers: headers,
            method: 'DELETE'
        }).done(this.deleteDone.bind(this)).fail(this.deleteFailed.bind(this));
    }

    deleteDone(response) {
        // fire onSave function if set
        if (typeof this.options.onDelete == 'function') this.options.onDelete();

        // create referenc for object instance
        var self = this;

        // delay modal hide and form enable action
        setTimeout(function () {
            // enable form
            self.disable(false);
            // hide modal
            self.hide();
        }, 800);
    }

    deleteFailed(err) {
        // enable form
        this.disable(false);
        // get and display error message
        var message = 'Could not delete event, please try again in a moment.';
        var message = err.message && err.message.length > 0 ? err.message : message;
        alert(message);
    }

    buildUrl(deleteUrl) {
        deleteUrl = deleteUrl ? true : false;
        if ((!deleteUrl && this.options.url == null) || (deleteUrl && this.options.deleteUrl == null)) return null;
        var url = deleteUrl ? JSON.parse(JSON.stringify(this.options.deleteUrl)) : JSON.parse(JSON.stringify(this.options.url));
        var regex = new RegExp(/^(:id)$/, 'ig');
        if (this.options.editting) {
            if (regex.test(url)) {
                url = url.replace(regex, this.id);
            }
            else {
                this.options.data = Object.assign({}, this.options.data, { id: this.id });
            }
        }
        return url;
    }

    destroy() {
        if (this.fields || this.fields.constructor == Array) {
            for (var i = 0; i < this.fields.length; i++) {
                if( thie.field[i]['type'] == 'datetime' && 
                    this.flatpickrs && 
                    this.flatpickrs.constructor == Object,
                    this.flatpickrs[thie.field[i]['name']]
                ){
                    this.flatpickrs[thie.field[i]['name']].destroy();
                }
                this.fields[i].destroy();
            }
        }
        $(this.uniqueID).remove();
        this.fields = [];
    }
}