class CPFSelect extends CPField {

    constructor(container, props) {
        super(container, props);
        this.type = 'select';
    }

    content() {
        if(this.props.options.constructor != Object){
            return '';
        }
        let options = {"": this.placeholder(), ...this.props.options};
        let optionKeys = Object.keys(options);
        return `
            <div class="${this.prefix}-control-group" ${this.idAttribute}="${this.id}">
                ${ this.label() }
                <select
                    name="${this.props.name}"
                    class="${this.prefix}-form-control"
                >
                    ${ optionKeys.map( key => this.renderOptions(key, options[key]) ).join("") }
                </select>
            </div>
        `;
    }

    renderOptions = (value, label) => (
        `<option 
            value="${value}"
            ${this.props.defaultValue == value 
                ? "selected" 
                : ""
            }
        >
            ${label}
        </option>`.trim()
    )
}