class CPField {

    container = null;
    props = {};
    prefix = "cp-ef";
    id = null;
    type = null;
    state = {};
    name = null;
    idAttribute = "data-cpf-id";
    fieldSelector = null;
    containerSelector = null;

    constructor(container, props) {
        this.container = container;
        this.props = Object.assign({}, this.props, props);
        let date = new Date;
        this.id = `${date.getTime()}${Math.random() * 2000}`;
        this.name = props.name || null;
        this.fieldSelector = `${this.htmlType()}[name="${this.name}"]`;
        this.containerSelector = `[${this.idAttribute}="${this.id}"]`;
    }

    render() {
        $(this.container)
            .call(this.handleWillRender.bind(this))
            .html(this.content().trim())
            .call(this.handleCompletedRender.bind(this));
    }

    label() {
        if (typeof this.props.label == 'string') {
            return `
                <label 
                    for="${this.props.name}"
                >
                    ${this.props.label}
                </label>
            `.trim();
        }
        return null;
    }

    placeholder() {
        if (
            typeof this.props.placeholder == 'string'
            && this.props.placeholder.trim().length > 0
        ) {
            return this.props.placeholder;
        }
        return null;
    }

    handleWillRender() {
        if (typeof this.willRender == 'function') {
            this.willRender();
        }
    }

    handleCompletedRender() {
        if (typeof this.completedRender == 'function') {
            this.completedRender();
        }
    }

    setDefaultValue() {
        // set default value on the form field
        if (this.props.defaultValue != undefined) {
            switch (this.type) {
                case 'text':
                case 'time':
                    $(this.containerSelector)
                        .children(`input[type="${this.type}"]`)
                        .val(this.props.defaultValue);
                    break;
                case 'radio':
                    $(this.containerSelector)
                        .children(`input[value="${this.props.defaultValue}"]`)
                        .props('checked', true);
                    break;
                case 'date':
                    $(this.containerSelector)
                        .children('input[type="date"]')
                        .val(this.formatDate(this.props.defaultValue));
                    break;
            }
        }
    }

    formatDate(date) {
        date = new Date(date);
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        return `${year}-${this.leadingZero(month)}-${this.leadingZero(day)}`;
    }

    leadingZero(data) {
        // return zero if data type is niether string nur number
        if (typeof data != 'string' && typeof data != 'number') return "0";

        // convert data to string if data is a number
        if (typeof data == 'number') data = data.toString();

        // return data with zero prepended to it
        return data.length > 1 ? data : `0${data}`;
    }

    setState(state, callback) {
        let prevState = { ...this.state }
        this.state = Object.assign({}, prevState, state);
        // fire callback if any was set
        if (typeof callback == 'function') {
            callback();
        }
        // fire component changed method
        if (typeof this.componentChanged == 'function') {
            this.componentChanged(prevState);
            this.setDefaultValue();
        }
    }

    setValue(value) {
        if (this.type == 'date') {
            value = this.formatDate(value);
        }

        if (this.type == 'datetime') {
           return;
        }

        if (this.type == 'radio') {
            $(this.containerSelector)
                .children(`${this.htmlType()}[value="${value}"]`)
                .prop('checked', true);
            return;
        }

        $(this.containerSelector)
            .children(`${this.htmlType()}[name="${this.name}"]`)
            .val(value);
    }

    getValue() {
        return $(this.containerSelector)
            .children(this.fieldSelector)
            .val();
    }

    htmlType() {
        switch (this.props.type) {
            case 'long-text':
                return 'textarea';
            case 'select':
                return 'select';
            default:
                return 'input';
        }
    }

    destory() {
        $(this.containerSelector).remove();
    }
}

const AllowedCPFTypes = [
    'select',
    'text',
    'long-text',
    'email',
    'color-picker',
    'date',
    'time',
    'image',
    'number',
    'phone',
    'pdf',
    'word-doc',
    'spreadsheet',
    'checkbox',
];