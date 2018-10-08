class CPFRadioGroup extends CPField {

    constructor(container, props) {
        super(container, props);
        this.type = 'radio';
    }

    content() {
        if(this.props.options.constructor != Object){
            return '';
        }
        let options = {...this.props.options};
        let optionKeys = Object.keys(options);
        return `
            <div class="${this.prefix}-control-group radio-group" ${this.idAttribute}="${this.id}">
                ${ this.label() }
                ${ optionKeys.map( key => this.renderOptions(key, options[key]) ).join("") }
            </div>
        `;
    }

    renderOptions = (value, label) => (
        ` 
            <div
                class="${this.prefix}-form-control radio-group"
            >
                <label class="${this.prefix}-radio-option">
                    <input
                        name="${this.props.name}"
                        type="radio" 
                        value="${value}"
                        ${this.props.defaultValue == value 
                            ? "checked" 
                            : ""
                        }
                    />
                    <span>${label}</span>
                </label>
            </div>
        `.trim()
    )

    getValue() {
        let radioButtons = $(this.containerSelector).find(this.fieldSelector);

        for(var i = 0; i <= radioButtons.length; i++){
            let radioButton = radioButtons.eq(i);
            if(radioButton.is(':checked')){
                return radioButton.val();
            }
        }
       return '';
    }
}